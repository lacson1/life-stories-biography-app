import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  getDocs, 
  query, 
  where 
} from 'firebase/firestore';
import { db } from './config';

// Save biography data
export const saveBiographyData = async (userId, biographyData) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    
    // Calculate progress
    const sections = biographyData.sections || {};
    const completedSections = Object.values(sections).filter(section => 
      section && section.trim().length > 50
    ).length;
    
    const totalWords = Object.values(sections).reduce((total, section) => {
      return total + (section ? section.trim().split(/\s+/).length : 0);
    }, 0);

    const updatedData = {
      biographyData: {
        ...biographyData,
        progress: {
          totalWords,
          completedSections,
          lastSaved: new Date().toISOString()
        }
      }
    };

    await updateDoc(userDocRef, updatedData);
    return true;
  } catch (error) {
    console.error('Error saving biography data:', error);
    return false;
  }
};

// Get biography data
export const getBiographyData = async (userId) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      return userData.biographyData || null;
    }
    return null;
  } catch (error) {
    console.error('Error getting biography data:', error);
    return null;
  }
};

// Get user profile
export const getUserProfile = async (userId) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      return userDocSnap.data();
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

// Update user profile
export const updateUserProfile = async (userId, profileData) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, profileData);
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return false;
  }
};

// Get all users (for admin/dashboard)
export const getAllUsers = async () => {
  try {
    const usersCollectionRef = collection(db, 'users');
    const querySnapshot = await getDocs(usersCollectionRef);
    
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return users;
  } catch (error) {
    console.error('Error getting all users:', error);
    return [];
  }
};

// Search users by email
export const searchUserByEmail = async (email) => {
  try {
    const usersCollectionRef = collection(db, 'users');
    const q = query(usersCollectionRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      return {
        id: userDoc.id,
        ...userDoc.data()
      };
    }
    return null;
  } catch (error) {
    console.error('Error searching user by email:', error);
    return null;
  }
};
