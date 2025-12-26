import { Equipment } from '@/types/inventory';
import { Badge } from '@/components/ui/badge';
import { 
  Laptop, 
  Monitor, 
  Mouse, 
  Keyboard, 
  Headphones, 
  Smartphone, 
  Tablet, 
  Package 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface EquipmentCardProps {
  equipment: Equipment;
}

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Notebook: Laptop,
  Monitor: Monitor,
  Mouse: Mouse,
  Teclado: Keyboard,
  Headset: Headphones,
  Celular: Smartphone,
  Tablet: Tablet,
  Outros: Package,
};

const statusColors: Record<Equipment['status'], string> = {
  active: 'bg-success/10 text-success border-success/20',
  maintenance: 'bg-warning/10 text-warning border-warning/20',
  inactive: 'bg-muted text-muted-foreground border-muted',
};

const statusLabels: Record<Equipment['status'], string> = {
  active: 'Disponível',
  maintenance: 'Manutenção',
  inactive: 'Inativo',
};

export function EquipmentCard({ equipment }: EquipmentCardProps) {
  const Icon = typeIcons[equipment.type] || Package;

  return (
    <div
      className={cn(
        'p-5 rounded-xl bg-card border border-border',
        'shadow-card hover:shadow-card-hover transition-all duration-300',
        'hover:border-primary/20',
        'animate-fade-in'
      )}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-card-foreground truncate">
              {equipment.name}
            </h3>
            <Badge
              variant="outline"
              className={cn('flex-shrink-0', statusColors[equipment.status])}
            >
              {statusLabels[equipment.status]}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {equipment.type}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            S/N: {equipment.serialNumber}
          </p>
        </div>
      </div>
    </div>
  );
}
