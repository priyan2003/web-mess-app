import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Message, MessageResponse } from "@/types";
import { format } from "date-fns";
import { Send, User } from "lucide-react";

interface MessageDetailProps {
  message: Message | null;
  responses: MessageResponse[];
  onSendResponse: (content: string) => void;
  onUseCannedResponse: () => void;
}

export const MessageDetail = ({ message, responses, onSendResponse, onUseCannedResponse }: MessageDetailProps) => {
  const [replyContent, setReplyContent] = useState("");

  if (!message) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <p>Select a message to view details</p>
      </div>
    );
  }

  const handleSend = () => {
    if (replyContent.trim()) {
      onSendResponse(replyContent);
      setReplyContent("");
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold mb-1">{message.customer?.name || 'Unknown Customer'}</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {message.customer?.email && <span>{message.customer.email}</span>}
              {message.customer?.phone && (
                <>
                  <span>•</span>
                  <span>{message.customer.phone}</span>
                </>
              )}
            </div>
          </div>
          <Badge variant={message.status === 'resolved' ? 'secondary' : 'default'}>
            {message.status.replace('_', ' ')}
          </Badge>
        </div>
        
        <div className="text-sm text-muted-foreground">
          <span>Created: {format(new Date(message.created_at), 'PPpp')}</span>
          {message.responded_at && (
            <>
              <span className="mx-2">•</span>
              <span>Responded: {format(new Date(message.responded_at), 'PPpp')}</span>
            </>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1 p-6">
        <Card className="p-4 mb-6 bg-muted/50">
          <div className="flex items-start gap-3">
            <User className="h-5 w-5 text-muted-foreground mt-1" />
            <div className="flex-1">
              <p className="font-medium mb-1">Customer Message</p>
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        </Card>

        {responses.length > 0 && (
          <>
            <Separator className="my-4" />
            <h3 className="font-semibold mb-3">Responses</h3>
            <div className="space-y-3">
              {responses.map((response) => (
                <Card key={response.id} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-medium text-sm">{response.agent?.name || 'Agent'}</span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(response.created_at), 'PP p')}
                    </span>
                  </div>
                  <p className="text-sm">{response.content}</p>
                </Card>
              ))}
            </div>
          </>
        )}
      </ScrollArea>

      <div className="p-6 border-t">
        <div className="space-y-3">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onUseCannedResponse}>
              Quick Responses
            </Button>
          </div>
          <div className="flex gap-2">
            <Textarea
              placeholder="Type your response..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              rows={3}
              className="flex-1"
            />
            <Button onClick={handleSend} disabled={!replyContent.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
