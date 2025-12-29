export type MovementType = 
  | 'created' 
  | 'updated' 
  | 'deleted' 
  | 'assigned' 
  | 'unassigned' 
  | 'status_changed';

export interface Movement {
  id: string;
  equipmentId: string;
  equipmentName: string;
  type: MovementType;
  description: string;
  previousValue?: string;
  newValue?: string;
  userId?: string;
  userName?: string;
  performedBy: string; // Nome do usuário logado que realizou a ação
  createdAt: string;
}
