import React from 'react';
import { CheckCircle, Clock, BookOpen, Target, TrendingUp, Award, Zap } from 'lucide-react';

const ProgressTracker = ({ formData, photos, recordings }) => {
    const sections = [
        { id: 'overview', title: 'About Me', weight: 20 },
        { id: 'childhood', title: 'Early Years', weight: 15 },
        { id: 'family', title: 'Family Life', weight: 20 },
        { id: 'career', title: 'Work & Career', weight: 15 },
        { id: 'achievements', title: 'Proud Moments', weight: 15 },
        { id: 'wisdom', title: 'Life Lessons', weight: 15 }
    ];

    const calculateSectionProgress = (section) => {
        let progress = 0;
        let maxProgress = 100;

        // Text content (60% of section progress)
        if (formData[section.id] && formData[section.id].trim().length > 50) {
            progress += 60;
        } else if (formData[section.id] && formData[section.id].trim().length > 0) {
            progress += 30;
        }

        // Photos (20% of section progress)
        if (photos[section.id] && photos[section.id].length > 0) {
            progress += 20;
        }

        // Voice recordings (20% of section progress)
        if (recordings[section.id]) {
            progress += 20;
        }

        return Math.min(progress, maxProgress);
    };

    const calculateOverallProgress = () => {
        let totalWeightedProgress = 0;
        let totalWeight = 0;

        sections.forEach(section => {
            const sectionProgress = calculateSectionProgress(section);
            totalWeightedProgress += (sectionProgress * section.weight) / 100;
            totalWeight += section.weight;
        });

        // Add memories and timeline bonus
        const memoriesBonus = Math.min((formData.memories && formData.memories.length * 2) || 0, 10);
        const timelineBonus = Math.min(((formData.timeline && formData.timeline.length - 5) * 1) || 0, 5);

        return Math.min((totalWeightedProgress / totalWeight) * 100 + memoriesBonus + timelineBonus, 100);
    };

    const overallProgress = calculateOverallProgress();
    const completedSections = sections.filter(section => calculateSectionProgress(section) >= 80).length;

    const getProgressColor = (progress) => {
        if (progress >= 80) return 'text-green-600 bg-green-100';
        if (progress >= 50) return 'text-yellow-600 bg-yellow-100';
        return 'text-gray-600 bg-gray-100';
    };

    const getProgressMessage = () => {
        if (overallProgress >= 90) return "Your life story is beautifully complete! 🎉";
        if (overallProgress >= 70) return "Great progress! Almost there! 🌟";
        if (overallProgress >= 50) return "You're making good progress! Keep going! 💪";
        if (overallProgress >= 25) return "Good start! Let's add more memories! 📖";
        return "Just getting started! Every story begins somewhere! ✨";
    };

    // Calculate comprehensive progress metrics
    const calculateProgress = () => {
        const sections = ['overview', 'childhood', 'family', 'career', 'achievements', 'wisdom'];
        let completedSections = 0;
        let totalWords = 0;
        let totalPhotos = 0;
        let totalRecordings = 0;

        sections.forEach(section => {
            const content = formData[section] || '';
            const words = content.trim().split(/\s+/).filter(word => word.length > 0).length;
            totalWords += words;

            if (content.length > 50) completedSections++;
            if (photos[section]) totalPhotos += photos[section].length;
            if (recordings[section]) totalRecordings++;
        });

        // Add memories to counts
        if (formData.memories) {
            formData.memories.forEach(memory => {
                if (memory.content) {
                    const words = memory.content.trim().split(/\s+/).filter(word => word.length > 0).length;
                    totalWords += words;
                }
            });
        }

        const memoryProgress = (formData.memories && formData.memories.filter(m => m.content && m.content.length > 20).length) || 0;
        const timelineProgress = (formData.timeline && formData.timeline.length) || 0;

        // Calculate reading time (average 200 words per minute)
        const readingTime = Math.ceil(totalWords / 200);

        const overallProgress = Math.round(
            ((completedSections / sections.length) * 40 +
                (Math.min(memoryProgress, 5) / 5) * 30 +
                (Math.min(timelineProgress, 10) / 10) * 20 +
                (Math.min(totalPhotos, 20) / 20) * 10)
        );

        return {
            overallProgress,
            completedSections,
            totalSections: sections.length,
            totalWords,
            totalPhotos,
            totalRecordings,
            memoryProgress,
            timelineProgress,
            readingTime
        };
    };

    const progress = calculateProgress();

    // Achievement system
    const achievements = [
        { id: 'first_words', title: 'First Words', desc: 'Write your first 100 words', achieved: progress.totalWords >= 100, icon: Zap, color: 'text-blue-500' },
        { id: 'storyteller', title: 'Storyteller', desc: 'Write 1,000 words', achieved: progress.totalWords >= 1000, icon: BookOpen, color: 'text-green-500' },
        { id: 'memory_keeper', title: 'Memory Keeper', desc: 'Add 3 special memories', achieved: progress.memoryProgress >= 3, icon: Award, color: 'text-purple-500' },
        { id: 'photographer', title: 'Photographer', desc: 'Add 10 photos', achieved: progress.totalPhotos >= 10, icon: Target, color: 'text-orange-500' },
        { id: 'completionist', title: 'Completionist', desc: 'Complete all sections', achieved: progress.completedSections === progress.totalSections, icon: TrendingUp, color: 'text-amber-500' }
    ];

    const getMotivationalMessage = () => {
        if (progress.overallProgress < 20) return "Every great story starts with a single word. You're on your way! ✨";
        if (progress.overallProgress < 40) return "Your story is taking shape beautifully! Keep adding those precious memories. 🌟";
        if (progress.overallProgress < 60) return "Wonderful progress! Your family will treasure these stories forever. 💝";
        if (progress.overallProgress < 80) return "You're almost there! Your biography is becoming truly special. 🎉";
        if (progress.overallProgress < 100) return "So close to completing your masterpiece! Just a few more touches. 🏆";
        return "Congratulations! You've created a beautiful legacy for future generations! 🎊";
    };

    return ( <
        div className = "bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 max-w-3xl mx-auto" >
        <
        div className = "text-center mb-8" >
        <
        h2 className = "text-2xl font-semibold text-gray-900 dark:text-white mb-3" > Your Progress < /h2> <
        p className = "text-gray-600 dark:text-gray-400" > { getMotivationalMessage() } < /p> < /
        div >

        { /* Main Progress Circle */ } <
        div className = "flex justify-center mb-8" >
        <
        div className = "relative w-32 h-32" >
        <
        svg className = "w-32 h-32 -rotate-90"
        viewBox = "0 0 120 120" >
        <
        circle cx = "60"
        cy = "60"
        r = "50"
        stroke = "currentColor"
        strokeWidth = "8"
        fill = "none"
        className = "text-gray-200 dark:text-gray-700" /
        >
        <
        circle cx = "60"
        cy = "60"
        r = "50"
        stroke = "currentColor"
        strokeWidth = "8"
        fill = "none"
        strokeLinecap = "round"
        strokeDasharray = { `${2 * Math.PI * 50}` }
        strokeDashoffset = { `${2 * Math.PI * 50 * (1 - progress.overallProgress / 100)}` }
        className = "text-amber-500 transition-all duration-1000 ease-out" /
        >
        <
        /svg> <
        div className = "absolute inset-0 flex items-center justify-center" >
        <
        span className = "text-2xl font-bold text-gray-800 dark:text-gray-100" > { progress.overallProgress } % < /span> < /
        div > <
        /div> < /
        div >

        { /* Enhanced Statistics Grid */ } <
        div className = "grid grid-cols-2 md:grid-cols-4 gap-4 mb-6" >
        <
        div className = "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg text-center" >
        <
        div className = "text-2xl font-bold text-blue-600 dark:text-blue-400" > { progress.totalWords.toLocaleString() } < /div> <
        div className = "text-sm text-blue-800 dark:text-blue-300" > Words Written < /div> <
        div className = "text-xs text-blue-600 dark:text-blue-400 mt-1" > ~{ progress.readingTime }
        min read < /div> < /
        div > <
        div className = "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg text-center" >
        <
        div className = "text-2xl font-bold text-green-600 dark:text-green-400" > { progress.completedSections }
        /{progress.totalSections}</div >
        <
        div className = "text-sm text-green-800 dark:text-green-300" > Sections Done < /div> < /
        div > <
        div className = "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-lg text-center" >
        <
        div className = "text-2xl font-bold text-purple-600 dark:text-purple-400" > { progress.totalPhotos } < /div> <
        div className = "text-sm text-purple-800 dark:text-purple-300" > Photos Added < /div> < /
        div > <
        div className = "bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-4 rounded-lg text-center" >
        <
        div className = "text-2xl font-bold text-orange-600 dark:text-orange-400" > { progress.memoryProgress } < /div> <
        div className = "text-sm text-orange-800 dark:text-orange-300" > Special Memories < /div> < /
        div > <
        /div>

        { /* Achievements Section */ } <
        div className = "mb-6" >
        <
        h3 className = "text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2" >
        <
        Award className = "h-5 w-5 text-amber-500" / >
        Achievements <
        /h3> <
        div className = "grid grid-cols-1 md:grid-cols-2 gap-3" > {
            achievements.map(achievement => {
                const Icon = achievement.icon;
                return ( <
                    div key = { achievement.id }
                    className = { `p-3 rounded-lg border-2 transition-all duration-300 ${
                                    achievement.achieved
                                        ? 'bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-amber-300 dark:border-amber-600'
                                        : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 opacity-60'
                                }` } >
                    <
                    div className = "flex items-center gap-3" >
                    <
                    div className = { `p-2 rounded-lg ${achievement.achieved ? 'bg-white dark:bg-gray-800' : 'bg-gray-200 dark:bg-gray-600'}` } >
                    <
                    Icon className = { `h-4 w-4 ${achievement.achieved ? achievement.color : 'text-gray-400'}` }
                    /> < /
                    div > <
                    div className = "flex-1" >
                    <
                    div className = { `font-semibold text-sm ${achievement.achieved ? 'text-gray-800 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}` } > { achievement.title } <
                    /div> <
                    div className = { `text-xs ${achievement.achieved ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}` } > { achievement.desc } <
                    /div> < /
                    div > {
                        achievement.achieved && ( <
                            CheckCircle className = "h-5 w-5 text-green-500" / >
                        )
                    } <
                    /div> < /
                    div >
                );
            })
        } <
        /div> < /
        div >

        { /* Next Steps */ } <
        div className = "bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-700" >
        <
        h4 className = "font-semibold text-amber-900 dark:text-amber-100 mb-2 flex items-center gap-2" >
        <
        Target className = "h-4 w-4" / >
        Next Steps <
        /h4> <
        div className = "text-sm text-amber-800 dark:text-amber-200" > {
            progress.overallProgress < 100 ? ( <
                ul className = "space-y-1" > {
                    progress.completedSections < progress.totalSections && ( <
                        li > •Complete { progress.totalSections - progress.completedSections }
                        more section { progress.totalSections - progress.completedSections !== 1 ? 's' : '' } < /li>
                    )
                } {
                    progress.memoryProgress < 3 && ( <
                        li > •Add { 3 - progress.memoryProgress }
                        more special memor { 3 - progress.memoryProgress !== 1 ? 'ies' : 'y' } < /li>
                    )
                } {
                    progress.totalPhotos < 5 && ( <
                        li > •Upload more photos to bring your story to life < /li>
                    )
                } {
                    progress.totalWords < 1000 && ( <
                        li > •Keep writing!Aim
                        for {
                            (1000 - progress.totalWords).toLocaleString()
                        }
                        more words < /li>
                    )
                } <
                /ul>
            ) : ( <
                p > 🎉Your biography is complete!Consider sharing it with family or creating a printed version. < /p>
            )
        } <
        /div> < /
        div > <
        /div>
    );
};

export default ProgressTracker;