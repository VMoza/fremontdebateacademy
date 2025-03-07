'use client';

import React, { useState } from 'react';

interface SpeechToTextProps {
  audioBlob: Blob;
  onTranscriptionComplete: (transcript: string) => void;
}

const SpeechToText: React.FC<SpeechToTextProps> = ({ audioBlob, onTranscriptionComplete }) => {
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const transcribeAudio = async () => {
    setIsTranscribing(true);
    setError(null);
    
    try {
      // Create a FormData object to send the audio file
      const formData = new FormData();
      formData.append('audio', audioBlob);
      
      // Send the audio to our transcription API
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to transcribe audio');
      }
      
      const data = await response.json();
      
      // Pass the transcript to the parent component
      onTranscriptionComplete(data.transcript);
    } catch (err) {
      console.error('Transcription error:', err);
      setError('An error occurred during transcription. Please try again.');
      
      // If there's an error, provide a fallback option to use mock transcripts
      const useFallback = confirm('Transcription failed. Would you like to use a sample transcript instead?');
      
      if (useFallback) {
        // Use a mock transcript as fallback
        const mockTranscripts = [
          `Ladies and gentlemen, today I stand before you to argue that climate change is the most pressing issue of our time. The evidence is overwhelming. Global temperatures have risen by 1.1 degrees Celsius since pre-industrial times, causing more frequent and severe weather events. The Intergovernmental Panel on Climate Change has warned that we have less than a decade to make significant changes to avoid catastrophic consequences. We must act now by transitioning to renewable energy, implementing carbon taxes, and investing in green infrastructure. The cost of inaction far exceeds the cost of addressing this crisis. Thank you.`,
          
          `I firmly believe that education reform is essential for our society's future. Our current system, designed for the industrial age, fails to prepare students for today's rapidly changing world. We need to move away from standardized testing and rote memorization toward critical thinking, creativity, and problem-solving skills. Finland's education model, which emphasizes fewer hours of instruction but deeper learning, has consistently produced excellent results. By investing in teacher training, reducing class sizes, and updating curricula to include digital literacy and emotional intelligence, we can create an education system that truly serves all students and prepares them for the challenges ahead.`,
        ];
        
        // Select a random transcript
        const randomIndex = Math.floor(Math.random() * mockTranscripts.length);
        const mockTranscript = mockTranscripts[randomIndex];
        
        onTranscriptionComplete(mockTranscript);
      }
    } finally {
      setIsTranscribing(false);
    }
  };
  
  return (
    <div className="mt-4">
      {error && (
        <div className="p-4 mb-4 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}
      
      <button
        onClick={transcribeAudio}
        disabled={isTranscribing}
        className={`w-full px-4 py-2 font-medium rounded-md transition-colors ${
          isTranscribing
            ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
        }`}
      >
        {isTranscribing ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Transcribing...
          </div>
        ) : 'Transcribe Recording'}
      </button>
      
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        This will use OpenAI's Whisper API to transcribe your speech.
      </p>
    </div>
  );
};

export default SpeechToText; 