export interface Equipment {
  id: string;
  name: string;
  type: string;
  serialNumber: string;
  assignedTo: string | null;
  status: 'active' | 'maintenance' | 'inactive';
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  department: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export type EquipmentType = 'Notebook' | 'Monitor' | 'Mouse' | 'Teclado' | 'Headset' | 'Celular' | 'Tablet' | 'Outros';
