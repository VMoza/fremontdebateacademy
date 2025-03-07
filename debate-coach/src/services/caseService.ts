'use client';

import { createClient } from '@/lib/supabase/client';

export interface DebateCaseData {
  id?: string;
  user_id?: string;
  topic: string;
  side: string;
  case_json: any;
  created_at?: string;
}

export const caseService = {
  // Save a debate case to Supabase
  async saveCase(caseData: DebateCaseData): Promise<{ data: any; error: any }> {
    const supabase = createClient();
    
    try {
      // Get the current user's session
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;
      
      if (!userId) {
        console.error('No authenticated user found when trying to save debate case');
        return { 
          data: null, 
          error: { message: 'You must be logged in to save a debate case' } 
        };
      }
      
      console.log('Current user ID:', userId);
      console.log('Saving debate case with data:', { 
        ...caseData, 
        user_id: userId 
      });
      
      // Insert the debate case data with explicit user_id
      const { data, error } = await supabase
        .from('debate_cases')
        .insert([
          {
            user_id: userId, // Explicitly set the user_id
            topic: caseData.topic,
            side: caseData.side,
            case_json: caseData.case_json,
          },
        ])
        .select()
        .single();
      
      if (error) {
        console.error('Supabase error saving debate case:', error);
      }
      
      return { data, error };
    } catch (err) {
      console.error('Exception saving debate case:', err);
      return { data: null, error: { message: 'Failed to save debate case: ' + (err instanceof Error ? err.message : String(err)) } };
    }
  },
  
  // Get all debate cases for the current user
  async getUserCases(): Promise<{ data: DebateCaseData[] | null; error: any }> {
    const supabase = createClient();
    
    try {
      const { data, error } = await supabase
        .from('debate_cases')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Supabase error getting debate cases:', error);
      }
      
      return { data, error };
    } catch (err) {
      console.error('Exception getting debate cases:', err);
      return { data: null, error: { message: 'Failed to get debate cases: ' + (err instanceof Error ? err.message : String(err)) } };
    }
  },
  
  // Get a specific debate case by ID
  async getCaseById(id: string): Promise<{ data: DebateCaseData | null; error: any }> {
    const supabase = createClient();
    
    try {
      const { data, error } = await supabase
        .from('debate_cases')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Supabase error getting debate case by ID:', error);
      }
      
      return { data, error };
    } catch (err) {
      console.error('Exception getting debate case by ID:', err);
      return { data: null, error: { message: 'Failed to get debate case: ' + (err instanceof Error ? err.message : String(err)) } };
    }
  },
  
  // Delete a debate case by ID
  async deleteCase(id: string): Promise<{ error: any }> {
    const supabase = createClient();
    
    try {
      const { error } = await supabase
        .from('debate_cases')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Supabase error deleting debate case:', error);
      }
      
      return { error };
    } catch (err) {
      console.error('Exception deleting debate case:', err);
      return { error: { message: 'Failed to delete debate case: ' + (err instanceof Error ? err.message : String(err)) } };
    }
  },
}; 