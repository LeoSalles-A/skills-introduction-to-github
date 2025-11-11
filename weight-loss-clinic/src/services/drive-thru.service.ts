// Drive-Through Service for Prescription and Exam Order Management

import { DriveThruOrder, Prescription, ExamOrder } from '../types';

/**
 * Service for managing drive-through prescription pickup and exam orders
 */
export class DriveThruService {
  /**
   * Create a new drive-through order
   */
  static createOrder(
    patientId: string,
    type: 'prescription' | 'exam_order' | 'both',
    prescriptions?: Prescription[],
    examOrders?: ExamOrder[]
  ): DriveThruOrder {
    return {
      id: this.generateId(),
      patientId,
      type,
      prescriptions,
      examOrders,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  /**
   * Schedule pickup time
   */
  static schedulePickup(order: DriveThruOrder, scheduledTime: Date): DriveThruOrder {
    return {
      ...order,
      scheduledPickup: scheduledTime,
      updatedAt: new Date(),
    };
  }

  /**
   * Assign parking spot
   */
  static assignParkingSpot(order: DriveThruOrder): DriveThruOrder {
    const spot = this.getNextAvailableSpot();
    return {
      ...order,
      parkingSpot: spot,
      status: 'ready',
      updatedAt: new Date(),
    };
  }

  /**
   * Complete pickup
   */
  static completePickup(order: DriveThruOrder): DriveThruOrder {
    return {
      ...order,
      status: 'picked_up',
      actualPickup: new Date(),
      updatedAt: new Date(),
    };
  }

  /**
   * Get orders ready for pickup
   */
  static getReadyOrders(orders: DriveThruOrder[]): DriveThruOrder[] {
    return orders.filter((order) => order.status === 'ready');
  }

  /**
   * Get orders scheduled for a specific time range
   */
  static getScheduledOrders(
    orders: DriveThruOrder[],
    startTime: Date,
    endTime: Date
  ): DriveThruOrder[] {
    return orders.filter((order) => {
      if (!order.scheduledPickup) return false;
      return order.scheduledPickup >= startTime && order.scheduledPickup <= endTime;
    });
  }

  /**
   * Get order statistics
   */
  static getStatistics(orders: DriveThruOrder[], startDate: Date, endDate: Date): {
    totalOrders: number;
    completedOrders: number;
    pendingOrders: number;
    averageWaitTime: number;
    byType: {
      prescription: number;
      examOrder: number;
      both: number;
    };
  } {
    const filteredOrders = orders.filter((order) => {
      return order.createdAt >= startDate && order.createdAt <= endDate;
    });

    const completed = filteredOrders.filter((o) => o.status === 'picked_up');
    const pending = filteredOrders.filter((o) => o.status === 'pending' || o.status === 'ready');

    // Calculate average wait time for completed orders
    let totalWaitTime = 0;
    completed.forEach((order) => {
      if (order.actualPickup && order.scheduledPickup) {
        const waitTime = order.actualPickup.getTime() - order.scheduledPickup.getTime();
        totalWaitTime += waitTime;
      }
    });

    const averageWaitTime = completed.length > 0 ? totalWaitTime / completed.length / 1000 / 60 : 0; // in minutes

    return {
      totalOrders: filteredOrders.length,
      completedOrders: completed.length,
      pendingOrders: pending.length,
      averageWaitTime: Math.round(averageWaitTime),
      byType: {
        prescription: filteredOrders.filter((o) => o.type === 'prescription').length,
        examOrder: filteredOrders.filter((o) => o.type === 'exam_order').length,
        both: filteredOrders.filter((o) => o.type === 'both').length,
      },
    };
  }

  /**
   * Generate prescription
   */
  static createPrescription(
    medication: string,
    dosage: string,
    quantity: number,
    instructions: string,
    prescribedBy: string
  ): Prescription {
    return {
      id: this.generateId(),
      medication,
      dosage,
      quantity,
      instructions,
      prescribedBy,
      prescriptionDate: new Date(),
    };
  }

  /**
   * Generate exam order
   */
  static createExamOrder(
    examType: string,
    laboratory: string,
    urgency: 'routine' | 'urgent' | 'stat',
    instructions: string,
    orderedBy: string
  ): ExamOrder {
    return {
      id: this.generateId(),
      examType,
      laboratory,
      urgency,
      instructions,
      orderedBy,
      orderDate: new Date(),
    };
  }

  /**
   * Get next available parking spot
   */
  private static getNextAvailableSpot(): string {
    // In a real system, this would check actual availability
    const spots = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3'];
    return spots[Math.floor(Math.random() * spots.length)];
  }

  /**
   * Generate unique ID
   */
  private static generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Send notification to patient
   */
  static sendPickupNotification(order: DriveThruOrder, message: string): {
    success: boolean;
    message: string;
  } {
    // In production, this would integrate with SMS/email service
    console.log(`Notification sent for order ${order.id}: ${message}`);

    return {
      success: true,
      message: `Notification sent successfully`,
    };
  }

  /**
   * Validate order is ready for pickup
   */
  static validateOrderReady(order: DriveThruOrder): {
    isReady: boolean;
    issues: string[];
  } {
    const issues: string[] = [];

    if (order.type === 'prescription' || order.type === 'both') {
      if (!order.prescriptions || order.prescriptions.length === 0) {
        issues.push('No prescriptions attached to order');
      }
    }

    if (order.type === 'exam_order' || order.type === 'both') {
      if (!order.examOrders || order.examOrders.length === 0) {
        issues.push('No exam orders attached to order');
      }
    }

    return {
      isReady: issues.length === 0,
      issues,
    };
  }
}
