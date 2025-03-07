'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { caseService } from '@/services/caseService';
import CaseDisplay from '@/components/CaseDisplay';

export default function CaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [debateCase, setDebateCase] = useState<any | null>(null);
  const [caseData, setCaseData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchCase = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const id = params.id as string;
        const { data, error } = await caseService.getCaseById(id);
        
        if (error) {
          throw new Error(error.message || 'Failed to fetch debate case');
        }
        
        if (!data) {
          throw new Error('Debate case not found');
        }
        
        setCaseData(data);
        setDebateCase(data.case_json);
      } catch (error) {
        console.error('Error fetching debate case:', error);
        setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCase();
  }, [params.id]);
  
  const handleDeleteCase = async () => {
    if (!caseData?.id) return;
    
    if (!confirm('Are you sure you want to delete this debate case?')) {
      return;
    }
    
    try {
      const { error } = await caseService.deleteCase(caseData.id);
      
      if (error) {
        throw new Error(error.message || 'Failed to delete debate case');
      }
      
      // Redirect to dashboard after deletion
      router.push('/dashboard');
    } catch (error) {
      console.error('Error deleting debate case:', error);
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
            <p className="text-gray-500">Loading debate case...</p>
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
        ) : debateCase && caseData ? (
          <>
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">{caseData.topic}</h1>
              <div className="text-sm text-gray-500">
                {caseData.created_at ? formatDate(caseData.created_at) : 'Unknown date'}
              </div>
            </div>
            
            <CaseDisplay 
              debateCase={debateCase} 
              topic={caseData.topic} 
              side={caseData.side}
            />
            
            <div className="flex justify-between">
              <Link href="/dashboard" className="text-blue-600 hover:text-blue-500">
                ← Back to Dashboard
              </Link>
              
              <button
                onClick={handleDeleteCase}
                className="px-4 py-2 text-red-600 border border-red-300 rounded-md hover:bg-red-50"
              >
                Delete Case
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Debate case not found</p>
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