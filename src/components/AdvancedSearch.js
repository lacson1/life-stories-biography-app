import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, Tag, User, MapPin, Heart, X, ChevronDown } from 'lucide-react';

const AdvancedSearch = ({ data, onResults, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        sections: [],
        dateRange: { start: '', end: '' },
        tags: [],
        people: [],
        locations: [],
        emotions: []
    });
    const [showFilters, setShowFilters] = useState(false);
    const [searchHistory, setSearchHistory] = useState([]);
    const [suggestions, setSuggestions] = useState([]);

    // Load search history
    useEffect(() => {
        const history = localStorage.getItem('search_history');
        if (history) {
            setSearchHistory(JSON.parse(history));
        }
    }, []);

    // Generate search suggestions based on content
    useEffect(() => {
        if (!data || !searchTerm) {
            setSuggestions([]);
            return;
        }

        const allText = Object.values(data).join(' ').toLowerCase();
        const words = allText.split(/\s+/).filter(word =>
            word.length > 3 &&
            word.includes(searchTerm.toLowerCase()) &&
            word !== searchTerm.toLowerCase()
        );

        const uniqueWords = [...new Set(words)].slice(0, 5);
        setSuggestions(uniqueWords);
    }, [searchTerm, data]);

    const searchCategories = {
        sections: ['About Me', 'Early Years', 'Family Life', 'Work & Career', 'Proud Moments', 'Life Lessons'],
        emotions: ['happy', 'sad', 'excited', 'proud', 'grateful', 'nostalgic', 'content', 'surprised'],
        commonPeople: ['mother', 'father', 'spouse', 'children', 'siblings', 'friends', 'colleagues'],
        commonLocations: ['home', 'school', 'work', 'hospital', 'church', 'park', 'beach', 'city']
    };

    const performSearch = () => {
        if (!searchTerm.trim() && Object.values(filters).every(f =>
                Array.isArray(f) ? f.length === 0 : !f.start && !f.end
            )) {
            if (onResults) onResults([]);
            return;
        }

        // Save to search history
        if (searchTerm.trim()) {
            const newHistory = [searchTerm, ...searchHistory.filter(h => h !== searchTerm)].slice(0, 10);
            setSearchHistory(newHistory);
            localStorage.setItem('search_history', JSON.stringify(newHistory));
        }

        // Perform search logic
        const results = [];

        Object.entries(data || {}).forEach(([section, content]) => {
            if (typeof content === 'string') {
                let matches = false;
                let score = 0;

                // Text search
                if (searchTerm.trim()) {
                    const regex = new RegExp(searchTerm.trim(), 'gi');
                    const textMatches = content.match(regex);
                    if (textMatches) {
                        matches = true;
                        score += textMatches.length;
                    }
                }

                // Section filter
                if (filters.sections.length > 0) {
                    if (!filters.sections.includes(section)) {
                        matches = false;
                    }
                }

                // Emotion filter
                if (filters.emotions.length > 0) {
                    const hasEmotion = filters.emotions.some(emotion =>
                        content.toLowerCase().includes(emotion.toLowerCase())
                    );
                    if (!hasEmotion) {
                        matches = false;
                    } else {
                        score += 2;
                    }
                }

                // People filter
                if (filters.people.length > 0) {
                    const hasPerson = filters.people.some(person =>
                        content.toLowerCase().includes(person.toLowerCase())
                    );
                    if (!hasPerson) {
                        matches = false;
                    } else {
                        score += 3;
                    }
                }

                // Location filter
                if (filters.locations.length > 0) {
                    const hasLocation = filters.locations.some(location =>
                        content.toLowerCase().includes(location.toLowerCase())
                    );
                    if (!hasLocation) {
                        matches = false;
                    } else {
                        score += 2;
                    }
                }

                if (matches) {
                    // Get context around matches
                    const words = content.split(' ');
                    let context = content;

                    if (searchTerm.trim()) {
                        const regex = new RegExp(`\\b${searchTerm.trim()}\\b`, 'gi');
                        const match = content.match(regex);
                        if (match) {
                            const index = content.toLowerCase().indexOf(match[0].toLowerCase());
                            const start = Math.max(0, index - 100);
                            const end = Math.min(content.length, index + 100);
                            context = '...' + content.slice(start, end) + '...';
                        }
                    }

                    results.push({
                        section,
                        content: context,
                        fullContent: content,
                        score,
                        matches: searchTerm ? (content.match(new RegExp(searchTerm, 'gi')) || []).length : 0
                    });
                }
            }
        });

        // Sort by relevance score
        results.sort((a, b) => b.score - a.score);
        if (onResults) onResults(results);
    };

    useEffect(() => {
        const timeoutId = setTimeout(performSearch, 300);
        return () => clearTimeout(timeoutId);
    }, [searchTerm, filters, data]);

    const addFilter = (category, value) => {
        if (!value.trim()) return;

        setFilters(prev => ({
            ...prev,
            [category]: [...prev[category], value.trim()]
        }));
    };

    const removeFilter = (category, value) => {
        setFilters(prev => ({
            ...prev,
            [category]: prev[category].filter(item => item !== value)
        }));
    };

    const clearAllFilters = () => {
        setFilters({
            sections: [],
            dateRange: { start: '', end: '' },
            tags: [],
            people: [],
            locations: [],
            emotions: []
        });
        setSearchTerm('');
    };

    return ( <
        div className = "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-lg" >
        <
        div className = "flex items-center justify-between mb-4" >
        <
        div className = "flex items-center gap-2" >
        <
        Search className = "w-5 h-5 text-blue-600 dark:text-blue-400" / >
        <
        h3 className = "font-semibold text-gray-900 dark:text-gray-100" > Advanced Search < /h3> < /
        div > <
        button onClick = { onClose }
        className = "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" >
        <
        X className = "w-5 h-5" / >
        <
        /button> < /
        div >

        { /* Main Search Input */ } <
        div className = "relative mb-4" >
        <
        div className = "relative" >
        <
        Search className = "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" / >
        <
        input type = "text"
        placeholder = "Search your life story..."
        value = { searchTerm }
        onChange = {
            (e) => setSearchTerm(e.target.value)
        }
        className = "w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent" /
        >
        <
        /div>

        { /* Search Suggestions */ } {
            suggestions.length > 0 && ( <
                div className = "absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10" > {
                    suggestions.map((suggestion, index) => ( <
                        button key = { index }
                        onClick = {
                            () => setSearchTerm(suggestion)
                        }
                        className = "w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 first:rounded-t-lg last:rounded-b-lg" > { suggestion } <
                        /button>
                    ))
                } <
                /div>
            )
        } <
        /div>

        { /* Filter Toggle */ } <
        button onClick = {
            () => setShowFilters(!showFilters)
        }
        className = "flex items-center gap-2 mb-4 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors" >
        <
        Filter className = "w-4 h-4" / >
        <
        span > Filters < /span> <
        ChevronDown className = { `w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}` }
        /> < /
        button >

        { /* Filters Panel */ } {
            showFilters && ( <
                div className = "space-y-4 mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg" > { /* Section Filter */ } <
                div >
                <
                label className = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" >
                Sections <
                /label> <
                div className = "flex flex-wrap gap-2" > {
                    searchCategories.sections.map(section => ( <
                        button key = { section }
                        onClick = {
                            () => {
                                if (filters.sections.includes(section)) {
                                    removeFilter('sections', section);
                                } else {
                                    addFilter('sections', section);
                                }
                            }
                        }
                        className = { `px-3 py-1 rounded text-sm transition-colors ${
                    filters.sections.includes(section)
                      ? 'bg-blue-500 text-white'
                      : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-500'
                  }` } > { section } <
                        /button>
                    ))
                } <
                /div> < /
                div >

                { /* Emotions Filter */ } <
                div >
                <
                label className = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" >
                <
                Heart className = "w-4 h-4 inline mr-1" / >
                Emotions <
                /label> <
                div className = "flex flex-wrap gap-2" > {
                    searchCategories.emotions.map(emotion => ( <
                        button key = { emotion }
                        onClick = {
                            () => {
                                if (filters.emotions.includes(emotion)) {
                                    removeFilter('emotions', emotion);
                                } else {
                                    addFilter('emotions', emotion);
                                }
                            }
                        }
                        className = { `px-3 py-1 rounded text-sm transition-colors ${
                    filters.emotions.includes(emotion)
                      ? 'bg-pink-500 text-white'
                      : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-500'
                  }` } > { emotion } <
                        /button>
                    ))
                } <
                /div> < /
                div >

                { /* People Filter */ } <
                div >
                <
                label className = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" >
                <
                User className = "w-4 h-4 inline mr-1" / >
                People <
                /label> <
                div className = "flex gap-2 mb-2" >
                <
                input type = "text"
                placeholder = "Add person..."
                onKeyPress = {
                    (e) => {
                        if (e.key === 'Enter') {
                            addFilter('people', e.target.value);
                            e.target.value = '';
                        }
                    }
                }
                className = "flex-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-600" /
                >
                <
                /div> <
                div className = "flex flex-wrap gap-1" > {
                    filters.people.map(person => ( <
                        span key = { person }
                        className = "px-2 py-1 bg-green-500 text-white rounded text-xs flex items-center gap-1" > { person } <
                        button onClick = {
                            () => removeFilter('people', person)
                        } >
                        <
                        X className = "w-3 h-3" / >
                        <
                        /button> < /
                        span >
                    ))
                } <
                /div> < /
                div >

                { /* Locations Filter */ } <
                div >
                <
                label className = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" >
                <
                MapPin className = "w-4 h-4 inline mr-1" / >
                Locations <
                /label> <
                div className = "flex gap-2 mb-2" >
                <
                input type = "text"
                placeholder = "Add location..."
                onKeyPress = {
                    (e) => {
                        if (e.key === 'Enter') {
                            addFilter('locations', e.target.value);
                            e.target.value = '';
                        }
                    }
                }
                className = "flex-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-600" /
                >
                <
                /div> <
                div className = "flex flex-wrap gap-1" > {
                    filters.locations.map(location => ( <
                        span key = { location }
                        className = "px-2 py-1 bg-purple-500 text-white rounded text-xs flex items-center gap-1" > { location } <
                        button onClick = {
                            () => removeFilter('locations', location)
                        } >
                        <
                        X className = "w-3 h-3" / >
                        <
                        /button> < /
                        span >
                    ))
                } <
                /div> < /
                div >

                { /* Clear Filters */ } <
                button onClick = { clearAllFilters }
                className = "w-full px-4 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors" >
                Clear All Filters <
                /button> < /
                div >
            )
        }

        { /* Search History */ } {
            searchHistory.length > 0 && ( <
                div className = "border-t border-gray-200 dark:border-gray-600 pt-4" >
                <
                h4 className = "text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" > Recent Searches < /h4> <
                div className = "flex flex-wrap gap-2" > {
                    searchHistory.slice(0, 5).map((term, index) => ( <
                        button key = { index }
                        onClick = {
                            () => setSearchTerm(term)
                        }
                        className = "px-3 py-1 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-500" > { term } <
                        /button>
                    ))
                } <
                /div> < /
                div >
            )
        } <
        /div>
    );
};

export default AdvancedSearch;