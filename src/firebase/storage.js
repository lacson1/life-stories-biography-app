import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  listAll 
} from 'firebase/storage';
import { storage } from './config';

// Upload photo
export const uploadPhoto = async (userId, file, fileName) => {
  try {
    const photoRef = ref(storage, `users/${userId}/photos/${fileName}`);
    const snapshot = await uploadBytes(photoRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return {
      id: fileName,
      url: downloadURL,
      name: file.name,
      size: file.size,
      uploadedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error uploading photo:', error);
    throw new Error('Failed to upload photo');
  }
};

// Upload audio recording
export const uploadAudio = async (userId, audioBlob, fileName) => {
  try {
    const audioRef = ref(storage, `users/${userId}/audio/${fileName}`);
    const snapshot = await uploadBytes(audioRef, audioBlob);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return {
      id: fileName,
      url: downloadURL,
      duration: 0, // You can calculate this if needed
      uploadedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error uploading audio:', error);
    throw new Error('Failed to upload audio');
  }
};

// Delete photo
export const deletePhoto = async (userId, fileName) => {
  try {
    const photoRef = ref(storage, `users/${userId}/photos/${fileName}`);
    await deleteObject(photoRef);
    return true;
  } catch (error) {
    console.error('Error deleting photo:', error);
    return false;
  }
};

// Delete audio
export const deleteAudio = async (userId, fileName) => {
  try {
    const audioRef = ref(storage, `users/${userId}/audio/${fileName}`);
    await deleteObject(audioRef);
    return true;
  } catch (error) {
    console.error('Error deleting audio:', error);
    return false;
  }
};

// Get all photos for user
export const getUserPhotos = async (userId) => {
  try {
    const photosRef = ref(storage, `users/${userId}/photos`);
    const photosList = await listAll(photosRef);
    
    const photos = await Promise.all(
      photosList.items.map(async (item) => {
        const url = await getDownloadURL(item);
        return {
          id: item.name,
          url: url,
          name: item.name
        };
      })
    );
    
    return photos;
  } catch (error) {
    console.error('Error getting user photos:', error);
    return [];
  }
};

// Get all audio recordings for user
export const getUserAudio = async (userId) => {
  try {
    const audioRef = ref(storage, `users/${userId}/audio`);
    const audioList = await listAll(audioRef);
    
    const recordings = await Promise.all(
      audioList.items.map(async (item) => {
        const url = await getDownloadURL(item);
        return {
          id: item.name,
          url: url,
          name: item.name
        };
      })
    );
    
    return recordings;
  } catch (error) {
    console.error('Error getting user audio:', error);
    return [];
  }
};
