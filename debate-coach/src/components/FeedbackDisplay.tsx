'use client';

import React, { useState } from 'react';
import { speechService } from '@/services/speechService';
import { useRouter } from 'next/navigation';

interface Criterion {
  score: number;
  feedback: string;
  suggestions?: string;
}

interface Feedback {
  criteria: {
    content: Criterion;
    style: Criterion;
    strategy: Criterion;
    overall: Criterion;
  };
  totalScore: number;
  keyTakeaways: string[];
}

interface FeedbackDisplayProps {
  feedback: Feedback;
  topic: string;
  transcript: string;
  onSaveSuccess?: () => void;
}

const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ 
  feedback, 
  topic, 
  transcript,
  onSaveSuccess 
}) => {
  const { criteria, totalScore, keyTakeaways } = feedback;
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const router = useRouter();
  
  // Calculate the percentage for the progress bar
  const getScorePercentage = (score: number, maxScore: number) => {
    return (score / maxScore) * 100;
  };
  
  // Determine color based on score percentage
  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  const handleSaveResults = async () => {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    
    try {
      console.log('Saving speech with data:', { topic, transcript, feedback, score: totalScore });
      
      const { data, error } = await speechService.saveSpeech({
        topic,
        transcript,
        feedback,
        score: totalScore,
      });
      
      if (error) {
        console.error('Error from saveSpeech:', error);
        setSaveError(error.message || 'Failed to save speech results');
        setIsSaving(false);
        return;
      }
      
      setSaveSuccess(true);
      
      // Call the onSaveSuccess callback if provided
      if (onSaveSuccess) {
        onSaveSuccess();
      }
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Exception in handleSaveResults:', error);
      setSaveError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Speech Evaluation</h2>
        <div className="mt-2 flex justify-center items-center">
          <div className="text-4xl font-bold">{totalScore}</div>
          <div className="text-xl text-gray-500 ml-1">/100</div>
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Content */}
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Content</h3>
            <div className="flex items-center">
              <span className="font-medium">{criteria.content.score}</span>
              <span className="text-gray-500 text-sm ml-1">/30</span>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div 
              className={`h-2.5 rounded-full ${getScoreColor(getScorePercentage(criteria.content.score, 30))}`} 
              style={{ width: `${getScorePercentage(criteria.content.score, 30)}%` }}
            ></div>
          </div>
          
          <div className="space-y-2">
            <div>
              <h4 className="text-sm font-medium text-gray-700">Feedback:</h4>
              <p className="text-sm text-gray-600">{criteria.content.feedback}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700">Suggestions:</h4>
              <p className="text-sm text-gray-600">{criteria.content.suggestions}</p>
            </div>
          </div>
        </div>
        
        {/* Style */}
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Style</h3>
            <div className="flex items-center">
              <span className="font-medium">{criteria.style.score}</span>
              <span className="text-gray-500 text-sm ml-1">/30</span>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div 
              className={`h-2.5 rounded-full ${getScoreColor(getScorePercentage(criteria.style.score, 30))}`} 
              style={{ width: `${getScorePercentage(criteria.style.score, 30)}%` }}
            ></div>
          </div>
          
          <div className="space-y-2">
            <div>
              <h4 className="text-sm font-medium text-gray-700">Feedback:</h4>
              <p className="text-sm text-gray-600">{criteria.style.feedback}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700">Suggestions:</h4>
              <p className="text-sm text-gray-600">{criteria.style.suggestions}</p>
            </div>
          </div>
        </div>
        
        {/* Strategy */}
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Strategy</h3>
            <div className="flex items-center">
              <span className="font-medium">{criteria.strategy.score}</span>
              <span className="text-gray-500 text-sm ml-1">/30</span>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div 
              className={`h-2.5 rounded-full ${getScoreColor(getScorePercentage(criteria.strategy.score, 30))}`} 
              style={{ width: `${getScorePercentage(criteria.strategy.score, 30)}%` }}
            ></div>
          </div>
          
          <div className="space-y-2">
            <div>
              <h4 className="text-sm font-medium text-gray-700">Feedback:</h4>
              <p className="text-sm text-gray-600">{criteria.strategy.feedback}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700">Suggestions:</h4>
              <p className="text-sm text-gray-600">{criteria.strategy.suggestions}</p>
            </div>
          </div>
        </div>
        
        {/* Overall */}
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Overall</h3>
            <div className="flex items-center">
              <span className="font-medium">{criteria.overall.score}</span>
              <span className="text-gray-500 text-sm ml-1">/10</span>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div 
              className={`h-2.5 rounded-full ${getScoreColor(getScorePercentage(criteria.overall.score, 10))}`} 
              style={{ width: `${getScorePercentage(criteria.overall.score, 10)}%` }}
            ></div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700">Feedback:</h4>
            <p className="text-sm text-gray-600">{criteria.overall.feedback}</p>
          </div>
        </div>
      </div>
      
      {/* Key Takeaways */}
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2">Key Takeaways</h3>
        <ul className="list-disc pl-5 space-y-1">
          {keyTakeaways.map((takeaway, index) => (
            <li key={index} className="text-sm text-gray-600">{takeaway}</li>
          ))}
        </ul>
      </div>
      
      {saveError && (
        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
          {saveError}
        </div>
      )}
      
      {saveSuccess && (
        <div className="p-3 text-sm text-green-500 bg-green-50 rounded-md">
          Speech results saved successfully! Redirecting to dashboard...
        </div>
      )}
      
      <div className="flex justify-center">
        <button
          type="button"
          className={`px-6 py-3 rounded-md ${
            isSaving || saveSuccess
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          }`}
          onClick={handleSaveResults}
          disabled={isSaving || saveSuccess}
        >
          {isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Results'}
        </button>
      </div>
    </div>
  );
};

export default FeedbackDisplay; 