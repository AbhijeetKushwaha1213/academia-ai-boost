
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ExternalLink, BookOpen, Video, Code, Music, Palette } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  provider: string;
  difficulty: string;
  duration: string;
  rating: number;
  tags: string[];
  url: string;
}

interface APIIntegration {
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  isConnected: boolean;
  courses?: Course[];
}

export const ExternalAPIIntegrations = () => {
  const [integrations, setIntegrations] = useState<APIIntegration[]>([
    {
      name: 'Khan Academy',
      icon: BookOpen,
      description: 'Access thousands of free educational videos and practice exercises',
      isConnected: false,
      courses: [
        {
          id: '1',
          title: 'Algebra Basics',
          provider: 'Khan Academy',
          difficulty: 'Beginner',
          duration: '4 hours',
          rating: 4.8,
          tags: ['Mathematics', 'Algebra'],
          url: 'https://www.khanacademy.org/math/algebra-basics'
        },
        {
          id: '2',
          title: 'Introduction to Programming',
          provider: 'Khan Academy',
          difficulty: 'Beginner',
          duration: '6 hours',
          rating: 4.7,
          tags: ['Programming', 'JavaScript'],
          url: 'https://www.khanacademy.org/computing/computer-programming'
        }
      ]
    },
    {
      name: 'Coursera',
      icon: Video,
      description: 'Access university-level courses from top institutions',
      isConnected: false,
      courses: [
        {
          id: '3',
          title: 'Machine Learning',
          provider: 'Stanford University',
          difficulty: 'Advanced',
          duration: '54 hours',
          rating: 4.9,
          tags: ['AI', 'Machine Learning', 'Python'],
          url: 'https://www.coursera.org/learn/machine-learning'
        },
        {
          id: '4',
          title: 'Data Structures and Algorithms',
          provider: 'UC San Diego',
          difficulty: 'Intermediate',
          duration: '40 hours',
          rating: 4.6,
          tags: ['Programming', 'Algorithms', 'Data Structures'],
          url: 'https://www.coursera.org/specializations/data-structures-algorithms'
        }
      ]
    },
    {
      name: 'LeetCode',
      icon: Code,
      description: 'Practice coding problems and prepare for technical interviews',
      isConnected: false,
    },
    {
      name: 'Duolingo',
      icon: Music,
      description: 'Learn languages through gamified lessons',
      isConnected: false,
    }
  ]);

  const handleConnect = (integrationName: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.name === integrationName 
        ? { ...integration, isConnected: !integration.isConnected }
        : integration
    ));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-sm ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">External Learning Integrations</h2>
        <p className="text-gray-600">Connect with popular learning platforms to expand your study resources</p>
      </div>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map((integration) => (
          <Card key={integration.name} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <integration.icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">{integration.name}</h3>
                  <p className="text-sm text-gray-600">{integration.description}</p>
                </div>
              </div>
              <Button
                variant={integration.isConnected ? "default" : "outline"}
                size="sm"
                onClick={() => handleConnect(integration.name)}
              >
                {integration.isConnected ? 'Connected' : 'Connect'}
              </Button>
            </div>

            {integration.isConnected && integration.courses && (
              <div className="space-y-3 mt-4">
                <h4 className="text-sm font-medium text-gray-700">Recommended Courses</h4>
                {integration.courses.map((course) => (
                  <div key={course.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-medium text-sm">{course.title}</h5>
                      <a
                        href={course.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                      <span>{course.provider}</span>
                      <div className="flex items-center space-x-1">
                        {renderStars(course.rating)}
                        <span className="ml-1">({course.rating})</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge className={getDifficultyColor(course.difficulty)}>
                          {course.difficulty}
                        </Badge>
                        <span className="text-xs text-gray-500">{course.duration}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {course.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Integration Status */}
      <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">Integration Status</h3>
            <p className="text-sm text-gray-600">
              {integrations.filter(i => i.isConnected).length} of {integrations.length} integrations active
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">
              {Math.round((integrations.filter(i => i.isConnected).length / integrations.length) * 100)}%
            </div>
            <p className="text-xs text-gray-500">Connected</p>
          </div>
        </div>
        <Progress 
          value={(integrations.filter(i => i.isConnected).length / integrations.length) * 100} 
          className="mt-3"
        />
      </Card>

      {/* Benefits of Integration */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Benefits of Integration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-sm">Expanded Content Library</h4>
              <p className="text-xs text-gray-600">Access thousands of additional courses and resources</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Palette className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <h4 className="font-medium text-sm">Personalized Recommendations</h4>
              <p className="text-xs text-gray-600">Get course suggestions based on your learning goals</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Video className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-sm">Unified Progress Tracking</h4>
              <p className="text-xs text-gray-600">Track progress across all platforms in one place</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Code className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <h4 className="font-medium text-sm">Seamless Integration</h4>
              <p className="text-xs text-gray-600">Access external content without leaving StudyMate</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
