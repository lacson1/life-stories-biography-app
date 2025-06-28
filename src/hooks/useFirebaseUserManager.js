import { useState, useEffect } from 'react';
import { 
  createUserAccount, 
  signInUser, 
  signOutUser, 
  onAuthStateChange,
  getCurrentUser 
} from '../firebase/auth';
import { 
  saveBiographyData, 
  getBiographyData, 
  getUserProfile,
  getAllUsers 
} from '../firebase/firestore';

const useFirebaseUserManager = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [authUser, setAuthUser] = useState(null);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      setIsLoading(true);
      
      if (user) {
        try {
          // Get user profile from Firestore
          const userProfile = await getUserProfile(user.uid);
          if (userProfile) {
            setCurrentUser(userProfile);
            setAuthUser(user);
          }
        } catch (error) {
          console.error('Error loading user profile:', error);
        }
      } else {
        setCurrentUser(null);
        setAuthUser(null);
      }
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Load all users (for dashboard)
  useEffect(() => {
    const loadUsers = async () => {
      if (currentUser) {
        try {
          const allUsers = await getAllUsers();
          setUsers(allUsers);
        } catch (error) {
          console.error('Error loading users:', error);
        }
      }
    };

    loadUsers();
  }, [currentUser]);

  const createUser = async (userData) => {
    try {
      const newUser = await createUserAccount(
        userData.email, 
        userData.password || '123456', // Default password
        userData.name
      );
      
      setCurrentUser(newUser);
      return newUser;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const loginUser = async (userData) => {
    try {
      const user = await signInUser(userData.email, userData.password);
      setCurrentUser(user);
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const logoutUser = async () => {
    try {
      await signOutUser();
      setCurrentUser(null);
      setAuthUser(null);
      setUsers([]);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateUserBiography = async (biographyData) => {
    if (!currentUser || !authUser) return false;

    try {
      const success = await saveBiographyData(authUser.uid, biographyData);
      
      if (success) {
        // Update local state
        const updatedUser = {
          ...currentUser,
          biographyData: {
            ...currentUser.biographyData,
            ...biographyData
          }
        };
        setCurrentUser(updatedUser);
        
        // Update users list
        setUsers(prev => prev.map(user => 
          user.id === currentUser.id ? updatedUser : user
        ));
      }
      
      return success;
    } catch (error) {
      console.error('Error updating biography:', error);
      return false;
    }
  };

  const getUserBiographyData = async (userId = null) => {
    const targetUserId = userId || (authUser && authUser.uid);
    if (!targetUserId) return null;

    try {
      return await getBiographyData(targetUserId);
    } catch (error) {
      console.error('Error getting biography data:', error);
      return null;
    }
  };

  const switchUser = async (userId) => {
    // Note: In Firebase, users need to sign in individually
    // This would require the user to know the password
    // You might want to implement a different approach for multi-user
    console.log('Switch user not implemented with Firebase auth');
  };

  const deleteUser = async (userId) => {
    // Note: Deleting users requires admin privileges
    // This would need to be implemented server-side
    console.log('Delete user not implemented with Firebase auth');
  };

  const exportUserData = (userId = null) => {
    const targetUserId = userId || (currentUser && currentUser.id);
    if (!targetUserId) return null;

    const user = users.find(u => u.id === targetUserId) || currentUser;
    if (!user) return null;

    return {
      user: {
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      },
      biography: user.biographyData,
      exportedAt: new Date().toISOString()
    };
  };

  const importUserData = (userData) => {
    // This would require creating a new Firebase user
    // For now, just log that it's not implemented
    console.log('Import user data not fully implemented with Firebase');
    return null;
  };

  const getAllUsersForDashboard = () => {
    return users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
      progress: user.biographyData && user.biographyData.progress ? user.biographyData.progress : {
        totalWords: 0,
        completedSections: 0,
        lastSaved: null
      }
    }));
  };

  return {
    // State
    currentUser,
    users: getAllUsersForDashboard(),
    isLoading,
    authUser,

    // Actions
    createUser,
    loginUser,
    logoutUser,
    switchUser,
    deleteUser,
    updateUserBiography,

    // Data access
    getUserBiographyData,
    exportUserData,
    importUserData,

    // Computed values
    isAuthenticated: !!currentUser,
    totalUsers: users.length
  };
};

export default useFirebaseUserManager;
