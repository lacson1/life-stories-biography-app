import React, { useState } from 'react';
import { Book, ChevronLeft, ChevronRight, Home, Printer, Eye, EyeOff } from 'lucide-react';

const BookView = ({ formData, photos, recordings, onClose }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [fontSize, setFontSize] = useState('text-lg');
    const [showPhotos, setShowPhotos] = useState(true);

    const sections = [
        { id: 'overview', title: 'About Me', icon: '👤' },
        { id: 'childhood', title: 'Early Years', icon: '🌟' },
        { id: 'family', title: 'Family Life', icon: '👨‍👩‍👧‍👦' },
        { id: 'career', title: 'Work & Career', icon: '💼' },
        { id: 'achievements', title: 'Proud Moments', icon: '🏆' },
        { id: 'wisdom', title: 'Life Lessons', icon: '📚' }
    ];

    // Create pages from content
    const createPages = () => {
        const pages = [];

        // Title page
        pages.push({
            type: 'title',
            content: {
                title: `The Life Story of ${formData.name}`,
                subtitle: 'A Legacy Preserved for Future Generations',
                date: new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })
            }
        });

        // Table of contents
        const toc = sections.filter(section => formData[section.id] && formData[section.id].trim());
        if (toc.length > 0) {
            pages.push({
                type: 'toc',
                content: { sections: toc }
            });
        }

        // Section pages
        sections.forEach(section => {
            const content = formData[section.id];
            if (content && content.trim()) {
                pages.push({
                    type: 'section',
                    content: {
                        title: section.title,
                        icon: section.icon,
                        text: content,
                        photos: photos[section.id] || [],
                        audio: recordings[section.id]
                    }
                });
            }
        });

        // Special memories
        if (formData.memories && formData.memories.length > 0) {
            formData.memories.forEach(memory => {
                if (memory.content && memory.content.trim()) {
                    pages.push({
                        type: 'memory',
                        content: {
                            title: memory.title,
                            text: memory.content,
                            photos: photos[`memory-${memory.id}`] || [],
                            audio: recordings[`memory-${memory.id}`]
                        }
                    });
                }
            });
        }

        // Timeline page
        if (formData.timeline && formData.timeline.length > 0) {
            pages.push({
                type: 'timeline',
                content: { events: formData.timeline }
            });
        }

        return pages;
    };

    const pages = createPages();
    const totalPages = pages.length;
    const currentPageData = pages[currentPage];

    const nextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const printBook = () => {
        window.print();
    };

    const renderPage = () => {
        if (!currentPageData) return null;

        switch (currentPageData.type) {
            case 'title':
                return ( <
                    div className = "h-full flex flex-col items-center justify-center text-center space-y-8" >
                    <
                    div className = "text-6xl mb-4" > 📖 < /div> <
                    h1 className = "text-4xl font-bold text-amber-800 mb-4" > { currentPageData.content.title } <
                    /h1> <
                    p className = "text-xl text-gray-600 italic" > { currentPageData.content.subtitle } <
                    /p> <
                    div className = "mt-12 text-gray-500" >
                    Created on { currentPageData.content.date } <
                    /div> < /
                    div >
                );

            case 'toc':
                return ( <
                    div className = "h-full py-12" >
                    <
                    h2 className = "text-3xl font-bold text-amber-800 mb-8 text-center" > Table of Contents < /h2> <
                    div className = "space-y-4 max-w-md mx-auto" > {
                        currentPageData.content.sections.map((section, index) => ( <
                            div key = { section.id }
                            className = "flex justify-between items-center border-b border-gray-200 pb-2" >
                            <
                            span className = "flex items-center space-x-3" >
                            <
                            span className = "text-2xl" > { section.icon } < /span> <
                            span className = "text-lg" > { section.title } < /span> < /
                            span > <
                            span className = "text-gray-500" > { index + 3 } < /span> < /
                            div >
                        ))
                    } <
                    /div> < /
                    div >
                );

            case 'section':
                return ( <
                    div className = "h-full py-8" >
                    <
                    div className = "flex items-center space-x-3 mb-6" >
                    <
                    span className = "text-3xl" > { currentPageData.content.icon } < /span> <
                    h2 className = "text-3xl font-bold text-amber-800" > { currentPageData.content.title } < /h2> < /
                    div >

                    <
                    div className = { `${fontSize} leading-relaxed text-gray-800 mb-6 whitespace-pre-wrap` } > { currentPageData.content.text } <
                    /div>

                    {
                        showPhotos && currentPageData.content.photos.length > 0 && ( <
                            div className = "mt-6" >
                            <
                            h3 className = "text-lg font-semibold text-gray-700 mb-3" > Photos < /h3> <
                            div className = "grid grid-cols-2 gap-4" > {
                                currentPageData.content.photos.slice(0, 4).map((photo, index) => ( <
                                    div key = { index }
                                    className = "text-center" >
                                    <
                                    img src = { photo.url }
                                    alt = { photo.caption || 'Memory photo' }
                                    className = "w-full h-32 object-cover rounded-lg shadow-md" /
                                    >
                                    {
                                        photo.caption && ( <
                                            p className = "text-sm text-gray-600 mt-2 italic" > { photo.caption } < /p>
                                        )
                                    } <
                                    /div>
                                ))
                            } <
                            /div> < /
                            div >
                        )
                    }

                    {
                        currentPageData.content.audio && ( <
                            div className = "mt-6 p-4 bg-purple-50 rounded-lg" >
                            <
                            p className = "text-purple-800 mb-2" > 🎤This section includes a voice recording < /p> <
                            audio controls className = "w-full" >
                            <
                            source src = { currentPageData.content.audio }
                            type = "audio/wav" / >
                            <
                            /audio> < /
                            div >
                        )
                    } <
                    /div>
                );

            case 'memory':
                return ( <
                    div className = "h-full py-8" >
                    <
                    div className = "flex items-center space-x-3 mb-6" >
                    <
                    span className = "text-3xl" > 💝 < /span> <
                    h2 className = "text-3xl font-bold text-pink-800" > { currentPageData.content.title } < /h2> < /
                    div >

                    <
                    div className = { `${fontSize} leading-relaxed text-gray-800 mb-6 whitespace-pre-wrap` } > { currentPageData.content.text } <
                    /div>

                    {
                        showPhotos && currentPageData.content.photos.length > 0 && ( <
                            div className = "mt-6" >
                            <
                            h3 className = "text-lg font-semibold text-gray-700 mb-3" > Photos < /h3> <
                            div className = "grid grid-cols-2 gap-4" > {
                                currentPageData.content.photos.slice(0, 4).map((photo, index) => ( <
                                    div key = { index }
                                    className = "text-center" >
                                    <
                                    img src = { photo.url }
                                    alt = { photo.caption || 'Memory photo' }
                                    className = "w-full h-32 object-cover rounded-lg shadow-md" /
                                    >
                                    {
                                        photo.caption && ( <
                                            p className = "text-sm text-gray-600 mt-2 italic" > { photo.caption } < /p>
                                        )
                                    } <
                                    /div>
                                ))
                            } <
                            /div> < /
                            div >
                        )
                    } <
                    /div>
                );

            case 'timeline':
                return ( <
                    div className = "h-full py-8" >
                    <
                    h2 className = "text-3xl font-bold text-amber-800 mb-8 text-center" > Life Timeline < /h2> <
                    div className = "space-y-4" > {
                        currentPageData.content.events.map((event, index) => ( <
                            div key = { index }
                            className = "flex items-center space-x-4" >
                            <
                            div className = "bg-amber-600 text-white px-3 py-1 rounded-full font-bold min-w-[60px] text-center" > { event.year } <
                            /div> <
                            div className = "flex-1" >
                            <
                            div className = "font-semibold" > { event.event } < /div> <
                            div className = "text-sm text-gray-600 capitalize" > { event.category } < /div> < /
                            div > <
                            /div>
                        ))
                    } <
                    /div> < /
                    div >
                );

            default:
                return <div > Page not found < /div>;
        }
    };

    return ( <
        div className = "fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center p-4" >
        <
        div className = "bg-white rounded-lg shadow-2xl w-full max-w-4xl h-full max-h-[90vh] flex flex-col" > { /* Header */ } <
        div className = "flex items-center justify-between p-4 border-b border-gray-200" >
        <
        div className = "flex items-center space-x-4" >
        <
        Book className = "h-6 w-6 text-amber-600" / >
        <
        h1 className = "text-xl font-bold text-gray-800" > Reading View < /h1> < /
        div >

        <
        div className = "flex items-center space-x-4" > { /* Font size controls */ } <
        select value = { fontSize }
        onChange = {
            (e) => setFontSize(e.target.value)
        }
        className = "text-sm border rounded px-2 py-1" >
        <
        option value = "text-sm" > Small < /option> <
        option value = "text-base" > Medium < /option> <
        option value = "text-lg" > Large < /option> <
        option value = "text-xl" > X - Large < /option> < /
        select >

        { /* Toggle photos */ } <
        button onClick = {
            () => setShowPhotos(!showPhotos)
        }
        className = "p-2 text-gray-600 hover:text-gray-800"
        title = { showPhotos ? "Hide photos" : "Show photos" } > { showPhotos ? < Eye className = "h-4 w-4" / > : < EyeOff className = "h-4 w-4" / > } <
        /button>

        { /* Print */ } <
        button onClick = { printBook }
        className = "p-2 text-gray-600 hover:text-gray-800"
        title = "Print book" >
        <
        Printer className = "h-4 w-4" / >
        <
        /button>

        { /* Close */ } <
        button onClick = { onClose }
        className = "p-2 text-gray-600 hover:text-gray-800"
        title = "Close reading view" >
        <
        Home className = "h-4 w-4" / >
        <
        /button> < /
        div > <
        /div>

        { /* Book content */ } <
        div className = "flex-1 overflow-hidden" >
        <
        div className = "h-full p-8 overflow-y-auto bg-gradient-to-br from-amber-50 to-orange-50" >
        <
        div className = "max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8 min-h-full" > { renderPage() } <
        /div> < /
        div > <
        /div>

        { /* Footer navigation */ } <
        div className = "flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50" >
        <
        button onClick = { prevPage }
        disabled = { currentPage === 0 }
        className = "flex items-center space-x-2 px-4 py-2 bg-amber-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-amber-700 transition-colors" >
        <
        ChevronLeft className = "h-4 w-4" / >
        <
        span > Previous < /span> < /
        button >

        <
        div className = "flex items-center space-x-4" >
        <
        span className = "text-gray-600" >
        Page { currentPage + 1 }
        of { totalPages } <
        /span>

        { /* Page dots */ } <
        div className = "flex space-x-1" > {
            pages.map((_, index) => ( <
                button key = { index }
                onClick = {
                    () => setCurrentPage(index)
                }
                className = { `w-2 h-2 rounded-full transition-colors ${
                    index === currentPage ? 'bg-amber-600' : 'bg-gray-300 hover:bg-gray-400'
                  }` }
                />
            ))
        } <
        /div> < /
        div >

        <
        button onClick = { nextPage }
        disabled = { currentPage === totalPages - 1 }
        className = "flex items-center space-x-2 px-4 py-2 bg-amber-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-amber-700 transition-colors" >
        <
        span > Next < /span> <
        ChevronRight className = "h-4 w-4" / >
        <
        /button> < /
        div > <
        /div> < /
        div >
    );
};

export default BookView;