import { auth, db } from './config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

// Test Firebase connection
export const testFirebaseConnection = async () => {
    console.log('🔥 Testing Firebase Connection...');
    
    try {
        // Test 1: Check if Firebase is initialized
        console.log('✅ Firebase Auth:', auth);
        console.log('✅ Firebase Firestore:', db);
        console.log('✅ Project ID:', auth.app.options.projectId);
        
        // Test 2: Try to create a test user
        const testEmail = `test-${Date.now()}@example.com`;
        const testPassword = '123456';
        
        console.log('🔥 Creating test user:', testEmail);
        const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
        const user = userCredential.user;
        console.log('✅ Test user created:', user.uid);
        
        // Test 3: Try to write to Firestore
        console.log('🔥 Testing Firestore write...');
        await setDoc(doc(db, 'test', 'connection'), {
            message: 'Firebase connection successful!',
            timestamp: new Date().toISOString(),
            userId: user.uid
        });
        console.log('✅ Firestore write successful!');
        
        // Test 4: Try to sign in
        console.log('🔥 Testing sign in...');
        await signInWithEmailAndPassword(auth, testEmail, testPassword);
        console.log('✅ Sign in successful!');
        
        return {
            success: true,
            message: 'All Firebase tests passed!'
        };
        
    } catch (error) {
        console.error('❌ Firebase test failed:', error);
        return {
            success: false,
            error: error.message,
            code: error.code
        };
    }
};

// Quick connection test
export const quickFirebaseTest = () => {
    console.log('🔥 Quick Firebase Test:');
    console.log('Auth Domain:', auth.app.options.authDomain);
    console.log('Project ID:', auth.app.options.projectId);
    console.log('API Key exists:', !!auth.app.options.apiKey);
    
    return {
        configured: true,
        projectId: auth.app.options.projectId,
        authDomain: auth.app.options.authDomain
    };
};
