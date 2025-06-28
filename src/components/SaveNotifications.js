import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, AlertCircle, History, Download, RotateCcw } from 'lucide-react';

const SaveNotifications = ({ saveStatus, lastSaved, versions, onRestoreVersion }) => {
const [showNotification, setShowNotification] = useState(false);
const [showVersionHistory, setShowVersionHistory] = useState(false);
const [notification, setNotification] = useState(null);

useEffect(() => {
    if (saveStatus === 'saved') {
        setNotification({
            type: 'success',
            message: 'Your story has been saved automatically',
            timestamp: new Date().toLocaleTimeString()
        });
        setShowNotification(true);

        // Auto-hide after 3 seconds
        const timer = setTimeout(() => {
            setShowNotification(false);
        }, 3000);

        return () => clearTimeout(timer);
    } else if (saveStatus === 'error') {
        setNotification({
            type: 'error',
            message: 'Failed to save your story. Please try again.',
            timestamp: new Date().toLocaleTimeString()
        });
        setShowNotification(true);
    }
}, [saveStatus]);

const formatTimestamp = (timestamp) => {
    const now = new Date();
    const saveTime = new Date(timestamp);
    const diffMs = now - saveTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    return saveTime.toLocaleDateString();
};

const getVersionPreview = (versionData) => {
    const content = versionData.overview || versionData.childhood || versionData.family || '';
    return content.substring(0, 100) + (content.length > 100 ? '...' : '');
};

const getWordCount = (versionData) => {
    let totalWords = 0;
    Object.values(versionData).forEach(value => {
        if (typeof value === 'string') {
            totalWords += value.trim().split(/\s+/).filter(word => word.length > 0).length;
        }
    });
    return totalWords;
};

return ( <
        >
        { /* Save Status Indicator */ } <
        div className = "flex items-center gap-2" >
        <
        div className = { `w-2 h-2 rounded-full transition-colors ${
          saveStatus === 'saved' ? 'bg-green-500' : 
          saveStatus === 'saving' ? 'bg-yellow-500 animate-pulse' : 
          saveStatus === 'error' ? 'bg-red-500' : 'bg-gray-400'
        }` } > < /div> <
        span className = "text-xs text-gray-600 dark:text-gray-300" > {
            saveStatus === 'saved' && lastSaved ? formatTimestamp(lastSaved) : saveStatus === 'saving' ? 'Saving...' : saveStatus === 'error' ? 'Save failed' : 'Not saved'
        } <
        /span> {
        versions && versions.length > 0 && ( <
            button onClick = {
                () => setShowVersionHistory(true)
            }
            className = "text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1"
            title = "Version History" >
            <
            History className = "h-3 w-3" / >
            <
            span > { versions.length }
            versions < /span> < /
            button >
        )
    } <
    /div>

{ /* Save Notification Toast */ } {
    showNotification && notification && ( <
        div className = { `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border-l-4 transition-all duration-300 transform ${
          notification.type === 'success' 
            ? 'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-800 dark:text-green-200' 
            : 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-800 dark:text-red-200'
        }` } >
        <
        div className = "flex items-start gap-3" >
        <
        div className = { `p-1 rounded-full ${
              notification.type === 'success' ? 'bg-green-100 dark:bg-green-800' : 'bg-red-100 dark:bg-red-800'
            }` } > {
            notification.type === 'success' ? ( <
                CheckCircle className = "h-4 w-4 text-green-600 dark:text-green-400" / >
            ) : ( <
                AlertCircle className = "h-4 w-4 text-red-600 dark:text-red-400" / >
            )
        } <
        /div> <
        div className = "flex-1" >
        <
        p className = "font-medium text-sm" > { notification.message } < /p> <
        p className = "text-xs opacity-75" > { notification.timestamp } < /p> < /
        div > <
        button onClick = {
            () => setShowNotification(false)
        }
        className = "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" > ×
        <
        /button> < /
        div > <
        /div>
    )
}

{ /* Version History Modal */ } {
    showVersionHistory && ( <
        div className = "fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" >
        <
        div className = "bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden" >
        <
        div className = "p-6 border-b border-gray-200 dark:border-gray-600" >
        <
        div className = "flex items-center justify-between" >
        <
        div className = "flex items-center gap-3" >
        <
        div className = "p-2 bg-blue-100 dark:bg-blue-900 rounded-lg" >
        <
        History className = "h-5 w-5 text-blue-600 dark:text-blue-400" / >
        <
        /div> <
        div >
        <
        h2 className = "text-xl font-bold text-gray-800 dark:text-gray-100" > Version History < /h2> <
        p className = "text-sm text-gray-600 dark:text-gray-400" > Restore a previous version of your story < /p> < /
        div > <
        /div> <
        button onClick = {
            () => setShowVersionHistory(false)
        }
        className = "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2" > ×
        <
        /button> < /
        div > <
        /div>

        <
        div className = "p-6 overflow-y-auto max-h-96" > {
            versions && versions.length > 0 ? ( <
                div className = "space-y-4" > {
                    versions.map((version, index) => ( <
                            div key = { version.timestamp }
                            className = "border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors" >
                            <
                            div className = "flex items-start justify-between" >
                            <
                            div className = "flex-1" >
                            <
                            div className = "flex items-center gap-3 mb-2" >
                            <
                            div className = "flex items-center gap-2" >
                            <
                            Clock className = "h-4 w-4 text-gray-500" / >
                            <
                            span className = "font-medium text-gray-800 dark:text-gray-100" > { formatTimestamp(version.timestamp) } <
                            /span> < /
                            div > <
                            span className = "text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-gray-600 dark:text-gray-300" > { getWordCount(version.data) }
                            words <
                            /span> {
                            index === 0 && ( <
                                span className = "text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded-full" >
                                Latest <
                                /span>
                            )
                        } <
                        /div> <
                        p className = "text-sm text-gray-600 dark:text-gray-400 leading-relaxed" > { getVersionPreview(version.data) } <
                        /p> < /
                        div > <
                        div className = "flex gap-2 ml-4" >
                        <
                        button onClick = {
                            () => {
                                const blob = new Blob([JSON.stringify(version.data, null, 2)], { type: 'application/json' });
                                const url = URL.createObjectURL(blob);
                                const link = document.createElement('a');
                                link.href = url;
                                link.download = `biography-backup-${new Date(version.timestamp).toISOString().split('T')[0]}.json`;
                                link.click();
                                URL.revokeObjectURL(url);
                            }
                        }
                        className = "p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title = "Download this version" >
                        <
                        Download className = "h-4 w-4" / >
                        <
                        /button> {
                        index > 0 && ( <
                            button onClick = {
                                () => {
                                    if (window.confirm('Are you sure you want to restore this version? Your current changes will be lost.')) {
                                        onRestoreVersion(version.data);
                                        setShowVersionHistory(false);
                                    }
                                }
                            }
                            className = "p-2 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"
                            title = "Restore this version" >
                            <
                            RotateCcw className = "h-4 w-4" / >
                            <
                            /button>
                        )
                    } <
                    /div> < /
                    div > <
                    /div>
                ))
        } <
        /div>
    ): ( <
        div className = "text-center py-8" >
        <
        div className = "p-4 bg-gray-100 dark:bg-gray-700 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center" >
        <
        History className = "h-8 w-8 text-gray-400" / >
        <
        /div> <
        p className = "text-gray-600 dark:text-gray-400" > No version history available yet < /p> <
        p className = "text-sm text-gray-500 dark:text-gray-500 mt-1" > Versions are saved automatically as you write < /p> < /
        div >
    )
} <
/div>

<
div className = "p-6 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50" >
    <
    div className = "flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400" >
    <
    AlertCircle className = "h-4 w-4" / >
    <
    span > Versions are automatically saved every few minutes
while you write.Keep up to 10 recent versions. < /span> < /
div > <
    /div> < /
div > <
    /div>
)
} <
/>
);
};

export default SaveNotifications;