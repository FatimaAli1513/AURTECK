# Play Store Release AAB Build

## 1. Keystore settings

Tumhari keystore: **`auteck-release-key.keystore`** (project root par).

**`android/keystore.properties`** open karo aur apne keystore ke hisaab se values daalo:

```properties
storeFile=../../auteck-release-key.keystore
storePassword=APNA_STORE_PASSWORD
keyAlias=APNA_KEY_ALIAS
keyPassword=APNA_KEY_PASSWORD
```

- **storePassword** – keystore banate waqt jo password diya tha  
- **keyAlias** – keystore ka alias (e.g. `upload`, `key0`, `aurteck` – jo tumne set kiya)  
- **keyPassword** – key ka password (agar alag hai to woh, warna storePassword hi use karo)

Alias check karne ke liye (password maangega):

```bash
keytool -list -keystore auteck-release-key.keystore
```

## 2. Release AAB banana

```bash
yarn android:release
```

Ya:

```bash
cd android && ./gradlew bundleRelease -x lint -x test
```

Build khatam hone ke baad AAB yahan milegi:

```
android/app/build/outputs/bundle/release/app-release.aab
```

Is **`app-release.aab`** file ko Play Console par upload karo (App release → Production / Testing → Create new release → Upload).

## 3. Play Store par upload

- **Package name:** `com.aurteck.app` (app.json aur build dono mein set hai)  
- **AAB:** Sirf `.aab` upload karo, `.apk` nahi  
- Pehli release ke liye **versionCode** 1 hai; har nayi release par `android/app/build.gradle` mein `versionCode` badha dena (2, 3, …) aur `versionName` bhi update karo (e.g. "1.0.1")

**Note:** `keystore.properties` aur `*.keystore` ko Git mein commit mat karo (passwords safe rehne chahiye).

---

## Play Store upload – issue na aaye iske liye

- **File:** Sirf **`app-release.aab`** upload karo (APK nahi).
- **Package name:** Play Console mein app create karte waqt package **`com.aurteck.app`** use karo (is AAB ke saath match karna chahiye).
- **Target SDK:** Is build mein targetSdk 36 hai – Play Store ki requirement meet ho rahi hai.
- **Signing:** AAB tumhare **auteck-release-key.keystore** se signed hai. Pehli upload par agar Google Play App Signing enable ho to Google tumse upload key maangega – tumhari yehi keystore upload key hai; future updates bhi isi se sign karke bhejna.
- **Version:** Abhi versionCode **1**, versionName **1.0.0**. Agli release par `android/app/build.gradle` mein dono increase karna (versionCode 2, versionName "1.0.1").
- **Keystore backup:** `auteck-release-key.keystore` aur uske passwords safe backup rakhna; bina iske future update sign nahi kar paoge.
