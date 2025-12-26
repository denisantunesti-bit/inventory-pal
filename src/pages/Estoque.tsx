import { useInventory } from '@/contexts/InventoryContext';
import { EquipmentCard } from '@/components/stock/EquipmentCard';
import { Archive, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function Estoque() {
  const { getUnassignedEquipments } = useInventory();
  const unassignedEquipments = getUnassignedEquipments();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEquipments = unassignedEquipments.filter(
    (equipment) =>
      equipment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      equipment.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      equipment.serialNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
            <Archive className="w-5 h-5 text-warning" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Estoque</h1>
        </div>
        <p className="text-muted-foreground">
          Equipamentos disponíveis não atribuídos a nenhum usuário.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome, tipo ou número de série..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats */}
      <div className="mb-6 p-4 bg-card border border-border rounded-xl animate-fade-in" style={{ animationDelay: '150ms' }}>
        <p className="text-sm text-muted-foreground">
          Total de equipamentos em estoque:{' '}
          <span className="font-semibold text-foreground">
            {unassignedEquipments.length}
          </span>
        </p>
      </div>

      {/* Equipment Grid */}
      {filteredEquipments.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {searchQuery
            ? 'Nenhum equipamento encontrado.'
            : 'Nenhum equipamento disponível no estoque.'}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredEquipments.map((equipment, index) => (
            <div
              key={equipment.id}
              style={{ animationDelay: `${(index + 1) * 50}ms` }}
              className="animate-slide-up"
            >
              <EquipmentCard equipment={equipment} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
