
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Wand2, Plus, Loader2 } from 'lucide-react';
import { useFlashcards } from '@/hooks/useFlashcards';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { FileUploadComponent } from './FileUploadComponent';

export const AIFlashcardGenerator = () => {
  const { user } = useAuth();
  const { createFlashcard, createStudyMaterial } = useFlashcards();
  const { toast } = useToast();
  const [content, setContent] = useState('');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [count, setCount] = useState('5');
  const [generatedCards, setGeneratedCards] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [uploadedContent, setUploadedContent] = useState('');

  const generateFlashcards = async () => {
    const finalContent = content.trim() || uploadedContent.trim();
    const finalTopic = topic.trim();
    
    if (!finalContent && !finalTopic) {
      toast({
        title: "Input Required",
        description: "Please provide either content to study or a specific topic.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      console.log('AIFlashcardGenerator: Starting generation with:', { finalContent, finalTopic, difficulty, count });
      
      // Call the AI assistant function for better content generation
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentType: 'flashcards',
          topic: finalTopic || finalContent.substring(0, 100),
          difficulty,
          count: parseInt(count),
          message: finalContent || finalTopic
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate flashcards');
      }

      const data = await response.json();
      let aiResponse = data.response;

      // Try to parse JSON response
      let parsedCards = [];
      try {
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          parsedCards = parsed.flashcards || [];
        }
      } catch (parseError) {
        console.error('Failed to parse AI response, using fallback generation');
        // Fallback to generating sample cards based on topic
        parsedCards = generateFallbackCards(finalTopic || finalContent, parseInt(count));
      }

      const cards = parsedCards.map((card: any, index: number) => ({
        id: `generated-${Date.now()}-${index}`,
        title: card.title || `${finalTopic || 'Study'} - Card ${index + 1}`,
        question: card.question || `Question about ${finalTopic || 'the topic'}`,
        answer: card.answer || `Answer for ${finalTopic || 'the topic'}`,
        hint: card.hint || undefined,
        tags: [finalTopic.toLowerCase() || 'study', difficulty],
        difficulty,
        selected: true
      }));

      console.log('AIFlashcardGenerator: Generated cards:', cards);
      setGeneratedCards(cards);

      toast({
        title: "Flashcards Generated Successfully!",
        description: `Generated ${cards.length} flashcards about "${finalTopic || 'your content'}". Review and select which ones to save.`,
      });
    } catch (error) {
      console.error('AIFlashcardGenerator: Error generating flashcards:', error);
      
      // Generate fallback cards on error
      const fallbackCards = generateFallbackCards(finalTopic || finalContent, parseInt(count));
      const cards = fallbackCards.map((card: any, index: number) => ({
        id: `fallback-${Date.now()}-${index}`,
        title: card.title,
        question: card.question,
        answer: card.answer,
        tags: [finalTopic.toLowerCase() || 'study', difficulty],
        difficulty,
        selected: true
      }));
      
      setGeneratedCards(cards);
      
      toast({
        title: "Using Offline Generation",
        description: `Generated ${cards.length} sample flashcards. AI service unavailable.`,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateFallbackCards = (topicText: string, cardCount: number) => {
    const topic = topicText.substring(0, 50);
    const cards = [];
    
    for (let i = 0; i < cardCount; i++) {
      cards.push({
        title: `${topic} - Concept ${i + 1}`,
        question: `What is an important concept related to ${topic}?`,
        answer: `This is a key concept about ${topic} that covers fundamental principles and practical applications for better understanding.`,
      });
    }
    
    return cards;
  };

  const toggleCardSelection = (cardId: string) => {
    console.log('AIFlashcardGenerator: Toggling card selection for:', cardId);
    setGeneratedCards(prev => 
      prev.map(card => 
        card.id === cardId ? { ...card, selected: !card.selected } : card
      )
    );
  };

  const createSelectedCards = async () => {
    const selectedCards = generatedCards.filter(card => card.selected);
    if (selectedCards.length === 0) {
      toast({
        title: "No Cards Selected",
        description: "Please select at least one flashcard to save.",
        variant: "destructive",
      });
      return;
    }

    if (!user?.user_id) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save flashcards.",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    let createdCount = 0;

    try {
      console.log('AIFlashcardGenerator: Creating selected cards for user:', user.user_id);
      
      for (const card of selectedCards) {
        try {
          console.log('Creating flashcard:', card.title);
          
          // Create flashcard - this will appear in FlashcardVault
          createFlashcard({
            title: card.title,
            question: card.question,
            answer: card.answer,
            difficulty: card.difficulty,
            tags: Array.isArray(card.tags) ? card.tags : [card.tags].filter(Boolean)
          });
          
          // Also create study material for comprehensive tracking
          createStudyMaterial({
            title: card.title,
            content: { 
              question: card.question, 
              answer: card.answer,
              hint: card.hint
            },
            type: 'flashcards',
            topic: topic || card.title.split(' - ')[0] || 'General',
            difficulty: card.difficulty,
            tags: Array.isArray(card.tags) ? card.tags : [card.tags].filter(Boolean),
            source: 'AI Generator'
          });
          
          createdCount++;
          console.log('Successfully created flashcard:', card.title);
        } catch (error) {
          console.error('AIFlashcardGenerator: Error creating card:', card.title, error);
        }
      }

      if (createdCount > 0) {
        toast({
          title: "Cards Saved Successfully!",
          description: `Successfully saved ${createdCount} flashcards. Go to the Flashcards tab to study them.`,
        });
        
        // Reset form
        setGeneratedCards([]);
        setContent('');
        setTopic('');
        setUploadedContent('');
      }
    } catch (error) {
      console.error('AIFlashcardGenerator: Error in creation process:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save some flashcards. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleFileContent = (fileContent: string, fileName: string) => {
    console.log('AIFlashcardGenerator: File content received:', { fileName, contentLength: fileContent.length });
    setUploadedContent(fileContent);
    if (fileContent) {
      toast({
        title: "File Processed",
        description: `Content from ${fileName} is ready for flashcard generation.`,
      });
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <Card className="p-8 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-purple-600 rounded-lg">
            <Wand2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">AI Flashcard Generator</h2>
            <p className="text-gray-600">Transform your study material into interactive flashcards</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* File Upload Component */}
          <FileUploadComponent onFileContent={handleFileContent} />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-purple-50 text-gray-500">OR</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-3 block">
              Study Content
            </label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your notes, textbook excerpts, or any study material here..."
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-purple-50 text-gray-500">OR</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-3 block">
              Specific Topic
            </label>
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Photosynthesis, Linear Algebra, World War II..."
              className="text-base"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">
                Difficulty Level
              </label>
              <Select value={difficulty} onValueChange={(value: 'easy' | 'medium' | 'hard') => setDifficulty(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy - Basic concepts</SelectItem>
                  <SelectItem value="medium">Medium - Standard level</SelectItem>
                  <SelectItem value="hard">Hard - Advanced concepts</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">
                Number of Cards
              </label>
              <Select value={count} onValueChange={setCount}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 cards</SelectItem>
                  <SelectItem value="5">5 cards</SelectItem>
                  <SelectItem value="10">10 cards</SelectItem>
                  <SelectItem value="15">15 cards</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={generateFlashcards}
            disabled={isGenerating || (!content.trim() && !topic.trim() && !uploadedContent.trim())}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 text-base font-medium"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating Flashcards...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5 mr-2" />
                Generate Flashcards with AI
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Generated Flashcards Preview */}
      {generatedCards.length > 0 && (
        <Card className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Generated Flashcards</h3>
              <p className="text-gray-600">Review and select flashcards to save to your collection</p>
            </div>
            <Button 
              onClick={createSelectedCards}
              disabled={isCreating || !generatedCards.some(card => card.selected)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Save Selected ({generatedCards.filter(card => card.selected).length})
                </>
              )}
            </Button>
          </div>

          <div className="grid gap-4">
            {generatedCards.map((card) => (
              <Card 
                key={card.id} 
                className={`p-6 cursor-pointer transition-all duration-200 ${
                  card.selected 
                    ? 'ring-2 ring-purple-500 bg-purple-50 border-purple-200' 
                    : 'hover:shadow-md border-gray-200'
                }`}
                onClick={() => toggleCardSelection(card.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-semibold text-gray-900">{card.title}</h4>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          card.difficulty === 'easy' ? 'border-green-300 text-green-700' :
                          card.difficulty === 'medium' ? 'border-yellow-300 text-yellow-700' :
                          'border-red-300 text-red-700'
                        }`}
                      >
                        {card.difficulty}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium text-blue-600">Q:</span> {card.question}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium text-green-600">A:</span> {card.answer}
                      </p>
                      {card.hint && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium text-yellow-600">Hint:</span> {card.hint}
                        </p>
                      )}
                    </div>
                    
                    {card.tags && card.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {card.tags.map((tag: string, tagIndex: number) => (
                          <Badge key={tagIndex} variant="secondary" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-6 flex-shrink-0">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      card.selected 
                        ? 'bg-purple-600 border-purple-600' 
                        : 'border-gray-300 hover:border-purple-400'
                    }`}>
                      {card.selected && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
