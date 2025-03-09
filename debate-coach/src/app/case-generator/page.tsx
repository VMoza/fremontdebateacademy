'use client';

import Link from "next/link";
import { useState } from "react";
import CaseDisplay from "@/components/CaseDisplay";

export default function CaseGeneratorPage() {
  const [topic, setTopic] = useState("");
  const [side, setSide] = useState("proposition");
  const [debateCase, setDebateCase] = useState<any | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState<string | null>(null);
  
  const handleGenerateCase = async () => {
    if (!topic.trim()) {
      setError('Please enter a debate topic');
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    setDebateCase(null);
    
    try {
      // Set progress updates
      setGenerationProgress("Researching topic and gathering factual information...");
      
      // Add a small delay to show the progress message
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = await fetch('/api/generate-case', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          side,
        }),
      });
      
      // Check if the response is ok before trying to parse JSON
      if (!response.ok) {
        let errorMessage = 'Failed to generate case';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          // If we can't parse the JSON, try to get the text
          try {
            const errorText = await response.text();
            errorMessage = errorText || errorMessage;
          } catch (textError) {
            console.error('Failed to get error text:', textError);
          }
        }
        throw new Error(errorMessage);
      }
      
      // Update progress
      setGenerationProgress("Structuring debate case with ARES-I format...");
      
      // Add a small delay to show the progress message
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const data = await response.json();
      setDebateCase(data);
      setGenerationProgress(null);
    } catch (error: any) {
      console.error('Error generating case:', error);
      setError(error?.message || 'An error occurred while generating the case. Please try again.');
      setGenerationProgress(null);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleSaveSuccess = () => {
    // Reset the form after successful save
    setTopic("");
    setSide("proposition");
    setDebateCase(null);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">
            <span className="gradient-text">Debate Case</span> Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Generate comprehensive debate cases with detailed ARES-I points for any topic
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
              placeholder="Enter your debate topic (e.g., 'Social media is harmful to society')"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="side" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Debate Side
            </label>
            <select
              id="side"
              name="side"
              className="input-field"
              value={side}
              onChange={(e) => setSide(e.target.value)}
            >
              <option value="proposition">Proposition</option>
              <option value="opposition">Opposition</option>
            </select>
          </div>
          
          {error && (
            <div className="p-4 mb-6 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800">
              {error}
            </div>
          )}
          
          <div>
            <button
              type="button"
              className={`btn-primary w-full ${
                isGenerating ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              onClick={handleGenerateCase}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Case...
                </div>
              ) : 'Generate Case'}
            </button>
            
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">What you'll get:</h3>
              <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1 list-disc pl-4">
                <li>6 unique, well-developed ARES-I points</li>
                <li>Detailed reasoning with 3-5 sentences for each point</li>
                <li>Comprehensive evidence with specific facts and examples</li>
                <li>Real, verifiable sources for each point</li>
                <li>Clear impact statements explaining why each point matters</li>
                <li>Speaker allocation suggestions for team debates</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          {debateCase ? (
            <CaseDisplay 
              debateCase={debateCase} 
              topic={topic} 
              side={side}
              onSave={handleSaveSuccess}
            />
          ) : (
            <div className="card text-center">
              <h2 className="text-xl font-semibold mb-4">Generated Case</h2>
              {isGenerating && generationProgress && (
                <div className="mb-6">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2.5 rounded-full animate-pulse" style={{ width: '100%' }}></div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 font-medium">{generationProgress}</p>
                </div>
              )}
              <div className="py-8">
                {isGenerating ? (
                  <div className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                    <p className="mb-2">This may take 1-2 minutes as we:</p>
                    <ul className="text-sm text-left space-y-2 pl-4">
                      <li className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Research your topic thoroughly
                      </li>
                      <li className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Gather factual information and sources
                      </li>
                      <li className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Create detailed ARES-I points
                      </li>
                      <li className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Structure your complete debate case
                      </li>
                    </ul>
                  </div>
                ) : (
                  <div className="text-gray-500 dark:text-gray-400">
                    <svg className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p>Enter a topic and click "Generate Case" to create a comprehensive debate case with 6 unique ARES-I points.</p>
                  </div>
                )}
              </div>
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