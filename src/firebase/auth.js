import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile,
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './config';

// Create user account
export const createUserAccount = async (email, password, name) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update user profile with name
    await updateProfile(user, {
      displayName: name
    });

    // Create user document in Firestore
    const userDoc = {
      id: user.uid,
      name: name,
      email: email,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff`,
      biographyData: {
        sections: {
          aboutMe: '',
          earlyYears: '',
          familyLife: '',
          workCareer: '',
          proudMoments: '',
          lifeLessons: ''
        },
        photos: [],
        timeline: [],
        specialMemories: [],
        tags: [],
        progress: {
          totalWords: 0,
          completedSections: 0,
          lastSaved: null
        }
      }
    };

    await setDoc(doc(db, 'users', user.uid), userDoc);

    return {
      ...userDoc,
      uid: user.uid
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Sign in user
export const signInUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get user data from Firestore
    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      
      // Update last login time
      const updatedData = {
        ...userData,
        lastLoginAt: new Date().toISOString()
      };
      
      await setDoc(userDocRef, updatedData);
      
      return {
        ...updatedData,
        uid: user.uid
      };
    } else {
      throw new Error('User data not found');
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

// Sign out user
export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error(error.message);
  }
};

// Listen to auth state changes
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser;
};
