import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { topic, side } = await request.json();
    
    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }
    
    // Step 1: Generate a research brief on the topic to ensure factual accuracy
    const researchBrief = await generateResearchBrief(topic, side);
    
    // Step 2: Generate the structured debate case with ARES-I format
    const debateCase = await generateDebateCase(topic, side, researchBrief);
    
    return NextResponse.json(debateCase);
  } catch (error) {
    console.error('Error generating debate case:', error);
    return NextResponse.json(
      { error: 'An error occurred while generating the debate case' },
      { status: 500 }
    );
  }
}

// Generate a research brief to ensure factual accuracy
async function generateResearchBrief(topic: string, side: string): Promise<string> {
  const prompt = `
    You are a professional researcher preparing a factual brief on the following debate topic:
    
    Topic: "${topic}"
    Side to argue: "${side || 'Proposition'}"
    
    Please provide a comprehensive research brief that includes:
    1. Key facts and statistics related to this topic
    2. Major arguments for the ${side || 'proposition'} side
    3. Credible sources and studies that can be cited (only include real, verifiable sources)
    4. Important context and background information
    
    This research will be used to create a debate case, so focus on accuracy and factual information.
    DO NOT make up or fabricate any statistics, studies, or sources.
    If you're uncertain about specific facts, acknowledge the limitations of available information.
  `;
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are a professional researcher who provides accurate, factual information with real sources. Never fabricate information.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.7,
  });
  
  return response.choices[0]?.message?.content || '';
}

// Generate the structured debate case with ARES-I format
async function generateDebateCase(topic: string, side: string, researchBrief: string) {
  const prompt = `
    You are an expert debate coach creating a structured case for a Middle School Public Debate Program (MSPDP) format debate.
    
    The debate topic is: "${topic}"
    The side to argue is: "${side || 'Proposition'}"
    
    Use the following research brief to ensure factual accuracy:
    
    ${researchBrief}
    
    Please generate a complete debate case using the ARES-I format for each point:
    - A: Assertion (a clear claim)
    - R: Reasoning (logical explanation of why the assertion is true)
    - E: Evidence (specific facts, statistics, or examples that support the reasoning)
    - S: Source (a credible, real-world source for the evidence - be specific with names, years, and publications)
    - I: Impact (why this point matters in the broader context of the debate)
    
    Create 6 unique, well-developed points using this format. Each point should be distinct and address a different aspect of the topic.
    
    Also include:
    - An introduction that frames the debate
    - A conclusion that summarizes the key points
    - Suggestions for how to allocate the 6 points between Speaker 1 and Speaker 2
    
    Format your response as a JSON object with the following structure:
    {
      "introduction": "string",
      "points": [
        {
          "assertion": "string",
          "reasoning": "string",
          "evidence": "string",
          "source": "string",
          "impact": "string"
        },
        // 5 more points with the same structure
      ],
      "conclusion": "string",
      "speakerAllocation": {
        "speaker1": ["Point 1", "Point 2", "Point 3"], // List of points for Speaker 1
        "speaker2": ["Point 4", "Point 5", "Point 6"]  // List of points for Speaker 2
      }
    }
    
    IMPORTANT GUIDELINES:
    1. Ensure all 6 points are unique and address different aspects of the topic
    2. Make each point thorough and well-developed
    3. Use ONLY real, verifiable sources - never fabricate sources or evidence
    4. If uncertain about specific facts, acknowledge limitations rather than making things up
    5. Ensure the evidence directly supports the reasoning and assertion
    6. Make the impact meaningful and relevant to the debate
  `;
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are an expert debate coach who creates structured debate cases using the ARES-I format. You prioritize factual accuracy and never fabricate information.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  });
  
  // Extract the response content
  const content = response.choices[0]?.message?.content;
  
  if (!content) {
    throw new Error('Failed to generate debate case');
  }
  
  // Parse the JSON response
  try {
    const debateCase = JSON.parse(content);
    
    // Validate the structure to ensure it has all required elements
    if (!debateCase.introduction || !debateCase.points || !Array.isArray(debateCase.points) || 
        debateCase.points.length < 6 || !debateCase.conclusion || !debateCase.speakerAllocation) {
      throw new Error('Generated debate case has an invalid structure');
    }
    
    return debateCase;
  } catch (error) {
    console.error('Error parsing OpenAI response:', error);
    throw new Error('Failed to parse debate case');
  }
} 