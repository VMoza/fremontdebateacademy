import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { mkdir } from 'fs/promises';
import fs from 'fs';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    console.log('Starting transcribe API route');
    
    // Log OpenAI API key presence (not the actual key)
    const apiKeyPresent = !!process.env.OPENAI_API_KEY;
    console.log('OpenAI API key present:', apiKeyPresent);
    
    if (!apiKeyPresent) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }
    
    // Create a temporary directory for storing audio files if it doesn't exist
    // In Vercel, we should use /tmp directory which is writable
    const tempDir = '/tmp';
    try {
      await mkdir(tempDir, { recursive: true });
    } catch (error) {
      // Directory might already exist, which is fine
      console.log('Temp directory already exists or could not be created:', error);
    }

    // Get the audio file from the request
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    
    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }
    
    console.log('Audio file received, size:', audioFile.size, 'bytes, type:', audioFile.type);
    
    // Generate a unique filename
    const filename = `${uuidv4()}.webm`;
    const filepath = join(tempDir, filename);
    
    // Convert the file to a Buffer and save it to disk
    const buffer = Buffer.from(await audioFile.arrayBuffer());
    await writeFile(filepath, buffer);
    
    console.log('Audio file saved to:', filepath);
    
    // Transcribe the audio using OpenAI's Whisper API
    try {
      console.log('Calling OpenAI Whisper API...');
      const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(filepath),
        model: "whisper-1",
      });
      
      // Clean up the temporary file
      try {
        fs.unlinkSync(filepath);
        console.log('Temporary file deleted');
      } catch (cleanupError) {
        console.error('Error deleting temporary file:', cleanupError);
      }
      
      console.log('Transcription successful, length:', transcription.text.length);
      
      // Return the transcription
      return NextResponse.json({ transcript: transcription.text });
    } catch (transcriptionError: any) {
      console.error('OpenAI transcription error:', transcriptionError);
      // Log more details about the error
      if (transcriptionError.status) console.error('Status:', transcriptionError.status);
      if (transcriptionError.headers) console.error('Headers:', transcriptionError.headers);
      if (transcriptionError.response) console.error('Response:', transcriptionError.response);
      
      // Try to clean up the temporary file even if transcription failed
      try {
        fs.unlinkSync(filepath);
        console.log('Temporary file deleted after error');
      } catch (cleanupError) {
        console.error('Error deleting temporary file after transcription error:', cleanupError);
      }
      
      return NextResponse.json(
        { error: `Transcription failed: ${transcriptionError?.message || 'Unknown error'}` },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error transcribing audio:', error);
    return NextResponse.json(
      { error: `An error occurred while transcribing the audio: ${error?.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
} 