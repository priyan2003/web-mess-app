import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { CannedResponse } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CannedResponsesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectResponse: (content: string) => void;
}

export const CannedResponsesDialog = ({ open, onOpenChange, onSelectResponse }: CannedResponsesDialogProps) => {
  const [responses, setResponses] = useState<CannedResponse[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadCannedResponses();
    }
  }, [open]);

  const loadCannedResponses = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('canned_responses')
        .select('*')
        .order('usage_count', { ascending: false });

      if (error) throw error;
      setResponses(data || []);
    } catch (error) {
      console.error('Error loading canned responses:', error);
      toast.error('Failed to load quick responses');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectResponse = async (response: CannedResponse) => {
    try {
      // Increment usage count
      await supabase
        .from('canned_responses')
        .update({ usage_count: response.usage_count + 1 })
        .eq('id', response.id);

      onSelectResponse(response.content);
      onOpenChange(false);
      toast.success('Response added');
    } catch (error) {
      console.error('Error updating usage count:', error);
      onSelectResponse(response.content);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Quick Responses</DialogTitle>
          <DialogDescription>
            Select a pre-configured response to quickly reply to customer inquiries
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[500px]">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : (
            <div className="space-y-3">
              {responses.map((response) => (
                <Card key={response.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h4 className="font-medium">{response.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {response.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{response.content}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Used {response.usage_count} times
                    </span>
                    <Button size="sm" onClick={() => handleSelectResponse(response)}>
                      Use Response
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
