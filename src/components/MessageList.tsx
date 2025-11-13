import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { AlertCircle, Clock, CheckCircle2 } from "lucide-react";

interface MessageListProps {
  messages: Message[];
  selectedMessageId?: string;
  onSelectMessage: (message: Message) => void;
}

const getUrgencyColor = (level: string) => {
  switch (level) {
    case 'high':
      return 'bg-urgency-high text-white';
    case 'medium':
      return 'bg-urgency-medium text-white';
    case 'low':
      return 'bg-urgency-low text-white';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'new':
      return <AlertCircle className="h-4 w-4 text-status-new" />;
    case 'in_progress':
      return <Clock className="h-4 w-4 text-status-inProgress" />;
    case 'resolved':
      return <CheckCircle2 className="h-4 w-4 text-status-resolved" />;
    default:
      return null;
  }
};

export const MessageList = ({ messages, selectedMessageId, onSelectMessage }: MessageListProps) => {
  return (
    <ScrollArea className="h-full">
      <div className="space-y-2 p-4">
        {messages.map((message) => (
          <Card
            key={message.id}
            className={`p-4 cursor-pointer transition-all hover:shadow-md ${
              selectedMessageId === message.id ? 'border-primary ring-2 ring-primary/20' : ''
            }`}
            onClick={() => onSelectMessage(message)}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  {getStatusIcon(message.status)}
                  <span className="font-semibold text-sm truncate">
                    {message.customer?.name || 'Unknown Customer'}
                  </span>
                  <Badge className={`${getUrgencyColor(message.urgency_level)} text-xs`}>
                    {message.urgency_level}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{message.content}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <span>{formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}</span>
                  {message.customer?.email && (
                    <>
                      <span>•</span>
                      <span className="truncate">{message.customer.email}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
        {messages.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No messages found</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};
