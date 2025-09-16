import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

// A helper function to format date strings
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const ViewLeadCard = ({ lead, isOpen, onOpenChange }) => {
  if (!lead) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {lead.first_name} {lead.last_name}
          </DialogTitle>
          <DialogDescription>{lead.email}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Company</p>
            <p>{lead.company || 'N/A'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Phone</p>
            <p>{lead.phone || 'N/A'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Location</p>
            <p>
              {lead.city || 'N/A'}, {lead.state || 'N/A'}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Source</p>
            <p className="capitalize">{lead.source?.replace('_', ' ')}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <Badge variant="outline" className="capitalize">
              {lead.status}
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Is Qualified</p>
            <p>{lead.is_qualified ? 'Yes' : 'No'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Lead Value</p>
            <p>Rs. {lead.lead_value?.toLocaleString() || '0'}</p>
          </div>
           <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Score</p>
            <p>{lead.score || 'N/A'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Last Activity
            </p>
            <p>{formatDate(lead.last_activity_at)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Date Created</p>
            <p>{formatDate(lead.createdAt)}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};