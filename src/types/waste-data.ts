
// Types pour le système d'extraction des déchets

// Type pour les événements de rotation (table tomasv2)
export interface RotationEvent {
  id: number;
  bac: string;
  poids_estime: number;
  created_at: string;
}

// Type pour le statut de connexion (table status_connexion)
export interface ConnectionStatus {
  id: number;
  created_at: string;
  statut_connexion: 'online' | 'offline';
}

// Type pour les filtres temporels
export type TimeFilter = 'day' | 'week' | 'month' | 'all';

// Types pour les statistiques
export interface WasteStats {
  totalRotations: number;
  totalRotationsBac1: number;
  totalRotationsBac2: number;
  totalWeight: number;
  currentStatus: 'online' | 'offline';
  lastStatusUpdate: string;
}
