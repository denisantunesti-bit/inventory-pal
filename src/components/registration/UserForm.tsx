import { useState } from 'react';
import { useInventory } from '@/contexts/InventoryContext';
import { User } from '@/types/inventory';
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
import { toast } from 'sonner';
import { Pencil, Trash2, Plus, X } from 'lucide-react';

const departments = [
  'Administrativo/RH',
  'Jurídico',
  'Negocial_ITAÚ',
  'TI',
  'Outros',
];

export function UserForm() {
  const { users, addUser, updateUser, deleteUser } = useInventory();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    extension: '',
  });

  const resetForm = () => {
    setFormData({ name: '', email: '', department: '', extension: '' });
    setIsEditing(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.department) {
      toast.error('Preencha todos os campos');
      return;
    }

    if (isEditing) {
      updateUser(isEditing, formData);
      toast.success('Usuário atualizado com sucesso!');
    } else {
      addUser(formData);
      toast.success('Usuário cadastrado com sucesso!');
    }
    resetForm();
  };

  const handleEdit = (user: User) => {
    setFormData({
      name: user.name,
      email: user.email,
      department: user.department,
      extension: user.extension || '',
    });
    setIsEditing(user.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    deleteUser(id);
    toast.success('Usuário removido com sucesso!');
  };

  return (
    <div className="space-y-6">
      {/* Add button */}
      {!showForm && (
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Usuário
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
              {isEditing ? 'Editar Usuário' : 'Novo Usuário'}
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
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Nome completo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="email@empresa.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="extension">Ramal</Label>
              <Input
                id="extension"
                value={formData.extension}
                onChange={(e) =>
                  setFormData({ ...formData, extension: e.target.value })
                }
                placeholder="Ex: 1234"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Departamento</Label>
            <Select
              value={formData.department}
              onValueChange={(value) =>
                setFormData({ ...formData, department: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o departamento" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

      {/* User List */}
      <div className="space-y-3">
        <h4 className="font-medium text-muted-foreground">
          Usuários cadastrados ({users.length})
        </h4>
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between p-4 border border-border rounded-xl bg-card hover:shadow-card transition-shadow"
          >
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-muted-foreground">
                {user.department} • {user.email}{user.extension && ` • Ramal: ${user.extension}`}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEdit(user)}
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(user.id)}
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
