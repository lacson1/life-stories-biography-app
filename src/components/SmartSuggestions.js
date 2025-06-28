import React, { useState, useEffect } from 'react';
import { Lightbulb, ChevronRight, Sparkles, Quote, Heart, Clock, MapPin, Users } from 'lucide-react';

const SmartSuggestions = ({ currentSection, currentText, onSuggestionClick, onClose }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [activeSuggestion, setActiveSuggestion] = useState(0);

    // Smart prompts based on section and current content
    const getSectionPrompts = (section) => {
        const prompts = {
            overview: [
                "I was born in [year] in [place], and my childhood was shaped by...",
                "The most important values that guide my life are...",
                "If I had to describe myself in three words, they would be...",
                "My greatest source of joy comes from...",
                "Looking back on my life, I'm most proud of..."
            ],
            childhood: [
                "My earliest memory is of...",
                "Growing up, my favorite place was...",
                "The person who influenced me most as a child was...",
                "A typical day in my childhood involved...",
                "The most important lesson I learned as a child was..."
            ],
            family: [
                "When I first met [spouse's name], I knew...",
                "The day my first child was born, I felt...",
                "Our family traditions include...",
                "The funniest family story I can remember is...",
                "What I hope my children remember about our family is..."
            ],
            career: [
                "My first job taught me...",
                "The career decision I'm most proud of was...",
                "A typical workday for me involved...",
                "The biggest challenge in my career was...",
                "My advice to someone starting in my field would be..."
            ],
            achievements: [
                "My greatest accomplishment was...",
                "The award/recognition that meant the most to me was...",
                "I overcame [challenge] by...",
                "The moment I realized I had succeeded was when...",
                "This achievement was important because..."
            ],
            wisdom: [
                "If I could tell my younger self one thing, it would be...",
                "The most important lesson life has taught me is...",
                "My advice for living a fulfilling life is...",
                "What I want future generations to know is...",
                "The secret to happiness, in my experience, is..."
            ]
        };
        return prompts[section] || [];
    };

    // Context-aware suggestions based on current text
    const getContextualSuggestions = (text) => {
        const contextSuggestions = [];
        const lowerText = text.toLowerCase();

        // Emotional context suggestions
        if (lowerText.includes('happy') || lowerText.includes('joy')) {
            contextSuggestions.push("Describe what this happiness felt like in your body");
            contextSuggestions.push("What sounds, smells, or sights do you associate with this joy?");
        }

        if (lowerText.includes('difficult') || lowerText.includes('hard') || lowerText.includes('challenge')) {
            contextSuggestions.push("How did you find the strength to get through this?");
            contextSuggestions.push("What did this experience teach you?");
            contextSuggestions.push("Who or what helped you during this time?");
        }

        if (lowerText.includes('remember') || lowerText.includes('recall')) {
            contextSuggestions.push("What specific details make this memory vivid?");
            contextSuggestions.push("How did this moment change you?");
        }

        // Relationship context
        if (lowerText.includes('mother') || lowerText.includes('father') || lowerText.includes('parent')) {
            contextSuggestions.push("What was their most distinctive characteristic?");
            contextSuggestions.push("What did they always say to you?");
            contextSuggestions.push("How are you similar to or different from them?");
        }

        // Place context
        if (lowerText.includes('house') || lowerText.includes('home') || lowerText.includes('lived')) {
            contextSuggestions.push("Describe the sounds and smells of this place");
            contextSuggestions.push("What was your favorite room and why?");
            contextSuggestions.push("How did this place make you feel safe or comfortable?");
        }

        return contextSuggestions;
    };

    // Story starters for when user is stuck
    const getStoryStarters = () => [
        "It was a [season] day when...",
        "I'll never forget the time...",
        "Looking back now, I realize...",
        "The most surprising thing was...",
        "Everyone always said I was...",
        "In those days, we used to...",
        "The smell of [something] always reminds me of...",
        "I was just [age] years old when..."
    ];

    // Transition phrases to help flow
    const getTransitionPhrases = () => [
        "What I remember most clearly is...",
        "Years later, I would understand that...",
        "This experience taught me that...",
        "Looking back, I can see how...",
        "The funny thing was...",
        "What made this special was...",
        "I learned that day that...",
        "This was the beginning of..."
    ];

    useEffect(() => {
        const sectionPrompts = getSectionPrompts(currentSection);
        const contextual = getContextualSuggestions(currentText);
        const starters = currentText.length < 50 ? getStoryStarters() : [];
        const transitions = currentText.length > 200 ? getTransitionPhrases() : [];

        const allSuggestions = [
            ...sectionPrompts.map(s => ({ type: 'prompt', text: s, icon: Lightbulb, color: 'text-blue-500' })),
            ...contextual.map(s => ({ type: 'context', text: s, icon: Heart, color: 'text-red-500' })),
            ...starters.map(s => ({ type: 'starter', text: s, icon: Sparkles, color: 'text-purple-500' })),
            ...transitions.map(s => ({ type: 'transition', text: s, icon: ChevronRight, color: 'text-green-500' }))
        ];

        setSuggestions(allSuggestions.slice(0, 8)); // Limit to 8 suggestions
    }, [currentSection, currentText]);

    const handleSuggestionClick = (suggestion) => {
        onSuggestionClick(suggestion.text);
        setActiveSuggestion(0);
    };

    const getSuggestionTypeLabel = (type) => {
        const labels = {
            prompt: 'Section Prompt',
            context: 'Based on Your Text',
            starter: 'Story Starter',
            transition: 'Transition Phrase'
        };
        return labels[type] || 'Suggestion';
    };

    if (suggestions.length === 0) return null;

    return ( <
        div className = "bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 p-4 max-w-sm shadow-lg" >
        <
        div className = "flex items-center justify-between mb-4" >
        <
        div className = "flex items-center gap-2" >
        <
        Sparkles className = "h-4 w-4 text-blue-500" / >
        <
        h3 className = "font-medium text-gray-900 dark:text-white text-sm" > Writing Suggestions < /h3> < /
        div > <
        button onClick = { onClose }
        className = "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-sm" > ×
        <
        /button> < /
        div >

        <
        div className = "space-y-2 max-h-80 overflow-y-auto" > {
            suggestions.map((suggestion, index) => {
                const Icon = suggestion.icon;
                return ( <
                    button key = { index }
                    onClick = {
                        () => handleSuggestionClick(suggestion)
                    }
                    onMouseEnter = {
                        () => setActiveSuggestion(index)
                    }
                    className = { `w-full text-left p-3 rounded-lg transition-all duration-200 border ${
                activeSuggestion === index
                  ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-600 shadow-sm'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 border-transparent'
              }` } >
                    <
                    div className = "flex items-start gap-3" >
                    <
                    div className = { `p-1.5 rounded-lg ${
                  activeSuggestion === index ? 'bg-white dark:bg-gray-800' : 'bg-gray-100 dark:bg-gray-600'
                }` } >
                    <
                    Icon className = { `h-3 w-3 ${suggestion.color}` }
                    /> < /
                    div > <
                    div className = "flex-1 min-w-0" >
                    <
                    div className = "text-xs text-gray-500 dark:text-gray-400 mb-1" > { getSuggestionTypeLabel(suggestion.type) } <
                    /div> <
                    div className = "text-sm text-gray-800 dark:text-gray-100 leading-relaxed" > { suggestion.text } <
                    /div> < /
                    div > <
                    /div> < /
                    button >
                );
            })
        } <
        /div>

        <
        div className = "mt-3 pt-3 border-t border-gray-200 dark:border-gray-600" >
        <
        div className = "flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400" >
        <
        Quote className = "h-3 w-3" / >
        <
        span > Click any suggestion to add it to your story < /span> < /
        div > <
        /div> < /
        div >
    );
};

export default SmartSuggestions;