import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, UserPlus, LogIn, Eye, EyeOff, AlertCircle } from 'lucide-react';
import LandingPage from './LandingPage';

const UserAuth = ({ onLogin, onCreateAccount }) => {
    const [showAuthForm, setShowAuthForm] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    // Debug Firebase on component mount
    useEffect(() => {
        console.log('🔥 Firebase Auth Component Loaded');
        // You can add Firebase connection test here if needed
    }, []);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (isSignUp && !formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (isSignUp && formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        setErrors({}); // Clear previous errors

        try {
            console.log('🔥 Attempting Firebase authentication...', { 
                isSignUp, 
                email: formData.email,
                hasPassword: !!formData.password 
            });

            if (isSignUp) {
                // Create new account with Firebase
                const newUser = {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                };
                console.log('🔥 Creating new user account...');
                await onCreateAccount(newUser);
                console.log('✅ Account created successfully!');
            } else {
                // Sign in existing user with Firebase
                const userData = {
                    email: formData.email,
                    password: formData.password
                };
                console.log('🔥 Signing in user...');
                await onLogin(userData);
                console.log('✅ Login successful!');
            }
        } catch (error) {
            console.error('❌ Authentication error:', error);
            
            // Provide user-friendly error messages
            let errorMessage = error.message;
            
            if (error.message.includes('auth/user-not-found')) {
                errorMessage = 'No account found with this email. Please sign up first.';
            } else if (error.message.includes('auth/wrong-password')) {
                errorMessage = 'Incorrect password. Please try again.';
            } else if (error.message.includes('auth/email-already-in-use')) {
                errorMessage = 'An account with this email already exists. Please sign in instead.';
            } else if (error.message.includes('auth/weak-password')) {
                errorMessage = 'Password is too weak. Please use at least 6 characters.';
            } else if (error.message.includes('auth/invalid-email')) {
                errorMessage = 'Invalid email address format.';
            } else if (error.message.includes('auth/network-request-failed')) {
                errorMessage = 'Network error. Please check your internet connection.';
            } else if (error.message.includes('auth/too-many-requests')) {
                errorMessage = 'Too many failed attempts. Please try again later.';
            }
            
            setErrors({ general: errorMessage });
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMode = () => {
        setIsSignUp(!isSignUp);
        setFormData({ name: '', email: '', password: '', confirmPassword: '' });
        setErrors({});
    };

    const handleGetStarted = () => {
        setIsSignUp(true);
        setShowAuthForm(true);
    };

    const handleSignIn = () => {
        setIsSignUp(false);
        setShowAuthForm(true);
    };

    if (!showAuthForm) {
        return (
            <LandingPage 
                onGetStarted={handleGetStarted}
                onSignIn={handleSignIn}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-6">
                    <button 
                        onClick={() => setShowAuthForm(false)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                        ←Back to Home
                    </button>
                </div>

                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                        <User className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {isSignUp ? 'Create Your Account' : 'Welcome Back'}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        {isSignUp 
                            ? 'Start creating your life story biography' 
                            : 'Sign in to continue your biography'
                        }
                    </p>
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                            🔥 Now powered by Firebase for secure cloud storage!
                        </p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {isSignUp && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input 
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                                            errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                        }`}
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input 
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                                        errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                    placeholder="Enter your email"
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input 
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                                        errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                    placeholder="Enter your password"
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>

                        {isSignUp && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input 
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                                            errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                        }`}
                                        placeholder="Confirm your password"
                                    />
                                </div>
                                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                            </div>
                        )}

                        {errors.general && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-3">
                                <div className="flex items-start gap-2">
                                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-red-600 dark:text-red-400 text-sm font-medium">Authentication Error</p>
                                        <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.general}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Connecting to Firebase...</span>
                                </>
                            ) : (
                                <>
                                    {isSignUp ? <UserPlus className="h-5 w-5" /> : <LogIn className="h-5 w-5" />}
                                    {isSignUp ? 'Create Firebase Account' : 'Sign In with Firebase'}
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600 dark:text-gray-400">
                            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                            <button
                                onClick={toggleMode}
                                className="ml-2 text-blue-600 hover:text-blue-700 font-medium"
                            >
                                {isSignUp ? 'Sign In' : 'Sign Up'}
                            </button>
                        </p>
                    </div>

                    {/* Debug Information */}
                    <div className="mt-6 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                            🔧 Debug: Check browser console for detailed Firebase logs
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserAuth;
