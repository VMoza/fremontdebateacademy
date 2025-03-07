'use client';

import React, { useState } from 'react';
import { caseService } from '@/services/caseService';
import { useRouter } from 'next/navigation';

interface Point {
  assertion: string;
  reasoning: string;
  evidence: string;
  source: string;
  impact: string;
}

interface DebateCase {
  introduction: string;
  points: Point[];
  conclusion: string;
  speakerAllocation: {
    speaker1: string[];
    speaker2: string[];
  };
}

interface CaseDisplayProps {
  debateCase: DebateCase;
  topic: string;
  side: string;
  onSave?: () => void;
}

const CaseDisplay: React.FC<CaseDisplayProps> = ({ 
  debateCase, 
  topic, 
  side,
  onSave 
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [expandedPoints, setExpandedPoints] = useState<number[]>([]);
  const router = useRouter();
  
  const handleSaveCase = async () => {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    
    try {
      console.log('Saving debate case with data:', { topic, side, case_json: debateCase });
      
      const { data, error } = await caseService.saveCase({
        topic,
        side,
        case_json: debateCase,
      });
      
      if (error) {
        console.error('Error from saveCase:', error);
        setSaveError(error.message || 'Failed to save debate case');
        setIsSaving(false);
        return;
      }
      
      setSaveSuccess(true);
      
      // Call the onSave callback if provided
      if (onSave) {
        onSave();
      }
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Exception in handleSaveCase:', error);
      setSaveError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  const togglePointExpansion = (index: number) => {
    setExpandedPoints(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    );
  };

  const isPointExpanded = (index: number) => {
    return expandedPoints.includes(index);
  };
  
  return (
    <div className="card animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">
          <span className="gradient-text">Debate Case</span>
        </h2>
        <div className="text-gray-600 dark:text-gray-400">
          <span className="font-semibold">{topic}</span> - <span className="italic capitalize">{side} Side</span>
        </div>
      </div>
      
      {saveError && (
        <div className="p-4 mb-6 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800">
          {saveError}
        </div>
      )}
      
      {saveSuccess && (
        <div className="p-4 mb-6 text-sm text-green-500 bg-green-50 dark:bg-green-900/20 dark:text-green-400 rounded-lg border border-green-200 dark:border-green-800">
          Debate case saved successfully! Redirecting to dashboard...
        </div>
      )}
      
      <div className="space-y-8">
        {/* Introduction */}
        <div className="p-5 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
          <h3 className="text-lg font-semibold mb-3 text-blue-800 dark:text-blue-300">Introduction</h3>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{debateCase.introduction}</p>
        </div>
        
        {/* Points */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">ARES-I Points</h3>
          
          {debateCase.points.map((point, index) => (
            <div 
              key={index} 
              className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-all duration-300"
            >
              <div 
                className="bg-gray-50 dark:bg-gray-800 p-4 flex justify-between items-center cursor-pointer"
                onClick={() => togglePointExpansion(index)}
              >
                <h4 className="font-medium text-lg">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">Point {index + 1}:</span> {point.assertion}
                </h4>
                <button className="text-gray-500 dark:text-gray-400">
                  {isPointExpanded(index) ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </button>
              </div>
              
              {isPointExpanded(index) && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
                  <div>
                    <h5 className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-1">Reasoning</h5>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{point.reasoning}</p>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-1">Evidence</h5>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{point.evidence}</p>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-1">Source</h5>
                    <p className="text-gray-700 dark:text-gray-300 italic">{point.source}</p>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-1">Impact</h5>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{point.impact}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Conclusion */}
        <div className="p-5 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
          <h3 className="text-lg font-semibold mb-3 text-purple-800 dark:text-purple-300">Conclusion</h3>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{debateCase.conclusion}</p>
        </div>
        
        {/* Speaker Allocation */}
        <div className="p-5 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Speaker Allocation</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 className="font-medium text-blue-600 dark:text-blue-400 mb-2">Speaker 1</h4>
              <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                {debateCase.speakerAllocation.speaker1.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>
            
            <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 className="font-medium text-blue-600 dark:text-blue-400 mb-2">Speaker 2</h4>
              <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                {debateCase.speakerAllocation.speaker2.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex justify-center">
        <button
          onClick={handleSaveCase}
          className={`btn-primary px-6 py-3 ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
          disabled={isSaving || saveSuccess}
        >
          {isSaving ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving Case...
            </div>
          ) : saveSuccess ? 'Saved!' : 'Save Case'}
        </button>
      </div>
    </div>
  );
};

export default CaseDisplay; 