import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ formData, onSearchResults, onClearSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        if (searchTerm.trim()) {
            performSearch(searchTerm);
        } else {
            onClearSearch();
        }
    }, [searchTerm]);

    const performSearch = (term) => {
        setIsSearching(true);
        const results = [];
        const searchLower = term.toLowerCase();

        // Search in main sections
        const sections = ['overview', 'childhood', 'family', 'career', 'achievements', 'wisdom'];
        sections.forEach(section => {
            const content = formData[section];
            if (content && content.toLowerCase().includes(searchLower)) {
                results.push({
                    type: 'section',
                    section,
                    content: content.substring(0, 200) + '...',
                    title: getSectionTitle(section)
                });
            }
        });

        // Search in memories
        formData.memories ? .forEach(memory => {
            if (memory.title.toLowerCase().includes(searchLower) ||
                memory.content ? .toLowerCase().includes(searchLower)) {
                results.push({
                    type: 'memory',
                    id: memory.id,
                    title: memory.title,
                    content: memory.content ? .substring(0, 200) + '...' || ''
                });
            }
        });

        // Search in timeline
        formData.timeline ? .forEach(event => {
            if (event.event.toLowerCase().includes(searchLower)) {
                results.push({
                    type: 'timeline',
                    year: event.year,
                    event: event.event,
                    category: event.category
                });
            }
        });

        onSearchResults(results);
        setIsSearching(false);
    };

    const getSectionTitle = (section) => {
        const titles = {
            overview: 'About Me',
            childhood: 'Early Years',
            family: 'Family Life',
            career: 'Work & Career',
            achievements: 'Proud Moments',
            wisdom: 'Life Lessons'
        };
        return titles[section] || section;
    };

    const clearSearch = () => {
        setSearchTerm('');
        onClearSearch();
    };

    return ( <
        div className = "relative mb-6" >
        <
        div className = "relative" >
        <
        Search className = "absolute left-3 top-3 h-5 w-5 text-gray-400" / >
        <
        input type = "text"
        value = { searchTerm }
        onChange = {
            (e) => setSearchTerm(e.target.value)
        }
        placeholder = "Search your life story..."
        className = "w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-400 focus:outline-none text-lg" /
        >
        {
            searchTerm && ( <
                button onClick = { clearSearch }
                className = "absolute right-3 top-3 h-5 w-5 text-gray-400 hover:text-gray-600" >
                <
                X className = "h-5 w-5" / >
                <
                /button>
            )
        } <
        /div>

        {
            isSearching && ( <
                div className = "absolute top-full left-0 right-0 bg-white border rounded-lg shadow-lg mt-1 p-3" >
                <
                div className = "text-gray-600" > Searching... < /div> < /
                div >
            )
        } <
        /div>
    );
};

export default SearchBar;