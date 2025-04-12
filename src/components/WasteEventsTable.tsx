
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RotationEvent } from "@/types/waste-data";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface WasteEventsTableProps {
  data: RotationEvent[];
}

export function WasteEventsTable({ data }: WasteEventsTableProps) {
  const [filteredData, setFilteredData] = useState<RotationEvent[]>(data);
  const [filter, setFilter] = useState({
    bac: 'all',
    search: '',
  });

  // Mettre à jour les données filtrées lorsque les données ou les filtres changent
  useEffect(() => {
    console.log(`WasteEventsTable: Traitement de ${data.length} événements`);
    let result = [...data];

    // Filtre par bac
    if (filter.bac !== 'all') {
      result = result.filter(item => item.bac === filter.bac);
      console.log(`Après filtre bac "${filter.bac}": ${result.length} événements`);
    }

    // Filtre par recherche
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      result = result.filter(
        item => 
          item.bac.toLowerCase().includes(searchLower) ||
          item.id.toString().includes(searchLower) ||
          new Date(item.created_at).toLocaleString('fr-FR').toLowerCase().includes(searchLower)
      );
      console.log(`Après filtre recherche "${filter.search}": ${result.length} événements`);
    }

    setFilteredData(result);
  }, [data, filter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-1/3">
          <Input
            placeholder="Rechercher..."
            value={filter.search}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            className="max-w-full sm:max-w-xs"
          />
        </div>
        <div className="w-full sm:w-1/3">
          <Select
            value={filter.bac}
            onValueChange={(value) => setFilter({ ...filter, bac: value })}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filtrer par bac" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les bacs</SelectItem>
              <SelectItem value="bac1">Bac 1</SelectItem>
              <SelectItem value="bac2">Bac 2</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Bac</TableHead>
              <TableHead>Poids estimé (kg)</TableHead>
              <TableHead className="w-[180px]">Date et heure</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  Aucune donnée trouvée
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.id}</TableCell>
                  <TableCell>{event.bac}</TableCell>
                  <TableCell>{event.poids_estime} kg</TableCell>
                  <TableCell>{new Date(event.created_at).toLocaleString('fr-FR')}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="text-sm text-muted-foreground">
        Affichage de {filteredData.length} événements sur {data.length} total
      </div>
    </div>
  );
}
