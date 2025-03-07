'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { speechService } from '@/services/speechService';
import FeedbackDisplay from '@/components/FeedbackDisplay';

export default function SpeechDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [speech, setSpeech] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchSpeech = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const id = params.id as string;
        const { data, error } = await speechService.getSpeechById(id);
        
        if (error) {
          throw new Error(error.message || 'Failed to fetch speech');
        }
        
        if (!data) {
          throw new Error('Speech not found');
        }
        
        setSpeech(data);
      } catch (error) {
        console.error('Error fetching speech:', error);
        setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSpeech();
  }, [params.id]);
  
  const handleDeleteSpeech = async () => {
    if (!speech?.id) return;
    
    if (!confirm('Are you sure you want to delete this speech?')) {
      return;
    }
    
    try {
      const { error } = await speechService.deleteSpeech(speech.id);
      
      if (error) {
        throw new Error(error.message || 'Failed to delete speech');
      }
      
      // Redirect to dashboard after deletion
      router.push('/dashboard');
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
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-4xl p-8 space-y-8 bg-white rounded-lg shadow-md">
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading speech details...</p>
          </div>
        ) : error ? (
          <div className="p-4 text-red-500 bg-red-50 rounded-md">
            <p>{error}</p>
            <div className="mt-4">
              <Link href="/dashboard" className="text-blue-600 hover:text-blue-500">
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        ) : speech ? (
          <>
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">{speech.topic}</h1>
              <div className="text-sm text-gray-500">
                {speech.created_at ? formatDate(speech.created_at) : 'Unknown date'}
              </div>
            </div>
            
            <div className="p-6 border border-gray-200 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Transcript</h2>
              <div className="whitespace-pre-wrap p-4 bg-gray-50 rounded-md">
                {speech.transcript}
              </div>
            </div>
            
            <FeedbackDisplay 
              feedback={speech.feedback}
              topic={speech.topic}
              transcript={speech.transcript}
            />
            
            <div className="flex justify-between">
              <Link href="/dashboard" className="text-blue-600 hover:text-blue-500">
                ← Back to Dashboard
              </Link>
              
              <button
                onClick={handleDeleteSpeech}
                className="px-4 py-2 text-red-600 border border-red-300 rounded-md hover:bg-red-50"
              >
                Delete Speech
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Speech not found</p>
            <div className="mt-4">
              <Link href="/dashboard" className="text-blue-600 hover:text-blue-500">
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 