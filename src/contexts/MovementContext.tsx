import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Movement, MovementType } from '@/types/movement';

interface MovementContextType {
  movements: Movement[];
  addMovement: (movement: Omit<Movement, 'id' | 'createdAt'>) => void;
  getMovementsByEquipment: (equipmentId: string) => Movement[];
}

const MovementContext = createContext<MovementContextType | undefined>(undefined);

export function MovementProvider({ children }: { children: ReactNode }) {
  const [movements, setMovements] = useState<Movement[]>([]);

  const addMovement = (movementData: Omit<Movement, 'id' | 'createdAt'>) => {
    const newMovement: Movement = {
      ...movementData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
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
