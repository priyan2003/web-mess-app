-- Create customers table
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  profile_info JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create messages table with urgency detection
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  urgency_level TEXT NOT NULL CHECK (urgency_level IN ('low', 'medium', 'high')) DEFAULT 'medium',
  status TEXT NOT NULL CHECK (status IN ('new', 'in_progress', 'resolved')) DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  responded_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create agents table
CREATE TABLE public.agents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('online', 'offline', 'busy')) DEFAULT 'online',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create canned responses table
CREATE TABLE public.canned_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  usage_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create message responses table
CREATE TABLE public.message_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.canned_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_responses ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Public access for agent portal)
CREATE POLICY "Allow all operations on customers" ON public.customers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on messages" ON public.messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on agents" ON public.agents FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on canned_responses" ON public.canned_responses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on message_responses" ON public.message_responses FOR ALL USING (true) WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_messages_customer_id ON public.messages(customer_id);
CREATE INDEX idx_messages_status ON public.messages(status);
CREATE INDEX idx_messages_urgency_level ON public.messages(urgency_level);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX idx_message_responses_message_id ON public.message_responses(message_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_messages_updated_at
BEFORE UPDATE ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.message_responses;

-- Insert sample canned responses
INSERT INTO public.canned_responses (title, content, category) VALUES
('Loan Status Check', 'Thank you for reaching out. Let me check the status of your loan application for you. This will take just a moment.', 'loan_inquiry'),
('Disbursement Timeline', 'Your loan has been approved! The disbursement typically takes 2-3 business days. You will receive a notification once the funds are transferred to your account.', 'loan_inquiry'),
('Account Update Help', 'To update your account information, please visit your profile settings in the Branch app. If you need further assistance, I can guide you through the process.', 'account_help'),
('Approval Process', 'Your loan application is currently under review. Our team is working diligently to process it. You should receive an update within 24-48 hours.', 'loan_inquiry'),
('General Greeting', 'Hello! Thank you for contacting Branch support. How can I assist you today?', 'general');