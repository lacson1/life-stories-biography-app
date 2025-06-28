import React, { useState, useEffect } from 'react';
import { Image, Grid, List, Search, Filter, Tag, Calendar, MapPin, Heart, Eye, Download, Trash2, Edit3, Plus } from 'lucide-react';

const PhotoOrganization = ({ photos, onPhotosUpdate, onClose }) => {
    const [viewMode, setViewMode] = useState('grid');
    const [selectedPhotos, setSelectedPhotos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterBy, setFilterBy] = useState('all');
    const [sortBy, setSortBy] = useState('date');
    const [albums, setAlbums] = useState([]);
    const [selectedAlbum, setSelectedAlbum] = useState('all');
    const [showCreateAlbum, setShowCreateAlbum] = useState(false);
    const [newAlbumName, setNewAlbumName] = useState('');
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    // Initialize albums and photo metadata
    useEffect(() => {
        const savedAlbums = localStorage.getItem('photo_albums');
        if (savedAlbums) {
            setAlbums(JSON.parse(savedAlbums));
        } else {
            // Create default albums
            const defaultAlbums = [
                { id: 'childhood', name: 'Childhood', description: 'Early years and childhood memories', photos: [] },
                { id: 'family', name: 'Family', description: 'Family gatherings and moments', photos: [] },
                { id: 'work', name: 'Work & Career', description: 'Professional milestones', photos: [] },
                { id: 'travel', name: 'Travel', description: 'Adventures and journeys', photos: [] },
                { id: 'celebrations', name: 'Celebrations', description: 'Special occasions and events', photos: [] }
            ];
            setAlbums(defaultAlbums);
            localStorage.setItem('photo_albums', JSON.stringify(defaultAlbums));
        }
    }, []);

    // Enhanced photo data with metadata
    const enhancedPhotos = (photos || []).map(photo => ({
        ...photo,
        tags: photo.tags || [],
        location: photo.location || '',
        date: photo.date || new Date().toISOString(),
        description: photo.description || photo.caption || '',
        favorite: photo.favorite || false,
        album: photo.album || 'unorganized'
    }));

    // Filter and search photos
    const filteredPhotos = enhancedPhotos.filter(photo => {
        const matchesSearch = searchTerm === '' ||
            photo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            photo.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
            photo.location.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filterBy === 'all' ||
            (filterBy === 'favorites' && photo.favorite) ||
            (filterBy === 'tagged' && photo.tags.length > 0) ||
            (filterBy === 'untagged' && photo.tags.length === 0);

        const matchesAlbum = selectedAlbum === 'all' || photo.album === selectedAlbum;

        return matchesSearch && matchesFilter && matchesAlbum;
    });

    // Sort photos
    const sortedPhotos = [...filteredPhotos].sort((a, b) => {
        switch (sortBy) {
            case 'date':
                return new Date(b.date) - new Date(a.date);
            case 'name':
                return a.description.localeCompare(b.description);
            case 'size':
                return (b.size || 0) - (a.size || 0);
            default:
                return 0;
        }
    });

    const togglePhotoSelection = (photoId) => {
        setSelectedPhotos(prev =>
            prev.includes(photoId) ?
            prev.filter(id => id !== photoId) : [...prev, photoId]
        );
    };

    const createAlbum = () => {
        if (!newAlbumName.trim()) return;

        const newAlbum = {
            id: Date.now().toString(),
            name: newAlbumName,
            description: '',
            photos: [],
            createdAt: new Date().toISOString()
        };

        const updatedAlbums = [...albums, newAlbum];
        setAlbums(updatedAlbums);
        localStorage.setItem('photo_albums', JSON.stringify(updatedAlbums));
        setNewAlbumName('');
        setShowCreateAlbum(false);
    };

    const addToAlbum = (albumId) => {
        if (selectedPhotos.length === 0) return;

        const updatedPhotos = enhancedPhotos.map(photo =>
            selectedPhotos.includes(photo.id) ? {...photo, album: albumId } :
            photo
        );

        if (onPhotosUpdate) onPhotosUpdate(updatedPhotos);
        setSelectedPhotos([]);
    };

    const toggleFavorite = (photoId) => {
        const updatedPhotos = enhancedPhotos.map(photo =>
            photo.id === photoId ? {...photo, favorite: !photo.favorite } :
            photo
        );
        if (onPhotosUpdate) onPhotosUpdate(updatedPhotos);
    };

    const addTag = (photoId, tag) => {
        if (!tag.trim()) return;

        const updatedPhotos = enhancedPhotos.map(photo =>
            photo.id === photoId ? {...photo, tags: [...(photo.tags || []), tag.trim()] } :
            photo
        );
        if (onPhotosUpdate) onPhotosUpdate(updatedPhotos);
    };

    const removeTag = (photoId, tagToRemove) => {
        const updatedPhotos = enhancedPhotos.map(photo =>
            photo.id === photoId ? {...photo, tags: photo.tags.filter(tag => tag !== tagToRemove) } :
            photo
        );
        if (onPhotosUpdate) onPhotosUpdate(updatedPhotos);
    };

    const deleteSelectedPhotos = () => {
        if (selectedPhotos.length === 0) return;

        const updatedPhotos = enhancedPhotos.filter(photo => !selectedPhotos.includes(photo.id));
        if (onPhotosUpdate) onPhotosUpdate(updatedPhotos);
        setSelectedPhotos([]);
    };

    const PhotoCard = ({ photo }) => ( <
            div className = { `relative group cursor-pointer transition-transform hover:scale-105 ${
      selectedPhotos.includes(photo.id) ? 'ring-2 ring-blue-500' : ''
    }` } >
            <
            div className = "aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden" >
            <
            img src = { photo.url }
            alt = { photo.description }
            className = "w-full h-full object-cover"
            onClick = {
                () => setSelectedPhoto(photo)
            }
            />

            { /* Selection checkbox */ } <
            div className = "absolute top-2 left-2" >
            <
            input type = "checkbox"
            checked = { selectedPhotos.includes(photo.id) }
            onChange = {
                () => togglePhotoSelection(photo.id)
            }
            className = "w-4 h-4 rounded border-gray-300"
            onClick = {
                (e) => e.stopPropagation()
            }
            /> < /
            div >

            { /* Favorite button */ } <
            button onClick = {
                (e) => {
                    e.stopPropagation();
                    toggleFavorite(photo.id);
                }
            }
            className = { `absolute top-2 right-2 p-1 rounded-full transition-colors ${
            photo.favorite 
              ? 'bg-red-500 text-white' 
              : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
          }` } >
            <
            Heart className = "w-4 h-4"
            fill = { photo.favorite ? 'currentColor' : 'none' }
            /> < /
            button >

            { /* Overlay with info */ } <
            div className = "absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end" >
            <
            div className = "p-3 text-white w-full" >
            <
            p className = "text-sm font-medium truncate" > { photo.description } < /p> <
            div className = "flex items-center gap-2 mt-1 text-xs" > {
                photo.location && ( <
                    span className = "flex items-center gap-1" >
                    <
                    MapPin className = "w-3 h-3" / > { photo.location } <
                    /span>
                )
            } {
                photo.date && ( <
                    span className = "flex items-center gap-1" >
                    <
                    Calendar className = "w-3 h-3" / > { new Date(photo.date).toLocaleDateString() } <
                    /span>
                )
            } <
            /div> {
            photo.tags.length > 0 && ( <
                div className = "flex flex-wrap gap-1 mt-2" > {
                    photo.tags.slice(0, 3).map(tag => ( <
                        span key = { tag }
                        className = "px-2 py-1 bg-blue-500 text-white rounded text-xs" > { tag } <
                        /span>
                    ))
                } {
                    photo.tags.length > 3 && ( <
                        span className = "text-xs" > +{ photo.tags.length - 3 } < /span>
                    )
                } <
                /div>
            )
        } <
        /div> < /
    div > <
        /div> < /
    div >
);

return ( <
        div className = "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-lg max-w-6xl" >
        <
        div className = "flex items-center justify-between mb-6" >
        <
        div className = "flex items-center gap-2" >
        <
        Image className = "w-5 h-5 text-purple-600 dark:text-purple-400" / >
        <
        h3 className = "font-semibold text-gray-900 dark:text-gray-100" > Photo Organization < /h3> <
        span className = "px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded text-sm" > { sortedPhotos.length }
        photos <
        /span> < /
        div > <
        button onClick = { onClose }
        className = "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" > ×
        <
        /button> < /
        div >

        { /* Controls */ } <
        div className = "flex flex-wrap items-center gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg" > { /* Search */ } <
        div className = "relative flex-1 min-w-64" >
        <
        Search className = "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" / >
        <
        input type = "text"
        placeholder = "Search photos..."
        value = { searchTerm }
        onChange = {
            (e) => setSearchTerm(e.target.value)
        }
        className = "w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600" /
        >
        <
        /div>

        { /* View Mode */ } <
        div className = "flex gap-1" >
        <
        button onClick = {
            () => setViewMode('grid')
        }
        className = { `p-2 rounded ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-600'}` } >
        <
        Grid className = "w-4 h-4" / >
        <
        /button> <
        button onClick = {
            () => setViewMode('list')
        }
        className = { `p-2 rounded ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-600'}` } >
        <
        List className = "w-4 h-4" / >
        <
        /button> < /
        div >

        { /* Filters */ } <
        select value = { filterBy }
        onChange = {
            (e) => setFilterBy(e.target.value)
        }
        className = "px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-600" >
        <
        option value = "all" > All Photos < /option> <
        option value = "favorites" > Favorites < /option> <
        option value = "tagged" > Tagged < /option> <
        option value = "untagged" > Untagged < /option> < /
        select >

        { /* Sort */ } <
        select value = { sortBy }
        onChange = {
            (e) => setSortBy(e.target.value)
        }
        className = "px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-600" >
        <
        option value = "date" > Sort by Date < /option> <
        option value = "name" > Sort by Name < /option> <
        option value = "size" > Sort by Size < /option> < /
        select > <
        /div>

        { /* Albums */ } <
        div className = "mb-6" >
        <
        div className = "flex items-center justify-between mb-3" >
        <
        h4 className = "font-medium text-gray-900 dark:text-gray-100" > Albums < /h4> <
        button onClick = {
            () => setShowCreateAlbum(true)
        }
        className = "flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded text-sm hover:bg-green-200 dark:hover:bg-green-800" >
        <
        Plus className = "w-4 h-4" / >
        New Album <
        /button> < /
        div >

        <
        div className = "flex flex-wrap gap-2" >
        <
        button onClick = {
            () => setSelectedAlbum('all')
        }
        className = { `px-3 py-1 rounded text-sm ${
              selectedAlbum === 'all' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
            }` } >
        All Photos <
        /button> {
        albums.map(album => ( <
            button key = { album.id }
            onClick = {
                () => setSelectedAlbum(album.id)
            }
            className = { `px-3 py-1 rounded text-sm ${
                selectedAlbum === album.id 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
              }` } > { album.name } <
            /button>
        ))
    } <
    /div>

{
    showCreateAlbum && ( <
        div className = "mt-3 flex gap-2" >
        <
        input type = "text"
        placeholder = "Album name..."
        value = { newAlbumName }
        onChange = {
            (e) => setNewAlbumName(e.target.value)
        }
        className = "flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-600"
        onKeyPress = {
            (e) => e.key === 'Enter' && createAlbum()
        }
        /> <
        button onClick = { createAlbum }
        className = "px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700" >
        Create <
        /button> <
        button onClick = {
            () => setShowCreateAlbum(false)
        }
        className = "px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600" >
        Cancel <
        /button> < /
        div >
    )
} <
/div>

{ /* Bulk Actions */ } {
    selectedPhotos.length > 0 && ( <
            div className = "mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg" >
            <
            div className = "flex items-center justify-between" >
            <
            span className = "text-blue-900 dark:text-blue-100" > { selectedPhotos.length }
            photos selected <
            /span> <
            div className = "flex gap-2" >
            <
            select onChange = {
                (e) => e.target.value && addToAlbum(e.target.value)
            }
            className = "px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-600" >
            <
            option value = "" > Add to Album... < /option> {
            albums.map(album => ( <
                option key = { album.id }
                value = { album.id } > { album.name } < /option>
            ))
        } <
        /select> <
    button onClick = { deleteSelectedPhotos }
    className = "px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600" >
        <
        Trash2 className = "w-4 h-4" / >
        <
        /button> < /
    div > <
        /div> < /
    div >
)
}

{ /* Photo Grid/List */ } <
div className = {
        viewMode === 'grid' ?
        'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4' : 'space-y-2'
    } > {
        sortedPhotos.map(photo => ( <
            PhotoCard key = { photo.id }
            photo = { photo }
            />
        ))
    } <
    /div>

{
    sortedPhotos.length === 0 && ( <
        div className = "text-center py-12" >
        <
        Image className = "w-16 h-16 text-gray-400 mx-auto mb-4" / >
        <
        p className = "text-gray-500 dark:text-gray-400" > No photos found < /p> <
        p className = "text-sm text-gray-400 dark:text-gray-500" >
        Try adjusting your search or filters <
        /p> < /
        div >
    )
}

{ /* Photo Viewer Modal */ } {
    selectedPhoto && ( <
        div className = "fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" >
        <
        div className = "bg-white dark:bg-gray-800 rounded-lg max-w-4xl max-h-full overflow-auto" >
        <
        div className = "p-4" >
        <
        div className = "flex items-center justify-between mb-4" >
        <
        h3 className = "font-medium text-gray-900 dark:text-gray-100" > { selectedPhoto.description } <
        /h3> <
        button onClick = {
            () => setSelectedPhoto(null)
        }
        className = "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" > ×
        <
        /button> < /
        div >

        <
        img src = { selectedPhoto.url }
        alt = { selectedPhoto.description }
        className = "w-full max-h-96 object-contain rounded-lg mb-4" /
        >

        <
        div className = "grid grid-cols-1 md:grid-cols-2 gap-4" >
        <
        div >
        <
        h4 className = "font-medium text-gray-900 dark:text-gray-100 mb-2" > Details < /h4> <
        div className = "space-y-2 text-sm" >
        <
        p > < strong > Date: < /strong> {new Date(selectedPhoto.date).toLocaleDateString()}</p >
        <
        p > < strong > Location: < /strong> {selectedPhoto.location || 'Not specified'}</p >
        <
        p > < strong > Album: < /strong> {(albums.find(a => a.id === selectedPhoto.album) && albums.find(a => a.id === selectedPhoto.album).name) || 'Unorganized'}</p >
        <
        /div> < /
        div >

        <
        div >
        <
        h4 className = "font-medium text-gray-900 dark:text-gray-100 mb-2" > Tags < /h4> <
        div className = "flex flex-wrap gap-1" > {
            selectedPhoto.tags.map(tag => ( <
                span key = { tag }
                className = "px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs flex items-center gap-1" > { tag } <
                button onClick = {
                    () => removeTag(selectedPhoto.id, tag)
                }
                className = "hover:text-red-500" > ×
                <
                /button> < /
                span >
            ))
        } <
        /div> < /
        div > <
        /div> < /
        div > <
        /div> < /
        div >
    )
} <
/div>
);
};

export default PhotoOrganization;