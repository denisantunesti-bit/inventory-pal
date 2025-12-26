import { useState } from 'react';
import { useInventory } from '@/contexts/InventoryContext';
import { Equipment, EquipmentType } from '@/types/inventory';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Pencil, Trash2, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const equipmentTypes: EquipmentType[] = [
  'Notebook',
  'Monitor',
  'Mouse',
  'Teclado',
  'Headset',
  'Celular',
  'Tablet',
  'Outros',
];

const statusOptions: { value: Equipment['status']; label: string }[] = [
  { value: 'active', label: 'Ativo' },
  { value: 'maintenance', label: 'Manutenção' },
  { value: 'inactive', label: 'Inativo' },
];

const statusColors: Record<Equipment['status'], string> = {
  active: 'bg-success/10 text-success border-success/20',
  maintenance: 'bg-warning/10 text-warning border-warning/20',
  inactive: 'bg-muted text-muted-foreground border-muted',
};

export function EquipmentForm() {
  const { equipments, users, addEquipment, updateEquipment, deleteEquipment } =
    useInventory();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '' as EquipmentType | '',
    serialNumber: '',
    assignedTo: null as string | null,
    status: 'active' as Equipment['status'],
  });

  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
      serialNumber: '',
      assignedTo: null,
      status: 'active',
    });
    setIsEditing(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.type || !formData.serialNumber.trim()) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    if (isEditing) {
      updateEquipment(isEditing, formData as Omit<Equipment, 'id' | 'createdAt'>);
      toast.success('Equipamento atualizado com sucesso!');
    } else {
      addEquipment(formData as Omit<Equipment, 'id' | 'createdAt'>);
      toast.success('Equipamento cadastrado com sucesso!');
    }
    resetForm();
  };

  const handleEdit = (equipment: Equipment) => {
    setFormData({
      name: equipment.name,
      type: equipment.type as EquipmentType,
      serialNumber: equipment.serialNumber,
      assignedTo: equipment.assignedTo,
      status: equipment.status,
    });
    setIsEditing(equipment.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    deleteEquipment(id);
    toast.success('Equipamento removido com sucesso!');
  };

  const getUserName = (userId: string | null) => {
    if (!userId) return 'Não atribuído';
    const user = users.find((u) => u.id === userId);
    return user?.name || 'Usuário não encontrado';
  };

  return (
    <div className="space-y-6">
      {/* Add button */}
      {!showForm && (
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Equipamento
        </Button>
      )}

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="p-6 border border-border rounded-xl bg-card space-y-4"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">
              {isEditing ? 'Editar Equipamento' : 'Novo Equipamento'}
            </h3>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={resetForm}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="equipName">Nome do Equipamento</Label>
              <Input
                id="equipName"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Ex: MacBook Pro 14"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serialNumber">Número de Série</Label>
              <Input
                id="serialNumber"
                value={formData.serialNumber}
                onChange={(e) =>
                  setFormData({ ...formData, serialNumber: e.target.value })
                }
                placeholder="Ex: MBP-2024-001"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value as EquipmentType })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {equipmentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value as Equipment['status'] })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="assignedTo">Atribuir a</Label>
              <Select
                value={formData.assignedTo || 'unassigned'}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    assignedTo: value === 'unassigned' ? null : value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o usuário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Não atribuído</SelectItem>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit">
              {isEditing ? 'Salvar Alterações' : 'Cadastrar'}
            </Button>
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancelar
            </Button>
          </div>
        </form>
      )}

      {/* Equipment List */}
      <div className="space-y-3">
        <h4 className="font-medium text-muted-foreground">
          Equipamentos cadastrados ({equipments.length})
        </h4>
        {equipments.map((equipment) => (
          <div
            key={equipment.id}
            className="flex items-center justify-between p-4 border border-border rounded-xl bg-card hover:shadow-card transition-shadow"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium">{equipment.name}</p>
                <Badge
                  variant="outline"
                  className={cn('text-xs', statusColors[equipment.status])}
                >
                  {statusOptions.find((s) => s.value === equipment.status)?.label}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {equipment.type} • {equipment.serialNumber} •{' '}
                {getUserName(equipment.assignedTo)}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEdit(equipment)}
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(equipment.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
