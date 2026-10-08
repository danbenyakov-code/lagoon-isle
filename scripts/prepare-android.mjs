// Patches the generated Android project for ads, login, signing and versioning.
// Runs after `npx cap add android` (locally or on GitHub Actions).
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const cfg = JSON.parse(fs.readFileSync(path.join(root, 'release-config.json'), 'utf8'));
const A = (...p) => path.join(root, 'android', ...p);
const read = f => fs.readFileSync(f, 'utf8');
const write = (f, s) => fs.writeFileSync(f, s);
const log = m => console.log('[prepare-android] ' + m);

// 1. Manifest: AdMob app id (required, the app crashes without it), portrait lock, Facebook ids
const manPath = A('app', 'src', 'main', 'AndroidManifest.xml');
let man = read(manPath);
if (!man.includes('com.google.android.gms.ads.APPLICATION_ID')) {
  let meta = `\n        <meta-data android:name="com.google.android.gms.ads.APPLICATION_ID" android:value="${cfg.admobAppIdAndroid}"/>`;
  if (cfg.facebookAppId) {
    meta += `\n        <meta-data android:name="com.facebook.sdk.ApplicationId" android:value="@string/facebook_app_id"/>`;
    meta += `\n        <meta-data android:name="com.facebook.sdk.ClientToken" android:value="@string/facebook_client_token"/>`;
  }
  man = man.replace(/<application([^>]*)>/, m => m + meta);
  log('added AdMob app id' + (cfg.facebookAppId ? ' and Facebook ids' : ''));
}
if (!man.includes('android:screenOrientation')) {
  man = man.replace(/<activity\b/, '<activity android:screenOrientation="portrait"');
  log('locked portrait orientation');
}
write(manPath, man);

// 2. Facebook strings
if (cfg.facebookAppId) {
  const strPath = A('app', 'src', 'main', 'res', 'values', 'strings.xml');
  let str = read(strPath);
  if (!str.includes('facebook_app_id')) {
    str = str.replace('</resources>', `    <string name="facebook_app_id">${cfg.facebookAppId}</string>\n    <string name="facebook_client_token">${cfg.facebookClientToken}</string>\n</resources>`);
    write(strPath, str);
  }
}

// 3. Firebase: only switch on native login providers when the Firebase config file exists
const gsSrc = path.join(root, 'firebase', 'google-services.json');
const varPath = A('variables.gradle');
let vars = read(varPath);
if (fs.existsSync(gsSrc)) {
  fs.copyFileSync(gsSrc, A('app', 'google-services.json'));
  if (!vars.includes('rgcfaIncludeGoogle')) {
    vars += `\next {\n    rgcfaIncludeGoogle = true\n    rgcfaIncludeFacebook = ${cfg.facebookAppId ? 'true' : 'false'}\n}\n`;
    write(varPath, vars);
  }
  log('Firebase config copied, Google sign-in enabled');
} else {
  log('no firebase/google-services.json: login runs in local test mode');
}

// 4. Version and release signing from environment (GitHub secrets)
const gradlePath = A('app', 'build.gradle');
let g = read(gradlePath);
const code = parseInt(process.env.BUILD_NUMBER || process.env.GITHUB_RUN_NUMBER || '1', 10);
g = g.replace(/versionCode \d+/, `versionCode ${code}`).replace(/versionName "[^"]*"/, `versionName "${cfg.versionName}"`);
if (!g.includes('signingConfigs')) {
  g = g.replace(/buildTypes \{/, `signingConfigs {
        release {
            if (System.getenv("KEYSTORE_FILE")) {
                storeFile file(System.getenv("KEYSTORE_FILE"))
                storePassword System.getenv("KEYSTORE_PASSWORD")
                keyAlias System.getenv("KEY_ALIAS")
                keyPassword System.getenv("KEY_PASSWORD")
            }
        }
    }
    buildTypes {`);
  g = g.replace(/release \{\n(\s*)minifyEnabled/, (m, sp) => `release {\n${sp}if (System.getenv("KEYSTORE_FILE")) { signingConfig signingConfigs.release }\n${sp}minifyEnabled`);
}
write(gradlePath, g);
log(`versionCode ${code}, versionName ${cfg.versionName}`);
