import { User } from '@/types/inventory';
import { useInventory } from '@/contexts/InventoryContext';
import { User as UserIcon, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserCardProps {
  user: User;
  onClick: () => void;
}

export function UserCard({ user, onClick }: UserCardProps) {
  const { getEquipmentCountByUser } = useInventory();
  const equipmentCount = getEquipmentCountByUser(user.id);

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left p-5 rounded-xl bg-card border border-border',
        'shadow-card hover:shadow-card-hover transition-all duration-300',
        'hover:border-primary/20 hover:-translate-y-1',
        'focus:outline-none focus:ring-2 focus:ring-primary/20',
        'animate-fade-in'
      )}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <UserIcon className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-card-foreground truncate">
            {user.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            {user.department}
          </p>
          <div className="flex items-center gap-1.5 mt-3">
            <Package className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              {equipmentCount} {equipmentCount === 1 ? 'equipamento' : 'equipamentos'}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
