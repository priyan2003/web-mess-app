import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Customer } from "@/types";
import { User, Mail, Phone, Info } from "lucide-react";

interface CustomerProfileProps {
  customer: Customer | null;
}

export const CustomerProfile = ({ customer }: CustomerProfileProps) => {
  if (!customer) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground text-center">No customer selected</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <User className="h-5 w-5" />
        Customer Profile
      </h3>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium mb-1">Name</p>
          <p className="text-sm text-muted-foreground">{customer.name}</p>
        </div>

        {customer.email && (
          <div>
            <p className="text-sm font-medium mb-1 flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </p>
            <p className="text-sm text-muted-foreground">{customer.email}</p>
          </div>
        )}

        {customer.phone && (
          <div>
            <p className="text-sm font-medium mb-1 flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone
            </p>
            <p className="text-sm text-muted-foreground">{customer.phone}</p>
          </div>
        )}

        {customer.profile_info && Object.keys(customer.profile_info).length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2 flex items-center gap-2">
              <Info className="h-4 w-4" />
              Additional Info
            </p>
            <div className="space-y-2">
              {Object.entries(customer.profile_info).map(([key, value]) => (
                <div key={key} className="flex items-start gap-2">
                  <Badge variant="outline" className="text-xs">
                    {key}
                  </Badge>
                  <span className="text-sm text-muted-foreground flex-1">
                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
