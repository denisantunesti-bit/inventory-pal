import { useState } from 'react';
import { useMovement } from '@/contexts/MovementContext';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, History, Plus, Edit, Trash2, UserPlus, UserMinus, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MovementType } from '@/types/movement';

const typeConfig: Record<MovementType, { label: string; color: string; icon: typeof Plus }> = {
  created: { label: 'Criado', color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: Plus },
  updated: { label: 'Atualizado', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: Edit },
  deleted: { label: 'Excluído', color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: Trash2 },
  assigned: { label: 'Atribuído', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: UserPlus },
  unassigned: { label: 'Desatribuído', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30', icon: UserMinus },
  status_changed: { label: 'Status alterado', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: RefreshCw },
};

export default function Historico() {
  const { movements } = useMovement();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMovements = movements.filter(
    (m) =>
      m.equipmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.userName && m.userName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Histórico de Movimentações</h1>
        <p className="text-muted-foreground mt-1">
          Acompanhe todas as alterações realizadas nos equipamentos
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por equipamento ou descrição..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      {filteredMovements.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <History className="w-12 h-12 mb-4 opacity-50" />
          <p className="text-lg font-medium">Nenhuma movimentação registrada</p>
          <p className="text-sm">As alterações em equipamentos aparecerão aqui</p>
        </div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[180px]">Data/Hora</TableHead>
                <TableHead className="w-[140px]">Tipo</TableHead>
                <TableHead>Equipamento</TableHead>
                <TableHead>Descrição</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMovements.map((movement) => {
                const config = typeConfig[movement.type];
                const IconComponent = config.icon;
                return (
                  <TableRow key={movement.id}>
                    <TableCell className="text-muted-foreground text-sm">
                      {format(new Date(movement.createdAt), "dd/MM/yyyy 'às' HH:mm", {
                        locale: ptBR,
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${config.color} gap-1.5`}>
                        <IconComponent className="w-3 h-3" />
                        {config.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{movement.equipmentName}</TableCell>
                    <TableCell className="text-muted-foreground">{movement.description}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
