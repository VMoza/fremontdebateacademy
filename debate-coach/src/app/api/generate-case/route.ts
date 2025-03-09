import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    console.log('Starting generate-case API route');
    
    // Log OpenAI API key presence (not the actual key)
    console.log('OpenAI API key present:', !!process.env.OPENAI_API_KEY);
    
    const { topic, side } = await request.json();
    
    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }
    
    console.log(`Generating case for topic: "${topic}", side: "${side || 'Proposition'}"`);
    
    // Step 1: Generate a research brief on the topic to ensure factual accuracy
    try {
      const researchBrief = await generateResearchBrief(topic, side);
      
      // Step 2: Generate the structured debate case with ARES-I format
      const debateCase = await generateDebateCase(topic, side, researchBrief);
      
      console.log('Successfully generated debate case');
      return NextResponse.json(debateCase);
    } catch (apiError) {
      console.error('OpenAI API error:', apiError);
      return NextResponse.json(
        { error: `OpenAI API error: ${apiError.message}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error generating debate case:', error);
    return NextResponse.json(
      { error: `An error occurred while generating the debate case: ${error.message}` },
      { status: 500 }
    );
  }
}

// Generate a research brief to ensure factual accuracy
async function generateResearchBrief(topic: string, side: string): Promise<string> {
  console.log('Generating research brief');
  
  const prompt = `
    You are a professional researcher preparing a factual brief on the following debate topic:
    
    Topic: "${topic}"
    Side to argue: "${side || 'Proposition'}"
    
    Please provide a comprehensive research brief that includes:
    1. Key facts and statistics related to this topic (be specific with numbers and data)
    2. Major arguments for the ${side || 'proposition'} side with supporting evidence
    3. Credible sources and studies that can be cited (only include real, verifiable sources with specific names, years, and publications)
    4. Important context and background information
    5. Expert opinions and quotes from recognized authorities in the field
    
    This research will be used to create a detailed debate case, so focus on accuracy, depth, and factual information.
    DO NOT make up or fabricate any statistics, studies, or sources.
    If you're uncertain about specific facts, acknowledge the limitations of available information.
    
    Provide at least 10 specific pieces of evidence that can be used in the debate case.
  `;
  
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a professional researcher who provides accurate, factual information with real sources. Never fabricate information. Be thorough and detailed in your research.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
    });
    
    console.log('Research brief generated successfully');
    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Error generating research brief:', error);
    throw new Error(`Failed to generate research brief: ${error.message}`);
  }
}

// Generate the structured debate case with ARES-I format
async function generateDebateCase(topic: string, side: string, researchBrief: string) {
  console.log('Generating debate case with ARES-I format');
  
  const prompt = `
    You are an expert debate coach creating a structured case for a Middle School Public Debate Program (MSPDP) format debate.
    
    The debate topic is: "${topic}"
    The side to argue is: "${side || 'Proposition'}"
    
    Use the following research brief to ensure factual accuracy:
    
    ${researchBrief}
    
    Please generate a complete debate case using the ARES-I format for each point:
    - A: Assertion (a clear, concise claim)
    - R: Reasoning (detailed logical explanation of why the assertion is true, 3-5 sentences that thoroughly explain the logic)
    - E: Evidence (comprehensive facts, statistics, or examples that support the reasoning, with specific numbers and details)
    - S: Source (a credible, real-world source for the evidence - be specific with names, years, publications, and credentials)
    - I: Impact (why this point matters in the broader context of the debate, connecting it to real-world significance)
    
    Create 6 unique, well-developed points using this format. Each point should be distinct and address a different aspect of the topic.
    
    IMPORTANT GUIDELINES FOR EACH COMPONENT:
    
    For REASONING:
    - Provide 3-5 detailed sentences that thoroughly explain the logical connection
    - Include cause-and-effect relationships
    - Address potential counterarguments where appropriate
    - Use clear, logical progression of ideas
    
    For EVIDENCE:
    - Include specific statistics with numbers where possible
    - Provide concrete examples that illustrate the point
    - Use a mix of quantitative and qualitative evidence
    - Make sure evidence directly supports the reasoning
    
    For SOURCES:
    - Include author names, publication names, and years
    - Specify credentials of experts or organizations cited
    - Use a variety of source types (academic studies, expert opinions, government data, etc.)
    - Only use real, verifiable sources
    
    Also include:
    - An introduction that frames the debate (5-7 sentences)
    - A conclusion that summarizes the key points (4-6 sentences)
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
  `;
  
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert debate coach who creates structured debate cases using the ARES-I format. You prioritize factual accuracy, thorough reasoning, and comprehensive evidence. Never fabricate information. Make each point detailed and well-developed.',
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
      throw new Error('Failed to generate debate case: No content returned from OpenAI');
    }
    
    console.log('Debate case generated, parsing JSON response');
    
    // Parse the JSON response
    try {
      const debateCase = JSON.parse(content);
      
      // Validate the structure to ensure it has all required elements
      if (!debateCase.introduction || !debateCase.points || !Array.isArray(debateCase.points) || 
          debateCase.points.length < 6 || !debateCase.conclusion || !debateCase.speakerAllocation) {
        throw new Error('Generated debate case has an invalid structure');
      }
      
      console.log('Debate case parsed and validated successfully');
      return debateCase;
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      console.error('Raw content:', content);
      throw new Error(`Failed to parse debate case: ${parseError.message}`);
    }
  } catch (apiError) {
    console.error('OpenAI API error in generateDebateCase:', apiError);
    throw new Error(`Failed to generate debate case: ${apiError.message}`);
  }
} 