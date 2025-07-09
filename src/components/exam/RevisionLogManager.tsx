
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RotateCcw, CheckCircle, BookOpen } from 'lucide-react';

interface RevisionLogManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const RevisionLogManager: React.FC<RevisionLogManagerProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Daily Revision Log</DialogTitle>
        </DialogHeader>
        
        <Card className="p-4 bg-purple-50 border-purple-200">
          <div className="text-center">
            <RotateCcw className="w-12 h-12 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold text-purple-900 mb-2">Coming Soon!</h3>
            <p className="text-purple-700 text-sm">
              Daily revision tracking system is in development. 
              Plan, track, and optimize your revision schedule for better retention.
            </p>
          </div>
        </Card>

        <div className="space-y-2 opacity-50">
          <div className="flex items-center gap-3 p-2 bg-gray-50 rounded">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm">Physics - Thermodynamics</span>
          </div>
          <div className="flex items-center gap-3 p-2 bg-gray-50 rounded">
            <BookOpen className="w-4 h-4 text-gray-400" />
            <span className="text-sm">Chemistry - Organic Reactions</span>
          </div>
          <div className="flex items-center gap-3 p-2 bg-gray-50 rounded">
            <BookOpen className="w-4 h-4 text-gray-400" />
            <span className="text-sm">Math - Integration</span>
          </div>
        </div>

        <Button onClick={() => onOpenChange(false)} className="w-full">
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};
