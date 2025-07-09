
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trash2, AlertTriangle } from 'lucide-react';

interface TrackerDeleteManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TrackerDeleteManager: React.FC<TrackerDeleteManagerProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Topic Tracker</DialogTitle>
        </DialogHeader>
        
        <Card className="p-4 bg-red-50 border-red-200">
          <div className="text-center">
            <Trash2 className="w-12 h-12 text-red-600 mx-auto mb-3" />
            <h3 className="font-semibold text-red-900 mb-2">Coming Soon!</h3>
            <p className="text-red-700 text-sm">
              Topic tracker management feature is being developed. 
              You'll be able to manage and delete topic trackers with data preservation options.
            </p>
          </div>
        </Card>

        <Card className="p-3 bg-yellow-50 border-yellow-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
            <span className="text-sm text-yellow-800">
              Deletion will be irreversible - backup options will be available
            </span>
          </div>
        </Card>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Close
          </Button>
          <Button variant="destructive" disabled className="flex-1">
            Delete Tracker
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
