import React, { useState } from 'react';
import { Download, FileText, Image, Mail, Globe, Book, Printer, Settings, Check } from 'lucide-react';

const ExportEnhancements = ({ data, photos, onClose }) => {
    const [selectedFormat, setSelectedFormat] = useState('pdf');
    const [exportOptions, setExportOptions] = useState({
        includePhotos: true,
        includeTimeline: true,
        includeMemories: true,
        pageNumbers: true,
        tableOfContents: true,
        coverPage: true,
        fontSize: 'medium',
        theme: 'classic',
        paperSize: 'A4',
        orientation: 'portrait'
    });
    const [isExporting, setIsExporting] = useState(false);
    const [exportComplete, setExportComplete] = useState(false);

    const exportFormats = {
        pdf: {
            name: 'PDF Document',
            icon: FileText,
            description: 'Professional document format',
            features: ['Print-ready', 'Universal compatibility', 'Preserves formatting']
        },
        epub: {
            name: 'EPUB E-book',
            icon: Book,
            description: 'Digital book format',
            features: ['E-reader compatible', 'Reflowable text', 'Interactive navigation']
        },
        html: {
            name: 'Interactive Website',
            icon: Globe,
            description: 'Web-based biography',
            features: ['Interactive timeline', 'Search functionality', 'Mobile responsive']
        },
        docx: {
            name: 'Word Document',
            icon: FileText,
            description: 'Microsoft Word format',
            features: ['Editable format', 'Comments support', 'Track changes']
        },
        photobook: {
            name: 'Photo Book',
            icon: Image,
            description: 'Image-focused layout',
            features: ['Large photos', 'Minimal text', 'Gallery style']
        },
        email: {
            name: 'Email Series',
            icon: Mail,
            description: 'Serialized email format',
            features: ['Weekly chapters', 'Email automation', 'Family sharing']
        }
    };

    const themes = {
        classic: 'Traditional book style',
        modern: 'Clean and minimal',
        vintage: 'Nostalgic design',
        elegant: 'Sophisticated layout',
        family: 'Warm and personal'
    };

    const handleExport = async() => {
        setIsExporting(true);

        try {
            // Simulate export process
            await new Promise(resolve => setTimeout(resolve, 3000));

            const exportData = {
                format: selectedFormat,
                options: exportOptions,
                data,
                photos,
                timestamp: new Date().toISOString()
            };

            // In a real implementation, this would call the appropriate export function
            switch (selectedFormat) {
                case 'pdf':
                    await exportToPDF(exportData);
                    break;
                case 'epub':
                    await exportToEPUB(exportData);
                    break;
                case 'html':
                    await exportToHTML(exportData);
                    break;
                case 'docx':
                    await exportToDocx(exportData);
                    break;
                case 'photobook':
                    await exportToPhotobook(exportData);
                    break;
                case 'email':
                    await exportToEmail(exportData);
                    break;
                default:
                    throw new Error('Unsupported format');
            }

            setExportComplete(true);
            setTimeout(() => {
                setExportComplete(false);
                setIsExporting(false);
            }, 2000);

        } catch (error) {
            console.error('Export failed:', error);
            setIsExporting(false);
        }
    };

    // Mock export functions (in real app, these would generate actual files)
    const exportToPDF = async(data) => {
        console.log('Exporting to PDF with options:', data.options);
        // Would use libraries like jsPDF or Puppeteer
    };

    const exportToEPUB = async(data) => {
        console.log('Exporting to EPUB with options:', data.options);
        // Would use libraries like epub-gen
    };

    const exportToHTML = async(data) => {
        console.log('Exporting to HTML with options:', data.options);
        // Would generate static HTML files
    };

    const exportToDocx = async(data) => {
        console.log('Exporting to DOCX with options:', data.options);
        // Would use libraries like docx
    };

    const exportToPhotobook = async(data) => {
        console.log('Exporting to Photobook with options:', data.options);
        // Would create image-heavy layout
    };

    const exportToEmail = async(data) => {
        console.log('Exporting to Email series with options:', data.options);
        // Would prepare email templates
    };

    const updateOption = (key, value) => {
        setExportOptions(prev => ({
            ...prev,
            [key]: value
        }));
    };

    return ( <
        div className = "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-lg max-w-4xl" >
        <
        div className = "flex items-center justify-between mb-6" >
        <
        div className = "flex items-center gap-2" >
        <
        Download className = "w-5 h-5 text-green-600 dark:text-green-400" / >
        <
        h3 className = "font-semibold text-gray-900 dark:text-gray-100" > Export Your Biography < /h3> < /
        div > <
        button onClick = { onClose }
        className = "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" > ×
        <
        /button> < /
        div >

        <
        div className = "grid grid-cols-1 lg:grid-cols-2 gap-6" > { /* Format Selection */ } <
        div >
        <
        h4 className = "font-medium text-gray-900 dark:text-gray-100 mb-4" > Choose Export Format < /h4> <
        div className = "space-y-3" > {
            Object.entries(exportFormats).map(([format, config]) => ( <
                div key = { format }
                className = { `p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedFormat === format
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }` }
                onClick = {
                    () => setSelectedFormat(format)
                } >
                <
                div className = "flex items-start gap-3" >
                <
                config.icon className = { `w-5 h-5 mt-1 ${
                    selectedFormat === format ? 'text-green-600' : 'text-gray-500'
                  }` }
                /> <
                div className = "flex-1" >
                <
                div className = "font-medium text-gray-900 dark:text-gray-100" > { config.name } <
                /div> <
                div className = "text-sm text-gray-600 dark:text-gray-400 mb-2" > { config.description } <
                /div> <
                div className = "flex flex-wrap gap-1" > {
                    config.features.map((feature, index) => ( <
                        span key = { index }
                        className = "px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs" > { feature } <
                        /span>
                    ))
                } <
                /div> < /
                div > {
                    selectedFormat === format && ( <
                        Check className = "w-5 h-5 text-green-600" / >
                    )
                } <
                /div> < /
                div >
            ))
        } <
        /div> < /
        div >

        { /* Export Options */ } <
        div >
        <
        h4 className = "font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2" >
        <
        Settings className = "w-4 h-4" / >
        Export Options <
        /h4>

        <
        div className = "space-y-4" > { /* Content Options */ } <
        div className = "space-y-3" >
        <
        h5 className = "text-sm font-medium text-gray-700 dark:text-gray-300" > Content < /h5>

        {
            [
                { key: 'includePhotos', label: 'Include Photos' },
                { key: 'includeTimeline', label: 'Include Timeline' },
                { key: 'includeMemories', label: 'Include Special Memories' },
                { key: 'tableOfContents', label: 'Table of Contents' },
                { key: 'coverPage', label: 'Cover Page' },
                { key: 'pageNumbers', label: 'Page Numbers' }
            ].map(option => ( <
                label key = { option.key }
                className = "flex items-center gap-2" >
                <
                input type = "checkbox"
                checked = { exportOptions[option.key] }
                onChange = {
                    (e) => updateOption(option.key, e.target.checked)
                }
                className = "rounded border-gray-300 dark:border-gray-600" /
                >
                <
                span className = "text-sm text-gray-700 dark:text-gray-300" > { option.label } <
                /span> < /
                label >
            ))
        } <
        /div>

        { /* Style Options */ } <
        div className = "space-y-3" >
        <
        h5 className = "text-sm font-medium text-gray-700 dark:text-gray-300" > Style < /h5>

        <
        div >
        <
        label className = "block text-xs text-gray-600 dark:text-gray-400 mb-1" > Theme < /label> <
        select value = { exportOptions.theme }
        onChange = {
            (e) => updateOption('theme', e.target.value)
        }
        className = "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-sm" > {
            Object.entries(themes).map(([theme, description]) => ( <
                option key = { theme }
                value = { theme } > { description } < /option>
            ))
        } <
        /select> < /
        div >

        <
        div >
        <
        label className = "block text-xs text-gray-600 dark:text-gray-400 mb-1" > Font Size < /label> <
        select value = { exportOptions.fontSize }
        onChange = {
            (e) => updateOption('fontSize', e.target.value)
        }
        className = "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-sm" >
        <
        option value = "small" > Small(10 pt) < /option> <
        option value = "medium" > Medium(12 pt) < /option> <
        option value = "large" > Large(14 pt) < /option> <
        option value = "xlarge" > Extra Large(16 pt) < /option> < /
        select > <
        /div>

        {
            selectedFormat === 'pdf' && ( <
                >
                <
                div >
                <
                label className = "block text-xs text-gray-600 dark:text-gray-400 mb-1" > Paper Size < /label> <
                select value = { exportOptions.paperSize }
                onChange = {
                    (e) => updateOption('paperSize', e.target.value)
                }
                className = "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-sm" >
                <
                option value = "A4" > A4 < /option> <
                option value = "Letter" > Letter < /option> <
                option value = "Legal" > Legal < /option> < /
                select > <
                /div>

                <
                div >
                <
                label className = "block text-xs text-gray-600 dark:text-gray-400 mb-1" > Orientation < /label> <
                select value = { exportOptions.orientation }
                onChange = {
                    (e) => updateOption('orientation', e.target.value)
                }
                className = "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-sm" >
                <
                option value = "portrait" > Portrait < /option> <
                option value = "landscape" > Landscape < /option> < /
                select > <
                /div> < / >
            )
        } <
        /div>

        { /* Preview Info */ } <
        div className = "p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg" >
        <
        h6 className = "text-sm font-medium text-blue-900 dark:text-blue-100 mb-2" >
        Export Preview <
        /h6> <
        div className = "text-xs text-blue-700 dark:text-blue-300 space-y-1" >
        <
        p > Format: { exportFormats[selectedFormat].name } < /p> <
        p > Theme: { themes[exportOptions.theme] } < /p> <
        p > Estimated pages: { Math.ceil(Object.values(data || {}).join(' ').length / 3000) } < /p> <
        p > Photos included: { exportOptions.includePhotos ? (photos && photos.length ? photos.length : 0) : 0 } < /p> < /
        div > <
        /div> < /
        div > <
        /div> < /
        div >

        { /* Export Button */ } <
        div className = "mt-6 pt-6 border-t border-gray-200 dark:border-gray-600" >
        <
        button onClick = { handleExport }
        disabled = { isExporting }
        className = { `w-full px-6 py-3 rounded-lg font-medium transition-colors ${
            isExporting
              ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
              : exportComplete
              ? 'bg-green-600 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }` } > {
            isExporting ? ( <
                div className = "flex items-center justify-center gap-2" >
                <
                div className = "w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" > < /div>
                Exporting... <
                /div>
            ) : exportComplete ? ( <
                div className = "flex items-center justify-center gap-2" >
                <
                Check className = "w-5 h-5" / >
                Export Complete!
                <
                /div>
            ) : ( <
                div className = "flex items-center justify-center gap-2" >
                <
                Download className = "w-5 h-5" / >
                Export { exportFormats[selectedFormat].name } <
                /div>
            )
        } <
        /button>

        { /* Quick Export Options */ } <
        div className = "mt-4 flex flex-wrap gap-2 justify-center" >
        <
        button onClick = {
            () => window.print()
        }
        className = "px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-sm flex items-center gap-2" >
        <
        Printer className = "w-4 h-4" / >
        Quick Print <
        /button> <
        button onClick = {
            () => {
                setSelectedFormat('email');
                handleExport();
            }
        }
        className = "px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 text-sm flex items-center gap-2" >
        <
        Mail className = "w-4 h-4" / >
        Email to Family <
        /button> < /
        div > <
        /div> < /
        div >
    );
};

export default ExportEnhancements;