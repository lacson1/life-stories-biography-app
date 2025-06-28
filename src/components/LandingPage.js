import React from 'react';
import {
    Book,
    Users,
    Camera,
    Mic,
    Download,
    ArrowRight,
    CheckCircle
} from 'lucide-react';

const LandingPage = ({ onGetStarted, onSignIn }) => {
    const features = [{
            icon: Book,
            title: "Write Your Story",
            description: "Create your life biography with guided sections and prompts."
        },
        {
            icon: Camera,
            title: "Add Photos",
            description: "Include photos and memories to bring your story to life."
        },
        {
            icon: Mic,
            title: "Record Voice",
            description: "Preserve your voice with audio recordings for each section."
        },
        {
            icon: Users,
            title: "Multiple Users",
            description: "Each family member can create their own separate biography."
        },
        {
            icon: Download,
            title: "Export & Share",
            description: "Download your completed biography as PDF or web page."
        }
    ];

    return ( <
        div className = "min-h-screen bg-white dark:bg-gray-900" > { /* Hero Section */ } <
        div className = "relative" >
        <
        div className = "max-w-4xl mx-auto px-6 py-20 text-center" > { /* Logo */ } <
        div className = "flex justify-center mb-8" >
        <
        div className = "flex items-center gap-3 bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-full" >
        <
        div className = "p-1 bg-blue-500 rounded" >
        <
        Book className = "h-5 w-5 text-white" / >
        <
        /div> <
        span className = "text-lg font-semibold text-gray-800 dark:text-white" > Life Stories < /span> < /
        div > <
        /div>

        { /* Hero Text */ } <
        h1 className = "text-5xl md:text-6xl font-bold text-gray-800 dark:text-white mb-6" >
        Preserve Your <
        span className = "block text-blue-500" > Life Stories < /span> < /
        h1 >

        <
        p className = "text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto" >
        Create beautiful biographies with photos, voice recordings, and memories
        for future generations. <
        /p>

        { /* CTA Buttons */ } <
        div className = "flex flex-col sm:flex-row gap-4 justify-center mb-16" >
        <
        button onClick = { onGetStarted }
        className = "bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2" >
        Get Started <
        ArrowRight className = "h-5 w-5" / >
        <
        /button>

        <
        button onClick = { onSignIn }
        className = "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" >
        Sign In <
        /button> < /
        div >

        { /* Simple Preview */ } <
        div className = "max-w-2xl mx-auto bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700" >
        <
        div className = "text-left" >
        <
        h3 className = "text-lg font-semibold text-gray-800 dark:text-white mb-3" > About Me < /h3> <
        p className = "text-gray-600 dark:text-gray-300 mb-4" >
        I was born in 1945 in a small town in Ohio.Growing up shaped my values of hard work and family... <
        /p> <
        div className = "flex gap-4" >
        <
        div className = "flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400" >
        <
        Camera className = "h-4 w-4" / >
        <
        span > 3 photos < /span> < /
        div > <
        div className = "flex items-center gap-2 text-sm text-green-600 dark:text-green-400" >
        <
        CheckCircle className = "h-4 w-4" / >
        <
        span > Complete < /span> < /
        div > <
        /div> < /
        div > <
        /div> < /
        div > <
        /div>

        { /* Features Section */ } <
        div className = "py-16 bg-gray-50 dark:bg-gray-800" >
        <
        div className = "max-w-6xl mx-auto px-6" >
        <
        div className = "text-center mb-12" >
        <
        h2 className = "text-3xl font-bold text-gray-800 dark:text-white mb-4" >
        Simple & Powerful <
        /h2> <
        p className = "text-lg text-gray-600 dark:text-gray-300" >
        Everything you need to create and share your life story <
        /p> < /
        div >

        <
        div className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto" > {
            features.map((feature, index) => {
                const Icon = feature.icon;
                return ( <
                    div key = { index }
                    className = "text-center" >
                    <
                    div className = "w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4" >
                    <
                    Icon className = "h-6 w-6 text-blue-600 dark:text-blue-400" / >
                    <
                    /div> <
                    h3 className = "text-lg font-semibold text-gray-800 dark:text-white mb-2" > { feature.title } <
                    /h3> <
                    p className = "text-gray-600 dark:text-gray-300" > { feature.description } <
                    /p> < /
                    div >
                );
            })
        } <
        /div> < /
        div > <
        /div>

        { /* Final CTA Section */ } <
        div className = "py-16 bg-blue-500" >
        <
        div className = "max-w-3xl mx-auto px-6 text-center" >
        <
        h2 className = "text-3xl font-bold text-white mb-4" >
        Start Your Story Today <
        /h2> <
        p className = "text-xl text-blue-100 mb-8" >
        Join families preserving their memories
        for future generations. <
        /p>

        <
        button onClick = { onGetStarted }
        className = "bg-white text-blue-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center gap-2" >
        Create Your Biography <
        ArrowRight className = "h-5 w-5" / >
        <
        /button>

        <
        div className = "mt-6 text-blue-100 text-sm" >
        Free to start• No credit card required <
        /div> < /
        div > <
        /div>

        { /* Footer */ } <
        div className = "bg-gray-800 text-white py-8" >
        <
        div className = "max-w-4xl mx-auto px-6 text-center" >
        <
        div className = "flex items-center justify-center gap-2 mb-2" >
        <
        div className = "p-1 bg-blue-500 rounded" >
        <
        Book className = "h-4 w-4 text-white" / >
        <
        /div> <
        span className = "font-semibold" > Life Stories < /span> < /
        div > <
        div className = "text-gray-400 text-sm" > ©2025 Life Stories.Preserving memories
        for future generations. <
        /div> < /
        div > <
        /div> < /
        div >
    );
};

export default LandingPage;