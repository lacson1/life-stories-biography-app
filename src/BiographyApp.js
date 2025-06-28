import React, { useState, useRef } from 'react';
import {
    Book,
    Heart,
    Users,
    MapPin,
    Briefcase,
    Star,
    Save,
    Plus,
    Edit3,
    Camera,
    Download,
    Mic,
    MicOff,
    Play,
    Pause,
    Calendar,
    FileText,
    Image,
    Volume2,
    BookOpen,
    Settings,
    Smartphone,
    Sparkles,
    Search as SearchIcon,
    Clock,
    Award,
    Lightbulb,
    Globe,
    PenTool,
    Palette,
    Shield,
    Target,
    Zap,
    TrendingUp,
    CheckCircle,
    AlertCircle,
    Info,
    Home,
    User,
    Baby,
    GraduationCap,
    Trophy,
    Compass,
    MessageSquare,
    Gift,
    Coffee,
    Sunrise,
    Moon,
    Sun,
    Cloud,
    CloudSnow,
    Flower,
    TreePine,
    Mountain
} from 'lucide-react';
import BookView from './components/BookView';

// Import all new advanced components
import DarkModeToggle from './components/DarkModeToggle';
import useCloudBackup from './hooks/useCloudBackup';
import AIWritingAssistant from './components/AIWritingAssistant';
import FamilyCollaboration from './components/FamilyCollaboration';
import MobileOptimization from './components/MobileOptimization';
import AdvancedSearch from './components/AdvancedSearch';
import ExportEnhancements from './components/ExportEnhancements';
import VoiceTranscription from './components/VoiceTranscription';
import PhotoOrganization from './components/PhotoOrganization';
import ProgressTracker from './components/ProgressTracker';
import SmartSuggestions from './components/SmartSuggestions';
import SaveNotifications from './components/SaveNotifications';

const BiographyApp = ({
        currentUser,
        biographyData,
        onBiographyUpdate,
        onShowDashboard,
        onLogout
    }) => {
        console.log('BiographyApp component is rendering...');

        const [currentSection, setCurrentSection] = useState('overview');
        const [isRecording, setIsRecording] = useState(false);
        const [recordings, setRecordings] = useState(biographyData && biographyData.recordings ? biographyData.recordings : {});
        const [showTimeline, setShowTimeline] = useState(false);
        const [showBookView, setShowBookView] = useState(false);
        const [photos, setPhotos] = useState(biographyData && biographyData.photos ? biographyData.photos : {});

        // New state for advanced features
        const [showAIAssistant, setShowAIAssistant] = useState(false);
        const [showCollaboration, setShowCollaboration] = useState(false);
        const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
        const [showExportEnhancements, setShowExportEnhancements] = useState(false);
        const [showVoiceTranscription, setShowVoiceTranscription] = useState(false);
        const [showPhotoOrganization, setShowPhotoOrganization] = useState(false);
        const [showProgressTracker, setShowProgressTracker] = useState(false);
        const [showSmartSuggestions, setShowSmartSuggestions] = useState(false);
        const [searchResults, setSearchResults] = useState([]);
        const [collaborationData, setCollaborationData] = useState({});
        const [mobileSettings, setMobileSettings] = useState({});

        const fileInputRef = useRef(null);
        const mediaRecorderRef = useRef(null);
        const audioChunksRef = useRef([]);

        const [formData, setFormData] = useState({
            name: currentUser && currentUser.name ? currentUser.name : 'User',
            birthYear: biographyData && biographyData.sections && biographyData.sections.birthYear ? biographyData.sections.birthYear : '',
            overview: biographyData && biographyData.sections && biographyData.sections.aboutMe ? biographyData.sections.aboutMe : '',
            childhood: biographyData && biographyData.sections && biographyData.sections.earlyYears ? biographyData.sections.earlyYears : '',
            family: biographyData && biographyData.sections && biographyData.sections.familyLife ? biographyData.sections.familyLife : '',
            career: biographyData && biographyData.sections && biographyData.sections.workCareer ? biographyData.sections.workCareer : '',
            achievements: biographyData && biographyData.sections && biographyData.sections.proudMoments ? biographyData.sections.proudMoments : '',
            wisdom: biographyData && biographyData.sections && biographyData.sections.lifeLessons ? biographyData.sections.lifeLessons : '',
            memories: biographyData && biographyData.specialMemories ? biographyData.specialMemories : [],
            timeline: biographyData && biographyData.timeline ? biographyData.timeline : [
                { year: new Date().getFullYear() - 30, event: 'Born', category: 'personal' },
                { year: new Date().getFullYear() - 12, event: 'Graduated High School', category: 'education' },
                { year: new Date().getFullYear() - 5, event: 'Started Career', category: 'career' }
            ]
        });

        // Enhanced cloud backup
        const cloudBackup = useCloudBackup(formData, 'biography_data', {
            enableCloudBackup: true,
            onSaveSuccess: (timestamp) => console.log('Saved at:', timestamp),
            onSaveError: (error) => console.error('Save error:', error),
            onCloudSync: (data) => console.log('Cloud synced:', data)
        });

        const sections = [
            { id: 'overview', title: 'About Me', icon: User, desc: 'Your life overview', color: 'text-blue-600' },
            { id: 'childhood', title: 'Early Years', icon: Baby, desc: 'Childhood memories', color: 'text-green-600' },
            { id: 'family', title: 'Family Life', icon: Heart, desc: 'Family and relationships', color: 'text-red-600' },
            { id: 'career', title: 'Work & Career', icon: Briefcase, desc: 'Professional journey', color: 'text-purple-600' },
            { id: 'achievements', title: 'Achievements', icon: Trophy, desc: 'Proud moments', color: 'text-yellow-600' },
            { id: 'wisdom', title: 'Life Lessons', icon: Lightbulb, desc: 'Wisdom to share', color: 'text-indigo-600' }
        ];

        const handleInputChange = (field, value) => {
            setFormData(prev => ({...prev, [field]: value }));

            // Update user biography data
            if (onBiographyUpdate) {
                const sectionMapping = {
                    overview: 'aboutMe',
                    childhood: 'earlyYears',
                    family: 'familyLife',
                    career: 'workCareer',
                    achievements: 'proudMoments',
                    wisdom: 'lifeLessons'
                };

                const sectionKey = sectionMapping[field] || field;
                onBiographyUpdate({
                    sections: {
                        ...biographyData && biographyData.sections,
                        [sectionKey]: value
                    }
                });
            }
        };

        const addMemory = () => {
            const title = prompt("What would you like to call this memory?");
            if (title) {
                const newMemory = { id: Date.now(), title, content: '' };
                setFormData(prev => ({
                    ...prev,
                    memories: [...prev.memories, newMemory]
                }));

                // Update user biography data
                if (onBiographyUpdate) {
                    onBiographyUpdate({
                        specialMemories: [...(biographyData && biographyData.specialMemories || []), newMemory]
                    });
                }
            }
        };

        const updateMemory = (id, content) => {
            setFormData(prev => ({
                ...prev,
                memories: prev.memories.map(memory =>
                    memory.id === id ? {...memory, content } : memory
                )
            }));

            // Update user biography data
            if (onBiographyUpdate) {
                const updatedMemories = (biographyData && biographyData.specialMemories || []).map(memory =>
                    memory.id === id ? {...memory, content } : memory
                );
                onBiographyUpdate({
                    specialMemories: updatedMemories
                });
            }
        };

        const addTimelineEvent = () => {
            const year = prompt("What year?");
            const event = prompt("What happened?");
            const category = prompt("Category (personal/family/career/education):") || 'personal';

            if (year && event) {
                const newTimeline = [...formData.timeline, { year, event, category }].sort((a, b) => a.year - b.year);
                setFormData(prev => ({
                    ...prev,
                    timeline: newTimeline
                }));

                // Update user biography data
                if (onBiographyUpdate) {
                    onBiographyUpdate({
                        timeline: newTimeline
                    });
                }
            }
        };

        const handlePhotoUpload = (sectionId) => {
            fileInputRef.current.click();
            fileInputRef.current.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const newPhoto = {
                            id: Date.now(),
                            url: e.target.result,
                            name: file.name,
                            caption: ''
                        };

                        setPhotos(prev => ({
                            ...prev,
                            [sectionId]: [...(prev[sectionId] || []), newPhoto]
                        }));

                        // Update user biography data
                        if (onBiographyUpdate) {
                            onBiographyUpdate({
                                photos: {
                                    ...(biographyData && biographyData.photos || {}),
                                    [sectionId]: [...((biographyData && biographyData.photos || {})[sectionId] || []), newPhoto]
                                }
                            });
                        }
                    };
                    reader.readAsDataURL(file);
                }
            };
        };

        const updatePhotoCaption = (sectionId, photoId, caption) => {
            setPhotos(prev => ({
                ...prev,
                [sectionId]: prev[sectionId].map(photo =>
                    photo.id === photoId ? {...photo, caption } : photo
                )
            }));

            // Update user biography data
            if (onBiographyUpdate) {
                const updatedPhotos = {
                    ...(biographyData && biographyData.photos || {}),
                    [sectionId]: ((biographyData && biographyData.photos || {})[sectionId] || []).map(photo =>
                        photo.id === photoId ? {...photo, caption } : photo
                    )
                };
                onBiographyUpdate({
                    photos: updatedPhotos
                });
            }
        };

        const startRecording = async(sectionId) => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorderRef.current = new MediaRecorder(stream);
                audioChunksRef.current = [];

                mediaRecorderRef.current.ondataavailable = (event) => {
                    audioChunksRef.current.push(event.data);
                };

                mediaRecorderRef.current.onstop = () => {
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                    const audioUrl = URL.createObjectURL(audioBlob);
                    setRecordings(prev => ({
                        ...prev,
                        [sectionId]: audioUrl
                    }));

                    // Update user biography data
                    if (onBiographyUpdate) {
                        onBiographyUpdate({
                            recordings: {
                                ...(biographyData && biographyData.recordings || {}),
                                [sectionId]: audioUrl
                            }
                        });
                    }

                    stream.getTracks().forEach(track => track.stop());
                };

                mediaRecorderRef.current.start();
                setIsRecording(sectionId);
            } catch (err) {
                alert("Could not access microphone. Please check your browser settings.");
            }
        };

        const stopRecording = () => {
            if (mediaRecorderRef.current && isRecording) {
                mediaRecorderRef.current.stop();
                setIsRecording(false);
            }
        };

        const playRecording = (sectionId) => {
            const audio = new Audio(recordings[sectionId]);
            audio.play();
        };

        const exportBiography = (format) => {
                if (!format) return;

                const generateHTML = () => {
                        const photosHtml = (sectionId) => {
                                const sectionPhotos = photos[sectionId] || [];
                                if (sectionPhotos.length === 0) return '';

                                return `
          <div style="margin: 20px 0;">
            <h4 style="color: #d97706; margin-bottom: 15px;">Photos</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
              ${sectionPhotos.map(photo => `
                <div>
                  <img src="${photo.url}" alt="${photo.caption || 'Memory photo'}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  ${photo.caption ? `<p style="margin-top: 8px; font-style: italic; color: #666;">${photo.caption}</p>` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        `;
      };

      const audioHtml = (sectionId) => {
        const recording = recordings[sectionId];
        if (!recording) return '';
        
        return `
          <div style="margin: 20px 0; padding: 15px; background: #f3f4f6; border-radius: 8px;">
            <h4 style="color: #7c3aed; margin-bottom: 10px;">Voice Recording</h4>
            <audio controls style="width: 100%;">
              <source src="${recording}" type="audio/wav">
              Your browser does not support the audio element.
            </audio>
          </div>
        `;
      };

      return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>The Life Story of ${formData.name}</title>
          <style>
            body { 
              font-family: Georgia, serif; 
              line-height: 1.6; 
              max-width: 800px; 
              margin: 0 auto; 
              padding: 40px 20px; 
              background: linear-gradient(135deg, #fef7e0 0%, #fed7aa 100%);
              color: #374151;
            }
            .header { 
              text-align: center; 
              margin-bottom: 50px; 
              padding: 30px; 
              background: white; 
              border-radius: 15px; 
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .header h1 { 
              font-size: 2.5em; 
              color: #d97706; 
              margin: 0 0 10px 0; 
            }
            .header p { 
              font-size: 1.2em; 
              color: #6b7280; 
              margin: 0;
            }
            .section { 
              margin: 40px 0; 
              padding: 30px; 
              background: white; 
              border-radius: 15px; 
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .section h2 { 
              color: #d97706; 
              border-bottom: 3px solid #fbbf24; 
              padding-bottom: 10px; 
              margin-bottom: 20px;
            }
            .section p { 
              font-size: 1.1em; 
              margin-bottom: 15px; 
              white-space: pre-wrap;
            }
            .timeline { 
              margin: 30px 0; 
            }
            .timeline-item { 
              display: flex; 
              margin: 20px 0; 
              align-items: center;
            }
            .timeline-year { 
              background: #d97706; 
              color: white; 
              padding: 10px 15px; 
              border-radius: 50%; 
              font-weight: bold; 
              margin-right: 20px; 
              min-width: 80px; 
              text-align: center;
            }
            .timeline-event { 
              background: #f9fafb; 
              padding: 15px 20px; 
              border-radius: 10px; 
              flex: 1;
            }
            .memory { 
              margin: 30px 0; 
              padding: 25px; 
              background: #fef2f2; 
              border-left: 5px solid #ef4444; 
              border-radius: 0 10px 10px 0;
            }
            .memory h3 { 
              color: #dc2626; 
              margin-top: 0; 
            }
            @media print { 
              body { background: white; } 
              .section, .header { box-shadow: none; border: 1px solid #e5e7eb; } 
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>The Life Story of ${formData.name}</h1>
            <p>A legacy preserved for family and future generations</p>
            <p><em>Created on ${new Date().toLocaleDateString()}</em></p>
          </div>

          ${sections.map(section => {
            const content = formData[section.id];
            if (!content && !(photos[section.id] && photos[section.id].length) && !recordings[section.id]) return '';
            
            return `
              <div class="section">
                <h2>${section.title}</h2>
                ${content ? `<p>${content}</p>` : ''}
                ${photosHtml(section.id)}
                ${audioHtml(section.id)}
              </div>
            `;
          }).join('')}

          ${formData.memories.length > 0 ? `
            <div class="section">
              <h2>Special Memories</h2>
              ${formData.memories.map(memory => `
                <div class="memory">
                  <h3>${memory.title}</h3>
                  ${memory.content ? `<p>${memory.content}</p>` : ''}
                  ${photosHtml(`memory-${memory.id}`)}
                  ${audioHtml(`memory-${memory.id}`)}
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${formData.timeline.length > 0 ? `
            <div class="section">
              <h2>Life Timeline</h2>
              <div class="timeline">
                ${formData.timeline.map(event => `
                  <div class="timeline-item">
                    <div class="timeline-year">${event.year}</div>
                    <div class="timeline-event">
                      <strong>${event.event}</strong>
                      <br><em>${event.category}</em>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <div class="section" style="text-align: center; font-style: italic; color: #6b7280;">
            <p>This biography was lovingly created to preserve precious memories and share wisdom with future generations.</p>
            <p>"The stories we tell become the legacy we leave."</p>
          </div>
        </body>
        </html>
      `;
    };

    const generateTextContent = () => {
      let content = `THE LIFE STORY OF ${formData.name.toUpperCase()}\n`;
      content += `${'='.repeat(content.length - 1)}\n\n`;
      content += `Created on ${new Date().toLocaleDateString()}\n`;
      content += `A legacy preserved for family and future generations\n\n`;

      sections.forEach(section => {
        const sectionContent = formData[section.id];
        if (sectionContent) {
          content += `${section.title.toUpperCase()}\n`;
          content += `${'-'.repeat(section.title.length)}\n\n`;
          content += `${sectionContent}\n\n`;
          
          if (photos[section.id] && photos[section.id].length > 0) {
            content += `Photos in this section: ${photos[section.id].length}\n`;
            photos[section.id].forEach(photo => {
              if (photo.caption) content += `- ${photo.caption}\n`;
            });
            content += '\n';
          }
          
          if (recordings[section.id]) {
            content += `This section includes a voice recording.\n\n`;
          }
        }
      });

      if (formData.memories.length > 0) {
        content += `SPECIAL MEMORIES\n`;
        content += `${'-'.repeat(15)}\n\n`;
        formData.memories.forEach(memory => {
          content += `${memory.title}\n`;
          if (memory.content) {
            content += `${memory.content}\n\n`;
          }
        });
      }

      if (formData.timeline.length > 0) {
        content += `LIFE TIMELINE\n`;
        content += `${'-'.repeat(13)}\n\n`;
        formData.timeline.forEach(event => {
          content += `${event.year}: ${event.event} (${event.category})\n`;
        });
        content += '\n';
      }

      content += `\n"The stories we tell become the legacy we leave."\n`;
      content += `\nThis biography was lovingly created to preserve precious memories\nand share wisdom with future generations.`;

      return content;
    };

    const downloadFile = (content, filename, mimeType) => {
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };

    const safeName = formData.name.replace(/[^a-zA-Z0-9]/g, '_');
    
    switch (format) {
      case 'PDF':
        // For PDF, we'll generate HTML and instruct to print as PDF
        const pdfHtml = generateHTML();
        downloadFile(pdfHtml, `${safeName}_Biography.html`, 'text/html');
        setTimeout(() => {
          alert('📄 HTML file downloaded! Open it in your browser and use "Print > Save as PDF" to create a PDF version.');
        }, 500);
        break;
        
      case 'Word':
        // Generate RTF format which Word can open
        const rtfContent = `{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Times New Roman;}}
\\f0\\fs24 ${generateTextContent().replace(/\n/g, '\\par ')}}`;
        downloadFile(rtfContent, `${safeName}_Biography.rtf`, 'application/rtf');
        break;
        
      case 'Web':
        const webHtml = generateHTML();
        downloadFile(webHtml, `${safeName}_Biography.html`, 'text/html');
        break;
        
      case 'Email':
        const emailContent = generateTextContent();
        const mailtoLink = `mailto:?subject=The Life Story of ${formData.name}&body=${encodeURIComponent(emailContent.substring(0, 1500) + '...\n\n[Full biography attached as separate file]')}`;
        window.open(mailtoLink);
        // Also download the full content
        downloadFile(emailContent, `${safeName}_Biography.txt`, 'text/plain');
        break;
        
      default:
        alert('Please select an export format');
    }
  };

  // Handlers for new features
  const handleAISuggestion = (suggestion) => {
    const currentContent = formData[currentSection] || '';
    const newContent = currentContent + (currentContent ? '\n\n' : '') + suggestion;
    handleInputChange(currentSection, newContent);
  };

  const handleTranscriptionComplete = (transcriptionData) => {
    handleAISuggestion(transcriptionData.text);
    setShowVoiceTranscription(false);
  };

  const handlePhotosUpdate = (updatedPhotos) => {
    setPhotos(prev => ({ ...prev, [currentSection]: updatedPhotos }));
  };

  const handleSmartSuggestion = (suggestionText) => {
    const currentContent = formData[currentSection] || '';
    const newContent = currentContent + (currentContent ? ' ' : '') + suggestionText;
    handleInputChange(currentSection, newContent);
    setShowSmartSuggestions(false);
  };

  const currentSectionData = sections.find(s => s.id === currentSection);
  const currentSectionId = currentSection.startsWith('memory-') ? currentSection : currentSection;

  // Modal Components
  if (showAIAssistant) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <AIWritingAssistant
          section={currentSectionData && currentSectionData.title}
          currentText={formData[currentSection] || ''}
          onSuggestion={handleAISuggestion}
          onClose={() => setShowAIAssistant(false)}
        />
      </div>
    );
  }

  if (showCollaboration) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <FamilyCollaboration
          onCollaborationChange={setCollaborationData}
          onClose={() => setShowCollaboration(false)}
        />
      </div>
    );
  }

  if (showAdvancedSearch) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <AdvancedSearch
          data={formData}
          onResults={setSearchResults}
          onClose={() => setShowAdvancedSearch(false)}
        />
      </div>
    );
  }

  if (showExportEnhancements) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <ExportEnhancements
          data={formData}
          photos={photos}
          onClose={() => setShowExportEnhancements(false)}
        />
      </div>
    );
  }

  if (showVoiceTranscription) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <VoiceTranscription
          onTranscriptionComplete={handleTranscriptionComplete}
          onClose={() => setShowVoiceTranscription(false)}
        />
      </div>
    );
  }

  if (showPhotoOrganization) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <PhotoOrganization
          photos={Object.values(photos).flat()}
          onPhotosUpdate={handlePhotosUpdate}
          onClose={() => setShowPhotoOrganization(false)}
        />
      </div>
    );
  }

  if (showProgressTracker) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="relative">
          <ProgressTracker
            formData={formData}
            photos={photos}
            recordings={recordings}
          />
          <button
            onClick={() => setShowProgressTracker(false)}
            className="absolute top-4 right-4 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 p-2 rounded-full shadow-lg"
          >
            ×
          </button>
        </div>
      </div>
    );
  }

  if (showBookView) {
    return (
      <BookView 
        formData={formData}
        photos={photos}
        recordings={recordings}
        onClose={() => setShowBookView(false)}
      />
    );
  }

  if (showTimeline) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
        <div className="bg-white shadow-sm border-b-4 border-amber-200">
          <div className="max-w-6xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
                    <Calendar className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 p-1 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full">
                    <Clock className="h-3 w-3 text-white" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-bold text-gray-800">Life Timeline</h1>
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 text-purple-500" />
                      <span className="text-sm font-medium text-purple-600">Journey View</span>
                    </div>
                  </div>
                  <p className="text-lg text-gray-600 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    Your journey through the years
                  </p>
                </div>
              </div>
              <div className="flex space-x-4">
                <button 
                  onClick={addTimelineEvent}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-5 w-5" />
                  <span>Add Event</span>
                </button>
                <button 
                  onClick={() => setShowTimeline(false)}
                  className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                >
                  Back to Story
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="space-y-8">
              {formData.timeline.map((event, index) => (
                <div key={index} className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                      event.category === 'family' ? 'bg-pink-500' :
                      event.category === 'career' ? 'bg-blue-500' :
                      event.category === 'education' ? 'bg-green-500' :
                      'bg-purple-500'
                    }`}>
                      {event.year}
                    </div>
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{event.event}</h3>
                    <p className="text-gray-600 capitalize">{event.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <MobileOptimization onMobileChange={setMobileSettings}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/*"
      />
      
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Book className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Life Stories</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Create your biography</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center gap-3">
                {/* User Info with Avatar */}
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-lg">
                  {currentUser && currentUser.avatar && (
                    <img 
                      src={currentUser.avatar} 
                      alt={currentUser.name}
                      className="h-6 w-6 rounded-full"
                    />
                  )}
                  <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{formData.name}</span>
                </div>
                
                {/* User Management Buttons */}
                <button
                  onClick={onShowDashboard}
                  className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                  title="User Dashboard"
                >
                  <Users className="h-4 w-4" />
                  <span className="text-sm font-medium">Dashboard</span>
                </button>
                
                <DarkModeToggle />
                <div className="bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-lg">
                  <SaveNotifications
                    saveStatus={cloudBackup.saveStatus}
                    lastSaved={cloudBackup.lastSaved}
                    versions={cloudBackup.versions}
                    onRestoreVersion={(versionData) => setFormData(versionData)}
                  />
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowBookView(true)}
                  className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Read</span>
                </button>
                <button 
                  onClick={() => setShowTimeline(true)}
                  className="bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm font-medium"
                >
                  <Clock className="h-4 w-4" />
                  <span>Timeline</span>
                </button>
                <button
                  onClick={() => setShowExportEnhancements(true)}
                  className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm font-medium"
                >
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </button>
                <button
                  onClick={() => setShowProgressTracker(true)}
                  className="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 text-sm font-medium"
                >
                  <TrendingUp className="h-4 w-4" />
                  <span>Progress</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Compass className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Sections</h2>
              </div>
                              <nav className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const hasContent = formData[section.id] && formData[section.id].length > 0;
                  const hasPhotos = photos[section.id] && photos[section.id].length > 0;
                  const hasRecording = recordings[section.id];
                  
                  return (
                    <button
                      key={section.id}
                      onClick={() => setCurrentSection(section.id)}
                      className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${
                        currentSection === section.id
                          ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 text-blue-900 dark:text-blue-100'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-transparent text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${
                            currentSection === section.id 
                              ? 'bg-white dark:bg-gray-800' 
                              : 'bg-gray-100 dark:bg-gray-600'
                          }`}>
                            <Icon className={`h-5 w-5 ${
                              currentSection === section.id ? section.color : 'text-gray-500 dark:text-gray-400'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{section.title}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{section.desc}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {hasContent && <CheckCircle className="h-3 w-3 text-green-500" />}
                          {hasPhotos && <Image className="h-3 w-3 text-blue-500" />}
                          {hasRecording && <Volume2 className="h-3 w-3 text-purple-500" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </nav>

              {/* Special Memories Section */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900 dark:to-rose-900 rounded-xl">
                      <Gift className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Special Memories</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Cherished moments</p>
                    </div>
                  </div>
                  <button
                    onClick={addMemory}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-2 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-sm"
                    title="Add a new special memory"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.memories.map((memory) => {
                    const memoryId = `memory-${memory.id}`;
                    const hasPhotos = photos[memoryId] && photos[memoryId].length > 0;
                    const hasRecording = recordings[memoryId];
                    
                    return (
                      <button
                        key={memory.id}
                        onClick={() => setCurrentSection(memoryId)}
                        className={`w-full text-left p-4 rounded-xl text-sm transition-all duration-300 transform hover:scale-[1.01] ${
                          currentSection === memoryId
                            ? 'bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/30 dark:to-rose-900/30 text-pink-900 dark:text-pink-100 border-2 border-pink-200 dark:border-pink-700 shadow-md'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-300 border-2 border-transparent hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{memory.title}</span>
                          <div className="flex space-x-1">
                            {hasPhotos && <Image className="h-3 w-3 text-blue-500" />}
                            {hasRecording && <Volume2 className="h-3 w-3 text-purple-500" />}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
              {currentSection.startsWith('memory-') ? (
                // Special Memory Editor
                (() => {
                  const memoryId = parseInt(currentSection.split('-')[1]);
                  const memory = formData.memories.find(m => m.id === memoryId);
                  const sectionPhotos = photos[currentSection] || [];
                  
                  return (
                    <div>
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/20">
                            <Heart className="h-8 w-8 text-red-600 dark:text-red-400" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{memory && memory.title}</h2>
                            <p className="text-gray-600 dark:text-gray-400">Special memory</p>
                          </div>
                        </div>
                                            <div className="flex gap-2">
                      <button
                        onClick={() => handlePhotoUpload(currentSection)}
                        className="bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1.5 text-xs font-medium"
                        title="Add Photo"
                      >
                        <Camera className="h-3.5 w-3.5" />
                        <span>Add Photo</span>
                      </button>
                      {isRecording === currentSection ? (
                        <button
                          onClick={stopRecording}
                          className="bg-red-600 text-white px-3 py-1.5 rounded-md hover:bg-red-700 transition-colors flex items-center gap-1.5 text-xs font-medium animate-pulse"
                        >
                          <MicOff className="h-3.5 w-3.5" />
                          <span>Stop Recording</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => startRecording(currentSection)}
                          className="bg-purple-600 text-white px-3 py-1.5 rounded-md hover:bg-purple-700 transition-colors flex items-center gap-1.5 text-xs font-medium"
                          title="Record Voice"
                        >
                          <Mic className="h-3.5 w-3.5" />
                          <span>Record Voice</span>
                        </button>
                      )}
                      {recordings[currentSection] && (
                        <button
                          onClick={() => playRecording(currentSection)}
                          className="bg-green-600 text-white px-3 py-1.5 rounded-md hover:bg-green-700 transition-colors flex items-center gap-1.5 text-xs font-medium"
                          title="Play"
                        >
                          <Play className="h-3.5 w-3.5" />
                          <span>Play</span>
                        </button>
                      )}
                    </div>
                      </div>

                      {/* Photos for this memory */}
                      {sectionPhotos.length > 0 && (
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold text-gray-800 mb-4">Photos</h3>
                          <div className="grid grid-cols-2 gap-4">
                            {sectionPhotos.map((photo) => (
                              <div key={photo.id} className="space-y-2">
                                <img 
                                  src={photo.url} 
                                  alt={photo.caption || photo.name}
                                  className="w-full h-48 object-cover rounded-lg shadow"
                                />
                                <input
                                  type="text"
                                  placeholder="Add a caption for this photo..."
                                  value={photo.caption}
                                  onChange={(e) => updatePhotoCaption(currentSection, photo.id, e.target.value)}
                                  className="w-full p-2 border rounded text-sm"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <textarea
                        value={(memory && memory.content) || ''}
                        onChange={(e) => updateMemory(memoryId, e.target.value)}
                        placeholder="Share this special memory in detail. What happened? Who was there? How did it make you feel? Why is it important to you?"
                        className="w-full h-80 p-6 border border-gray-300 dark:border-gray-600 rounded-lg text-base leading-relaxed resize-none focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all bg-white dark:bg-gray-800"
                      />
                      <div className="mt-6 p-6 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-2xl border border-pink-200 dark:border-pink-700">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-pink-100 dark:bg-pink-800 rounded-lg">
                            <Heart className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-pink-900 dark:text-pink-100 mb-2">Memory Tip</h4>
                            <p className="text-pink-800 dark:text-pink-200 leading-relaxed">
                              Take your time to capture every detail of this precious memory. Include emotions, sensory details, and why this moment matters to you.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()
              ) : (
                // Regular Section Editor
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
                        {React.createElement(currentSectionData.icon, { 
                          className: `h-8 w-8 ${currentSectionData.color}` 
                        })}
                      </div>
                      <div>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{currentSectionData.title}</h2>
                        <p className="text-gray-600 dark:text-gray-400">{currentSectionData.desc}</p>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handlePhotoUpload(currentSection)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                      >
                        <Camera className="h-4 w-4" />
                        <span>Add Photo</span>
                      </button>
                      {isRecording === currentSection ? (
                        <button
                          onClick={stopRecording}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                        >
                          <MicOff className="h-4 w-4" />
                          <span>Stop Recording</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => startRecording(currentSection)}
                          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                        >
                          <Mic className="h-4 w-4" />
                          <span>Record Voice</span>
                        </button>
                      )}
                      {recordings[currentSection] && (
                        <button
                          onClick={() => playRecording(currentSection)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                        >
                          <Play className="h-4 w-4" />
                          <span>Play</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Photos for this section */}
                                        {photos[currentSection] && photos[currentSection].length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Photos</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {photos[currentSection].map((photo) => (
                          <div key={photo.id} className="space-y-2">
                            <img 
                              src={photo.url} 
                              alt={photo.caption || photo.name}
                              className="w-full h-48 object-cover rounded-lg shadow"
                            />
                            <input
                              type="text"
                              placeholder="Add a caption for this photo..."
                              value={photo.caption}
                              onChange={(e) => updatePhotoCaption(currentSection, photo.id, e.target.value)}
                              className="w-full p-2 border rounded text-sm"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="relative">
                    <textarea
                      value={formData[currentSection]}
                      onChange={(e) => handleInputChange(currentSection, e.target.value)}
                      placeholder={getSectionPlaceholder(currentSection)}
                      className="w-full h-80 p-6 border border-gray-300 dark:border-gray-600 rounded-lg text-base leading-relaxed resize-none focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all bg-white dark:bg-gray-800"
                    />
                    <button
                      onClick={() => setShowSmartSuggestions(!showSmartSuggestions)}
                      className="absolute top-4 right-4 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                      title="Smart Suggestions"
                    >
                      <Sparkles className="h-4 w-4" />
                    </button>
                    {showSmartSuggestions && (
                      <div className="absolute top-16 right-4 z-10">
                        <SmartSuggestions
                          currentSection={currentSection}
                          currentText={formData[currentSection] || ''}
                          onSuggestionClick={handleSmartSuggestion}
                          onClose={() => setShowSmartSuggestions(false)}
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl border border-amber-200 dark:border-amber-700">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-amber-100 dark:bg-amber-800 rounded-lg">
                        <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">Writing Tip</h4>
                        <p className="text-amber-800 dark:text-amber-200 leading-relaxed">
                          {getSectionTip(currentSection)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* AI Writing Assistant Integration */}
                  <div className="mt-6 flex justify-center">
                    <button
                      onClick={() => setShowAIAssistant(true)}
                      className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-100 to-violet-100 dark:from-purple-900 dark:to-violet-900 text-purple-700 dark:text-purple-300 rounded-xl hover:from-purple-200 hover:to-violet-200 dark:hover:from-purple-800 dark:hover:to-violet-800 transition-all duration-200 transform hover:scale-105 shadow-md border border-purple-200 dark:border-purple-700"
                    >
                      <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">
                        <Sparkles className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <span className="font-semibold">Get Writing Help</span>
                        <p className="text-xs opacity-75">AI-powered suggestions and prompts</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </MobileOptimization>
  );
};

const getSectionPlaceholder = (section) => {
  const placeholders = {
    overview: "Tell us about yourself. Where and when were you born? What kind of person are you? What are you most proud of in your life?",
    childhood: "What was your childhood like? Where did you grow up? What games did you play? What were your favorite memories from being young?",
    family: "Tell us about your family. How did you meet your spouse? What was your wedding like? What do you want your children and grandchildren to know about family?",
    career: "What work did you do? What jobs did you have? What did you enjoy most about working? What challenges did you overcome?",
    achievements: "What accomplishments are you most proud of? What goals did you achieve? What challenges did you overcome that made you stronger?",
    wisdom: "What advice would you give to your children and grandchildren? What have you learned about life? What do you want them to remember?"
  };
  return placeholders[section] || "Share your thoughts and memories here...";
};

const getSectionTip = (section) => {
  const tips = {
    overview: "Start with the basics and paint a picture of who you are. This will help your family understand your personality and character.",
    childhood: "Include sensory details - what did things smell, sound, or look like? These details bring memories to life.",
    family: "Share both the joyful moments and the challenges. Real stories help your family understand your journey.",
    career: "Don't just list jobs - explain what you learned and how work shaped who you became.",
    achievements: "Include both big and small victories. Sometimes the small ones mean the most.",
    wisdom: "Think about lessons you learned the hard way, or insights that came with age and experience."
  };
  return tips[section] || "Take your time and write from the heart. Your family will treasure these words.";
};

export default BiographyApp;