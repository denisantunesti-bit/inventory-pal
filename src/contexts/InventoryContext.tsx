import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Equipment, User } from '@/types/inventory';
import { mockUsers, mockEquipments } from '@/data/mockData';

interface InventoryContextType {
  users: User[];
  equipments: Equipment[];
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
  addEquipment: (equipment: Omit<Equipment, 'id' | 'createdAt'>) => void;
  updateEquipment: (id: string, equipment: Partial<Equipment>) => void;
  deleteEquipment: (id: string) => void;
  getEquipmentsByUser: (userId: string) => Equipment[];
  getUnassignedEquipments: () => Equipment[];
  getEquipmentCountByUser: (userId: string) => number;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [equipments, setEquipments] = useState<Equipment[]>(mockEquipments);

  const addUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setUsers((prev) => [...prev, newUser]);
  };

  const updateUser = (id: string, userData: Partial<User>) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === id ? { ...user, ...userData } : user))
    );
  };

  const deleteUser = (id: string) => {
    // Unassign all equipments from the user
    setEquipments((prev) =>
      prev.map((eq) => (eq.assignedTo === id ? { ...eq, assignedTo: null } : eq))
    );
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  const addEquipment = (equipmentData: Omit<Equipment, 'id' | 'createdAt'>) => {
    const newEquipment: Equipment = {
      ...equipmentData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setEquipments((prev) => [...prev, newEquipment]);
  };

  const updateEquipment = (id: string, equipmentData: Partial<Equipment>) => {
    setEquipments((prev) =>
      prev.map((eq) => (eq.id === id ? { ...eq, ...equipmentData } : eq))
    );
  };

  const deleteEquipment = (id: string) => {
    setEquipments((prev) => prev.filter((eq) => eq.id !== id));
  };

  const getEquipmentsByUser = (userId: string) => {
    return equipments.filter((eq) => eq.assignedTo === userId);
  };

  const getUnassignedEquipments = () => {
    return equipments.filter((eq) => eq.assignedTo === null);
  };

  const getEquipmentCountByUser = (userId: string) => {
    return equipments.filter((eq) => eq.assignedTo === userId).length;
  };

  return (
    <InventoryContext.Provider
      value={{
        users,
        equipments,
        addUser,
        updateUser,
        deleteUser,
        addEquipment,
        updateEquipment,
        deleteEquipment,
        getEquipmentsByUser,
        getUnassignedEquipments,
        getEquipmentCountByUser,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
}
