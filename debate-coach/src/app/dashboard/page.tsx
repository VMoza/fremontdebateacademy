'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { speechService, SpeechData } from "@/services/speechService";

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSpeeches, setIsLoadingSpeeches] = useState(true);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const router = useRouter();

  // Real data from Supabase
  const [speeches, setSpeeches] = useState<SpeechData[]>([]);
  
  // Mock data for cases (will be replaced in later steps)
  const [cases, setCases] = useState<any[]>([]);

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
    
    // Set mock data for cases
    setCases([
      { id: 1, topic: 'Sample Case 1', side: 'Proposition', date: '2023-05-10' },
      { id: 2, topic: 'Sample Case 2', side: 'Opposition', date: '2023-05-18' },
    ]);
    
    // Fetch speeches when the component mounts
    fetchSpeeches();
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
      
      // Remove the deleted speech from the state
      setSpeeches(speeches.filter(speech => speech.id !== id));
    } catch (error) {
      console.error('Error deleting speech:', error);
      alert(error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">
              {user?.email}
            </span>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              disabled={isLoading}
            >
              {isLoading ? 'Signing out...' : 'Sign out'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Your Speeches</h2>
              <Link
                href="/speech"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Record New Speech
              </Link>
            </div>
            
            {isLoadingSpeeches ? (
              <div className="text-center py-4">
                <p className="text-gray-500">Loading speeches...</p>
              </div>
            ) : speechError ? (
              <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                {speechError}
              </div>
            ) : speeches.length === 0 ? (
              <p className="text-gray-500">You haven't recorded any speeches yet.</p>
            ) : (
              <div className="space-y-4">
                {speeches.map((speech) => (
                  <div key={speech.id} className="border rounded-md p-4">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{speech.topic}</h3>
                      <span className="text-sm text-gray-500">
                        {speech.created_at ? formatDate(speech.created_at) : 'Unknown date'}
                      </span>
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-sm">
                        Score: <span className="font-semibold">{speech.score}/100</span>
                      </span>
                      <div className="flex space-x-2">
                        <Link 
                          href={`/speech/${speech.id}`}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          View Details
                        </Link>
                        <button 
                          onClick={() => handleDeleteSpeech(speech.id!)}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Your Debate Cases</h2>
              <Link
                href="/case-generator"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Generate New Case
              </Link>
            </div>
            
            {cases.length === 0 ? (
              <p className="text-gray-500">You haven't generated any debate cases yet.</p>
            ) : (
              <div className="space-y-4">
                {cases.map((debateCase) => (
                  <div key={debateCase.id} className="border rounded-md p-4">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{debateCase.topic}</h3>
                      <span className="text-sm text-gray-500">{debateCase.date}</span>
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-sm">
                        Side: <span className="font-semibold">{debateCase.side}</span>
                      </span>
                      <button className="text-sm text-blue-600 hover:text-blue-800">
                        View Case
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 