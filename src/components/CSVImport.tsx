import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CSVImportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportComplete: () => void;
}

export const CSVImport = ({ open, onOpenChange, onImportComplete }: CSVImportProps) => {
  const [loading, setLoading] = useState(false);

  const parseCSV = (text: string): string[][] => {
    const lines = text.split('\n').filter(line => line.trim());
    return lines.map(line => {
      const values: string[] = [];
      let currentValue = '';
      let insideQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          insideQuotes = !insideQuotes;
        } else if (char === ',' && !insideQuotes) {
          values.push(currentValue.trim());
          currentValue = '';
        } else {
          currentValue += char;
        }
      }
      values.push(currentValue.trim());
      return values;
    });
  };

  

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const text = await file.text();
      const rows = parseCSV(text);
      
      if (rows.length < 2) {
        toast.error('CSV file must contain at least a header row and one data row');
        return;
      }

      const headers = rows[0].map(h => h.toLowerCase().trim());
      const nameIndex = headers.findIndex(h => h.includes('name') || h.includes('customer'));
      const emailIndex = headers.findIndex(h => h.includes('email'));
      const phoneIndex = headers.findIndex(h => h.includes('phone'));
      const messageIndex = headers.findIndex(h => h.includes('message') || h.includes('content') || h.includes('inquiry'));

      if (nameIndex === -1 || messageIndex === -1) {
        toast.error('CSV must contain at least "name" and "message" columns');
        return;
      }

      const dataRows = rows.slice(1);
      let successCount = 0;

      for (const row of dataRows) {
        if (row.length <= Math.max(nameIndex, messageIndex)) continue;

        const customerName = row[nameIndex]?.trim();
        const customerEmail = emailIndex !== -1 ? row[emailIndex]?.trim() : undefined;
        const customerPhone = phoneIndex !== -1 ? row[phoneIndex]?.trim() : undefined;
        const messageContent = row[messageIndex]?.trim();

        if (!customerName || !messageContent) continue;

        // Create or get customer
        const { data: existingCustomer } = await supabase
          .from('customers')
          .select('id')
          .eq('name', customerName)
          .maybeSingle();

        let customerId: string;

        if (existingCustomer) {
          customerId = existingCustomer.id;
        } else {
          const { data: newCustomer, error: customerError } = await supabase
            .from('customers')
            .insert({
              name: customerName,
              email: customerEmail,
              phone: customerPhone,
            })
            .select('id')
            .single();

          if (customerError || !newCustomer) {
            console.error('Error creating customer:', customerError);
            continue;
          }
          customerId = newCustomer.id;
        }

        // Create message
        const urgencyLevel = detectUrgency(messageContent);
        const { error: messageError } = await supabase
          .from('messages')
          .insert({
            customer_id: customerId,
            content: messageContent,
            urgency_level: urgencyLevel,
            status: 'new',
          });

        if (!messageError) {
          successCount++;
        }
      }

      toast.success(`Successfully imported ${successCount} messages`);
      onImportComplete();
      onOpenChange(false);
    } catch (error) {
      console.error('Error importing CSV:', error);
      toast.error('Failed to import CSV file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Messages from CSV</DialogTitle>
          <DialogDescription>
            Upload a CSV file with columns: name, email, phone, message
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-4">
              Click to select a CSV file
            </p>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={loading}
              className="hidden"
              id="csv-upload"
            />
            <label htmlFor="csv-upload">
              <Button asChild disabled={loading}>
                <span>{loading ? 'Importing...' : 'Select File'}</span>
              </Button>
            </label>
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Required columns: name, message</p>
            <p>• Optional columns: email, phone</p>
            <p>• Urgency is automatically detected based on message content</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
