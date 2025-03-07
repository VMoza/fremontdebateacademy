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
    if (percentage >= 80) return 'bg-green-500 dark:bg-green-600';
    if (percentage >= 60) return 'bg-blue-500 dark:bg-blue-600';
    if (percentage >= 40) return 'bg-yellow-500 dark:bg-yellow-600';
    return 'bg-red-500 dark:bg-red-600';
  };
  
  const handleSaveResults = async () => {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    
    try {
      const { data, error } = await speechService.saveSpeech({
        topic,
        transcript,
        feedback: feedback,
        score: totalScore,
      });
      
      if (error) {
        throw new Error(error.message || 'Failed to save speech results');
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
      console.error('Error saving speech results:', error);
      setSaveError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="card">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">
          <span className="gradient-text">Speech Feedback</span>
        </h2>
        <div className="text-gray-600 dark:text-gray-400">
          <span className="font-semibold">{topic}</span>
        </div>
      </div>
      
      {saveError && (
        <div className="p-4 mb-6 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800">
          {saveError}
        </div>
      )}
      
      {saveSuccess && (
        <div className="p-4 mb-6 text-sm text-green-500 bg-green-50 dark:bg-green-900/20 dark:text-green-400 rounded-lg border border-green-200 dark:border-green-800">
          Speech results saved successfully! Redirecting to dashboard...
        </div>
      )}
      
      {/* Overall Score */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-semibold">Overall Score</h3>
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalScore}/100</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
          <div 
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-4 rounded-full transition-all duration-1000" 
            style={{ width: `${totalScore}%` }}
          ></div>
        </div>
      </div>
      
      {/* Criteria Scores */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Criteria Scores</h3>
        <div className="space-y-6">
          {/* Content */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <h4 className="font-medium">Content</h4>
              <span className="font-medium">{criteria.content.score}/25</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-3">
              <div 
                className={`${getScoreColor(getScorePercentage(criteria.content.score, 25))} h-2.5 rounded-full transition-all duration-1000`} 
                style={{ width: `${getScorePercentage(criteria.content.score, 25)}%` }}
              ></div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-gray-700 dark:text-gray-300 mb-3">{criteria.content.feedback}</p>
              {criteria.content.suggestions && (
                <div>
                  <h5 className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Suggestions for Improvement:</h5>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{criteria.content.suggestions}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Style */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <h4 className="font-medium">Delivery & Style</h4>
              <span className="font-medium">{criteria.style.score}/25</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-3">
              <div 
                className={`${getScoreColor(getScorePercentage(criteria.style.score, 25))} h-2.5 rounded-full transition-all duration-1000`} 
                style={{ width: `${getScorePercentage(criteria.style.score, 25)}%` }}
              ></div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-gray-700 dark:text-gray-300 mb-3">{criteria.style.feedback}</p>
              {criteria.style.suggestions && (
                <div>
                  <h5 className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Suggestions for Improvement:</h5>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{criteria.style.suggestions}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Strategy */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <h4 className="font-medium">Strategy & Structure</h4>
              <span className="font-medium">{criteria.strategy.score}/25</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-3">
              <div 
                className={`${getScoreColor(getScorePercentage(criteria.strategy.score, 25))} h-2.5 rounded-full transition-all duration-1000`} 
                style={{ width: `${getScorePercentage(criteria.strategy.score, 25)}%` }}
              ></div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-gray-700 dark:text-gray-300 mb-3">{criteria.strategy.feedback}</p>
              {criteria.strategy.suggestions && (
                <div>
                  <h5 className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Suggestions for Improvement:</h5>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{criteria.strategy.suggestions}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Overall */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <h4 className="font-medium">Overall Effectiveness</h4>
              <span className="font-medium">{criteria.overall.score}/25</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-3">
              <div 
                className={`${getScoreColor(getScorePercentage(criteria.overall.score, 25))} h-2.5 rounded-full transition-all duration-1000`} 
                style={{ width: `${getScorePercentage(criteria.overall.score, 25)}%` }}
              ></div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-gray-700 dark:text-gray-300 mb-3">{criteria.overall.feedback}</p>
              {criteria.overall.suggestions && (
                <div>
                  <h5 className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Suggestions for Improvement:</h5>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{criteria.overall.suggestions}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Key Takeaways */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Key Takeaways</h3>
        <div className="p-5 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
          <ul className="space-y-2">
            {keyTakeaways.map((takeaway, index) => (
              <li key={index} className="flex items-start">
                <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300">{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Save Button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={handleSaveResults}
          className={`btn-primary px-6 py-3 ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
          disabled={isSaving || saveSuccess}
        >
          {isSaving ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving Results...
            </div>
          ) : saveSuccess ? 'Saved!' : 'Save Results'}
        </button>
      </div>
    </div>
  );
};

export default FeedbackDisplay; 