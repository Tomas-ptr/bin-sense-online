import { supabase } from '@/integrations/supabase/client';
import { ConnectionStatus, RotationEvent, TimeFilter, WasteStats } from '@/types/waste-data';
import { toast } from "sonner";

// Ces valeurs seront à remplacer par vos propres informations de connexion Supabase
// Pour le moment, nous utilisons des valeurs par défaut pour le développement
const supabaseUrl = 'https://votre-projet.supabase.co';
const supabaseKey = 'votre-clé-api-supabase';

// Créer un client Supabase
// const supabase = createClient(supabaseUrl, supabaseKey);

// Récupérer les événements de rotation avec filtrage temporel
export async function getRotationEvents(filter: TimeFilter = 'all'): Promise<RotationEvent[]> {
  try {
    let query = supabase.from('tomasv2').select('*').order('created_at', { ascending: false });

    // Appliquer le filtre temporel
    const now = new Date();
    if (filter === 'day') {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      query = query.gte('created_at', yesterday.toISOString());
    } else if (filter === 'week') {
      const lastWeek = new Date(now);
      lastWeek.setDate(lastWeek.getDate() - 7);
      query = query.gte('created_at', lastWeek.toISOString());
    } else if (filter === 'month') {
      const lastMonth = new Date(now);
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      query = query.gte('created_at', lastMonth.toISOString());
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erreur lors de la récupération des événements de rotation:', error);
      toast.error('Erreur de chargement des données', {
        description: 'Impossible de charger les événements de rotation.'
      });
      return [];
    }

    return data as RotationEvent[];
  } catch (error) {
    console.error('Exception lors de la récupération des événements de rotation:', error);
    toast.error('Erreur de connexion', {
      description: 'Vérifiez votre connexion internet et réessayez.'
    });
    return [];
  }
}

// Récupérer le dernier statut de connexion
export async function getConnectionStatus(): Promise<ConnectionStatus | null> {
  try {
    const { data, error } = await supabase
      .from('status_connexion')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Erreur lors de la récupération du statut de connexion:', error);
      toast.error('Erreur de chargement des données', {
        description: 'Impossible de charger le statut de connexion.'
      });
      return null;
    }

    return data.length > 0 ? (data[0] as ConnectionStatus) : null;
  } catch (error) {
    console.error('Exception lors de la récupération du statut de connexion:', error);
    toast.error('Erreur de connexion', {
      description: 'Vérifiez votre connexion internet et réessayez.'
    });
    return null;
  }
}

// Calculer les statistiques à partir des événements de rotation
export function calculateStats(
  rotationEvents: RotationEvent[], 
  connectionStatus: ConnectionStatus | null
): WasteStats {
  const totalRotations = rotationEvents.length;
  const totalRotationsBac1 = rotationEvents.filter(event => event.bac === 'bac1').length;
  const totalRotationsBac2 = rotationEvents.filter(event => event.bac === 'bac2').length;
  const totalWeight = rotationEvents.reduce((sum, event) => sum + (event.poids_estime || 0), 0);

  return {
    totalRotations,
    totalRotationsBac1,
    totalRotationsBac2,
    totalWeight,
    currentStatus: connectionStatus?.statut_connexion || 'offline',
    lastStatusUpdate: connectionStatus?.created_at || new Date().toISOString()
  };
}

// Fonction pour obtenir les données agrégées par période pour les graphiques
export function getChartData(rotationEvents: RotationEvent[], filter: TimeFilter) {
  // Initialiser les tableaux pour les données du graphique
  const labels: string[] = [];
  const bac1Data: number[] = [];
  const bac2Data: number[] = [];
  const weightData: number[] = [];

  if (rotationEvents.length === 0) {
    return { labels, bac1Data, bac2Data, weightData };
  }

  // Déterminer le format de date et l'intervalle en fonction du filtre
  let dateFormat: Intl.DateTimeFormatOptions;
  let interval: 'hour' | 'day' | 'week' | 'month';

  switch (filter) {
    case 'day':
      dateFormat = { hour: '2-digit' };
      interval = 'hour';
      break;
    case 'week':
      dateFormat = { weekday: 'short' };
      interval = 'day';
      break;
    case 'month':
      dateFormat = { day: '2-digit' };
      interval = 'day';
      break;
    default:
      dateFormat = { month: 'short', day: '2-digit' };
      interval = 'week';
      break;
  }

  // Regrouper les données par intervalle
  const groupedData = new Map();

  rotationEvents.forEach(event => {
    const date = new Date(event.created_at);
    let groupKey: string;

    if (interval === 'hour') {
      groupKey = date.toLocaleDateString('fr-FR', { hour: '2-digit' });
    } else if (interval === 'day') {
      groupKey = date.toLocaleDateString('fr-FR');
    } else if (interval === 'week') {
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      groupKey = weekStart.toLocaleDateString('fr-FR');
    } else {
      groupKey = date.toLocaleDateString('fr-FR', { month: 'short' });
    }

    if (!groupedData.has(groupKey)) {
      groupedData.set(groupKey, {
        label: date.toLocaleDateString('fr-FR', dateFormat),
        bac1Count: 0,
        bac2Count: 0,
        totalWeight: 0
      });
    }

    const group = groupedData.get(groupKey);
    if (event.bac === 'bac1') {
      group.bac1Count++;
    } else if (event.bac === 'bac2') {
      group.bac2Count++;
    }
    
    group.totalWeight += event.poids_estime || 0;
  });

  // Convertir les données groupées en tableaux pour les graphiques
  groupedData.forEach((value) => {
    labels.push(value.label);
    bac1Data.push(value.bac1Count);
    bac2Data.push(value.bac2Count);
    weightData.push(value.totalWeight);
  });

  return { labels, bac1Data, bac2Data, weightData };
}
