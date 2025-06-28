import { useState, useEffect, useCallback } from 'react';

const useCloudBackup = (data, key, options = {}) => {
    const {
        autoSaveDelay = 2000,
            enableCloudBackup = true,
            onSaveSuccess,
            onSaveError,
            onCloudSync
    } = options;

    const [saveStatus, setSaveStatus] = useState('idle'); // idle, saving, saved, error
    const [lastSaved, setLastSaved] = useState(null);
    const [cloudSyncStatus, setCloudSyncStatus] = useState('synced');

    // Enhanced local save with versioning
    const saveToLocal = useCallback((dataToSave) => {
        try {
            const timestamp = new Date().toISOString();
            const saveData = {
                data: dataToSave,
                timestamp,
                version: Date.now()
            };

            localStorage.setItem(key, JSON.stringify(saveData));

            // Keep last 5 versions for recovery
            const versions = JSON.parse(localStorage.getItem(`${key}_versions`) || '[]');
            versions.unshift(saveData);
            if (versions.length > 5) versions.pop();
            localStorage.setItem(`${key}_versions`, JSON.stringify(versions));

            setLastSaved(timestamp);
            setSaveStatus('saved');
            if (onSaveSuccess) onSaveSuccess(timestamp);

            return true;
        } catch (error) {
            console.error('Local save failed:', error);
            setSaveStatus('error');
            if (onSaveError) onSaveError(error);
            return false;
        }
    }, [key, onSaveSuccess, onSaveError]);

    // Simulate cloud backup
    const syncToCloud = useCallback(async(dataToSave) => {
        if (!enableCloudBackup) return;

        try {
            setCloudSyncStatus('syncing');

            // Simulate cloud API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Simulate occasional cloud sync failures (10% chance)
            if (Math.random() < 0.1) {
                throw new Error('Cloud sync failed');
            }

            const cloudData = {
                data: dataToSave,
                timestamp: new Date().toISOString(),
                cloudId: `cloud_${Date.now()}`
            };

            // Store cloud backup info locally
            localStorage.setItem(`${key}_cloud`, JSON.stringify(cloudData));
            setCloudSyncStatus('synced');
            if (onCloudSync) onCloudSync(cloudData);

        } catch (error) {
            console.error('Cloud sync failed:', error);
            setCloudSyncStatus('error');
            // Don't fail the entire save if cloud sync fails
        }
    }, [key, enableCloudBackup, onCloudSync]);

    // Auto-save effect
    useEffect(() => {
        if (!data) return;

        setSaveStatus('saving');

        const timeoutId = setTimeout(async() => {
            const localSaved = saveToLocal(data);
            if (localSaved && enableCloudBackup) {
                syncToCloud(data);
            }
        }, autoSaveDelay);

        return () => clearTimeout(timeoutId);
    }, [data, autoSaveDelay, saveToLocal, syncToCloud, enableCloudBackup]);

    // Manual save function
    const manualSave = useCallback(async() => {
        if (!data) return false;

        setSaveStatus('saving');
        const localSaved = saveToLocal(data);

        if (localSaved && enableCloudBackup) {
            await syncToCloud(data);
        }

        return localSaved;
    }, [data, saveToLocal, syncToCloud, enableCloudBackup]);

    // Load data with version recovery
    const loadData = useCallback(() => {
        try {
            const saved = localStorage.getItem(key);
            if (saved) {
                const parsedData = JSON.parse(saved);
                return parsedData.data || parsedData; // Handle both new and old formats
            }
        } catch (error) {
            console.error('Failed to load data:', error);
        }
        return null;
    }, [key]);

    // Get available versions for recovery
    const getVersions = useCallback(() => {
        try {
            const versions = localStorage.getItem(`${key}_versions`);
            return versions ? JSON.parse(versions) : [];
        } catch (error) {
            console.error('Failed to load versions:', error);
            return [];
        }
    }, [key]);

    // Restore from version
    const restoreVersion = useCallback((version) => {
        try {
            localStorage.setItem(key, JSON.stringify(version));
            setLastSaved(version.timestamp);
            return version.data;
        } catch (error) {
            console.error('Failed to restore version:', error);
            return null;
        }
    }, [key]);

    return {
        saveStatus,
        lastSaved,
        cloudSyncStatus,
        manualSave,
        loadData,
        getVersions,
        restoreVersion
    };
};

export default useCloudBackup;