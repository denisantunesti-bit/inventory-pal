import { User, Equipment } from '@/types/inventory';
import { useInventory } from '@/contexts/InventoryContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { User as UserIcon, Mail, Building, Package } from 'lucide-react';

interface UserDetailModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

const statusColors: Record<Equipment['status'], string> = {
  active: 'bg-success/10 text-success border-success/20',
  maintenance: 'bg-warning/10 text-warning border-warning/20',
  inactive: 'bg-muted text-muted-foreground border-muted',
};

const statusLabels: Record<Equipment['status'], string> = {
  active: 'Ativo',
  maintenance: 'Manutenção',
  inactive: 'Inativo',
};

export function UserDetailModal({ user, isOpen, onClose }: UserDetailModalProps) {
  const { getEquipmentsByUser } = useInventory();

  if (!user) return null;

  const equipments = getEquipmentsByUser(user.id);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">Detalhes do Usuário</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto">
          {/* User Info */}
          <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-xl mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <UserIcon className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                <Building className="w-4 h-4" />
                <span>{user.department}</span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
            </div>
          </div>

          {/* Equipment List */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-primary" />
              <h4 className="font-semibold">
                Equipamentos ({equipments.length})
              </h4>
            </div>

            {equipments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum equipamento atribuído a este usuário.
              </div>
            ) : (
              <div className="space-y-3">
                {equipments.map((equipment) => (
                  <div
                    key={equipment.id}
                    className="p-4 border border-border rounded-xl bg-card hover:shadow-card transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h5 className="font-medium">{equipment.name}</h5>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {equipment.type} • {equipment.serialNumber}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={statusColors[equipment.status]}
                      >
                        {statusLabels[equipment.status]}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
