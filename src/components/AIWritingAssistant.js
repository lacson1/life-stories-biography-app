import React, { useState, useEffect } from 'react';
import { Sparkles, Lightbulb, RefreshCw, Copy, Check } from 'lucide-react';

const AIWritingAssistant = ({ section, currentText, onSuggestion }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [prompts, setPrompts] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState(null);

    // Writing prompts for different sections
    const sectionPrompts = {
        'About Me': [
            "What are three words that best describe your personality?",
            "What's a unique talent or skill you possess?",
            "What makes you laugh the most?",
            "What's your biggest dream or aspiration?",
            "What values are most important to you?"
        ],
        'Early Years': [
            "What's your earliest childhood memory?",
            "Who was your childhood hero and why?",
            "What was your favorite game or activity as a child?",
            "Describe your childhood home and neighborhood",
            "What lesson did you learn early in life that stuck with you?"
        ],
        'Family Life': [
            "What family tradition means the most to you?",
            "Who in your family has influenced you the most?",
            "What's a funny family story you love to tell?",
            "How has your family shaped who you are today?",
            "What advice would you give to future generations of your family?"
        ],
        'Work & Career': [
            "What's the most rewarding project you've worked on?",
            "Who was a mentor that changed your career path?",
            "What's the biggest challenge you've overcome professionally?",
            "What skills are you most proud of developing?",
            "What would you tell your younger self about work?"
        ],
        'Proud Moments': [
            "What achievement are you most proud of and why?",
            "Describe a time when you overcame a significant obstacle",
            "What's something you did that surprised even yourself?",
            "When did you feel most confident in your abilities?",
            "What moment made you realize how much you'd grown?"
        ],
        'Life Lessons': [
            "What's the most important lesson life has taught you?",
            "What mistake taught you the most?",
            "What advice do you wish someone had given you earlier?",
            "How has your perspective on life changed over the years?",
            "What wisdom would you pass on to others?"
        ]
    };

    // Generate AI-like suggestions (simulated)
    const generateSuggestions = async(text) => {
        setIsGenerating(true);

        // Simulate AI processing time
        await new Promise(resolve => setTimeout(resolve, 1500));

        const suggestions = [];

        if (!text || text.length < 10) {
            // Starter suggestions for empty/short content
            suggestions.push(
                `Consider starting with: "Looking back on this part of my life..."`,
                `Try beginning with: "One thing that stands out to me is..."`,
                `You might open with: "I remember when..."`
            );
        } else {
            // Enhancement suggestions for existing content
            if (text.length < 100) {
                suggestions.push(
                    "Try adding more specific details to make your story come alive",
                    "Consider including how this experience made you feel",
                    "What sensory details can you remember? Sounds, smells, sights?"
                );
            }

            if (!text.includes('I felt') && !text.includes('I was')) {
                suggestions.push("Consider adding your emotions or reactions to make it more personal");
            }

            if (!text.includes('because') && !text.includes('since')) {
                suggestions.push("Try explaining why this was significant or meaningful to you");
            }

            suggestions.push(
                "Consider adding a specific example or anecdote",
                "What lesson did you learn from this experience?",
                "How did this experience shape who you are today?"
            );
        }

        setSuggestions(suggestions.slice(0, 3));
        setIsGenerating(false);
    };

    useEffect(() => {
        if (section && sectionPrompts[section]) {
            setPrompts(sectionPrompts[section]);
        }
    }, [section]);

    const copyToClipboard = async(text, index) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedIndex(index);
            setTimeout(() => setCopiedIndex(null), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    const handlePromptClick = (prompt) => {
        if (onSuggestion) onSuggestion(prompt);
    };

    if (!isOpen) {
        return ( <
            button onClick = {
                () => setIsOpen(true)
            }
            className = "flex items-center gap-2 px-3 py-2 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors" >
            <
            Sparkles className = "w-4 h-4" / >
            <
            span className = "text-sm font-medium" > Writing Assistant < /span> < /
            button >
        );
    }

    return ( <
        div className = "bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-700 rounded-lg p-4 shadow-lg" >
        <
        div className = "flex items-center justify-between mb-4" >
        <
        div className = "flex items-center gap-2" >
        <
        Sparkles className = "w-5 h-5 text-purple-600 dark:text-purple-400" / >
        <
        h3 className = "font-semibold text-purple-900 dark:text-purple-100" > AI Writing Assistant < /h3> < /
        div > <
        button onClick = {
            () => setIsOpen(false)
        }
        className = "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" > ×
        <
        /button> < /
        div >

        { /* Writing Prompts */ } <
        div className = "mb-6" >
        <
        div className = "flex items-center gap-2 mb-3" >
        <
        Lightbulb className = "w-4 h-4 text-amber-600 dark:text-amber-400" / >
        <
        h4 className = "font-medium text-gray-900 dark:text-gray-100" > Writing Prompts < /h4> < /
        div > <
        div className = "space-y-2" > {
            prompts.map((prompt, index) => ( <
                button key = { index }
                onClick = {
                    () => handlePromptClick(prompt)
                }
                className = "w-full text-left p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors text-sm" > { prompt } <
                /button>
            ))
        } <
        /div> < /
        div >

        { /* AI Suggestions */ } <
        div className = "mb-4" >
        <
        div className = "flex items-center gap-2 mb-3" >
        <
        RefreshCw className = "w-4 h-4 text-blue-600 dark:text-blue-400" / >
        <
        h4 className = "font-medium text-gray-900 dark:text-gray-100" > AI Suggestions < /h4> <
        button onClick = {
            () => generateSuggestions(currentText)
        }
        disabled = { isGenerating }
        className = "ml-auto px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs hover:bg-blue-200 dark:hover:bg-blue-800 disabled:opacity-50" > { isGenerating ? 'Generating...' : 'Generate' } <
        /button> < /
        div >

        {
            isGenerating ? ( <
                div className = "flex items-center justify-center py-8" >
                <
                RefreshCw className = "w-6 h-6 text-blue-600 dark:text-blue-400 animate-spin" / >
                <
                span className = "ml-2 text-blue-600 dark:text-blue-400" > Analyzing your content... < /span> < /
                div >
            ) : ( <
                div className = "space-y-2" > {
                    suggestions.map((suggestion, index) => ( <
                        div key = { index }
                        className = "flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg" >
                        <
                        div className = "flex-1 text-blue-800 dark:text-blue-200 text-sm" > { suggestion } <
                        /div> <
                        button onClick = {
                            () => copyToClipboard(suggestion, index)
                        }
                        className = "p-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                        title = "Copy suggestion" > {
                            copiedIndex === index ? ( <
                                Check className = "w-4 h-4" / >
                            ) : ( <
                                Copy className = "w-4 h-4" / >
                            )
                        } <
                        /button> < /
                        div >
                    ))
                } {
                    suggestions.length === 0 && ( <
                        p className = "text-gray-500 dark:text-gray-400 text-sm italic" >
                        Click "Generate"
                        to get AI - powered writing suggestions <
                        /p>
                    )
                } <
                /div>
            )
        } <
        /div>

        { /* Quick Actions */ } <
        div className = "border-t border-purple-200 dark:border-purple-700 pt-4" >
        <
        h4 className = "font-medium text-gray-900 dark:text-gray-100 mb-2" > Quick Actions < /h4> <
        div className = "flex flex-wrap gap-2" >
        <
        button onClick = {
            () => onSuggestion && onSuggestion("Let me tell you about a time when...")
        }
        className = "px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded text-xs hover:bg-green-200 dark:hover:bg-green-800" >
        Start a story <
        /button> <
        button onClick = {
            () => onSuggestion && onSuggestion("Looking back, I realize that...")
        }
        className = "px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded text-xs hover:bg-green-200 dark:hover:bg-green-800" >
        Add reflection <
        /button> <
        button onClick = {
            () => onSuggestion && onSuggestion("The most important thing I learned was...")
        }
        className = "px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded text-xs hover:bg-green-200 dark:hover:bg-green-800" >
        Share lesson <
        /button> < /
        div > <
        /div> < /
        div >
    );
};

export default AIWritingAssistant;