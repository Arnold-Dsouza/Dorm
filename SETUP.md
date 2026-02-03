# TABU Project Setup

This project has been successfully set up! 🎉

## Project Overview
- **Framework**: Next.js 15.3.3 with TypeScript
- **UI Framework**: Tailwind CSS + Radix UI components
- **Mobile**: Capacitor for Android development
- **Database**: Firebase Firestore
- **AI Integration**: Google Genkit with Gemini 2.0 Flash
- **State Management**: React Hook Form with Zod validation

## Setup Completed ✅
1. ✅ Dependencies installed (npm install)
2. ✅ Environment files created (.env.local, .env.example)
3. ✅ Build configuration fixed (server actions compatibility)
4. ✅ Project builds successfully
5. ✅ Development task configured

## Next Steps

### 1. Configure Firebase
Edit `.env.local` with your actual Firebase credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_actual_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 2. Configure Google AI
Add your Google AI API key to `.env.local`:
```env
GOOGLE_GENAI_API_KEY=your_google_ai_api_key
```

### 3. Available Scripts
- `npm run dev` - Start development server (port 9002)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run genkit:dev` - Start Genkit AI development
- `npm run android` - Run on Android (requires setup)

### 4. Development Server
The development server is now running at: http://localhost:9002

### 5. Mobile Development (Optional)
If you plan to develop for mobile:
```bash
npm run cap:sync  # Sync web assets to native projects
npm run android   # Run on Android
```

## Project Structure
- `src/app/` - Next.js app router pages
- `src/components/` - Reusable UI components
- `src/lib/` - Utilities, Firebase config, types
- `src/ai/` - AI/Genkit configuration and flows
- `android/` - Mobile app configurations

## Security Note 🔒
Remember to:
- Never commit actual API keys to version control
- Keep `.env.local` in your `.gitignore`
- Use environment variables for all sensitive data

Happy coding! 🚀
