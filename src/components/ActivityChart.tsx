
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RotationEvent, TimeFilter } from "@/types/waste-data";
import { getChartData } from "@/services/supabase";
import { BarChart, LineChart } from "@/components/ui/chart";

interface ActivityChartProps {
  data: RotationEvent[];
  timeFilter: TimeFilter;
  onTimeFilterChange: (filter: TimeFilter) => void;
}

export function ActivityChart({ data, timeFilter, onTimeFilterChange }: ActivityChartProps) {
  // Utiliser la fonction getChartData pour préparer les données pour les graphiques
  const { labels, bac1Data, bac2Data, weightData } = getChartData(data, timeFilter);

  // Données pour le graphique de barres (rotations)
  const barChartData = {
    labels,
    datasets: [
      {
        label: 'Bac 1',
        data: bac1Data,
        backgroundColor: '#0ea5e9',
      },
      {
        label: 'Bac 2',
        data: bac2Data,
        backgroundColor: '#6366f1',
      },
    ],
  };

  // Données pour le graphique linéaire (poids)
  const lineChartData = {
    labels,
    datasets: [
      {
        label: 'Poids total (kg)',
        data: weightData,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.2,
        fill: true,
      },
    ],
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Activité</CardTitle>
          <CardDescription>
            Visualisation des rotations et du poids collecté
          </CardDescription>
        </div>
        <Select value={timeFilter} onValueChange={(value) => onTimeFilterChange(value as TimeFilter)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Dernières 24h</SelectItem>
            <SelectItem value="week">Dernière semaine</SelectItem>
            <SelectItem value="month">Dernier mois</SelectItem>
            <SelectItem value="all">Tous</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="rotations">
          <TabsList className="mb-4">
            <TabsTrigger value="rotations">Rotations</TabsTrigger>
            <TabsTrigger value="weight">Poids</TabsTrigger>
          </TabsList>
          <TabsContent value="rotations" className="h-80">
            {data.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Aucune donnée disponible
              </div>
            ) : (
              <BarChart data={barChartData} />
            )}
          </TabsContent>
          <TabsContent value="weight" className="h-80">
            {data.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Aucune donnée disponible
              </div>
            ) : (
              <LineChart data={lineChartData} />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
