# 🔥 Firebase Login Troubleshooting Guide

## Common Login Issues & Solutions

### 1. **Authentication Not Enabled**
**Problem**: Firebase Auth is not enabled in Firebase Console
**Solution**: 
- Go to [Firebase Console](https://console.firebase.google.com/)
- Select your project: `biographi-28eed`
- Go to Authentication > Sign-in method
- Enable "Email/Password" authentication

### 2. **Firestore Not Enabled**
**Problem**: Firestore database is not created
**Solution**:
- Go to Firestore Database in Firebase Console
- Click "Create database"
- Choose "Start in test mode" for now
- Select a location (us-central1 recommended)

### 3. **Security Rules Too Restrictive**
**Problem**: Firestore security rules prevent read/write
**Solution**: Set these rules temporarily:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 4. **Network/CORS Issues**
**Problem**: Browser blocking Firebase requests
**Solution**:
- Check browser console for CORS errors
- Try in incognito mode
- Disable browser extensions temporarily

### 5. **Common Error Messages**

| Error | Meaning | Solution |
|-------|---------|----------|
| `auth/user-not-found` | Email not registered | Sign up first |
| `auth/wrong-password` | Incorrect password | Check password |
| `auth/email-already-in-use` | Email exists | Sign in instead |
| `auth/weak-password` | Password too short | Use 6+ characters |
| `auth/network-request-failed` | Network issue | Check internet |

### 6. **Testing Steps**

1. **Open Browser Console** (F12)
2. **Create New Account**:
   - Use a test email: `test@example.com`
   - Password: `123456` (6+ chars)
   - Check console for Firebase logs

3. **Sign In**:
   - Use same credentials
   - Check for error messages

### 7. **Firebase Console Checklist**

✅ Project exists: `biographi-28eed`
✅ Authentication enabled
✅ Email/Password provider enabled
✅ Firestore database created
✅ Security rules allow authenticated users

### 8. **Quick Fix Commands**

```bash
# Check Firebase config
npm list firebase

# Restart dev server
npm start
```

## Need Help?
Check browser console for detailed error messages and Firebase logs.
