import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageList } from "@/components/MessageList";
import { MessageDetail } from "@/components/MessageDetail";
import { CustomerProfile } from "@/components/CustomerProfile";
import { CannedResponsesDialog } from "@/components/CannedResponsesDialog";
import { CSVImport } from "@/components/CSVImport";
import { SearchBar } from "@/components/SearchBar";
import { Message, MessageResponse } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, MessageSquare } from "lucide-react";

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [messageResponses, setMessageResponses] = useState<MessageResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<'all' | 'new' | 'in_progress' | 'resolved'>('all');
  const [showCannedDialog, setShowCannedDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
    subscribeToMessages();
  }, []);

  useEffect(() => {
    if (selectedMessage) {
      loadMessageResponses(selectedMessage.id);
    }
  }, [selectedMessage]);

  const subscribeToMessages = () => {
    const channel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages'
        },
        () => {
          loadMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

 const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          customer:customers(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages((data || []) as Message[]);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const loadMessageResponses = async (messageId: string) => {
    try {
      const { data, error } = await supabase
        .from('message_responses')
        .select(`
          *,
          agent:agents(*)
        `)
        .eq('message_id', messageId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessageResponses((data || []) as MessageResponse[]);
    } catch (error) {
      console.error('Error loading responses:', error);
      toast.error('Failed to load responses');
    }
  };

  const handleSendResponse = async (content: string) => {
    if (!selectedMessage) return;

    try {
      // For demo purposes, create a demo agent if none exists
      let { data: agents } = await supabase
        .from('agents')
        .select('id')
        .limit(1)
        .maybeSingle();

      if (!agents) {
        const { data: newAgent } = await supabase
          .from('agents')
          .insert({
            name: 'Demo Agent',
            email: 'agent@branch.com',
            status: 'online'
          })
          .select('id')
          .single();
        
        agents = newAgent;
      }

      if (!agents) {
        toast.error('Failed to create agent');
        return;
      }

      const { error } = await supabase
        .from('message_responses')
        .insert({
          message_id: selectedMessage.id,
          agent_id: agents.id,
          content: content,
        });

      if (error) throw error;

      // Update message status
      await supabase
        .from('messages')
        .update({
          status: 'in_progress',
          responded_at: new Date().toISOString(),
        })
        .eq('id', selectedMessage.id);

      toast.success('Response sent');
      loadMessageResponses(selectedMessage.id);
      loadMessages();
    } catch (error) {
      console.error('Error sending response:', error);
      toast.error('Failed to send response');
    }
  };

  const filteredMessages = messages.filter((message) => {
    const matchesSearch = 
      message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.customer?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.customer?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || message.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const sortedMessages = [...filteredMessages].sort((a, b) => {
    const urgencyOrder = { high: 0, medium: 1, low: 2 };
    const urgencyDiff = urgencyOrder[a.urgency_level] - urgencyOrder[b.urgency_level];
    if (urgencyDiff !== 0) return urgencyDiff;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (

  );
};

export default Index;
 