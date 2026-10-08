# אי הלגונה: מדריך מהקוד ועד החנות

המשחק כולו נמצא ב-`www/index.html`. התיקייה הזו הופכת אותו לאפליקציה אמיתית לאנדרואיד ולאייפון בעזרת Capacitor.

**הסדר המומלץ:** שלב 1 נותן לך APK לבדיקה תוך כ-15 דקות, בלי להתקין כלום על המחשב. כל השאר מחבר את השירותים האמיתיים.

---

## שלב 1: APK לבדיקה בטלפון אנדרואיד (בלי Android Studio)
1. פתח חשבון חינמי ב-github.com.
2. צור מאגר חדש (New repository), למשל `lagoon-isle`, פרטי (Private).
3. בדף המאגר: Add file, ואז Upload files. גרור את **כל התוכן** של התיקייה הזו (כולל התיקייה `.github`) ולחץ Commit.
   אם התיקייה `.github` לא עולה בגרירה (היא מוסתרת במחשבים מסוימים), צור אותה ידנית: Add file, ואז Create new file, בשם `.github/workflows/android.yml`, והדבק את התוכן מהקובץ.
4. עבור ללשונית **Actions**. הבנייה מתחילה לבד ולוקחת כ-10 דקות.
5. בסיום לחץ על הריצה, ובתחתית תחת Artifacts הורד את `lagoon-isle-test-apk`.
6. העבר את קובץ ה-APK לטלפון, פתח אותו ואשר "התקנה ממקור לא ידוע".

בגרסה הזו: הפרסומות הן פרסומות בדיקה אמיתיות של Google, ההתחברות והרכישות עובדות במצב בדיקה מקומי.

## שלב 2: התחברות ושמירה בענן (Firebase)
1. היכנס ל-console.firebase.google.com וצור פרויקט.
2. הוסף אפליקציית Android עם המזהה `com.lagoonisle.merge` (מופיע ב-capacitor.config.json). הורד את `google-services.json`.
3. ב-Authentication, תחת Sign-in method, הפעל: Email/Password, Google, Apple ו-Facebook.
4. ב-Firestore Database צור מסד נתונים, ובלשונית Rules הדבק את התוכן של `firebase/firestore.rules`.
5. ב-GitHub: Settings, ואז Secrets and variables, ואז Actions, ואז New repository secret. בשם `GOOGLE_SERVICES_JSON` הדבק את כל תוכן הקובץ.
6. כדי שהתחברות Google תעבוד, הוסף ב-Firebase את טביעת האצבע SHA-1 של מפתח החתימה (מופיעה ב-Play Console תחת App integrity).

## שלב 3: פרסומות אמיתיות (AdMob)
1. פתח חשבון ב-admob.google.com, צור אפליקציה ויחידת מודעה מסוג **Rewarded**.
2. ב-`release-config.json` החלף את `admobAppIdAndroid` במזהה האפליקציה שלך.
3. ב-`www/index.html`, בבלוק `CONFIG` בראש הקוד, החלף את `ADMOB_REWARDED_ANDROID` במזהה יחידת המודעה.
4. השאר `TEST_MODE: true` עד שהכל עובד. לחיצות על פרסומות אמיתיות שלך בזמן בדיקה עלולות לגרום לחסימת החשבון.

## שלב 4: רכישות אמיתיות (RevenueCat)
1. ב-Play Console צור את המוצרים מהטבלה ב-`STORE-LISTING.md` (In-app products), עם אותם מזהים בדיוק.
2. פתח חשבון ב-revenuecat.com, חבר אותו ל-Play Console וייבא את המוצרים.
3. העתק את מפתח ה-API הציבורי (מתחיל ב-`goog_`) לשדה `REVENUECAT_KEY_ANDROID` ב-`CONFIG`.
4. ב-Play Console הוסף את עצמך כ-License tester, כדי לקנות בבדיקה בלי לשלם.

## שלב 5: Google Play
1. חשבון מפתח ב-play.google.com/console (25 דולר, פעם אחת).
2. **מפתח חתימה:** במחשב עם Java הרץ:
   `keytool -genkey -v -keystore release.keystore -alias lagoon -keyalg RSA -keysize 2048 -validity 10000`
   שמור את הקובץ והסיסמה במקום בטוח. בלעדיהם אי אפשר לעדכן את המשחק.
3. ב-GitHub Secrets הוסף: `KEYSTORE_BASE64` (הקובץ בקידוד base64), `KEYSTORE_PASSWORD`, `KEY_ALIAS` (lagoon), `KEY_PASSWORD`.
   עכשיו כל בנייה מייצרת גם `lagoon-isle-store-aab` להעלאה לחנות.
4. העלה את קובץ ה-AAB למסלול **Internal testing** קודם, ורק אחר כך ל-Closed testing.
5. חשבון אישי חדש חייב בדיקה סגורה עם 12 בודקים במשך 14 יום לפני פרסום ציבורי.
6. מלא את דף החנות, Data safety ודירוג גילאים לפי `STORE-LISTING.md`.

## שלב 6: App Store (אייפון)
1. חשבון ב-developer.apple.com (99 דולר לשנה).
2. אין מק? חבר את המאגר ל-**Codemagic** (codemagic.io). הוא בונה ומעלה לאפל בענן.
3. נדרש: `GoogleService-Info.plist` מ-Firebase, יחידת מודעה Rewarded ל-iOS, מפתח RevenueCat שמתחיל ב-`appl_`, והפעלת Sign in with Apple במזהה האפליקציה.
4. אפל דורשת שאפשר יהיה למחוק חשבון מתוך האפליקציה. זה כבר קיים (הגדרות, ואז מחק חשבון).

## לפני השקה ציבורית
עבור על `TESTING-CHECKLIST.md`, ובסוף:
- `TEST_MODE: false` ב-`CONFIG`
- למלא את הפרטים החסרים ב-`www/privacy.html` ולפרסם אותו בקישור ציבורי (למשל GitHub Pages)
- להחליף את כפתורי ההתחברות בגרסאות הרשמיות מערכות המיתוג של Google, Apple ו-Facebook


## איורים ורישיון
כל האיורים בתיקייה `www/art` לקוחים מ-Fluent Emoji של Microsoft, ברישיון MIT שמתיר שימוש מסחרי. קובץ הרישיון נמצא באותה תיקייה וחייב להישאר בפרויקט.

## מבנה התיקייה
| קובץ | תפקיד |
|---|---|
| `www/index.html` | כל המשחק: לוגיקה, איורים וטקסטים בעברית ובאנגלית |
| `www/fonts` | גופנים מקומיים, כדי שהמשחק יעבוד גם בלי אינטרנט |
| `www/privacy.html` | מדיניות פרטיות בעברית ובאנגלית |
| `assets` | אייקון ומסך פתיחה, שמהם נוצרים כל הגדלים |
| `release-config.json` | מזהים לגרסה לחנות |
| `scripts/prepare-android.mjs` | מכין את פרויקט האנדרואיד לפרסומות, להתחברות ולחתימה |
| `.github/workflows/android.yml` | בנייה אוטומטית ב-GitHub |
| `firebase/firestore.rules` | הרשאות: כל שחקן רואה רק את השמירה שלו |
| `STORE-LISTING.md` | טקסטים לחנות, מוצרים ומחירים |
| `TESTING-CHECKLIST.md` | רשימת בדיקות |

## פרסומות (Rewarded בלבד)
- פרסומת מוצגת רק כשהשחקן לוחץ "צפה". אין פרסומות כפויות או קופצות.
- המקומות: אנרגיה (רק כשהיא כמעט נגמרת), יהלומים בחנות, הכפלת המתנה היומית, שחרור בועה, ובונוס לתיבה על הלוח.
- את הפרסים והמגבלות היומיות משנים בקובץ `www/index.html` בבלוק `CONFIG.ADS`,
  או מרחוק בלי עדכון אפליקציה: ב Firebase Console צור מסמך `config/ads` עם אותם שדות (למשל `energy: {reward: 30}`).
- לפני ההשקה: החלף ב CONFIG את מזהי הבדיקה `ADMOB_REWARDED_*` במזהים מחשבון AdMob שלך, ואת `TEST_MODE` ל false.
