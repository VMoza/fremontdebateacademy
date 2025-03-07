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
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-4xl p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Speech Recording & Grading</h1>
          <p className="mt-2 text-gray-600">Record your speech, get it transcribed, and receive feedback</p>
        </div>
        
        <div className="mt-8">
          <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
            Debate Topic
          </label>
          <input
            id="topic"
            name="topic"
            type="text"
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
        
        <div className="mt-6 p-6 border border-gray-200 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Transcript</h2>
          {transcript ? (
            <div className="whitespace-pre-wrap p-4 bg-gray-50 rounded-md">{transcript}</div>
          ) : (
            <p className="text-gray-500 italic">
              {audioBlob 
                ? "Click 'Transcribe Recording' above to convert your speech to text." 
                : "Your speech transcript will appear here after recording and transcription."}
            </p>
          )}
        </div>
        
        {transcript && !feedback && (
          <div className="mt-6 flex justify-center">
            {gradingError && (
              <div className="p-3 mb-4 text-sm text-red-500 bg-red-50 rounded-md w-full">
                {gradingError}
              </div>
            )}
            <button
              type="button"
              className={`px-6 py-3 rounded-md ${
                isGrading
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
              }`}
              onClick={handleGradeSpeech}
              disabled={isGrading}
            >
              {isGrading ? 'Grading...' : 'Grade Speech'}
            </button>
          </div>
        )}
        
        <div className="mt-6">
          {feedback ? (
            <FeedbackDisplay 
              feedback={feedback} 
              topic={topic}
              transcript={transcript || ""}
              onSaveSuccess={handleSaveSuccess}
            />
          ) : (
            <div className="p-6 border border-gray-200 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Feedback & Scores</h2>
              <p className="text-gray-500 italic">
                {transcript
                  ? "Click 'Grade Speech' above to receive feedback on your speech."
                  : "Your speech feedback and scores will appear here after analysis."}
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-8">
        <Link href="/" className="text-blue-600 hover:text-blue-500">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
} 