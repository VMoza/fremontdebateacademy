import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { topic, transcript } = await request.json();
    
    if (!transcript) {
      return NextResponse.json(
        { error: 'Transcript is required' },
        { status: 400 }
      );
    }
    
    // Define the prompt for the LLM
    const prompt = `
      You are an expert debate coach evaluating a student's speech for a Middle School Public Debate Program (MSPDP) format debate.
      
      The debate topic is: "${topic || 'Unknown topic'}"
      
      Here is the student's speech transcript:
      """
      ${transcript}
      """
      
      Please evaluate this speech based on the following criteria:
      1. Content (30 points): Quality of arguments, evidence, and reasoning
      2. Style (30 points): Delivery, language use, and persuasiveness
      3. Strategy (30 points): Organization, time management, and responsiveness to the topic
      4. Overall (10 points): General effectiveness and impact
      
      For each criterion, provide:
      - A score (out of the available points)
      - Specific feedback with examples from the speech
      - Suggestions for improvement
      
      Then, provide an overall assessment with the total score (out of 100) and 2-3 key takeaways.
      
      Format your response as a JSON object with the following structure:
      {
        "criteria": {
          "content": {
            "score": number,
            "feedback": "string",
            "suggestions": "string"
          },
          "style": {
            "score": number,
            "feedback": "string",
            "suggestions": "string"
          },
          "strategy": {
            "score": number,
            "feedback": "string",
            "suggestions": "string"
          },
          "overall": {
            "score": number,
            "feedback": "string"
          }
        },
        "totalScore": number,
        "keyTakeaways": ["string", "string", "string"]
      }
    `;
    
    // Call OpenAI API with gpt-4o-mini model
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert debate coach who provides detailed feedback on student speeches.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
    });
    
    // Extract the response content
    const content = response.choices[0]?.message?.content;
    
    if (!content) {
      return NextResponse.json(
        { error: 'Failed to generate feedback' },
        { status: 500 }
      );
    }
    
    // Parse the JSON response
    try {
      const feedback = JSON.parse(content);
      return NextResponse.json(feedback);
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      return NextResponse.json(
        { error: 'Failed to parse feedback', content },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error grading speech:', error);
    return NextResponse.json(
      { error: 'An error occurred while grading the speech' },
      { status: 500 }
    );
  }
} 