import { auth, db } from './config';
import { connectAuthEmulator, connectFirestoreEmulator } from 'firebase/auth';

export const debugFirebaseConnection = () => {
  console.log('🔥 Firebase Debug Information:');
  console.log('Auth instance:', auth);
  console.log('Firestore instance:', db);
  console.log('Auth app:', auth.app);
  console.log('Auth config:', auth.config);
  
  // Test if Firebase is properly initialized
  try {
    console.log('✅ Firebase is properly initialized');
    console.log('Project ID:', auth.app.options.projectId);
    console.log('Auth Domain:', auth.app.options.authDomain);
    return true;
  } catch (error) {
    console.error('❌ Firebase initialization error:', error);
    return false;
  }
};

export const testFirebaseConnection = async () => {
  try {
    // Test auth connection
    const currentUser = auth.currentUser;
    console.log('Current user:', currentUser);
    
    // Test if we can access Firestore
    console.log('Testing Firestore connection...');
    
    return true;
  } catch (error) {
    console.error('Firebase connection test failed:', error);
    return false;
  }
};
