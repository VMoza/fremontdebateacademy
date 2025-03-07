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
  
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Debate Case</h2>
        <div className="mt-2 text-gray-600">
          <span className="font-semibold">{topic}</span> - <span className="italic">{side} Side</span>
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Introduction */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Introduction</h3>
          <p className="text-gray-700">{debateCase.introduction}</p>
        </div>
        
        {/* Points */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">ARES-I Points</h3>
          
          {debateCase.points.map((point, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-2">
                  {index + 1}
                </div>
                <h4 className="text-md font-semibold">Point {index + 1}</h4>
              </div>
              
              <div className="space-y-3 pl-10">
                <div>
                  <h5 className="text-sm font-medium text-blue-700">A: Assertion</h5>
                  <p className="text-gray-700">{point.assertion}</p>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-blue-700">R: Reasoning</h5>
                  <p className="text-gray-700">{point.reasoning}</p>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-blue-700">E: Evidence</h5>
                  <p className="text-gray-700">{point.evidence}</p>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-blue-700">S: Source</h5>
                  <p className="text-gray-700">{point.source}</p>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-blue-700">I: Impact</h5>
                  <p className="text-gray-700">{point.impact}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Conclusion */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Conclusion</h3>
          <p className="text-gray-700">{debateCase.conclusion}</p>
        </div>
        
        {/* Speaker Allocation */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Speaker Allocation</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-md font-semibold mb-2">Speaker 1</h4>
              <ul className="list-disc pl-5 space-y-1">
                {debateCase.speakerAllocation.speaker1.map((point, index) => (
                  <li key={index} className="text-gray-700">{point}</li>
                ))}
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-md font-semibold mb-2">Speaker 2</h4>
              <ul className="list-disc pl-5 space-y-1">
                {debateCase.speakerAllocation.speaker2.map((point, index) => (
                  <li key={index} className="text-gray-700">{point}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {saveError && (
        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
          {saveError}
        </div>
      )}
      
      {saveSuccess && (
        <div className="p-3 text-sm text-green-500 bg-green-50 rounded-md">
          Debate case saved successfully! Redirecting to dashboard...
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
          onClick={handleSaveCase}
          disabled={isSaving || saveSuccess}
        >
          {isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Case'}
        </button>
      </div>
    </div>
  );
};

export default CaseDisplay; 