'use client';

import React, { useState, useRef, useEffect } from 'react';

interface RecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
}

const Recorder: React.FC<RecorderProps> = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);
  
  const startRecording = async () => {
    try {
      // Reset state
      audioChunksRef.current = [];
      setAudioUrl(null);
      setRecordingTime(0);
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      // Set up event handlers
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        // Combine audio chunks into a single blob
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        
        // Pass the audio blob to the parent component
        onRecordingComplete(audioBlob);
        
        // Stop all audio tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please ensure you have granted permission.');
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };
  
  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="flex flex-col items-center p-6 border rounded-lg bg-white">
      <div className="w-full mb-6 flex justify-center">
        {isRecording ? (
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-red-500 mr-2 animate-pulse"></div>
            <span className="text-lg font-medium">Recording... {formatTime(recordingTime)}</span>
          </div>
        ) : (
          <span className="text-lg font-medium">Ready to record</span>
        )}
      </div>
      
      <div className="flex space-x-4">
        <button
          onClick={startRecording}
          disabled={isRecording}
          className={`px-6 py-3 rounded-full font-medium ${
            isRecording
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-red-600 text-white hover:bg-red-700'
          }`}
        >
          Start Recording
        </button>
        
        <button
          onClick={stopRecording}
          disabled={!isRecording}
          className={`px-6 py-3 rounded-full font-medium ${
            !isRecording
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gray-800 text-white hover:bg-gray-900'
          }`}
        >
          Stop Recording
        </button>
      </div>
      
      {audioUrl && (
        <div className="mt-6 w-full">
          <h3 className="text-lg font-medium mb-2">Recording Preview</h3>
          <audio controls src={audioUrl} className="w-full"></audio>
        </div>
      )}
    </div>
  );
};

export default Recorder; 