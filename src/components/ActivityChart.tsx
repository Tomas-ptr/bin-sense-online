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
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, Line } from "recharts";

interface ActivityChartProps {
  data: RotationEvent[];
  timeFilter: TimeFilter;
  onTimeFilterChange: (filter: TimeFilter) => void;
}

export function ActivityChart({ data, timeFilter, onTimeFilterChange }: ActivityChartProps) {
  const { labels, bac1Data, bac2Data, weightData } = getChartData(data, timeFilter);

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

  const rechartsData = labels.map((label, index) => ({
    name: label,
    bac1: bac1Data[index],
    bac2: bac2Data[index],
    poids: weightData[index]
  }));

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
              <ChartContainer config={{}} className="w-full h-full">
                <BarChart
                  width={500}
                  height={300}
                  data={rechartsData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <defs>
                    <linearGradient id="colorBac1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorBac2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="bac1" name="Bac 1" fill="url(#colorBac1)" />
                  <Bar dataKey="bac2" name="Bac 2" fill="url(#colorBac2)" />
                </BarChart>
              </ChartContainer>
            )}
          </TabsContent>
          <TabsContent value="weight" className="h-80">
            {data.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Aucune donnée disponible
              </div>
            ) : (
              <ChartContainer config={{}} className="w-full h-full">
                <LineChart
                  width={500}
                  height={300}
                  data={rechartsData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="poids" 
                    name="Poids (kg)"
                    stroke="#10b981" 
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                </LineChart>
              </ChartContainer>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
