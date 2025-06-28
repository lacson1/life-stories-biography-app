import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Play, Pause, FileText, Edit3, Save, RotateCcw, Volume2 } from 'lucide-react';

const VoiceTranscription = ({ onTranscriptionComplete, onClose }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [transcription, setTranscription] = useState('');
    const [editedText, setEditedText] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [audioURL, setAudioURL] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const [confidence, setConfidence] = useState(0);

    const mediaRecorderRef = useRef(null);
    const audioRef = useRef(null);
    const recognitionRef = useRef(null);
    const chunksRef = useRef([]);

    // Initialize speech recognition
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();

            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                let finalTranscript = '';
                let interimTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    const confidence = event.results[i][0].confidence;

                    if (event.results[i].isFinal) {
                        finalTranscript += transcript;
                        setConfidence(confidence || 0.8);
                    } else {
                        interimTranscript += transcript;
                    }
                }

                setTranscription(prev => prev + finalTranscript);
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsTranscribing(false);
            };

            recognitionRef.current.onend = () => {
                setIsTranscribing(false);
            };
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    const startRecording = async() => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            mediaRecorderRef.current = new MediaRecorder(stream);
            chunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
                const url = URL.createObjectURL(blob);
                setAudioURL(url);

                // Start transcription process
                simulateTranscription();
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);

            // Start real-time transcription if available
            if (recognitionRef.current) {
                recognitionRef.current.start();
                setIsTranscribing(true);
            }

        } catch (error) {
            console.error('Error starting recording:', error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);

            // Stop all tracks
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }

        if (recognitionRef.current && isTranscribing) {
            recognitionRef.current.stop();
        }
    };

    // Simulate AI transcription for demo purposes
    const simulateTranscription = async() => {
        setIsTranscribing(true);

        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 2000));

        // If no real transcription was captured, use a demo transcription
        if (!transcription.trim()) {
            const demoText = "This is a sample transcription of your voice recording. In a real implementation, this would be the actual transcribed text from your audio using advanced speech-to-text technology.";
            setTranscription(demoText);
            setConfidence(0.92);
        }

        setEditedText(transcription);
        setIsTranscribing(false);
    };

    const playAudio = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play();
                setIsPlaying(true);
            }
        }
    };

    const handleSave = () => {
        const finalText = isEditing ? editedText : transcription;
        if (onTranscriptionComplete) {
            onTranscriptionComplete({
                text: finalText,
                audioURL,
                confidence,
                timestamp: new Date().toISOString()
            });
        }
    };

    const resetRecording = () => {
        setTranscription('');
        setEditedText('');
        setAudioURL('');
        setIsEditing(false);
        setConfidence(0);
        if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    };

    return ( <
        div className = "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-lg max-w-2xl" >
        <
        div className = "flex items-center justify-between mb-6" >
        <
        div className = "flex items-center gap-2" >
        <
        Mic className = "w-5 h-5 text-blue-600 dark:text-blue-400" / >
        <
        h3 className = "font-semibold text-gray-900 dark:text-gray-100" > Voice to Text < /h3> < /
        div > <
        button onClick = { onClose }
        className = "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" > ×
        <
        /button> < /
        div >

        { /* Recording Controls */ } <
        div className = "text-center mb-6" >
        <
        div className = "flex items-center justify-center gap-4 mb-4" > {!isRecording ? ( <
                button onClick = { startRecording }
                className = "w-16 h-16 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors shadow-lg" >
                <
                Mic className = "w-8 h-8" / >
                <
                /button>
            ) : ( <
                button onClick = { stopRecording }
                className = "w-16 h-16 bg-gray-500 hover:bg-gray-600 text-white rounded-full flex items-center justify-center transition-colors shadow-lg animate-pulse" >
                <
                MicOff className = "w-8 h-8" / >
                <
                /button>
            )
        }

        {
            audioURL && ( <
                button onClick = { playAudio }
                className = "w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors" > { isPlaying ? < Pause className = "w-6 h-6" / > : < Play className = "w-6 h-6" / > } <
                /button>
            )
        }

        <
        button onClick = { resetRecording }
        className = "w-12 h-12 bg-gray-500 hover:bg-gray-600 text-white rounded-full flex items-center justify-center transition-colors" >
        <
        RotateCcw className = "w-6 h-6" / >
        <
        /button> < /
        div >

        <
        p className = "text-sm text-gray-600 dark:text-gray-400" > { isRecording ? 'Recording... Click to stop' : 'Click the microphone to start recording' } <
        /p>

        {
            isTranscribing && ( <
                div className = "mt-2 flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400" >
                <
                div className = "w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" > < /div> <
                span className = "text-sm" > Transcribing audio... < /span> < /
                div >
            )
        } <
        /div>

        { /* Audio Player */ } {
            audioURL && ( <
                audio ref = { audioRef }
                src = { audioURL }
                onEnded = {
                    () => setIsPlaying(false)
                }
                className = "hidden" /
                >
            )
        }

        { /* Transcription Results */ } {
            transcription && ( <
                    div className = "space-y-4" >
                    <
                    div className = "flex items-center justify-between" >
                    <
                    div className = "flex items-center gap-2" >
                    <
                    FileText className = "w-4 h-4 text-green-600 dark:text-green-400" / >
                    <
                    h4 className = "font-medium text-gray-900 dark:text-gray-100" > Transcription < /h4> {
                    confidence > 0 && ( <
                        span className = { `px-2 py-1 rounded text-xs ${
                  confidence > 0.8 ? 'bg-green-100 text-green-800' :
                  confidence > 0.6 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }` } > { Math.round(confidence * 100) } % confidence <
                        /span>
                    )
                } <
                /div> <
            button onClick = {
                () => setIsEditing(!isEditing)
            }
            className = "flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-sm hover:bg-blue-200 dark:hover:bg-blue-800" >
                <
                Edit3 className = "w-4 h-4" / > { isEditing ? 'Preview' : 'Edit' } <
                /button> < /
            div >

                {
                    isEditing ? ( <
                        textarea value = { editedText }
                        onChange = {
                            (e) => setEditedText(e.target.value)
                        }
                        className = "w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder = "Edit your transcription here..." /
                        >
                    ) : ( <
                        div className = "p-3 bg-gray-50 dark:bg-gray-700 rounded-lg" >
                        <
                        p className = "text-gray-900 dark:text-gray-100 whitespace-pre-wrap" > { editedText || transcription } <
                        /p> < /
                        div >
                    )
                }

            { /* Quick Edit Suggestions */ } <
            div className = "space-y-2" >
                <
                h5 className = "text-sm font-medium text-gray-700 dark:text-gray-300" > Quick Fixes < /h5> <
            div className = "flex flex-wrap gap-2" >
                <
                button onClick = {
                    () => setEditedText(prev => prev.replace(/\bi\b/g, 'I'))
                }
            className = "px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded text-sm hover:bg-yellow-200 dark:hover:bg-yellow-800" >
                Fix Capitalization <
                /button> <
            button onClick = {
                () => setEditedText(prev => prev.replace(/\s+/g, ' ').trim())
            }
            className = "px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded text-sm hover:bg-yellow-200 dark:hover:bg-yellow-800" >
                Remove Extra Spaces <
                /button> <
            button onClick = {
                () => setEditedText(prev => prev.replace(/([.!?])\s*([a-z])/g, (match, p1, p2) => p1 + ' ' + p2.toUpperCase()))
            }
            className = "px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded text-sm hover:bg-yellow-200 dark:hover:bg-yellow-800" >
                Fix Sentences <
                /button> < /
            div > <
                /div>

            { /* Action Buttons */ } <
            div className = "flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-600" >
                <
                button onClick = { handleSave }
            className = "flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors" >
                <
                Save className = "w-4 h-4" / >
                Save Transcription <
                /button> <
            button onClick = {
                () => navigator.clipboard.writeText(editedText || transcription)
            }
            className = "px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors" >
                Copy Text <
                /button> < /
            div > <
                /div>
        )
    }

    { /* Tips */ } <
    div className = "mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg" >
        <
        h5 className = "text-sm font-medium text-blue-900 dark:text-blue-100 mb-2" >
        <
        Volume2 className = "w-4 h-4 inline mr-1" / >
        Tips
    for Better Transcription <
        /h5> <
    ul className = "text-xs text-blue-700 dark:text-blue-300 space-y-1" >
        <
        li > •Speak clearly and at a moderate pace < /li> <
    li > •Minimize background noise < /li> <
    li > •Use a good quality microphone
    if available < /li> <
    li > •Pause between sentences
    for better accuracy < /li> <
    li > •Review and edit the transcription before saving < /li> < /
    ul > <
        /div> < /
    div >
);
};

export default VoiceTranscription;