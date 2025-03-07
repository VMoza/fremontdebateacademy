'use client';

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const { user, isLoading } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to Debate Coach</h1>
      <p className="text-xl mb-8 max-w-2xl">
        Your AI-powered assistant for improving debate skills, generating cases, and receiving feedback on your speeches.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
        <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-semibold mb-3">Speech Recording & Grading</h2>
          <p className="mb-4">Record your speech, get it transcribed, and receive detailed feedback and scores.</p>
          <Link 
            href={user ? "/speech" : "/login?redirectedFrom=/speech"} 
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Start Recording
          </Link>
        </div>
        
        <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-semibold mb-3">Debate Case Generator</h2>
          <p className="mb-4">Generate structured debate cases with ARES points for any topic.</p>
          <Link 
            href={user ? "/case-generator" : "/login?redirectedFrom=/case-generator"} 
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Generate Case
          </Link>
        </div>
      </div>
      
      <div className="mt-12">
        {isLoading ? (
          <div className="inline-block px-6 py-3 bg-gray-200 text-gray-500 rounded">
            Loading...
          </div>
        ) : user ? (
          <div className="flex flex-col items-center space-y-4">
            <p className="text-gray-600">
              Logged in as <span className="font-semibold">{user.email}</span>
            </p>
            <div className="flex space-x-4">
              <Link 
                href="/dashboard" 
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <Link 
            href="/login" 
            className="inline-block px-6 py-3 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
          >
            Login / Sign Up
          </Link>
        )}
      </div>
    </div>
  );
}
