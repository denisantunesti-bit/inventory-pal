import { useState } from 'react';
import { useInventory } from '@/contexts/InventoryContext';
import { UserCard } from '@/components/inventory/UserCard';
import { UserDetailModal } from '@/components/inventory/UserDetailModal';
import { User } from '@/types/inventory';
import { Search, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function Inventario() {
  const { users } = useInventory();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Inventário</h1>
        </div>
        <p className="text-muted-foreground">
          Visualize os equipamentos atribuídos a cada usuário.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome ou departamento..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* User Grid */}
      {filteredUsers.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          Nenhum usuário encontrado.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map((user, index) => (
            <div
              key={user.id}
              style={{ animationDelay: `${(index + 1) * 50}ms` }}
              className="animate-slide-up"
            >
              <UserCard user={user} onClick={() => setSelectedUser(user)} />
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <UserDetailModal
        user={selectedUser}
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </div>
  );
}
