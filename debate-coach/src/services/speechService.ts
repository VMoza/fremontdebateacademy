'use client';

import { createClient } from '@/lib/supabase/client';

export interface SpeechData {
  id?: string;
  user_id?: string;
  topic: string;
  transcript: string;
  feedback: any;
  score: number;
  created_at?: string;
}

export const speechService = {
  // Save a speech to Supabase
  async saveSpeech(speechData: SpeechData): Promise<{ data: any; error: any }> {
    const supabase = createClient();
    
    try {
      // Get the current user's session
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;
      
      if (!userId) {
        console.error('No authenticated user found when trying to save speech');
        return { 
          data: null, 
          error: { message: 'You must be logged in to save a speech' } 
        };
      }
      
      console.log('Current user ID:', userId);
      console.log('Saving speech with data:', { 
        ...speechData, 
        user_id: userId 
      });
      
      // Insert the speech data with explicit user_id
      const { data, error } = await supabase
        .from('speeches')
        .insert([
          {
            user_id: userId, // Explicitly set the user_id
            topic: speechData.topic,
            transcript: speechData.transcript,
            feedback: speechData.feedback,
            score: speechData.score,
          },
        ])
        .select()
        .single();
      
      if (error) {
        console.error('Supabase error saving speech:', error);
      }
      
      return { data, error };
    } catch (err) {
      console.error('Exception saving speech:', err);
      return { data: null, error: { message: 'Failed to save speech: ' + (err instanceof Error ? err.message : String(err)) } };
    }
  },
  
  // Get all speeches for the current user
  async getUserSpeeches(): Promise<{ data: SpeechData[] | null; error: any }> {
    const supabase = createClient();
    
    try {
      const { data, error } = await supabase
        .from('speeches')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Supabase error getting speeches:', error);
      }
      
      return { data, error };
    } catch (err) {
      console.error('Exception getting speeches:', err);
      return { data: null, error: { message: 'Failed to get speeches: ' + (err instanceof Error ? err.message : String(err)) } };
    }
  },
  
  // Get a specific speech by ID
  async getSpeechById(id: string): Promise<{ data: SpeechData | null; error: any }> {
    const supabase = createClient();
    
    try {
      const { data, error } = await supabase
        .from('speeches')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Supabase error getting speech by ID:', error);
      }
      
      return { data, error };
    } catch (err) {
      console.error('Exception getting speech by ID:', err);
      return { data: null, error: { message: 'Failed to get speech: ' + (err instanceof Error ? err.message : String(err)) } };
    }
  },
  
  // Delete a speech by ID
  async deleteSpeech(id: string): Promise<{ error: any }> {
    const supabase = createClient();
    
    try {
      const { error } = await supabase
        .from('speeches')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Supabase error deleting speech:', error);
      }
      
      return { error };
    } catch (err) {
      console.error('Exception deleting speech:', err);
      return { error: { message: 'Failed to delete speech: ' + (err instanceof Error ? err.message : String(err)) } };
    }
  },
}; 