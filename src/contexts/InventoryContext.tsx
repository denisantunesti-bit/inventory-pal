import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Equipment, User } from '@/types/inventory';
import { mockUsers, mockEquipments } from '@/data/mockData';
import { useMovement } from '@/contexts/MovementContext';

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
  getUserById: (userId: string) => User | undefined;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [equipments, setEquipments] = useState<Equipment[]>(mockEquipments);
  const { addMovement } = useMovement();

  const getUserById = (userId: string) => {
    return users.find((u) => u.id === userId);
  };

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
    // Unassign all equipments from the user and log movements
    setEquipments((prev) =>
      prev.map((eq) => {
        if (eq.assignedTo === id) {
          const user = getUserById(id);
          addMovement({
            equipmentId: eq.id,
            equipmentName: eq.name,
            type: 'unassigned',
            description: `Desatribuído de ${user?.name || 'usuário removido'} (usuário excluído)`,
            previousValue: user?.name,
            userId: id,
            userName: user?.name,
          });
          return { ...eq, assignedTo: null };
        }
        return eq;
      })
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

    addMovement({
      equipmentId: newEquipment.id,
      equipmentName: newEquipment.name,
      type: 'created',
      description: `Equipamento criado: ${newEquipment.type} - ${newEquipment.serialNumber}`,
    });

    // If assigned to a user on creation
    if (equipmentData.assignedTo) {
      const user = getUserById(equipmentData.assignedTo);
      addMovement({
        equipmentId: newEquipment.id,
        equipmentName: newEquipment.name,
        type: 'assigned',
        description: `Atribuído a ${user?.name || 'usuário'}`,
        newValue: user?.name,
        userId: equipmentData.assignedTo,
        userName: user?.name,
      });
    }
  };

  const updateEquipment = (id: string, equipmentData: Partial<Equipment>) => {
    setEquipments((prev) =>
      prev.map((eq) => {
        if (eq.id === id) {
          const updated = { ...eq, ...equipmentData };

          // Check for status change
          if (equipmentData.status && equipmentData.status !== eq.status) {
            addMovement({
              equipmentId: id,
              equipmentName: eq.name,
              type: 'status_changed',
              description: `Status alterado de "${eq.status}" para "${equipmentData.status}"`,
              previousValue: eq.status,
              newValue: equipmentData.status,
            });
          }

          // Check for assignment change
          if (equipmentData.assignedTo !== undefined && equipmentData.assignedTo !== eq.assignedTo) {
            if (eq.assignedTo && !equipmentData.assignedTo) {
              // Unassigned
              const prevUser = getUserById(eq.assignedTo);
              addMovement({
                equipmentId: id,
                equipmentName: eq.name,
                type: 'unassigned',
                description: `Desatribuído de ${prevUser?.name || 'usuário'}`,
                previousValue: prevUser?.name,
                userId: eq.assignedTo,
                userName: prevUser?.name,
              });
            } else if (!eq.assignedTo && equipmentData.assignedTo) {
              // Assigned
              const newUser = getUserById(equipmentData.assignedTo);
              addMovement({
                equipmentId: id,
                equipmentName: eq.name,
                type: 'assigned',
                description: `Atribuído a ${newUser?.name || 'usuário'}`,
                newValue: newUser?.name,
                userId: equipmentData.assignedTo,
                userName: newUser?.name,
              });
            } else if (eq.assignedTo && equipmentData.assignedTo) {
              // Reassigned
              const prevUser = getUserById(eq.assignedTo);
              const newUser = getUserById(equipmentData.assignedTo);
              addMovement({
                equipmentId: id,
                equipmentName: eq.name,
                type: 'unassigned',
                description: `Desatribuído de ${prevUser?.name || 'usuário'}`,
                previousValue: prevUser?.name,
                userId: eq.assignedTo,
                userName: prevUser?.name,
              });
              addMovement({
                equipmentId: id,
                equipmentName: eq.name,
                type: 'assigned',
                description: `Atribuído a ${newUser?.name || 'usuário'}`,
                newValue: newUser?.name,
                userId: equipmentData.assignedTo,
                userName: newUser?.name,
              });
            }
          }

          // Check for other updates (name, type, serialNumber)
          const fieldsChanged: string[] = [];
          if (equipmentData.name && equipmentData.name !== eq.name) fieldsChanged.push('nome');
          if (equipmentData.type && equipmentData.type !== eq.type) fieldsChanged.push('tipo');
          if (equipmentData.serialNumber && equipmentData.serialNumber !== eq.serialNumber) fieldsChanged.push('número de série');

          if (fieldsChanged.length > 0) {
            addMovement({
              equipmentId: id,
              equipmentName: equipmentData.name || eq.name,
              type: 'updated',
              description: `Campos atualizados: ${fieldsChanged.join(', ')}`,
            });
          }

          return updated;
        }
        return eq;
      })
    );
  };

  const deleteEquipment = (id: string) => {
    const equipment = equipments.find((eq) => eq.id === id);
    if (equipment) {
      addMovement({
        equipmentId: id,
        equipmentName: equipment.name,
        type: 'deleted',
        description: `Equipamento excluído: ${equipment.type} - ${equipment.serialNumber}`,
      });
    }
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
        getUserById,
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
