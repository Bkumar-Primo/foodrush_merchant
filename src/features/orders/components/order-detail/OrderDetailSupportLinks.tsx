import { HelpCircle, MessageSquare } from "lucide-react";
import { BrandButton } from "@/components/common/BrandButton";

export function OrderDetailSupportLinks(): React.JSX.Element {
  return (
    <div className="flex flex-col gap-2 items-end">
      <BrandButton
        variant="orderOutline"
        className="w-fit flex items-center gap-1.5 py-1.5 px-2 rounded-sm text-[10.5px]"
      >
        <MessageSquare className="h-3.5 w-3.5" /> Live order chat support
      </BrandButton>
      <BrandButton
        variant="orderOutline"
        className="w-fit flex items-center gap-1.5 py-1.5 px-2 rounded-sm text-[10.5px]"
      >
        <HelpCircle className="h-3.5 w-3.5" /> Order help
      </BrandButton>
    </div>
  );
}
