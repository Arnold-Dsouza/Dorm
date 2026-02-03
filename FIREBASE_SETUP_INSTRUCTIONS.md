# Setting Up Firebase for Android Push Notifications

Now that I've updated your Gradle files and created the necessary components, you need to:

1. Get a Firebase configuration file:

## Firebase Setup Instructions

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use an existing one)
3. Add an Android app:
   - Use package name: `com.dorms.app`
   - App nickname: Dorms
   - Debug signing certificate: (optional)
4. Download `google-services.json`
5. Place the downloaded file in: `android/app/`

## Integration in Your App

I've added these files to your project:

1. `android/app/src/main/res/drawable/ic_stat_notification.xml` - Notification icon
2. `src/lib/android-push-notifications.ts` - Push notification initialization
3. `src/components/android-push-notification-initializer.tsx` - Component to integrate

## Add the Initializer to Your App

Add this to your app layout:

```tsx
// In src/app/layout.tsx (or another root component)
import AndroidPushNotificationInitializer from '@/components/android-push-notification-initializer';

// Then inside your component:
{Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android' && (
  <AndroidPushNotificationInitializer />
)}
```

## Test Your Setup

After adding the Firebase configuration file:

1. Run: `npm run mobile:sync` to sync your Android project
2. Test notifications using the notification test feature in your app

If you need help with the Firebase Console, let me know!
