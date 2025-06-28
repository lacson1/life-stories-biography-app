import React, { useState, useEffect } from 'react';
import BiographyApp from './BiographyApp';
import UserAuth from './components/UserAuth';
import UserDashboard from './components/UserDashboard';
import useUserManager from './hooks/useFirebaseUserManager';
import { quickFirebaseTest } from './firebase/test';

const BiographyAppWrapper = () => {
    const {
        currentUser,
        users,
        isLoading,
        isAuthenticated,
        loginUser,
        logoutUser,
        createUser,
        switchUser,
        deleteUser,
        updateUserBiography,
        getUserBiographyData,
        exportUserData,
        importUserData
    } = useUserManager();

    const [showDashboard, setShowDashboard] = useState(false);
    const [showAuth, setShowAuth] = useState(false);

    // Debug Firebase connection on mount
    useEffect(() => {
        console.log('🔥 BiographyAppWrapper mounted');
        const testResult = quickFirebaseTest();
        console.log('🔥 Firebase Quick Test Result:', testResult);
    }, []);

    // Handle user login
    const handleLogin = async(userData) => {
        try {
            console.log('🔥 BiographyAppWrapper: Attempting login...', userData.email);
            await loginUser(userData);
            console.log('✅ BiographyAppWrapper: Login successful');
            setShowAuth(false);
        } catch (error) {
            console.error('❌ BiographyAppWrapper: Login failed:', error);
            // Don't show alert here, let UserAuth component handle the error display
            throw error; // Re-throw so UserAuth can catch it
        }
    };

    // Handle user creation
    const handleCreateAccount = async(userData) => {
        try {
            console.log('🔥 BiographyAppWrapper: Creating account...', userData.email);
            await createUser(userData);
            console.log('✅ BiographyAppWrapper: Account created successfully');
            setShowAuth(false);
        } catch (error) {
            console.error('❌ BiographyAppWrapper: Account creation failed:', error);
            // Don't show alert here, let UserAuth component handle the error display
            throw error; // Re-throw so UserAuth can catch it
        }
    };

    // Handle logout
    const handleLogout = async() => {
        try {
            await logoutUser();
            setShowDashboard(false);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    // Handle user switching
    const handleSwitchUser = (userId) => {
        // Note: Firebase requires individual authentication
        alert('With Firebase, each user needs to sign in with their own credentials');
        setShowDashboard(false);
        setShowAuth(true);
    };

    // Handle creating new user from dashboard
    const handleCreateNewUser = () => {
        setShowDashboard(false);
        setShowAuth(true);
    };

    // Handle user deletion
    const handleDeleteUser = (userId) => {
        alert('User deletion requires admin privileges in Firebase');
    };

    // Handle data import
    const handleImportUser = (userData) => {
        alert('Data import not fully implemented with Firebase yet');
    };

    // Handle biography data updates
    const handleBiographyUpdate = async(biographyData) => {
        try {
            await updateUserBiography(biographyData);
        } catch (error) {
            console.error('Error updating biography:', error);
        }
    };

    // Show loading state
    if (isLoading) {
        return ( <
            div className = "min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center" >
            <
            div className = "text-center" >
            <
            div className = "w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" > < /div> <
            p className = "text-gray-600 dark:text-gray-400" > Connecting... < /p> < /
            div > <
            /div>
        );
    }

    // Show authentication if no user is logged in or auth is requested
    if (!isAuthenticated || showAuth) {
        return ( <
            UserAuth onLogin = { handleLogin }
            onCreateAccount = { handleCreateAccount }
            />
        );
    }

    // Show dashboard if requested
    if (showDashboard) {
        return ( <
            UserDashboard currentUser = { currentUser }
            users = { users }
            onSwitchUser = { handleSwitchUser }
            onLogout = { handleLogout }
            onCreateNewUser = { handleCreateNewUser }
            onDeleteUser = { handleDeleteUser }
            onExportUser = { exportUserData }
            onImportUser = { handleImportUser }
            />
        );
    }

    // Show main biography app with user context
    return ( <
        BiographyApp currentUser = { currentUser }
        biographyData = { getUserBiographyData() }
        onBiographyUpdate = { handleBiographyUpdate }
        onShowDashboard = {
            () => setShowDashboard(true)
        }
        onLogout = { handleLogout }
        />
    );
};

export default BiographyAppWrapper;