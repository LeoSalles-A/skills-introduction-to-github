// Schedule Calendar Component for Resource Booking

import React, { useState } from 'react';
import { WeeklySchedule, DaySchedule, TimeSlot, ResourceType } from '../types';

interface ScheduleCalendarProps {
  schedule: WeeklySchedule;
  onSlotSelect?: (dayOfWeek: string, slot: TimeSlot) => void;
  resourceName: string;
}

export const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({
  schedule,
  onSlotSelect,
  resourceName,
}) => {
  const [selectedSlot, setSelectedSlot] = useState<{ day: string; time: string } | null>(null);

  const handleSlotClick = (dayOfWeek: string, slot: TimeSlot) => {
    if (slot.isAvailable) {
      setSelectedSlot({ day: dayOfWeek, time: slot.startTime });
      onSlotSelect?.(dayOfWeek, slot);
    }
  };

  const getResourceTypeLabel = (type: ResourceType): string => {
    const labels: Record<ResourceType, string> = {
      medication_box: 'Box de Medicação',
      apartment: 'Apartamento',
      endoscopy_room: 'Sala de Endoscopia',
      videoconference_office: 'Consultório Virtual',
      operating_room: 'Sala Cirúrgica',
    };
    return labels[type];
  };

  return (
    <div className="schedule-calendar">
      <h2 className="text-2xl font-bold mb-4">
        {getResourceTypeLabel(schedule.resourceType)}: {resourceName}
      </h2>

      <div className="calendar-grid grid grid-cols-8 gap-2">
        {/* Header row */}
        <div className="font-bold text-center p-2 bg-gray-200">Horário</div>
        {schedule.schedule.map((daySchedule) => (
          <div key={daySchedule.dayOfWeek} className="font-bold text-center p-2 bg-gray-200">
            {daySchedule.dayOfWeek}
          </div>
        ))}

        {/* Time slots */}
        {schedule.schedule[0]?.slots.map((_, slotIndex) => (
          <React.Fragment key={slotIndex}>
            {/* Time label */}
            <div className="text-center p-2 bg-gray-100 font-semibold">
              {schedule.schedule[0].slots[slotIndex].startTime}
            </div>

            {/* Slots for each day */}
            {schedule.schedule.map((daySchedule) => {
              const slot = daySchedule.slots[slotIndex];
              const isSelected =
                selectedSlot?.day === daySchedule.dayOfWeek &&
                selectedSlot?.time === slot.startTime;

              return (
                <div
                  key={`${daySchedule.dayOfWeek}-${slotIndex}`}
                  className={`
                    p-2 text-center cursor-pointer border rounded transition-all
                    ${
                      slot.isAvailable
                        ? isSelected
                          ? 'bg-blue-500 text-white border-blue-700'
                          : 'bg-green-100 hover:bg-green-200 border-green-300'
                        : 'bg-red-100 border-red-300 cursor-not-allowed'
                    }
                  `}
                  onClick={() => handleSlotClick(daySchedule.dayOfWeek, slot)}
                  title={
                    slot.isAvailable
                      ? 'Disponível - Clique para agendar'
                      : 'Indisponível'
                  }
                >
                  {slot.isAvailable ? '✓' : '✗'}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      <div className="mt-4 flex gap-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
          <span className="text-sm">Disponível</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
          <span className="text-sm">Ocupado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 border border-blue-700 rounded"></div>
          <span className="text-sm">Selecionado</span>
        </div>
      </div>
    </div>
  );
};

export default ScheduleCalendar;
