
import { useEffect, useState, useCallback } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { WasteEventsTable } from "@/components/WasteEventsTable";
import { ActivityChart } from "@/components/ActivityChart";
import { RotationEvent, TimeFilter, WasteStats } from "@/types/waste-data";
import { getRotationEvents, getConnectionStatus, calculateStats } from "@/services/supabase";
import { toast } from "sonner";

const DEFAULT_REFRESH_INTERVAL = 30000; // 30 secondes

const Index = () => {
  const [rotationEvents, setRotationEvents] = useState<RotationEvent[]>([]);
  const [stats, setStats] = useState<WasteStats>({
    totalRotations: 0,
    totalRotationsBac1: 0,
    totalRotationsBac2: 0,
    totalWeight: 0,
    currentStatus: 'offline',
    lastStatusUpdate: new Date().toISOString()
  });
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('day');
  const [isLoading, setIsLoading] = useState(false);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  // Fonction pour charger les données
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Récupérer les données
      const [events, status] = await Promise.all([
        getRotationEvents(timeFilter),
        getConnectionStatus()
      ]);

      // Mettre à jour l'état
      setRotationEvents(events);
      setStats(calculateStats(events, status));
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      toast.error('Erreur de chargement', {
        description: 'Les données n\'ont pas pu être chargées correctement.'
      });
    } finally {
      setIsLoading(false);
    }
  }, [timeFilter]);

  // Mettre en place l'auto-refresh
  useEffect(() => {
    if (autoRefreshEnabled) {
      const interval = setInterval(() => {
        loadData();
      }, DEFAULT_REFRESH_INTERVAL);
      
      setRefreshInterval(interval);
      
      return () => {
        if (interval) clearInterval(interval);
      };
    } else if (refreshInterval) {
      clearInterval(refreshInterval);
      setRefreshInterval(null);
    }
  }, [autoRefreshEnabled, loadData]);

  // Chargement initial des données
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Gérer le changement de filtre temporel
  const handleTimeFilterChange = (filter: TimeFilter) => {
    setTimeFilter(filter);
  };

  // Gérer le basculement de l'auto-refresh
  const handleToggleAutoRefresh = () => {
    setAutoRefreshEnabled(!autoRefreshEnabled);
    // Afficher une notification pour informer l'utilisateur
    if (!autoRefreshEnabled) {
      toast.success('Auto-refresh activé', {
        description: `Les données seront actualisées toutes les ${DEFAULT_REFRESH_INTERVAL / 1000} secondes.`
      });
    } else {
      toast.info('Auto-refresh désactivé', {
        description: 'Les données ne seront plus actualisées automatiquement.'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8 space-y-8">
        <DashboardHeader
          stats={stats}
          isLoading={isLoading}
          onRefresh={loadData}
          autoRefreshEnabled={autoRefreshEnabled}
          onToggleAutoRefresh={handleToggleAutoRefresh}
        />

        <ActivityChart
          data={rotationEvents}
          timeFilter={timeFilter}
          onTimeFilterChange={handleTimeFilterChange}
        />

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Journal des événements de rotation</h2>
          <WasteEventsTable data={rotationEvents} />
        </div>
      </div>
    </div>
  );
};

export default Index;
