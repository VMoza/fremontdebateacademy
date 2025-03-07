'use client';

import Link from "next/link";
import { useState } from "react";
import Recorder from "@/components/Recorder";
import SpeechToText from "@/components/SpeechToText";
import FeedbackDisplay from "@/components/FeedbackDisplay";

export default function SpeechPage() {
  const [topic, setTopic] = useState("");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<any | null>(null);
  const [isGrading, setIsGrading] = useState(false);
  const [gradingError, setGradingError] = useState<string | null>(null);
  
  const handleRecordingComplete = (blob: Blob) => {
    setAudioBlob(blob);
    // Reset transcript and feedback when a new recording is made
    setTranscript(null);
    setFeedback(null);
    setGradingError(null);
  };
  
  const handleTranscriptionComplete = (text: string) => {
    setTranscript(text);
    setFeedback(null);
    setGradingError(null);
  };
  
  const handleGradeSpeech = async () => {
    if (!transcript) return;
    
    setIsGrading(true);
    setGradingError(null);
    
    try {
      const response = await fetch('/api/grade-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          transcript,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to grade speech');
      }
      
      const data = await response.json();
      setFeedback(data);
    } catch (error) {
      console.error('Error grading speech:', error);
      setGradingError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsGrading(false);
    }
  };
  
  const handleSaveSuccess = () => {
    // Reset the form after successful save
    setTopic("");
    setAudioBlob(null);
    setTranscript(null);
    setFeedback(null);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">
            <span className="gradient-text">Speech Recording</span> & Grading
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Record your speech, get it transcribed, and receive detailed feedback to improve your debate skills
          </p>
        </div>
        
        <div className="card animate-fade-in mb-8">
          <div className="mb-6">
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Debate Topic
            </label>
            <input
              id="topic"
              name="topic"
              type="text"
              className="input-field"
              placeholder="Enter your debate topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          
          <div className="mt-6">
            <Recorder onRecordingComplete={handleRecordingComplete} />
            
            {audioBlob && !transcript && (
              <SpeechToText 
                audioBlob={audioBlob} 
                onTranscriptionComplete={handleTranscriptionComplete} 
              />
            )}
          </div>
        </div>
        
        <div className="card animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-xl font-semibold mb-4">Transcript</h2>
          {transcript ? (
            <div className="whitespace-pre-wrap p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              {transcript}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 italic">
              {audioBlob 
                ? "Click 'Transcribe Recording' above to convert your speech to text." 
                : "Your speech transcript will appear here after recording and transcription."}
            </p>
          )}
        </div>
        
        {transcript && !feedback && (
          <div className="mt-6 flex justify-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {gradingError && (
              <div className="p-4 mb-4 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800 w-full">
                {gradingError}
              </div>
            )}
            <button
              type="button"
              className={`btn-primary px-6 py-3 ${
                isGrading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              onClick={handleGradeSpeech}
              disabled={isGrading}
            >
              {isGrading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing Speech...
                </div>
              ) : 'Grade Speech'}
            </button>
          </div>
        )}
        
        <div className="mt-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          {feedback ? (
            <FeedbackDisplay 
              feedback={feedback} 
              topic={topic}
              transcript={transcript || ""}
              onSaveSuccess={handleSaveSuccess}
            />
          ) : (
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Feedback & Scores</h2>
              <p className="text-gray-500 dark:text-gray-400 italic">
                {transcript
                  ? "Click 'Grade Speech' above to receive feedback on your speech."
                  : "Your speech feedback and scores will appear here after analysis."}
              </p>
            </div>
          )}
        </div>
        
        <div className="mt-8 flex justify-center">
          <Link href="/dashboard" className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 flex items-center mr-4">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
          <Link href="/" className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </Link>
        </div>
      </div>
    </div>
  );
} 