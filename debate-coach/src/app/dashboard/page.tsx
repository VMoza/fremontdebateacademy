'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { speechService, SpeechData } from "@/services/speechService";
import { caseService, DebateCaseData } from "@/services/caseService";

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSpeeches, setIsLoadingSpeeches] = useState(true);
  const [isLoadingCases, setIsLoadingCases] = useState(true);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [caseError, setCaseError] = useState<string | null>(null);
  const router = useRouter();

  // Real data from Supabase
  const [speeches, setSpeeches] = useState<SpeechData[]>([]);
  const [cases, setCases] = useState<DebateCaseData[]>([]);

  useEffect(() => {
    // Fetch speeches from Supabase
    const fetchSpeeches = async () => {
      setIsLoadingSpeeches(true);
      setSpeechError(null);
      
      try {
        const { data, error } = await speechService.getUserSpeeches();
        
        if (error) {
          throw new Error(error.message || 'Failed to fetch speeches');
        }
        
        setSpeeches(data || []);
      } catch (error) {
        console.error('Error fetching speeches:', error);
        setSpeechError(error instanceof Error ? error.message : 'An unexpected error occurred');
      } finally {
        setIsLoadingSpeeches(false);
      }
    };
    
    // Fetch debate cases from Supabase
    const fetchCases = async () => {
      setIsLoadingCases(true);
      setCaseError(null);
      
      try {
        const { data, error } = await caseService.getUserCases();
        
        if (error) {
          throw new Error(error.message || 'Failed to fetch debate cases');
        }
        
        setCases(data || []);
      } catch (error) {
        console.error('Error fetching debate cases:', error);
        setCaseError(error instanceof Error ? error.message : 'An unexpected error occurred');
      } finally {
        setIsLoadingCases(false);
      }
    };
    
    fetchSpeeches();
    fetchCases();
  }, []);

  const handleSignOut = async () => {
    setIsLoading(true);
    await signOut();
    router.push('/');
  };

  const handleDeleteSpeech = async (id: string) => {
    if (!confirm('Are you sure you want to delete this speech?')) {
      return;
    }
    
    try {
      const { error } = await speechService.deleteSpeech(id);
      
      if (error) {
        throw new Error(error.message || 'Failed to delete speech');
      }
      
      // Update the speeches list
      setSpeeches(speeches.filter(speech => speech.id !== id));
    } catch (error) {
      console.error('Error deleting speech:', error);
      alert('Failed to delete speech. Please try again.');
    }
  };

  const handleDeleteCase = async (id: string) => {
    if (!confirm('Are you sure you want to delete this debate case?')) {
      return;
    }
    
    try {
      const { error } = await caseService.deleteCase(id);
      
      if (error) {
        throw new Error(error.message || 'Failed to delete debate case');
      }
      
      // Update the cases list
      setCases(cases.filter(debateCase => debateCase.id !== id));
    } catch (error) {
      console.error('Error deleting debate case:', error);
      alert('Failed to delete debate case. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back, {user?.email}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="card animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/speech" className="btn-primary text-center">
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                  Record Speech
                </div>
              </Link>
              <Link href="/case-generator" className="btn-primary text-center">
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Generate Case
                </div>
              </Link>
            </div>
          </div>

          <div className="card animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Account</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300">{user?.email}</span>
              </div>
              <button 
                onClick={handleSignOut} 
                className="btn-secondary w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Signing out...' : 'Sign Out'}
              </button>
            </div>
          </div>
        </div>

        {/* Speeches Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Your Speeches</h2>
            <Link href="/speech" className="btn-secondary text-sm">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                New Speech
              </div>
            </Link>
          </div>

          {speechError && (
            <div className="p-4 mb-6 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800">
              {speechError}
            </div>
          )}

          {isLoadingSpeeches ? (
            <div className="flex justify-center items-center py-12">
              <svg className="animate-spin h-8 w-8 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : speeches.length === 0 ? (
            <div className="card bg-gray-50 dark:bg-gray-800 border-dashed">
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No speeches</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by recording a new speech.</p>
                <div className="mt-6">
                  <Link href="/speech" className="btn-primary">
                    <div className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Record Speech
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
              {speeches.map((speech) => (
                <div key={speech.id} className="card hover:shadow-lg transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg mb-2 truncate">{speech.topic}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        {formatDate(speech.created_at || '')}
                      </p>
                    </div>
                    <div className="flex">
                      <button
                        onClick={() => handleDeleteSpeech(speech.id || '')}
                        className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                        aria-label="Delete speech"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center mb-2">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2.5 rounded-full" style={{ width: `${speech.score}%` }}></div>
                      </div>
                      <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">{speech.score}%</span>
                    </div>
                    <Link
                      href={`/speech/${speech.id}`}
                      className="mt-4 inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      View Details
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Debate Cases Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Your Debate Cases</h2>
            <Link href="/case-generator" className="btn-secondary text-sm">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                New Case
              </div>
            </Link>
          </div>

          {caseError && (
            <div className="p-4 mb-6 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800">
              {caseError}
            </div>
          )}

          {isLoadingCases ? (
            <div className="flex justify-center items-center py-12">
              <svg className="animate-spin h-8 w-8 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : cases.length === 0 ? (
            <div className="card bg-gray-50 dark:bg-gray-800 border-dashed">
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No debate cases</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by generating a new debate case.</p>
                <div className="mt-6">
                  <Link href="/case-generator" className="btn-primary">
                    <div className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Generate Case
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
              {cases.map((debateCase) => (
                <div key={debateCase.id} className="card hover:shadow-lg transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg mb-2 truncate">{debateCase.topic}</h3>
                      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 mb-2">
                        {debateCase.side}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        {formatDate(debateCase.created_at || '')}
                      </p>
                    </div>
                    <div className="flex">
                      <button
                        onClick={() => handleDeleteCase(debateCase.id || '')}
                        className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                        aria-label="Delete case"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {debateCase.case_json?.points?.length || 0} ARES points
                    </p>
                    <Link
                      href={`/case/${debateCase.id}`}
                      className="mt-4 inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      View Case
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 