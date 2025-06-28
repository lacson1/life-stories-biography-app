# 📖 Life Stories Biography App

A comprehensive, Firebase-powered React application for creating, managing, and sharing personal life stories and biographies.

![Life Stories App](https://img.shields.io/badge/React-18.0+-blue.svg)
![Firebase](https://img.shields.io/badge/Firebase-Latest-orange.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0+-green.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

## ✨ Features

### 📝 Biography Creation

- **6 Comprehensive Sections**: About Me, Early Years, Family Life, Work & Career, Proud Moments, Life Lessons
- **Rich Text Editor**: Advanced formatting and styling options
- **Auto-Save**: Automatic saving with cloud backup
- **Progress Tracking**: Visual completion tracking with achievements

### 🤖 AI-Powered Writing

- **AI Writing Assistant**: 30+ section-specific prompts and suggestions
- **Smart Suggestions**: Context-aware writing recommendations
- **Story Starters**: AI-generated prompts to overcome writer's block

### 🔊 Voice & Media

- **Voice Transcription**: Real-time speech-to-text conversion
- **Audio Recording**: Record and attach voice memos
- **Photo Organization**: Upload, organize, and manage photos in albums
- **Timeline View**: Visual chronological organization

### 👥 Multi-User Support

- **Firebase Authentication**: Secure user accounts
- **Individual Profiles**: Separate biography data for each user
- **User Dashboard**: Manage multiple accounts and progress
- **Family Collaboration**: Share and collaborate on family stories

### 📱 Modern UI/UX

- **Mobile-First Design**: Fully responsive across all devices
- **Dark/Light Mode**: Theme switching with system preference detection
- **Professional Landing Page**: Beautiful onboarding experience
- **5 Color Themes**: Customizable visual themes

### 📤 Export Options

- **6 Export Formats**: PDF, Word, Web, Email, JSON, Print
- **5 Export Themes**: Professional styling options
- **Custom Branding**: Personalized export layouts

## 🚀 Quick Start

### Prerequisites

- Node.js 16.0 or higher
- npm or yarn package manager
- Firebase account (for cloud features)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/lacson1/life-stories-biography-app.git
   cd life-stories-biography-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Firebase Setup** (Optional - for cloud features)
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Create Firestore database
   - Update Firebase config in `src/firebase/config.js`

4. **Start development server**

   ```bash
   npm start
   ```

5. **Open in browser**
   - Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── UserAuth.js      # Authentication forms
│   ├── LandingPage.js   # Landing page
│   ├── UserDashboard.js # User management
│   ├── AIWritingAssistant.js
│   ├── VoiceTranscription.js
│   ├── PhotoOrganization.js
│   └── ...
├── firebase/            # Firebase configuration
│   ├── config.js        # Firebase setup
│   ├── auth.js          # Authentication service
│   ├── firestore.js     # Database operations
│   └── storage.js       # File storage
├── hooks/               # Custom React hooks
│   ├── useFirebaseUserManager.js
│   ├── useAutoSave.js
│   └── useCloudBackup.js
├── BiographyApp.js      # Main application component
├── BiographyAppWrapper.js # App wrapper with auth
└── index.js             # Application entry point
```

## 🔧 Configuration

### Firebase Setup

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Note your project configuration

2. **Enable Services**
   - **Authentication**: Enable Email/Password sign-in
   - **Firestore**: Create database in test mode
   - **Storage**: Enable for photo/audio uploads

3. **Update Configuration**

   ```javascript
   // src/firebase/config.js
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.firebasestorage.app",
     messagingSenderId: "your-sender-id",
     appId: "your-app-id"
   };
   ```

### Environment Variables (Optional)

Create a `.env` file for sensitive configuration:

```env
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
```

## 📱 Usage

### Creating Your First Biography

1. **Sign Up**: Create a new account or sign in
2. **Start Writing**: Choose a section to begin
3. **Use AI Assistance**: Click the AI assistant for writing prompts
4. **Add Media**: Upload photos and record voice memos
5. **Track Progress**: Monitor completion in the progress tracker
6. **Export**: Share your story in multiple formats

### Advanced Features

- **Voice Transcription**: Click the microphone icon to dictate text
- **Photo Albums**: Organize photos by life periods or themes
- **Timeline View**: See your life story chronologically
- **Export Options**: Generate professional PDFs or web pages

## 🛠️ Development

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

### Key Technologies

- **React 18**: Modern React with hooks and concurrent features
- **Firebase**: Authentication, Firestore, Storage
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Beautiful icons
- **Web Speech API**: Voice transcription

## 🐛 Troubleshooting

### Common Issues

1. **Firebase Login Fails**
   - Check Firebase configuration
   - Ensure Authentication is enabled
   - Verify network connectivity

2. **Build Errors**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check for syntax errors in console

3. **Voice Transcription Not Working**
   - Ensure HTTPS (required for Web Speech API)
   - Check browser permissions for microphone

See [FIREBASE_TROUBLESHOOTING.md](FIREBASE_TROUBLESHOOTING.md) for detailed Firebase setup help.

## 📚 Documentation

- [Implementation Summary](IMPLEMENTATION_SUMMARY.md) - Detailed feature overview
- [Latest Improvements](LATEST_IMPROVEMENTS.md) - Recent updates and enhancements
- [Design Improvements](DESIGN_IMPROVEMENTS.md) - UI/UX evolution
- [Firebase Troubleshooting](FIREBASE_TROUBLESHOOTING.md) - Setup and debugging guide

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Firebase for cloud infrastructure
- Tailwind CSS for styling system
- Lucide for beautiful icons
- Web Speech API for voice features

## 📞 Support

If you encounter any issues or have questions:

1. Check the [troubleshooting guide](FIREBASE_TROUBLESHOOTING.md)
2. Search existing [GitHub issues](https://github.com/lacson1/life-stories-biography-app/issues)
3. Create a new issue with detailed information

---

**Made with ❤️ for preserving life stories and family memories**
