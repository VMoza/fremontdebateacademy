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
    // Create a temporary directory for storing audio files if it doesn't exist
    const tempDir = join(process.cwd(), 'tmp');
    try {
      await mkdir(tempDir, { recursive: true });
    } catch (error) {
      // Directory might already exist, which is fine
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
    
    // Generate a unique filename
    const filename = `${uuidv4()}.webm`;
    const filepath = join(tempDir, filename);
    
    // Convert the file to a Buffer and save it to disk
    const buffer = Buffer.from(await audioFile.arrayBuffer());
    await writeFile(filepath, buffer);
    
    // Transcribe the audio using OpenAI's Whisper API
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filepath),
      model: "whisper-1",
    });
    
    // Clean up the temporary file
    try {
      fs.unlinkSync(filepath);
    } catch (error) {
      console.error('Error deleting temporary file:', error);
    }
    
    // Return the transcription
    return NextResponse.json({ transcript: transcription.text });
  } catch (error) {
    console.error('Error transcribing audio:', error);
    return NextResponse.json(
      { error: 'An error occurred while transcribing the audio' },
      { status: 500 }
    );
  }
} 