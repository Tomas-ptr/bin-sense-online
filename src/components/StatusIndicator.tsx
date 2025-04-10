
import { Circle, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { ConnectionStatus } from "@/types/waste-data";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface StatusIndicatorProps {
  status: ConnectionStatus | null;
  isLoading: boolean;
  onRefresh: () => void;
}

export function StatusIndicator({ status, isLoading, onRefresh }: StatusIndicatorProps) {
  const isOnline = status?.statut_connexion === 'online';
  const statusText = isOnline ? 'Connecté' : 'Déconnecté';
  const lastUpdate = status 
    ? new Date(status.created_at).toLocaleString('fr-FR') 
    : 'Aucune donnée';

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border">
      <div className="flex items-center space-x-2">
        <Circle
          size={12}
          className={cn(
            isOnline ? "text-status-online" : "text-status-offline",
            "animate-pulse-slow"
          )}
          fill={isOnline ? "currentColor" : "currentColor"}
        />
        <div>
          <p className="font-medium">{statusText}</p>
          <p className="text-xs text-muted-foreground">
            Dernière mise à jour: {lastUpdate}
          </p>
        </div>
      </div>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onRefresh}
              disabled={isLoading}
              className={isLoading ? "animate-spin" : ""}
            >
              <RefreshCcw size={18} />
              <span className="sr-only">Rafraîchir</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Rafraîchir les données</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
