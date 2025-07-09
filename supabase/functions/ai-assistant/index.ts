
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, context, userType, subject, contentType, topic, difficulty, count } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Enhanced system prompts for different content types with strict topic anchoring
    const getSystemPrompt = (type: string) => {
      const basePrompt = `You are an expert educational content creator specializing in accurate, relevant study materials.

CRITICAL TOPIC FOCUS RULES:
1. ONLY generate content DIRECTLY related to the specific topic: "${topic || message}"
2. DO NOT include unrelated subjects or tangential information
3. Ensure all concepts are factually accurate and pedagogically sound
4. Stay within the scope of the requested topic
5. Use clear, educational language appropriate for the difficulty level

TOPIC: "${topic || message}"
DIFFICULTY: ${difficulty || 'medium'}`;
      
      switch (type) {
        case 'flashcards':
          return `${basePrompt}

Create educational flashcards in this EXACT JSON format:
{
  "flashcards": [
    {
      "title": "Clear, descriptive title for ${topic || message}",
      "question": "Specific, testable question about ${topic || message}",
      "answer": "Comprehensive but concise answer (2-4 sentences) about ${topic || message}",
      "hint": "Optional helpful memory aid or clue for ${topic || message}"
    }
  ]
}

FLASHCARD CREATION RULES:
- Generate exactly ${count || 5} flashcards
- Focus ONLY on key concepts within "${topic || message}"
- Questions should test understanding, not just memorization
- Answers must be factually accurate and complete
- Include hints for complex concepts when helpful
- Use progressive difficulty if multiple cards
- Ensure each card covers a distinct aspect of ${topic || message}

QUALITY STANDARDS:
- Questions should be clear and unambiguous
- Answers should be educational and comprehensive
- No hallucinated or invented information
- Maintain consistency with established knowledge in the field`;

        case 'mindmaps':
          return `${basePrompt}

Create a mind map in this EXACT JSON format:
{
  "mindmap": {
    "central_topic": "${topic || message}",
    "branches": [
      {
        "title": "Main branch directly related to ${topic || message}",
        "subtopics": [
          "Specific subtopic 1 within ${topic || message}",
          "Specific subtopic 2 within ${topic || message}"
        ],
        "details": "Brief explanation connecting to ${topic || message}"
      }
    ]
  }
}

MIND MAP RULES:
- Central topic must be exactly "${topic || message}"
- Create 4-6 main branches maximum
- Each branch should have 2-4 relevant subtopics
- All content must relate directly to ${topic || message}
- Use hierarchical thinking from general to specific`;

        case 'quizzes':
          return `${basePrompt}

Create quiz questions in this EXACT JSON format:
{
  "quiz": [
    {
      "question": "Clear, specific question testing knowledge of ${topic || message}",
      "options": ["Correct answer about ${topic}", "Plausible distractor", "Another distractor", "Third distractor"],
      "correct_answer": 0,
      "explanation": "Educational explanation of why this answer is correct for ${topic || message}"
    }
  ]
}

QUIZ CREATION RULES:
- Generate exactly ${count || 5} questions
- All questions must test knowledge of ${topic || message}
- Provide exactly 4 options per question
- Use index 0-3 for correct_answer
- Create plausible but incorrect distractors
- Include educational explanations
- Vary question types (factual, conceptual, application)`;

        case 'notes':
          return `${basePrompt}

Create comprehensive revision notes in this EXACT JSON format:
{
  "notes": {
    "title": "${topic || message}",
    "summary": "Concise 2-3 sentence overview of ${topic || message}",
    "key_points": [
      {
        "heading": "Main concept within ${topic || message}",
        "content": "Detailed explanation of this concept",
        "importance": "high"
      }
    ],
    "formulas": [
      {
        "name": "Formula name related to ${topic || message}",
        "formula": "Mathematical expression",
        "explanation": "When and how to use this formula"
      }
    ],
    "quick_facts": [
      "Important fact 1 about ${topic || message}",
      "Important fact 2 about ${topic || message}"
    ]
  }
}

NOTES CREATION RULES:
- Start with clear overview of ${topic || message}
- Include 5-8 key points covering main concepts
- Add relevant formulas only if applicable
- Provide memorable quick facts
- Use student-friendly language
- Maintain academic accuracy`;

        default:
          return `${basePrompt}

Provide helpful, accurate information ONLY about "${topic || message}".
Focus on educational content that helps students understand this specific topic.
Be encouraging, clear, and pedagogically sound.`;
      }
    };

    const systemPrompt = contentType ? getSystemPrompt(contentType) : 
      `You are a helpful AI study assistant focused on the specific topic: "${topic || message}"
      
      Provide accurate, educational information about this topic.
      Be encouraging, concise, and maintain focus on the subject matter.
      Help students understand concepts clearly and thoroughly.`;

    const userPrompt = contentType ? 
      `Generate ${contentType} content for the topic: "${topic || message}"
      Difficulty Level: ${difficulty || 'medium'}
      ${count ? `Number of items: ${count}` : ''}
      
      Focus exclusively on "${topic || message}" and ensure all content is:
      - Factually accurate and educationally sound
      - Directly relevant to the specified topic
      - Appropriate for the ${difficulty || 'medium'} difficulty level
      - Well-structured and clear for students
      
      Do not include unrelated concepts or subjects.` 
      : message;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    console.log('Calling OpenAI with enhanced topic-focused prompts for:', contentType, 'Topic:', topic || message);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 2000,
        temperature: 0.2, // Low temperature for consistent, focused output
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', response.status, errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";

    console.log('AI response generated successfully for topic:', topic || message);

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-assistant function:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to process request',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
