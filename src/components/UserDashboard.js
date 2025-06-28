import React, { useState } from 'react';
import {
    Users,
    Plus,
    LogOut,
    Settings,
    Calendar,
    FileText,
    Trash2,
    Download,
    Upload,
    Search,
    MoreVertical
} from 'lucide-react';

const UserDashboard = ({
    currentUser,
    users,
    onSwitchUser,
    onLogout,
    onCreateNewUser,
    onDeleteUser,
    onExportUser,
    onImportUser
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showActions, setShowActions] = useState(null);

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getProgressColor = (completedSections) => {
        if (completedSections === 0) return 'bg-gray-200';
        if (completedSections <= 2) return 'bg-red-200';
        if (completedSections <= 4) return 'bg-yellow-200';
        return 'bg-green-200';
    };

    const handleExportUser = (userId) => {
        const userData = onExportUser(userId);
        if (userData) {
            const blob = new Blob([JSON.stringify(userData, null, 2)], {
                type: 'application/json'
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${userData.user.name}_biography_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    };

    const handleImportUser = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const userData = JSON.parse(e.target.result);
                    onImportUser(userData);
                } catch (error) {
                    alert('Error importing user data. Please check the file format.');
                }
            };
            reader.readAsText(file);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                <Users className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                                    Biography Dashboard
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Manage multiple life story biographies
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Import User */}
                            <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer">
                                <Upload className="h-4 w-4" />
                                Import User
                                <input 
                                    type="file"
                                    accept=".json"
                                    onChange={handleImportUser}
                                    className="hidden"
                                />
                            </label>

                            {/* Create New User */}
                            <button 
                                onClick={onCreateNewUser}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                <Plus className="h-4 w-4" />
                                New User
                            </button>

                            {/* Logout */}
                            <button 
                                onClick={onLogout}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                <LogOut className="h-4 w-4" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Current User Info */}
                {currentUser && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6 mb-8">
                        <div className="flex items-center gap-4">
                            <img 
                                src={currentUser.avatar}
                                alt={currentUser.name}
                                className="w-16 h-16 rounded-full"
                            />
                            <div className="flex-1">
                                <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100">
                                    Currently signed in as {currentUser.name}
                                </h2>
                                <p className="text-blue-700 dark:text-blue-300">{currentUser.email}</p>
                                <div className="flex items-center gap-4 mt-2 text-sm text-blue-600 dark:text-blue-400">
                                    <span>Words: {currentUser.biographyData?.progress?.totalWords || 0}</span>
                                    <span>Sections: {currentUser.biographyData?.progress?.completedSections || 0}/6</span>
                                    {currentUser.biographyData?.progress?.lastSaved && (
                                        <span>Last saved: {formatDate(currentUser.biographyData.progress.lastSaved)}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Search */}
                <div className="mb-6">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input 
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search users..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                </div>

                {/* Users Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredUsers.map((user) => (
                        <div 
                            key={user.id}
                            className={`bg-white dark:bg-gray-800 rounded-lg border-2 p-6 hover:shadow-lg transition-all ${
                                currentUser && currentUser.id === user.id
                                    ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800'
                                    : 'border-gray-200 dark:border-gray-700'
                            }`}
                        >
                            {/* User Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <img 
                                        src={user.avatar}
                                        alt={user.name}
                                        className="w-12 h-12 rounded-full"
                                    />
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">{user.name}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                                    </div>
                                </div>

                                {/* Actions Menu */}
                                <div className="relative">
                                    <button 
                                        onClick={() => setShowActions(showActions === user.id ? null : user.id)}
                                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    >
                                        <MoreVertical className="h-4 w-4" />
                                    </button>

                                    {showActions === user.id && (
                                        <div className="absolute right-0 top-8 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10 min-w-[160px]">
                                            <button 
                                                onClick={() => {
                                                    handleExportUser(user.id);
                                                    setShowActions(null);
                                                }}
                                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                                            >
                                                <Download className="h-4 w-4" />
                                                Export Data
                                            </button>
                                            {currentUser && currentUser.id !== user.id && (
                                                <button 
                                                    onClick={() => {
                                                        onDeleteUser(user.id);
                                                        setShowActions(null);
                                                    }}
                                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    Delete User
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Progress
                                    </span>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {user.progress?.completedSections || 0}/6 sections
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div 
                                        className={`h-2 rounded-full ${getProgressColor(user.progress?.completedSections || 0)}`}
                                        style={{ width: `${((user.progress?.completedSections || 0) / 6) * 100}%` }}
                                    >
                                    </div>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-1 text-gray-600 dark:text-gray-400">
                                        <FileText className="h-4 w-4" />
                                        <span className="text-sm">Words</span>
                                    </div>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {user.progress?.totalWords || 0}
                                    </p>
                                </div>
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-1 text-gray-600 dark:text-gray-400">
                                        <Calendar className="h-4 w-4" />
                                        <span className="text-sm">Joined</span>
                                    </div>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {formatDate(user.createdAt)}
                                    </p>
                                </div>
                            </div>

                            {/* Last Activity */}
                            <div className="text-center mb-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Last active: {formatDate(user.lastLoginAt)}
                                </p>
                            </div>

                            {/* Switch User Button */}
                            {currentUser && currentUser.id !== user.id ? (
                                <button 
                                    onClick={() => onSwitchUser(user.id)}
                                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium"
                                >
                                    Switch to {user.name}
                                </button>
                            ) : (
                                <div className="w-full bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 py-2 rounded-lg text-center font-medium">
                                    Current User
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredUsers.length === 0 && (
                    <div className="text-center py-12">
                        <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            {searchTerm ? 'No users found' : 'No users yet'}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            {searchTerm 
                                ? 'Try adjusting your search terms' 
                                : 'Create your first user account to get started'
                            }
                        </p>
                        {!searchTerm && (
                            <button 
                                onClick={onCreateNewUser}
                                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mx-auto"
                            >
                                <Plus className="h-5 w-5" />
                                Create First User
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;
