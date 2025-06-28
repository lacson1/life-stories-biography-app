import { useState, useEffect } from 'react';

const useUserManager = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load users and current user from localStorage on mount
    useEffect(() => {
        const savedUsers = localStorage.getItem('biography_users');
        const savedCurrentUser = localStorage.getItem('biography_current_user');

        if (savedUsers) {
            const parsedUsers = JSON.parse(savedUsers);
            // Ensure all users have proper biographyData structure
            const normalizedUsers = parsedUsers.map(user => ({
                ...user,
                biographyData: {
                    sections: {
                        aboutMe: '',
                        earlyYears: '',
                        familyLife: '',
                        workCareer: '',
                        proudMoments: '',
                        lifeLessons: '',
                        ...(user.biographyData && user.biographyData.sections ? user.biographyData.sections : {})
                    },
                    photos: (user.biographyData && user.biographyData.photos) || [],
                    timeline: (user.biographyData && user.biographyData.timeline) || [],
                    specialMemories: (user.biographyData && user.biographyData.specialMemories) || [],
                    tags: (user.biographyData && user.biographyData.tags) || [],
                    progress: {
                        totalWords: 0,
                        completedSections: 0,
                        lastSaved: null,
                        ...(user.biographyData && user.biographyData.progress ? user.biographyData.progress : {})
                    }
                }
            }));
            setUsers(normalizedUsers);
        }

        if (savedCurrentUser) {
            const parsedUser = JSON.parse(savedCurrentUser);
            // Ensure current user has proper biographyData structure
            const normalizedUser = {
                ...parsedUser,
                biographyData: {
                    sections: {
                        aboutMe: '',
                        earlyYears: '',
                        familyLife: '',
                        workCareer: '',
                        proudMoments: '',
                        lifeLessons: '',
                        ...(parsedUser.biographyData && parsedUser.biographyData.sections ? parsedUser.biographyData.sections : {})
                    },
                    photos: (parsedUser.biographyData && parsedUser.biographyData.photos) || [],
                    timeline: (parsedUser.biographyData && parsedUser.biographyData.timeline) || [],
                    specialMemories: (parsedUser.biographyData && parsedUser.biographyData.specialMemories) || [],
                    tags: (parsedUser.biographyData && parsedUser.biographyData.tags) || [],
                    progress: {
                        totalWords: 0,
                        completedSections: 0,
                        lastSaved: null,
                        ...(parsedUser.biographyData && parsedUser.biographyData.progress ? parsedUser.biographyData.progress : {})
                    }
                }
            };
            setCurrentUser(normalizedUser);
        }

        setIsLoading(false);
    }, []);

    // Save users to localStorage whenever users array changes
    useEffect(() => {
        if (users.length > 0) {
            localStorage.setItem('biography_users', JSON.stringify(users));
        }
    }, [users]);

    // Save current user to localStorage whenever it changes
    useEffect(() => {
        if (currentUser) {
            localStorage.setItem('biography_current_user', JSON.stringify(currentUser));
        } else {
            localStorage.removeItem('biography_current_user');
        }
    }, [currentUser]);

    const createUser = (userData) => {
        const newUser = {
            ...userData,
            id: userData.id || `user_${Date.now()}`,
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString(),
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

        setUsers(prev => [...prev, newUser]);
        setCurrentUser(newUser);
        return newUser;
    };

    const loginUser = (userData) => {
        // Check if user already exists
        const existingUser = users.find(user => user.email === userData.email);

        if (existingUser) {
            // Update last login time
            const updatedUser = {
                ...existingUser,
                lastLoginAt: new Date().toISOString()
            };

            setUsers(prev => prev.map(user =>
                user.id === existingUser.id ? updatedUser : user
            ));
            setCurrentUser(updatedUser);
            return updatedUser;
        } else {
            // Create new user if doesn't exist
            return createUser(userData);
        }
    };

    const logoutUser = () => {
        setCurrentUser(null);
    };

    const updateUserBiography = (biographyData) => {
        if (!currentUser) return;

        const updatedUser = {
            ...currentUser,
            biographyData: {
                ...currentUser.biographyData,
                ...biographyData,
                progress: {
                    ...currentUser.biographyData.progress,
                    lastSaved: new Date().toISOString()
                }
            }
        };

        setUsers(prev => prev.map(user =>
            user.id === currentUser.id ? updatedUser : user
        ));
        setCurrentUser(updatedUser);
    };

    const deleteUser = (userId) => {
        setUsers(prev => prev.filter(user => user.id !== userId));

        // If deleting current user, log out
        if (currentUser && currentUser.id === userId) {
            setCurrentUser(null);
        }

        // Clean up user's biography data from localStorage
        localStorage.removeItem(`biography_data_${userId}`);
    };

    const switchUser = (userId) => {
        const user = users.find(u => u.id === userId);
        if (user) {
            const updatedUser = {
                ...user,
                lastLoginAt: new Date().toISOString()
            };

            setUsers(prev => prev.map(u =>
                u.id === userId ? updatedUser : u
            ));
            setCurrentUser(updatedUser);
        }
    };

    const getUserBiographyData = (userId = null) => {
        const targetUserId = userId || (currentUser && currentUser.id);
        if (!targetUserId) return null;

        const user = users.find(u => u.id === targetUserId);
        return user ? user.biographyData : null;
    };

    const getAllUsers = () => {
        return users.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            createdAt: user.createdAt,
            lastLoginAt: user.lastLoginAt,
            progress: user.biographyData.progress
        }));
    };

    const exportUserData = (userId = null) => {
        const targetUserId = userId || (currentUser && currentUser.id);
        if (!targetUserId) return null;

        const user = users.find(u => u.id === targetUserId);
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
        try {
            const newUser = {
                id: `imported_${Date.now()}`,
                name: userData.user.name,
                email: userData.user.email,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.user.name)}&background=3b82f6&color=fff`,
                createdAt: userData.user.createdAt,
                lastLoginAt: new Date().toISOString(),
                biographyData: userData.biography
            };

            setUsers(prev => [...prev, newUser]);
            return newUser;
        } catch (error) {
            console.error('Error importing user data:', error);
            return null;
        }
    };

    return {
        // State
        currentUser,
        users: getAllUsers(),
        isLoading,

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

export default useUserManager;