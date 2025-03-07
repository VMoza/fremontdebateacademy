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
    if (!topic) {
      setError("Please enter a debate topic");
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    setGenerationProgress("Starting case generation...");
    
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
      
      // Update progress
      setGenerationProgress("Creating structured ARES-I points...");
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate debate case');
      }
      
      const data = await response.json();
      
      // Validate the structure of the response
      if (!data.introduction || !data.points || !Array.isArray(data.points) || 
          data.points.length < 6 || !data.conclusion || !data.speakerAllocation) {
        throw new Error('The generated debate case is incomplete. Please try again.');
      }
      
      // Ensure each point has all required elements
      for (let i = 0; i < data.points.length; i++) {
        const point = data.points[i];
        if (!point.assertion || !point.reasoning || !point.evidence || !point.source || !point.impact) {
          throw new Error(`Point ${i+1} is missing required elements. Please try again.`);
        }
      }
      
      setDebateCase(data);
      setGenerationProgress(null);
    } catch (error) {
      console.error('Error generating case:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
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
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-4xl p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Debate Case Generator</h1>
          <p className="mt-2 text-gray-600">Generate structured debate cases with ARES-I points for any topic</p>
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
        
        <div className="mt-4">
          <label htmlFor="side" className="block text-sm font-medium text-gray-700">
            Debate Side
          </label>
          <select
            id="side"
            name="side"
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={side}
            onChange={(e) => setSide(e.target.value)}
          >
            <option value="proposition">Proposition</option>
            <option value="opposition">Opposition</option>
          </select>
        </div>
        
        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
            {error}
          </div>
        )}
        
        <div className="mt-6">
          <button
            type="button"
            className={`w-full px-4 py-2 text-white rounded-md ${
              isGenerating
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }`}
            onClick={handleGenerateCase}
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating Case...' : 'Generate Case'}
          </button>
          
          <p className="mt-2 text-xs text-gray-500 text-center">
            This will generate 6 unique ARES-I points (Assertion, Reasoning, Evidence, Source, Impact) with factual information.
          </p>
        </div>
        
        <div className="mt-8">
          {debateCase ? (
            <CaseDisplay 
              debateCase={debateCase} 
              topic={topic} 
              side={side}
              onSave={handleSaveSuccess}
            />
          ) : (
            <div className="p-6 border border-gray-200 rounded-lg text-center">
              <h2 className="text-xl font-semibold mb-4">Generated Case</h2>
              {isGenerating && generationProgress && (
                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                    <div className="bg-blue-600 h-2.5 rounded-full animate-pulse" style={{ width: '100%' }}></div>
                  </div>
                  <p className="text-gray-600">{generationProgress}</p>
                </div>
              )}
              <p className="text-gray-500">
                {isGenerating 
                  ? "This may take a minute or two as we research and create a high-quality debate case."
                  : "Your generated debate case will appear here. It will include 6 unique ARES-I points."}
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