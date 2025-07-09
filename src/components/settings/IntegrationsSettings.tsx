
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Github, Linkedin, Code2, Trophy, ExternalLink, Settings, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  connected: boolean;
  color: string;
  authUrl?: string;
  lastSync?: string;
  data?: any;
}

export const IntegrationsSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState<string | null>(null);
  
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'github',
      name: 'GitHub',
      description: 'Sync your repositories and track coding progress',
      icon: <Github className="w-6 h-6" />,
      connected: false,
      color: 'border-gray-800 bg-gray-50',
      authUrl: 'https://github.com/login/oauth/authorize',
      data: null
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      description: 'Share achievements and connect with professionals',
      icon: <Linkedin className="w-6 h-6" />,
      connected: false,
      color: 'border-blue-600 bg-blue-50',
      authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
      data: null
    },
    {
      id: 'leetcode',
      name: 'LeetCode',
      description: 'Import coding challenges and track problem-solving stats',
      icon: <Code2 className="w-6 h-6" />,
      connected: false,
      color: 'border-orange-600 bg-orange-50',
      data: null
    }
  ]);

  const handleConnect = async (integrationId: string) => {
    setIsConnecting(integrationId);
    
    try {
      // Simulate OAuth flow
      toast({
        title: "Connecting...",
        description: `Redirecting to ${integrations.find(i => i.id === integrationId)?.name} authorization...`,
      });

      // In a real implementation, this would:
      // 1. Redirect to OAuth provider
      // 2. Handle callback
      // 3. Store tokens securely
      // 4. Fetch initial data

      // Simulate connection process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock successful connection with sample data
      const mockData = getMockData(integrationId);
      
      setIntegrations(prev => 
        prev.map(integration => 
          integration.id === integrationId 
            ? { 
                ...integration, 
                connected: true, 
                lastSync: new Date().toISOString(),
                data: mockData
              }
            : integration
        )
      );
      
      toast({
        title: "Connected Successfully! ✅",
        description: `Your ${integrations.find(i => i.id === integrationId)?.name} account is now connected.`,
      });

    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(null);
    }
  };

  const handleDisconnect = (integrationId: string) => {
    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === integrationId 
          ? { ...integration, connected: false, data: null, lastSync: undefined }
          : integration
      )
    );
    
    const integrationName = integrations.find(i => i.id === integrationId)?.name;
    toast({
      title: "Disconnected",
      description: `Successfully disconnected from ${integrationName}.`,
    });
  };

  const getMockData = (integrationId: string) => {
    switch (integrationId) {
      case 'github':
        return {
          username: 'john_doe',
          repositories: 24,
          commits: 156,
          streak: 12
        };
      case 'linkedin':
        return {
          connections: 342,
          posts: 8,
          profile_views: 89
        };
      case 'leetcode':
        return {
          problems_solved: 127,
          easy: 45,
          medium: 62,
          hard: 20,
          rating: 1540
        };
      default:
        return null;
    }
  };

  const renderConnectionData = (integration: Integration) => {
    if (!integration.connected || !integration.data) return null;

    switch (integration.id) {
      case 'github':
        return (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <p className="font-semibold text-gray-900">{integration.data.repositories}</p>
                <p className="text-gray-600">Repositories</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-900">{integration.data.commits}</p>
                <p className="text-gray-600">Commits</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-900">{integration.data.streak}</p>
                <p className="text-gray-600">Day Streak</p>
              </div>
            </div>
          </div>
        );
      case 'linkedin':
        return (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <p className="font-semibold text-blue-900">{integration.data.connections}</p>
                <p className="text-blue-700">Connections</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-blue-900">{integration.data.profile_views}</p>
                <p className="text-blue-700">Profile Views</p>
              </div>
            </div>
          </div>
        );
      case 'leetcode':
        return (
          <div className="mt-4 p-3 bg-orange-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <p className="font-semibold text-orange-900">{integration.data.problems_solved}</p>
                <p className="text-orange-700">Problems Solved</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-orange-900">{integration.data.rating}</p>
                <p className="text-orange-700">Rating</p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Platform Integrations</h2>
        <p className="text-gray-600">Connect your accounts to sync progress and enhance your learning experience</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((integration) => (
          <Card key={integration.id} className={`p-6 border-2 ${integration.color} ${integration.connected ? 'ring-2 ring-green-500' : ''}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${integration.connected ? 'bg-green-100' : 'bg-gray-100'}`}>
                  {integration.icon}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                    {integration.connected && (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{integration.description}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={integration.connected}
                  disabled={isConnecting === integration.id}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      handleConnect(integration.id);
                    } else {
                      handleDisconnect(integration.id);
                    }
                  }}
                />
                <span className="text-sm text-gray-600">
                  {isConnecting === integration.id ? 'Connecting...' : 
                   integration.connected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              
              {integration.connected && (
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Configure
                </Button>
              )}
            </div>

            {integration.connected && integration.lastSync && (
              <div className="text-xs text-gray-500 mb-2">
                Last synced: {new Date(integration.lastSync).toLocaleString()}
              </div>
            )}

            {renderConnectionData(integration)}

            {!integration.connected && (
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm text-yellow-800">
                    Connect to unlock progress tracking and personalized insights
                  </span>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Integration Benefits */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Trophy className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Why Connect Your Accounts?</h3>
            <p className="text-sm text-gray-600">Unlock powerful features and insights</p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div className="space-y-2">
            <p>• <strong>Automatic Progress Tracking:</strong> Sync your coding activity and achievements</p>
            <p>• <strong>Personalized Recommendations:</strong> Get study suggestions based on your activity</p>
          </div>
          <div className="space-y-2">
            <p>• <strong>Portfolio Integration:</strong> Showcase your projects and skills</p>
            <p>• <strong>Achievement Sharing:</strong> Share milestones with your network</p>
          </div>
        </div>
        
        <div className="flex space-x-3 mt-4">
          <Button variant="outline" size="sm">
            <ExternalLink className="w-4 h-4 mr-2" />
            View Documentation
          </Button>
        </div>
      </Card>
    </div>
  );
};
