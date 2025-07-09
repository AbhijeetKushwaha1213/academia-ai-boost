
import React, { useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Download, Copy, BookOpen, FileText, Brain, Zap } from 'lucide-react';

interface GeneratedMaterial {
  id: string;
  type: 'flashcards' | 'quiz' | 'summary' | 'mindmap';
  title: string;
  content: any;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  created_at: string;
}

export const AIStudyMaterialGenerator = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [topic, setTopic] = useState('');
  const [materialType, setMaterialType] = useState<'flashcards' | 'quiz' | 'summary' | 'mindmap'>('flashcards');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMaterial, setGeneratedMaterial] = useState<GeneratedMaterial | null>(null);
  const [recentMaterials, setRecentMaterials] = useState<GeneratedMaterial[]>([]);

  const generateMaterial = async () => {
    if (!topic.trim()) {
      toast({
        title: "Topic Required",
        description: "Please enter a topic to generate study materials.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate AI generation with realistic content
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockContent = generateMockContent(materialType, topic, difficulty);
      
      const newMaterial: GeneratedMaterial = {
        id: Date.now().toString(),
        type: materialType,
        title: `${topic} - ${materialType}`,
        content: mockContent,
        difficulty,
        topic,
        created_at: new Date().toISOString()
      };

      setGeneratedMaterial(newMaterial);
      setRecentMaterials(prev => [newMaterial, ...prev.slice(0, 4)]);
      
      toast({
        title: "Study Material Generated!",
        description: `Successfully created ${materialType} for ${topic}`,
      });
    } catch (error) {
      console.error('Error generating material:', error);
      toast({
        title: "Generation Failed",
        description: "There was an error generating your study material. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMockContent = (type: string, topic: string, difficulty: string) => {
    switch (type) {
      case 'flashcards':
        return {
          cards: [
            { front: `What is ${topic}?`, back: `${topic} is a fundamental concept in ${user?.user_type === 'college' ? 'your studies' : user?.exam_type || 'your preparation'}.` },
            { front: `Key principles of ${topic}`, back: `The main principles include understanding the core concepts and practical applications.` },
            { front: `Applications of ${topic}`, back: `${topic} can be applied in various real-world scenarios and problem-solving situations.` }
          ]
        };
      case 'quiz':
        return {
          questions: [
            {
              question: `What is the primary focus of ${topic}?`,
              options: ['Option A', 'Option B', 'Option C', 'Option D'],
              correct: 0
            },
            {
              question: `Which of the following best describes ${topic}?`,
              options: ['Description A', 'Description B', 'Description C', 'Description D'],
              correct: 1
            }
          ]
        };
      case 'summary':
        return {
          summary: `${topic} is an important subject that requires understanding of key concepts and principles. This summary covers the essential points you need to know for ${user?.user_type === 'college' ? 'your academic success' : 'exam preparation'}.`,
          keyPoints: [
            `Understanding the fundamentals of ${topic}`,
            'Practical applications and examples',
            'Common misconceptions to avoid',
            'Tips for effective study and retention'
          ]
        };
      case 'mindmap':
        return {
          central: topic,
          branches: [
            { name: 'Key Concepts', children: ['Concept A', 'Concept B', 'Concept C'] },
            { name: 'Applications', children: ['Application 1', 'Application 2', 'Application 3'] },
            { name: 'Examples', children: ['Example 1', 'Example 2', 'Example 3'] }
          ]
        };
      default:
        return {};
    }
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied to Clipboard",
      description: "Content has been copied to your clipboard.",
    });
  };

  const downloadMaterial = () => {
    if (!generatedMaterial) return;
    
    const dataStr = JSON.stringify(generatedMaterial, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${generatedMaterial.title.replace(/\s+/g, '_')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">AI Study Material Generator</h1>
        <p className="text-gray-600">Generate personalized study materials using AI</p>
      </div>

      {/* Generation Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Generate New Material
          </CardTitle>
          <CardDescription>
            Create custom study materials tailored to your learning needs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Topic</label>
            <Textarea
              placeholder="Enter the topic you want to study (e.g., 'Photosynthesis', 'Calculus Integration', 'World War II')"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Material Type</label>
              <Select value={materialType} onValueChange={(value: any) => setMaterialType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flashcards">Flashcards</SelectItem>
                  <SelectItem value="quiz">Quiz</SelectItem>
                  <SelectItem value="summary">Summary</SelectItem>
                  <SelectItem value="mindmap">Mind Map</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Difficulty Level</label>
              <Select value={difficulty} onValueChange={(value: any) => setDifficulty(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={generateMaterial} 
            disabled={isGenerating || !topic.trim()}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Generate Study Material
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Material Display */}
      {generatedMaterial && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  {generatedMaterial.title}
                </CardTitle>
                <CardDescription>
                  <Badge variant="outline" className="mr-2">
                    {generatedMaterial.type}
                  </Badge>
                  <Badge variant="outline">
                    {generatedMaterial.difficulty}
                  </Badge>
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(JSON.stringify(generatedMaterial.content, null, 2))}>
                  <Copy className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={downloadMaterial}>
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {generatedMaterial.type === 'flashcards' && (
                <div className="space-y-2">
                  {generatedMaterial.content.cards?.map((card: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="font-medium text-sm text-gray-500 mb-1">Question {index + 1}</div>
                      <div className="font-semibold mb-2">{card.front}</div>
                      <div className="text-gray-700">{card.back}</div>
                    </div>
                  ))}
                </div>
              )}

              {generatedMaterial.type === 'quiz' && (
                <div className="space-y-4">
                  {generatedMaterial.content.questions?.map((q: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="font-semibold mb-3">{q.question}</div>
                      <div className="space-y-2">
                        {q.options.map((option: string, optIndex: number) => (
                          <div 
                            key={optIndex} 
                            className={`p-2 rounded ${optIndex === q.correct ? 'bg-green-100 border-green-300' : 'bg-gray-50'}`}
                          >
                            {option} {optIndex === q.correct && '✓'}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {generatedMaterial.type === 'summary' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Summary</h3>
                    <p className="text-gray-700">{generatedMaterial.content.summary}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Key Points</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {generatedMaterial.content.keyPoints?.map((point: string, index: number) => (
                        <li key={index} className="text-gray-700">{point}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {generatedMaterial.type === 'mindmap' && (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold">
                      {generatedMaterial.content.central}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {generatedMaterial.content.branches?.map((branch: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4">
                        <h3 className="font-semibold mb-2">{branch.name}</h3>
                        <ul className="list-disc list-inside space-y-1">
                          {branch.children.map((child: string, childIndex: number) => (
                            <li key={childIndex} className="text-sm text-gray-700">{child}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Materials */}
      {recentMaterials.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Recent Materials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentMaterials.map((material) => (
                <div
                  key={material.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => setGeneratedMaterial(material)}
                >
                  <div>
                    <div className="font-medium">{material.title}</div>
                    <div className="text-sm text-gray-500">
                      <Badge variant="outline" className="mr-1 text-xs">
                        {material.type}
                      </Badge>
                      {new Date(material.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
