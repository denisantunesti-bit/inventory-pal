import { Package, Users, Archive, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useInventory } from '@/contexts/InventoryContext';

const Index = () => {
  const { users, equipments, getUnassignedEquipments } = useInventory();
  const unassignedCount = getUnassignedEquipments().length;

  const stats = [
    {
      label: 'Usuários',
      value: users.length,
      icon: Users,
      color: 'bg-primary/10 text-primary',
      link: '/inventario',
    },
    {
      label: 'Equipamentos',
      value: equipments.length,
      icon: Package,
      color: 'bg-success/10 text-success',
      link: '/cadastro',
    },
    {
      label: 'Em Estoque',
      value: unassignedCount,
      icon: Archive,
      color: 'bg-warning/10 text-warning',
      link: '/estoque',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="mb-12 animate-fade-in">
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          Bem-vindo ao Sistema de Inventário
        </h1>
        <p className="text-lg text-muted-foreground">
          Gerencie equipamentos e atribuições de forma simples e eficiente.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3 mb-12">
        {stats.map((stat, index) => (
          <Link
            key={stat.label}
            to={stat.link}
            className="group p-6 bg-card border border-border rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <p className="text-3xl font-bold mb-1">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="p-6 bg-card border border-border rounded-xl animate-fade-in" style={{ animationDelay: '300ms' }}>
        <h2 className="text-lg font-semibold mb-4">Acesso Rápido</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <Link
            to="/inventario"
            className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
          >
            <Users className="w-5 h-5 text-primary" />
            <div className="flex-1">
              <p className="font-medium">Ver Inventário</p>
              <p className="text-sm text-muted-foreground">Consulte equipamentos por usuário</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>
          <Link
            to="/cadastro"
            className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
          >
            <Package className="w-5 h-5 text-primary" />
            <div className="flex-1">
              <p className="font-medium">Cadastrar</p>
              <p className="text-sm text-muted-foreground">Adicione novos usuários ou equipamentos</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
