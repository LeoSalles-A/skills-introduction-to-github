// Drive-Through Management Component

import React, { useState } from 'react';
import { DriveThruOrder } from '../types';
import { DriveThruService } from '../services/drive-thru.service';

interface DriveThruManagementProps {
  orders: DriveThruOrder[];
  onOrderUpdate?: (order: DriveThruOrder) => void;
}

export const DriveThruManagement: React.FC<DriveThruManagementProps> = ({
  orders,
  onOrderUpdate,
}) => {
  const [selectedOrder, setSelectedOrder] = useState<DriveThruOrder | null>(null);

  const readyOrders = orders.filter((o) => o.status === 'ready');
  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const completedOrders = orders.filter((o) => o.status === 'picked_up');

  const handleAssignParkingSpot = (order: DriveThruOrder) => {
    const updatedOrder = DriveThruService.assignParkingSpot(order);
    onOrderUpdate?.(updatedOrder);
    DriveThruService.sendPickupNotification(
      updatedOrder,
      `Seu pedido está pronto! Vaga: ${updatedOrder.parkingSpot}`
    );
  };

  const handleCompletePickup = (order: DriveThruOrder) => {
    const updatedOrder = DriveThruService.completePickup(order);
    onOrderUpdate?.(updatedOrder);
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      ready: 'bg-green-100 text-green-800',
      picked_up: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return badges[status as keyof typeof badges] || badges.pending;
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      prescription: 'Receita',
      exam_order: 'Pedido de Exame',
      both: 'Receita + Exame',
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <div className="drive-thru-management p-6 bg-white rounded-lg shadow-lg">
      <div className="header mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Sistema Drive-Through 🚗
        </h2>
        <p className="text-gray-600">Gestão de pedidos para retirada rápida</p>
      </div>

      {/* Statistics */}
      <div className="stats grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="stat-card bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
          <p className="text-sm text-yellow-800 font-medium">Pendentes</p>
          <p className="text-3xl font-bold text-yellow-900">{pendingOrders.length}</p>
        </div>
        <div className="stat-card bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
          <p className="text-sm text-green-800 font-medium">Prontos</p>
          <p className="text-3xl font-bold text-green-900">{readyOrders.length}</p>
        </div>
        <div className="stat-card bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
          <p className="text-sm text-blue-800 font-medium">Retirados Hoje</p>
          <p className="text-3xl font-bold text-blue-900">{completedOrders.length}</p>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {/* Pending Orders */}
        {pendingOrders.length > 0 && (
          <div className="section">
            <h3 className="text-lg font-semibold mb-3 text-yellow-800">
              Pedidos Pendentes ({pendingOrders.length})
            </h3>
            <div className="space-y-3">
              {pendingOrders.map((order) => (
                <div
                  key={order.id}
                  className="order-card bg-yellow-50 p-4 rounded-lg border border-yellow-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusBadge(order.status)}`}>
                          {order.status.toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-600">
                          {getTypeLabel(order.type)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">
                        Pedido: <span className="font-mono">{order.id.substring(0, 12)}...</span>
                      </p>
                      {order.prescriptions && (
                        <p className="text-sm text-gray-600">
                          Receitas: {order.prescriptions.length}
                        </p>
                      )}
                      {order.examOrders && (
                        <p className="text-sm text-gray-600">
                          Exames: {order.examOrders.length}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleAssignParkingSpot(order)}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm font-medium"
                    >
                      Marcar Pronto
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ready Orders */}
        {readyOrders.length > 0 && (
          <div className="section">
            <h3 className="text-lg font-semibold mb-3 text-green-800">
              Prontos para Retirada ({readyOrders.length})
            </h3>
            <div className="space-y-3">
              {readyOrders.map((order) => (
                <div
                  key={order.id}
                  className="order-card bg-green-50 p-4 rounded-lg border-2 border-green-300 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">📦</span>
                        <div>
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusBadge(order.status)}`}>
                            PRONTO
                          </span>
                          <span className="ml-2 text-sm text-gray-600">
                            {getTypeLabel(order.type)}
                          </span>
                        </div>
                      </div>
                      {order.parkingSpot && (
                        <p className="text-lg font-bold text-green-900 mb-2">
                          Vaga: {order.parkingSpot}
                        </p>
                      )}
                      <p className="text-sm text-gray-700">
                        Pedido: <span className="font-mono">{order.id.substring(0, 12)}...</span>
                      </p>
                      {order.scheduledPickup && (
                        <p className="text-sm text-gray-600">
                          Agendado: {new Date(order.scheduledPickup).toLocaleString('pt-BR')}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleCompletePickup(order)}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm font-medium"
                    >
                      Confirmar Retirada
                    </button>
                  </div>

                  {/* Order Details */}
                  <div className="mt-3 pt-3 border-t border-green-200">
                    {order.prescriptions && order.prescriptions.length > 0 && (
                      <div className="mb-2">
                        <p className="text-xs font-semibold text-gray-700 mb-1">Receitas:</p>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {order.prescriptions.map((prescription, idx) => (
                            <li key={idx}>
                              • {prescription.medication} - {prescription.dosage} ({prescription.quantity} unidades)
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {order.examOrders && order.examOrders.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-700 mb-1">Pedidos de Exame:</p>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {order.examOrders.map((exam, idx) => (
                            <li key={idx}>
                              • {exam.examType} - {exam.laboratory}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Orders */}
        {orders.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-xl">Nenhum pedido no momento</p>
            <p className="text-sm">Pedidos aparecerão aqui quando forem criados</p>
          </div>
        )}
      </div>

      {/* Parking Map */}
      <div className="parking-map mt-8 bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Mapa de Vagas</h3>
        <div className="grid grid-cols-3 gap-4">
          {['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3'].map((spot) => {
            const occupiedOrder = readyOrders.find((o) => o.parkingSpot === spot);
            const isOccupied = !!occupiedOrder;

            return (
              <div
                key={spot}
                className={`parking-spot p-4 rounded-lg border-2 text-center transition-all ${
                  isOccupied
                    ? 'bg-red-100 border-red-300'
                    : 'bg-green-100 border-green-300'
                }`}
              >
                <p className="text-2xl font-bold">{spot}</p>
                <p className="text-xs mt-1">
                  {isOccupied ? '🚗 Ocupada' : '✓ Livre'}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DriveThruManagement;
