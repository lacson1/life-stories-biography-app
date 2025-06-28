import React, { useState, useEffect } from 'react';
import { Smartphone, Tablet, Monitor, RotateCcw, ZoomIn, ZoomOut, Menu, X } from 'lucide-react';

const MobileOptimization = ({ children, onMobileChange }) => {
    const [viewMode, setViewMode] = useState('auto');
    const [fontSize, setFontSize] = useState(16);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [orientation, setOrientation] = useState('portrait');
    const [touchGestures, setTouchGestures] = useState(true);

    // Detect mobile device and orientation
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
            if (onMobileChange) onMobileChange({ isMobile: mobile, orientation });
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        window.addEventListener('orientationchange', checkMobile);

        return () => {
            window.removeEventListener('resize', checkMobile);
            window.removeEventListener('orientationchange', checkMobile);
        };
    }, [onMobileChange]);

    // Load saved preferences
    useEffect(() => {
        const savedFontSize = localStorage.getItem('mobile_font_size');
        const savedTouchGestures = localStorage.getItem('mobile_touch_gestures');

        if (savedFontSize) setFontSize(parseInt(savedFontSize));
        if (savedTouchGestures) setTouchGestures(JSON.parse(savedTouchGestures));
    }, []);

    // Save preferences
    useEffect(() => {
        localStorage.setItem('mobile_font_size', fontSize.toString());
        localStorage.setItem('mobile_touch_gestures', JSON.stringify(touchGestures));

        // Apply font size to root
        document.documentElement.style.fontSize = `${fontSize}px`;
    }, [fontSize, touchGestures]);

    const viewModes = {
        auto: { name: 'Auto', icon: Monitor },
        mobile: { name: 'Mobile', icon: Smartphone },
        tablet: { name: 'Tablet', icon: Tablet },
        desktop: { name: 'Desktop', icon: Monitor }
    };

    const increaseFontSize = () => {
        if (fontSize < 24) setFontSize(fontSize + 2);
    };

    const decreaseFontSize = () => {
        if (fontSize > 12) setFontSize(fontSize - 2);
    };

    const resetFontSize = () => {
        setFontSize(16);
    };

    // Touch gesture handlers
    const handleTouchStart = (e) => {
        if (!touchGestures) return;

        const touch = e.touches[0];
        const startX = touch.clientX;
        const startY = touch.clientY;
        const startTime = Date.now();

        const handleTouchEnd = (endEvent) => {
            const endTouch = endEvent.changedTouches[0];
            const endX = endTouch.clientX;
            const endY = endTouch.clientY;
            const endTime = Date.now();

            const deltaX = endX - startX;
            const deltaY = endY - startY;
            const deltaTime = endTime - startTime;

            // Swipe detection
            if (Math.abs(deltaX) > 50 && deltaTime < 300) {
                if (deltaX > 0) {
                    // Swipe right
                    console.log('Swipe right detected');
                } else {
                    // Swipe left
                    console.log('Swipe left detected');
                }
            }

            document.removeEventListener('touchend', handleTouchEnd);
        };

        document.addEventListener('touchend', handleTouchEnd);
    };

    // Mobile-specific styles
    const getMobileStyles = () => {
        if (!isMobile && viewMode === 'auto') return {};

        return {
            fontSize: `${fontSize}px`,
            lineHeight: '1.6',
            letterSpacing: '0.5px',
            padding: '1rem',
            maxWidth: '100%',
            overflowX: 'hidden'
        };
    };

    const MobileToolbar = () => ( <
        div className = "fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-50 p-2" >
        <
        div className = "flex items-center justify-between" >
        <
        button onClick = {
            () => setIsMenuOpen(!isMenuOpen)
        }
        className = "p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600" > { isMenuOpen ? < X className = "w-5 h-5" / > : < Menu className = "w-5 h-5" / > } <
        /button>

        <
        div className = "flex items-center gap-2" >
        <
        button onClick = { decreaseFontSize }
        className = "p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
        disabled = { fontSize <= 12 } >
        <
        ZoomOut className = "w-4 h-4" / >
        <
        /button>

        <
        span className = "text-sm font-medium px-2" > { fontSize }
        px <
        /span>

        <
        button onClick = { increaseFontSize }
        className = "p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
        disabled = { fontSize >= 24 } >
        <
        ZoomIn className = "w-4 h-4" / >
        <
        /button>

        <
        button onClick = { resetFontSize }
        className = "p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600" >
        <
        RotateCcw className = "w-4 h-4" / >
        <
        /button> < /
        div >

        <
        div className = "flex items-center gap-1" > {
            Object.entries(viewModes).map(([mode, config]) => ( <
                button key = { mode }
                onClick = {
                    () => setViewMode(mode)
                }
                className = { `p-2 rounded-lg ${
                viewMode === mode
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
              }` }
                title = { config.name } >
                <
                config.icon className = "w-4 h-4" / >
                <
                /button>
            ))
        } <
        /div> < /
        div >

        { /* Mobile Menu */ } {
            isMenuOpen && ( <
                div className = "mt-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg" >
                <
                div className = "space-y-4" >
                <
                div >
                <
                h4 className = "font-medium text-gray-900 dark:text-gray-100 mb-2" >
                Device Info <
                /h4> <
                div className = "text-sm text-gray-600 dark:text-gray-400 space-y-1" >
                <
                p > Screen: { window.innerWidth }× { window.innerHeight } < /p> <
                p > Orientation: { orientation } < /p> <
                p > Device: { isMobile ? 'Mobile' : 'Desktop' } < /p> <
                p > View Mode: { viewModes[viewMode].name } < /p> < /
                div > <
                /div>

                <
                div >
                <
                label className = "flex items-center gap-2" >
                <
                input type = "checkbox"
                checked = { touchGestures }
                onChange = {
                    (e) => setTouchGestures(e.target.checked)
                }
                className = "rounded" /
                >
                <
                span className = "text-sm text-gray-700 dark:text-gray-300" >
                Enable Touch Gestures <
                /span> < /
                label > <
                /div>

                <
                div className = "flex flex-wrap gap-2" >
                <
                button onClick = {
                    () => setViewMode('mobile')
                }
                className = "px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-sm" >
                Force Mobile View <
                /button> <
                button onClick = {
                    () => setViewMode('auto')
                }
                className = "px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded text-sm" >
                Auto Detect <
                /button> < /
                div > <
                /div> < /
                div >
            )
        } <
        /div>
    );

    const MobileContainer = ({ children }) => ( <
        div className = { `${isMobile || viewMode === 'mobile' ? 'mobile-optimized' : ''}` }
        style = { getMobileStyles() }
        onTouchStart = { handleTouchStart } > { children } <
        /div>
    );

    // Add mobile-specific CSS
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
      .mobile-optimized {
        /* Touch-friendly button sizes */
        button {
          min-height: 44px;
          min-width: 44px;
          padding: 12px 16px;
        }
        
        /* Larger form inputs */
        input, textarea, select {
          min-height: 44px;
          padding: 12px 16px;
          font-size: 16px; /* Prevents zoom on iOS */
        }
        
        /* Better spacing for mobile */
        .space-y-2 > * + * {
          margin-top: 1rem;
        }
        
        .space-y-4 > * + * {
          margin-top: 1.5rem;
        }
        
        /* Improved scroll areas */
        .overflow-y-auto {
          -webkit-overflow-scrolling: touch;
        }
        
        /* Hide scrollbars on mobile */
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        /* Better tap targets */
        a, button, [role="button"] {
          touch-action: manipulation;
        }
        
        /* Prevent zoom on inputs */
        input[type="text"],
        input[type="email"],
        input[type="password"],
        input[type="number"],
        textarea {
          font-size: 16px !important;
        }
        
        /* Improved modal on mobile */
        .modal-mobile {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1000;
          background: white;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }
        
        /* Better grid layouts on mobile */
        .grid-mobile {
          display: block;
        }
        
        .grid-mobile > * {
          margin-bottom: 1rem;
        }
        
        /* Improved card layouts */
        .card-mobile {
          border-radius: 0;
          border-left: none;
          border-right: none;
          margin-left: -1rem;
          margin-right: -1rem;
        }
        
        /* Better typography */
        .text-mobile {
          line-height: 1.6;
          letter-spacing: 0.025em;
        }
        
        /* Improved focus states */
        .focus-mobile:focus {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }
      }
      
      /* Orientation-specific styles */
      @media (orientation: landscape) and (max-height: 500px) {
        .mobile-optimized {
          font-size: 14px;
        }
        
        .mobile-optimized button {
          min-height: 36px;
          padding: 8px 12px;
        }
      }
      
      /* Device-specific optimizations */
      @media (max-width: 320px) {
        .mobile-optimized {
          font-size: 14px;
        }
      }
      
      @media (min-width: 768px) and (max-width: 1024px) {
        .mobile-optimized {
          font-size: 18px;
        }
      }
    `;

        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    return ( <
        div className = "mobile-optimization-wrapper" > {
            (isMobile || viewMode === 'mobile') && < MobileToolbar / >
        }

        <
        MobileContainer >
        <
        div className = { `${isMobile || viewMode === 'mobile' ? 'pt-20' : ''}` } > { children } <
        /div> < /
        MobileContainer >

        { /* Mobile-specific floating action button */ } {
            (isMobile || viewMode === 'mobile') && ( <
                div className = "fixed bottom-4 right-4 z-40" >
                <
                button onClick = {
                    () => window.scrollTo({ top: 0, behavior: 'smooth' })
                }
                className = "w-12 h-12 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 flex items-center justify-center" > ↑
                <
                /button> < /
                div >
            )
        }

        { /* Mobile optimization indicator */ } {
            (isMobile || viewMode === 'mobile') && ( <
                div className = "fixed bottom-4 left-4 z-40 bg-green-500 text-white px-2 py-1 rounded text-xs" >
                Mobile Optimized <
                /div>
            )
        } <
        /div>
    );
};

export default MobileOptimization;