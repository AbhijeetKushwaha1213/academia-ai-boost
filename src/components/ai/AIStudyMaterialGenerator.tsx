
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wand2, Plus, Loader2, BookOpen, Brain, FileQuestion, GitBranch, FileText, Upload, FileCheck, X } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { useStudyMaterials } from '@/hooks/useStudyMaterials';

type MaterialType = 'flashcards' | 'mindmaps' | 'quizzes' | 'diagrams' | 'notes';

interface GeneratedMaterial {
  id: string;
  type: MaterialType;
  title: string;
  content: any;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  created_at: string;
  selected: boolean;
}

export const AIStudyMaterialGenerator = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { createMultipleMaterials, isBulkCreating } = useStudyMaterials();
  const [content, setContent] = useState('');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [materialType, setMaterialType] = useState<MaterialType>('flashcards');
  const [count, setCount] = useState('5');
  const [generatedMaterials, setGeneratedMaterials] = useState<GeneratedMaterial[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [uploadedContent, setUploadedContent] = useState('');

  const materialIcons = {
    flashcards: BookOpen,
    mindmaps: Brain,
    quizzes: FileQuestion,
    diagrams: GitBranch,
    notes: FileText
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (50KB limit)
    if (file.size > 50 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload files smaller than 50KB.",
        variant: "destructive",
      });
      return;
    }

    // Check file type
    const allowedTypes = ['text/plain', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Unsupported file type",
        description: "Please upload a PDF or text file.",
        variant: "destructive",
      });
      return;
    }

    try {
      let fileContent = '';
      
      if (file.type === 'text/plain') {
        fileContent = await file.text();
      } else if (file.type === 'application/pdf') {
        // For now, show message about PDF support
        toast({
          title: "PDF Processing",
          description: "PDF text extraction will be implemented. Using filename as topic for now.",
        });
        fileContent = `PDF content from: ${file.name}`;
      }

      setUploadedFile(file.name);
      setUploadedContent(fileContent);
      
      toast({
        title: "File uploaded successfully",
        description: `${file.name} has been processed and is ready for generation.`,
      });
    } catch (error) {
      console.error('File upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to process the file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const clearFile = () => {
    setUploadedFile(null);
    setUploadedContent('');
  };

  const generateMaterial = async () => {
    const finalContent = content.trim() || uploadedContent.trim();
    
    if (!finalContent && !topic.trim()) {
      toast({
        title: "Input Required",
        description: "Please provide either content to study or a topic.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      console.log('AIStudyMaterialGenerator: Starting generation:', { 
        type: materialType, 
        finalContent, 
        topic, 
        difficulty, 
        count 
      });
      
      // Simulate AI generation with proper content structure
      const materials = [];
      const numItems = parseInt(count);
      const materialTopic = topic || finalContent.substring(0, 30) + '...';
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      for (let i = 0; i < numItems; i++) {
        let materialContent;
        
        switch (materialType) {
          case 'flashcards':
            materialContent = {
              question: `What is the key concept about "${materialTopic}" that relates to point ${i + 1}?`,
              answer: `This is a detailed answer for concept ${i + 1} about ${materialTopic}. The answer explains the fundamental principles and provides practical examples for better understanding.`,
              tags: [topic.toLowerCase() || 'study', difficulty]
            };
            break;
          case 'mindmaps':
            materialContent = {
              central_topic: materialTopic,
              branches: [
                { title: `Branch ${i + 1}A`, subtopics: [`Subtopic 1`, `Subtopic 2`] },
                { title: `Branch ${i + 1}B`, subtopics: [`Subtopic 3`, `Subtopic 4`] }
              ]
            };
            break;
          case 'quizzes':
            materialContent = {
              question: `Quiz question ${i + 1} about ${materialTopic}?`,
              options: ['Option A', 'Option B', 'Option C', 'Option D'],
              correct_answer: 0,
              explanation: `Explanation for question ${i + 1} about ${materialTopic}.`
            };
            break;
          case 'diagrams':
            materialContent = {
              title: `${materialTopic} - Diagram ${i + 1}`,
              components: [`Component A`, `Component B`, `Component C`],
              relationships: [`A connects to B`, `B influences C`]
            };
            break;
          case 'notes':
            materialContent = {
              title: `${materialTopic} - Note ${i + 1}`,
              content: `Comprehensive notes about ${materialTopic}, covering key concepts, important formulas, and practical applications. This section explains the fundamental principles in detail.`,
              key_points: [`Key point 1`, `Key point 2`, `Key point 3`]
            };
            break;
        }

        materials.push({
          id: `generated-${Date.now()}-${i}`,
          type: materialType,
          title: `${materialTopic} - ${materialType.charAt(0).toUpperCase() + materialType.slice(1)} ${i + 1}`,
          content: materialContent,
          topic: materialTopic,
          difficulty,
          created_at: new Date().toISOString(),
          selected: true
        });
      }

      console.log('AIStudyMaterialGenerator: Generated materials:', materials);
      setGeneratedMaterials(materials);

      toast({
        title: "Materials Generated Successfully! 🎉",
        description: `Generated ${materials.length} ${materialType}. Review and select which ones to save.`,
      });
    } catch (error) {
      console.error('AIStudyMaterialGenerator: Error generating materials:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate study materials. Please try again with different content.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleMaterialSelection = (materialId: string) => {
    setGeneratedMaterials(prev => 
      prev.map(material => 
        material.id === materialId ? { ...material, selected: !material.selected } : material
      )
    );
  };

  const saveSelectedMaterials = async () => {
    const selectedMaterials = generatedMaterials.filter(material => material.selected);
    if (selectedMaterials.length === 0) {
      toast({
        title: "No Materials Selected",
        description: "Please select at least one material to save.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('AIStudyMaterialGenerator: Saving selected materials:', selectedMaterials);
      
      // Convert to the format expected by the database
      const materialsToSave = selectedMaterials.map(material => ({
        title: material.title,
        content: material.content,
        type: material.type,
        topic: material.topic,
        difficulty: material.difficulty,
        tags: [], // Can be enhanced later
        source: uploadedFile || content.substring(0, 50) || topic,
      }));

      // Save using the hook
      createMultipleMaterials(materialsToSave);
      
      // Reset form on success (the hook will handle the success toast)
      setGeneratedMaterials([]);
      setContent('');
      setTopic('');
      setUploadedContent('');
      setUploadedFile(null);
    } catch (error) {
      console.error('AIStudyMaterialGenerator: Error in saving process:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save study materials. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderMaterialPreview = (material: GeneratedMaterial) => {
    const IconComponent = materialIcons[material.type];
    
    return (
      <Card 
        key={material.id} 
        className={`p-4 cursor-pointer transition-all ${
          material.selected ? 'ring-2 ring-purple-500 bg-purple-50' : 'hover:shadow-md'
        }`}
        onClick={() => toggleMaterialSelection(material.id)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <IconComponent className="w-4 h-4 text-purple-600" />
              <h4 className="font-medium text-gray-900">{material.title}</h4>
              <Badge variant="outline" className="text-xs">
                {material.difficulty}
              </Badge>
            </div>
            
            {/* Render different previews based on type */}
            {material.type === 'flashcards' && (
              <div className="text-sm text-gray-600">
                <p><strong>Q:</strong> {material.content.question}</p>
                <p className="mt-1"><strong>A:</strong> {material.content.answer.substring(0, 100)}...</p>
              </div>
            )}
            
            {material.type === 'mindmaps' && (
              <div className="text-sm text-gray-600">
                <p><strong>Central Topic:</strong> {material.content.central_topic}</p>
                <p><strong>Branches:</strong> {material.content.branches.length} main branches</p>
              </div>
            )}
            
            {material.type === 'quizzes' && (
              <div className="text-sm text-gray-600">
                <p><strong>Q:</strong> {material.content.question}</p>
                <p><strong>Options:</strong> {material.content.options.length} choices</p>
              </div>
            )}
            
            {material.type === 'diagrams' && (
              <div className="text-sm text-gray-600">
                <p><strong>Components:</strong> {material.content.components.join(', ')}</p>
              </div>
            )}
            
            {material.type === 'notes' && (
              <div className="text-sm text-gray-600">
                <p>{material.content.content.substring(0, 150)}...</p>
              </div>
            )}
          </div>
          <div className="ml-4">
            {material.selected ? (
              <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            ) : (
              <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
            )}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6 pb-20">
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Wand2 className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-semibold text-gray-900">AI Study Material Generator</h2>
        </div>

        <div className="space-y-4">
          {/* Material Type Selection */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              What would you like to generate?
            </label>
            <Select value={materialType} onValueChange={(value: MaterialType) => setMaterialType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flashcards">📚 Flashcards</SelectItem>
                <SelectItem value="mindmaps">🧠 Mind Maps</SelectItem>
                <SelectItem value="quizzes">❓ Quizzes</SelectItem>
                <SelectItem value="diagrams">📊 Diagrams</SelectItem>
                <SelectItem value="notes">📝 Revision Notes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* File Upload */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Upload Study Material</label>
            
            {!uploadedFile ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">Upload your notes, documents, or study materials</p>
                <p className="text-xs text-gray-500 mb-3">Supported: PDF, TXT (Max: 50KB)</p>
                <Input
                  type="file"
                  accept=".pdf,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  Choose File
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <FileCheck className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-800">{uploadedFile}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearFile}
                  className="text-green-600 hover:text-green-800"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="text-center text-sm text-gray-500">OR</div>

          {/* Manual Content Input */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Paste Study Content
            </label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your study material, notes, or textbook content here..."
              rows={4}
            />
          </div>

          <div className="text-center text-sm text-gray-500">OR</div>

          {/* Topic Input */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Enter Topic/Subject
            </label>
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Photosynthesis, World War II, Calculus, Machine Learning..."
            />
          </div>

          {/* Configuration Options */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Difficulty Level
              </label>
              <Select value={difficulty} onValueChange={(value: 'easy' | 'medium' | 'hard') => setDifficulty(value)}>
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

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Number to Generate
              </label>
              <Select value={count} onValueChange={setCount}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 items</SelectItem>
                  <SelectItem value="5">5 items</SelectItem>
                  <SelectItem value="10">10 items</SelectItem>
                  <SelectItem value="15">15 items</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Generate Button */}
          <Button 
            onClick={generateMaterial}
            disabled={isGenerating || (!content.trim() && !topic.trim() && !uploadedContent.trim())}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating {materialType}...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Generate {materialType.charAt(0).toUpperCase() + materialType.slice(1)}
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Generated Materials Preview */}
      {generatedMaterials.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Generated {materialType.charAt(0).toUpperCase() + materialType.slice(1)}</h3>
            <Button 
              onClick={saveSelectedMaterials}
              disabled={isBulkCreating || !generatedMaterials.some(material => material.selected)}
              className="bg-green-600 hover:bg-green-700"
            >
              {isBulkCreating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Save Selected ({generatedMaterials.filter(material => material.selected).length})
                </>
              )}
            </Button>
          </div>

          <div className="space-y-4">
            {generatedMaterials.map(renderMaterialPreview)}
          </div>
        </Card>
      )}
    </div>
  );
};
