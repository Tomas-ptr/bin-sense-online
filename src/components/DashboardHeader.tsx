
import { Recycle, RotateCw, Scale, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WasteStats } from "@/types/waste-data";
import { StatCard } from "@/components/StatCard";
import { StatusIndicator } from "@/components/StatusIndicator";

interface DashboardHeaderProps {
  stats: WasteStats;
  isLoading: boolean;
  onRefresh: () => void;
  autoRefreshEnabled: boolean;
  onToggleAutoRefresh: () => void;
}

export function DashboardHeader({
  stats,
  isLoading,
  onRefresh,
  autoRefreshEnabled,
  onToggleAutoRefresh,
}: DashboardHeaderProps) {
  const { 
    totalRotations, 
    totalRotationsBac1, 
    totalRotationsBac2, 
    totalWeight,
    currentStatus,
    lastStatusUpdate
  } = stats;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Tableau de bord - Système d'extraction des déchets</h1>
        <div className="flex items-center space-x-2">
          <Button
            variant={autoRefreshEnabled ? "default" : "outline"}
            onClick={onToggleAutoRefresh}
            size="sm"
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            {autoRefreshEnabled ? "Auto-refresh activé" : "Auto-refresh désactivé"}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Rotations totales"
          value={totalRotations}
          description={`Bac 1: ${totalRotationsBac1} | Bac 2: ${totalRotationsBac2}`}
          icon={<RotateCw className="h-4 w-4" />}
        />
        <StatCard
          title="Poids total collecté"
          value={`${totalWeight.toFixed(1)} kg`}
          description="Basé sur 4 kg par rotation"
          icon={<Scale className="h-4 w-4" />}
        />
        <StatCard
          title="Moyenne par bac"
          value={totalRotations > 0 ? `${(totalWeight / totalRotations).toFixed(1)} kg` : "0 kg"}
          description="Poids moyen par rotation"
          icon={<Recycle className="h-4 w-4" />}
        />
        <StatusIndicator
          status={{
            id: 0,
            statut_connexion: currentStatus,
            created_at: lastStatusUpdate
          }}
          isLoading={isLoading}
          onRefresh={onRefresh}
        />
      </div>
    </div>
  );
}
