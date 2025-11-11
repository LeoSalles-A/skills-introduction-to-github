// Scheduling Service for Weight Loss Clinic Management System

import {
  Resource,
  Appointment,
  WeeklySchedule,
  DaySchedule,
  TimeSlot,
  DayOfWeek,
  ResourceType,
  AppointmentStatus,
} from '../types';

/**
 * Service to manage scheduling for all clinic resources
 */
export class SchedulingService {
  /**
   * Initialize default resources for the clinic
   */
  static initializeDefaultResources(): Resource[] {
    const resources: Resource[] = [];

    // 13 Medication Boxes
    for (let i = 1; i <= 13; i++) {
      resources.push({
        id: `medication-box-${i}`,
        type: 'medication_box',
        name: `Box ${i.toString().padStart(2, '0')}`,
        number: i,
        isActive: true,
        equipment: ['IV stand', 'Medication cart', 'Vital signs monitor', 'Reclining chair'],
      });
    }

    // 7 Apartments for hospitalization
    for (let i = 1; i <= 7; i++) {
      resources.push({
        id: `apartment-${i}`,
        type: 'apartment',
        name: `Ap ${i.toString().padStart(2, '0')}`,
        number: i,
        isActive: true,
        capacity: 1,
        equipment: ['Hospital bed', 'Private bathroom', 'TV', 'Nurse call system'],
      });
    }

    // 3 Endoscopy Rooms
    for (let i = 1; i <= 3; i++) {
      resources.push({
        id: `endoscopy-room-${i}`,
        type: 'endoscopy_room',
        name: `Sala Endoscopia ${i}`,
        number: i,
        isActive: true,
        equipment: [
          'Endoscope',
          'Monitoring equipment',
          'Sedation equipment',
          'Recovery area',
          'Sterilization equipment',
        ],
      });
    }

    // 12 Videoconferencing Offices
    for (let i = 1; i <= 12; i++) {
      resources.push({
        id: `videoconference-office-${i}`,
        type: 'videoconference_office',
        name: `Consultório ${i}`,
        number: i,
        isActive: true,
        equipment: ['High-speed internet', 'Camera', 'Microphone', 'Display screen', 'Soundproofing'],
      });
    }

    // 7 Operating Rooms
    for (let i = 1; i <= 7; i++) {
      const specialty = i === 7 ? 'EDA' : undefined;
      resources.push({
        id: `operating-room-${i}`,
        type: 'operating_room',
        name: `Sala ${i}${specialty ? ' - ' + specialty : ''}`,
        number: i,
        isActive: true,
        equipment: [
          'Operating table',
          'Anesthesia machine',
          'Surgical lights',
          'Monitoring equipment',
          'Laparoscopic equipment',
          'Sterilization equipment',
        ],
      });
    }

    return resources;
  }

  /**
   * Get all available time slots for a specific resource on a given day
   */
  static getAvailableSlots(
    resourceId: string,
    date: Date,
    appointments: Appointment[],
    slotDuration: number = 60 // minutes
  ): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const dayOfWeek = this.getDayOfWeek(date);

    // Define business hours (7 AM to 7 PM)
    const startHour = 7;
    const endHour = 19;

    // Generate all possible slots
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += slotDuration) {
        const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const endMinute = minute + slotDuration;
        const endHourCalc = hour + Math.floor(endMinute / 60);
        const endMinuteCalc = endMinute % 60;
        const endTime = `${endHourCalc.toString().padStart(2, '0')}:${endMinuteCalc.toString().padStart(2, '0')}`;

        if (endHourCalc > endHour) break;

        // Check if slot is available
        const isAvailable = !this.isSlotOccupied(resourceId, date, startTime, appointments);

        slots.push({
          startTime,
          endTime,
          isAvailable,
          appointmentId: isAvailable ? undefined : this.getAppointmentIdForSlot(resourceId, date, startTime, appointments),
        });
      }
    }

    return slots;
  }

  /**
   * Get weekly schedule for a resource
   */
  static getWeeklySchedule(
    resourceId: string,
    weekStartDate: Date,
    appointments: Appointment[]
  ): WeeklySchedule {
    const daysOfWeek: DayOfWeek[] = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sab', 'Dom'];
    const schedule: DaySchedule[] = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStartDate);
      date.setDate(weekStartDate.getDate() + i);

      const daySchedule: DaySchedule = {
        dayOfWeek: daysOfWeek[i],
        slots: this.getAvailableSlots(resourceId, date, appointments),
      };

      schedule.push(daySchedule);
    }

    return {
      resourceId,
      resourceType: this.getResourceType(resourceId),
      schedule,
    };
  }

  /**
   * Book an appointment
   */
  static createAppointment(appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Appointment {
    const newAppointment: Appointment = {
      ...appointment,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return newAppointment;
  }

  /**
   * Check if a time slot is available
   */
  static isSlotAvailable(
    resourceId: string,
    date: Date,
    startTime: string,
    duration: number,
    appointments: Appointment[]
  ): boolean {
    return !this.isSlotOccupied(resourceId, date, startTime, appointments);
  }

  /**
   * Get all appointments for a specific resource on a given date
   */
  static getResourceAppointments(
    resourceId: string,
    date: Date,
    appointments: Appointment[]
  ): Appointment[] {
    return appointments.filter((apt) => {
      const aptDate = new Date(apt.scheduledDate);
      return (
        apt.resourceId === resourceId &&
        aptDate.toDateString() === date.toDateString() &&
        apt.status !== 'cancelled'
      );
    });
  }

  /**
   * Get appointments for a patient
   */
  static getPatientAppointments(
    patientId: string,
    appointments: Appointment[],
    includeCompleted: boolean = false
  ): Appointment[] {
    return appointments.filter((apt) => {
      if (apt.patientId !== patientId) return false;
      if (!includeCompleted && (apt.status === 'completed' || apt.status === 'cancelled')) return false;
      return true;
    });
  }

  /**
   * Update appointment status
   */
  static updateAppointmentStatus(
    appointmentId: string,
    status: AppointmentStatus,
    appointments: Appointment[]
  ): Appointment | null {
    const appointment = appointments.find((apt) => apt.id === appointmentId);
    if (!appointment) return null;

    appointment.status = status;
    appointment.updatedAt = new Date();

    return appointment;
  }

  /**
   * Get resource utilization report
   */
  static getResourceUtilization(
    resourceId: string,
    startDate: Date,
    endDate: Date,
    appointments: Appointment[]
  ): {
    totalSlots: number;
    bookedSlots: number;
    utilization: number;
  } {
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const slotsPerDay = 12; // 7 AM to 7 PM with 1-hour slots
    const totalSlots = days * slotsPerDay;

    const bookedSlots = appointments.filter((apt) => {
      const aptDate = new Date(apt.scheduledDate);
      return (
        apt.resourceId === resourceId &&
        aptDate >= startDate &&
        aptDate <= endDate &&
        apt.status !== 'cancelled'
      );
    }).length;

    return {
      totalSlots,
      bookedSlots,
      utilization: (bookedSlots / totalSlots) * 100,
    };
  }

  // Private helper methods

  private static isSlotOccupied(
    resourceId: string,
    date: Date,
    startTime: string,
    appointments: Appointment[]
  ): boolean {
    return appointments.some((apt) => {
      const aptDate = new Date(apt.scheduledDate);
      return (
        apt.resourceId === resourceId &&
        aptDate.toDateString() === date.toDateString() &&
        apt.scheduledTime === startTime &&
        apt.status !== 'cancelled'
      );
    });
  }

  private static getAppointmentIdForSlot(
    resourceId: string,
    date: Date,
    startTime: string,
    appointments: Appointment[]
  ): string | undefined {
    const appointment = appointments.find((apt) => {
      const aptDate = new Date(apt.scheduledDate);
      return (
        apt.resourceId === resourceId &&
        aptDate.toDateString() === date.toDateString() &&
        apt.scheduledTime === startTime &&
        apt.status !== 'cancelled'
      );
    });

    return appointment?.id;
  }

  private static getDayOfWeek(date: Date): DayOfWeek {
    const days: DayOfWeek[] = ['Dom', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sab'];
    return days[date.getDay()];
  }

  private static getResourceType(resourceId: string): ResourceType {
    if (resourceId.startsWith('medication-box')) return 'medication_box';
    if (resourceId.startsWith('apartment')) return 'apartment';
    if (resourceId.startsWith('endoscopy-room')) return 'endoscopy_room';
    if (resourceId.startsWith('videoconference-office')) return 'videoconference_office';
    if (resourceId.startsWith('operating-room')) return 'operating_room';
    return 'medication_box'; // default
  }

  private static generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
