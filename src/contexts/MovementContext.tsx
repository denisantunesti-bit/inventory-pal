import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Movement, MovementType } from '@/types/movement';
import { useAuth } from '@/contexts/AuthContext';

interface MovementContextType {
  movements: Movement[];
  addMovement: (movement: Omit<Movement, 'id' | 'createdAt' | 'performedBy'>) => void;
  getMovementsByEquipment: (equipmentId: string) => Movement[];
}

const MovementContext = createContext<MovementContextType | undefined>(undefined);

export function MovementProvider({ children }: { children: ReactNode }) {
  const [movements, setMovements] = useState<Movement[]>([]);

  return (
    <MovementContext.Provider
      value={{
        movements,
        addMovement: () => {}, // Será sobrescrito pelo inner provider
        getMovementsByEquipment: (equipmentId: string) =>
          movements.filter((m) => m.equipmentId === equipmentId),
      }}
    >
      <MovementInnerProvider movements={movements} setMovements={setMovements}>
        {children}
      </MovementInnerProvider>
    </MovementContext.Provider>
  );
}

// Inner provider que tem acesso ao AuthContext
function MovementInnerProvider({
  children,
  movements,
  setMovements,
}: {
  children: ReactNode;
  movements: Movement[];
  setMovements: React.Dispatch<React.SetStateAction<Movement[]>>;
}) {
  const auth = useAuth();

  const addMovement = (movementData: Omit<Movement, 'id' | 'createdAt' | 'performedBy'>) => {
    const newMovement: Movement = {
      ...movementData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      performedBy: auth?.user?.name || 'Sistema',
    };
    setMovements((prev) => [newMovement, ...prev]);
  };

  const getMovementsByEquipment = (equipmentId: string) => {
    return movements.filter((m) => m.equipmentId === equipmentId);
  };

  return (
    <MovementContext.Provider
      value={{
        movements,
        addMovement,
        getMovementsByEquipment,
      }}
    >
      {children}
    </MovementContext.Provider>
  );
}

export function useMovement() {
  const context = useContext(MovementContext);
  if (context === undefined) {
    throw new Error('useMovement must be used within a MovementProvider');
  }
  return context;
}
