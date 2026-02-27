import { Clock, Play, Pause, CheckCircle, HelpCircle } from "lucide-react";

export const getStatusBadge = (
  status: string,
): {
  label: string;
  variant: "default" | "secondary" | "outline";
  Icon: any;
  isActive?: boolean;
} => {
    
  switch (status) {
    case "WAITING":
      return {
        label: "Aguardando",
        variant: "secondary",
        Icon: Clock,
      };
    case "STARTED":
      return {
        label: "Em andamento",
        variant: "default",
        Icon: Play,
        isActive: true,
      };
    case "PAUSED":
      return {
        label: "Pausado",
        variant: "outline",
        Icon: Pause,
      };
    case "FINISHED":
      return {
        label: "Finalizado",
        variant: "secondary",
        Icon: CheckCircle,
      };
    default:
      return {
        label: "Desconhecido",
        variant: "secondary",
        Icon: HelpCircle,
      };
  }
};
