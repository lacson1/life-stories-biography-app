import React, { useState } from 'react';
import { Tag, Plus, X } from 'lucide-react';

const TagManager = ({ tags = [], onTagsChange, availableTags = [] }) => {
    const [isAddingTag, setIsAddingTag] = useState(false);
    const [newTag, setNewTag] = useState('');

    const predefinedTags = [
        'childhood', 'family', 'career', 'travel', 'achievements',
        'relationships', 'hobbies', 'education', 'challenges', 'milestones',
        'funny', 'emotional', 'important', 'lessons', 'advice'
    ];

    const allAvailableTags = [...new Set([...predefinedTags, ...availableTags])];

    const addTag = (tagName) => {
        const tag = tagName.trim().toLowerCase();
        if (tag && !tags.includes(tag)) {
            onTagsChange([...tags, tag]);
        }
        setNewTag('');
        setIsAddingTag(false);
    };

    const removeTag = (tagToRemove) => {
        onTagsChange(tags.filter(tag => tag !== tagToRemove));
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            addTag(newTag);
        } else if (e.key === 'Escape') {
            setNewTag('');
            setIsAddingTag(false);
        }
    };

    const getTagColor = (tag) => {
        const colors = [
            'bg-blue-100 text-blue-800',
            'bg-green-100 text-green-800',
            'bg-purple-100 text-purple-800',
            'bg-pink-100 text-pink-800',
            'bg-yellow-100 text-yellow-800',
            'bg-indigo-100 text-indigo-800',
            'bg-red-100 text-red-800',
            'bg-gray-100 text-gray-800'
        ];

        const hash = tag.split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0);

        return colors[Math.abs(hash) % colors.length];
    };

    return ( <
        div className = "mb-4" >
        <
        div className = "flex items-center justify-between mb-2" >
        <
        label className = "text-sm font-medium text-gray-700 flex items-center" >
        <
        Tag className = "h-4 w-4 mr-1" / >
        Tags <
        /label> <
        button onClick = {
            () => setIsAddingTag(true)
        }
        className = "text-xs text-amber-600 hover:text-amber-700 flex items-center" >
        <
        Plus className = "h-3 w-3 mr-1" / >
        Add Tag <
        /button> < /
        div >

        { /* Current Tags */ } <
        div className = "flex flex-wrap gap-2 mb-3" > {
            tags.map(tag => ( <
                span key = { tag }
                className = { `inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getTagColor(tag)}` } > { tag } <
                button onClick = {
                    () => removeTag(tag)
                }
                className = "ml-2 hover:text-red-600" >
                <
                X className = "h-3 w-3" / >
                <
                /button> < /
                span >
            ))
        } <
        /div>

        { /* Add New Tag */ } {
            isAddingTag && ( <
                div className = "mb-3" >
                <
                input type = "text"
                value = { newTag }
                onChange = {
                    (e) => setNewTag(e.target.value)
                }
                onKeyDown = { handleKeyPress }
                onBlur = {
                    () => {
                        if (newTag.trim()) addTag(newTag);
                        else setIsAddingTag(false);
                    }
                }
                placeholder = "Enter tag name..."
                className = "w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                autoFocus /
                >
                <
                /div>
            )
        }

        { /* Suggested Tags */ } {
            isAddingTag && ( <
                div className = "space-y-2" >
                <
                div className = "text-xs text-gray-600" > Suggested tags: < /div> <
                div className = "flex flex-wrap gap-1" > {
                    allAvailableTags
                    .filter(tag => !tags.includes(tag) && tag.includes(newTag.toLowerCase()))
                    .slice(0, 8)
                    .map(tag => ( <
                        button key = { tag }
                        onClick = {
                            () => addTag(tag)
                        }
                        className = "px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200" > { tag } <
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

export default TagManager;