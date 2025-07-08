
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

    // Enhanced system prompts for different content types
    const getSystemPrompt = (type: string) => {
      const basePrompt = `You are an expert educational content creator. Generate ONLY accurate, relevant, and well-structured content. Do not hallucinate or add unrelated information.`;
      
      switch (type) {
        case 'flashcards':
          return `${basePrompt}

Create flashcards in this EXACT JSON format:
{
  "flashcards": [
    {
      "question": "Clear, specific question about the topic",
      "answer": "Comprehensive but concise answer (2-3 sentences max)",
      "hint": "Optional helpful hint or memory aid"
    }
  ]
}

Rules:
- Focus on key concepts, definitions, and important facts
- Questions should test understanding, not just memorization
- Answers must be factual and to-the-point
- Include hints for complex concepts
- Generate exactly ${count || 5} flashcards`;

        case 'mindmaps':
          return `${basePrompt}

Create a mind map in this EXACT JSON format:
{
  "mindmap": {
    "central_topic": "Main topic name",
    "branches": [
      {
        "title": "Main branch name",
        "subtopics": [
          "Subtopic 1",
          "Subtopic 2"
        ],
        "details": "Brief explanation of this branch"
      }
    ]
  }
}

Rules:
- Central topic should be the main subject
- Create 4-6 main branches maximum
- Each branch should have 2-4 subtopics
- Keep subtopics concise (1-3 words)
- Details should explain the connection to main topic`;

        case 'quizzes':
          return `${basePrompt}

Create quiz questions in this EXACT JSON format:
{
  "quiz": [
    {
      "question": "Clear, specific question",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer": 0,
      "explanation": "Why this answer is correct and others are wrong"
    }
  ]
}

Rules:
- Questions should test understanding and application
- Always provide exactly 4 options
- correct_answer is the index (0-3) of the correct option
- Explanations must be educational and clear
- Mix difficulty levels appropriately
- Generate exactly ${count || 5} questions`;

        case 'diagrams':
          return `${basePrompt}

Create diagram descriptions in this EXACT JSON format:
{
  "diagram": {
    "title": "Diagram title",
    "type": "flowchart|hierarchy|process|concept",
    "components": [
      {
        "id": "component1",
        "label": "Component name",
        "description": "What this represents"
      }
    ],
    "connections": [
      {
        "from": "component1",
        "to": "component2",
        "relationship": "leads to|part of|causes|connects to"
      }
    ]
  }
}

Rules:
- Create clear, logical flow or hierarchy
- Components should be key elements of the topic
- Connections must show relationships accurately
- Keep labels concise but descriptive`;

        case 'notes':
          return `${basePrompt}

Create revision notes in this EXACT JSON format:
{
  "notes": {
    "title": "Topic title",
    "summary": "Brief 1-2 sentence overview",
    "key_points": [
      {
        "heading": "Main point heading",
        "content": "Detailed explanation",
        "importance": "high|medium|low"
      }
    ],
    "formulas": [
      {
        "name": "Formula name",
        "formula": "Mathematical expression",
        "explanation": "When and how to use"
      }
    ],
    "quick_facts": [
      "Important fact 1",
      "Important fact 2"
    ]
  }
}

Rules:
- Start with clear overview
- 5-8 key points maximum
- Include relevant formulas if applicable
- Quick facts should be memorable points
- Use student-friendly language`;

        default:
          return `${basePrompt} Provide helpful, accurate information about the topic.`;
      }
    };

    const systemPrompt = contentType ? getSystemPrompt(contentType) : 
      `You are a helpful AI study assistant for students. You specialize in helping with:
      - Study planning and organization
      - Explaining complex topics
      - Creating practice questions
      - Providing study tips and motivation
      - Time management advice
      
      Be encouraging, concise, and educational. Always try to provide actionable advice.`;

    const userPrompt = contentType ? 
      `Topic: ${topic || message}
      Difficulty Level: ${difficulty || 'medium'}
      Subject Context: ${subject || 'general'}
      
      Generate ${contentType} content for this topic. Focus only on the provided topic and ensure all content is accurate and relevant.` 
      : message;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    console.log('Calling OpenAI with enhanced prompts for content type:', contentType);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 1500,
        temperature: 0.3, // Lower temperature for more consistent, factual output
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', response.status, errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";

    console.log('AI response generated successfully');

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
