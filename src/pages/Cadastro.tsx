import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserForm } from '@/components/registration/UserForm';
import { EquipmentForm } from '@/components/registration/EquipmentForm';
import { UserPlus, Package, Users } from 'lucide-react';

export default function Cadastro() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <UserPlus className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Cadastro</h1>
        </div>
        <p className="text-muted-foreground">
          Gerencie usuários e equipamentos do sistema.
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="users" className="animate-fade-in" style={{ animationDelay: '100ms' }}>
        <TabsList className="mb-6">
          <TabsTrigger value="users" className="gap-2">
            <Users className="w-4 h-4" />
            Usuários
          </TabsTrigger>
          <TabsTrigger value="equipments" className="gap-2">
            <Package className="w-4 h-4" />
            Equipamentos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="animate-fade-in">
          <UserForm />
        </TabsContent>

        <TabsContent value="equipments" className="animate-fade-in">
          <EquipmentForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
