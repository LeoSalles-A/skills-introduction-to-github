// Core Type Definitions for Weight Loss Clinic Management System

export type DayOfWeek = 'Segunda' | 'Terça' | 'Quarta' | 'Quinta' | 'Sexta' | 'Sab' | 'Dom';

export type AppointmentStatus = 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';

export type ResourceType = 'medication_box' | 'apartment' | 'endoscopy_room' | 'videoconference_office' | 'operating_room';

export type TreatmentType =
  | 'medication_delivery'
  | 'vitamin_application'
  | 'anemia_correction'
  | 'hydration'
  | 'potassium_correction'
  | 'tirzepatide'
  | 'glp1_analog'
  | 'gip_analog'
  | 'intragastric_balloon'
  | 'bariatric_endoscopy'
  | 'bariatric_surgery'
  | 'nutritional_consultation'
  | 'psychological_consultation';

// Patient Information
export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  dateOfBirth: Date;
  gender: 'M' | 'F' | 'Other';
  address: Address;
  medicalHistory: MedicalHistory;
  currentWeight: number;
  targetWeight: number;
  height: number;
  bmi: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface MedicalHistory {
  allergies: string[];
  chronicDiseases: string[];
  medications: string[];
  previousSurgeries: string[];
  familyHistory: string[];
  smokingStatus: 'never' | 'former' | 'current';
  alcoholConsumption: 'none' | 'occasional' | 'moderate' | 'heavy';
}

// Laboratory Results
export interface LabResult {
  id: string;
  patientId: string;
  testDate: Date;
  results: LabTest[];
  aiAnalysis?: AILabAnalysis;
  reviewedBy?: string;
  reviewDate?: Date;
  status: 'pending' | 'analyzed' | 'reviewed';
}

export interface LabTest {
  name: string;
  value: number | string;
  unit: string;
  referenceRange: string;
  status: 'normal' | 'abnormal' | 'critical';
}

export interface AILabAnalysis {
  summary: string;
  abnormalities: string[];
  recommendations: string[];
  riskAssessment: 'low' | 'medium' | 'high';
  suggestedTreatments: TreatmentType[];
  generatedAt: Date;
}

// Treatment Plans
export interface TreatmentPlan {
  id: string;
  patientId: string;
  startDate: Date;
  endDate?: Date;
  status: 'active' | 'completed' | 'suspended' | 'cancelled';
  treatments: Treatment[];
  nutritionalPlan?: NutritionalPlan;
  psychologicalSupport?: PsychologicalSupport;
  progress: TreatmentProgress[];
}

export interface Treatment {
  id: string;
  type: TreatmentType;
  medication?: Medication;
  dosage?: string;
  frequency: string;
  duration: string;
  instructions: string;
  startDate: Date;
  endDate?: Date;
  prescribedBy: string;
}

export interface Medication {
  name: string;
  activeIngredient: string;
  concentration: string;
  form: 'injection' | 'oral' | 'iv' | 'topical';
  manufacturer: string;
}

export interface NutritionalPlan {
  id: string;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
  mealPlan: string;
  restrictions: string[];
  supplements: string[];
  createdBy: string;
  createdAt: Date;
}

export interface PsychologicalSupport {
  id: string;
  sessions: PsychologySession[];
  assessments: string[];
  goals: string[];
  assignedPsychologist: string;
}

export interface PsychologySession {
  id: string;
  date: Date;
  duration: number;
  notes: string;
  nextSession?: Date;
}

export interface TreatmentProgress {
  date: Date;
  weight: number;
  bmi: number;
  measurements?: {
    waist: number;
    hip: number;
    chest: number;
  };
  notes: string;
  photos?: string[];
}

// Scheduling Resources
export interface Resource {
  id: string;
  type: ResourceType;
  name: string;
  number: number;
  isActive: boolean;
  equipment?: string[];
  capacity?: number;
}

export interface MedicationBox extends Resource {
  type: 'medication_box';
  equipment: string[];
}

export interface Apartment extends Resource {
  type: 'apartment';
  capacity: number;
  amenities: string[];
}

export interface EndoscopyRoom extends Resource {
  type: 'endoscopy_room';
  equipment: string[];
}

export interface VideoconferenceOffice extends Resource {
  type: 'videoconference_office';
  equipment: string[];
}

export interface OperatingRoom extends Resource {
  type: 'operating_room';
  equipment: string[];
  specialty?: string;
}

// Appointments
export interface Appointment {
  id: string;
  patientId: string;
  resourceId: string;
  resourceType: ResourceType;
  treatmentType: TreatmentType;
  scheduledDate: Date;
  scheduledTime: string;
  duration: number; // in minutes
  status: AppointmentStatus;
  staff: StaffAssignment[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StaffAssignment {
  staffId: string;
  role: 'doctor' | 'nurse' | 'nutritionist' | 'psychologist' | 'anesthesiologist' | 'technician';
  name: string;
}

// Weekly Schedule
export interface WeeklySchedule {
  resourceId: string;
  resourceType: ResourceType;
  schedule: DaySchedule[];
}

export interface DaySchedule {
  dayOfWeek: DayOfWeek;
  slots: TimeSlot[];
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  appointmentId?: string;
}

// Drive-Through System
export interface DriveThruOrder {
  id: string;
  patientId: string;
  type: 'prescription' | 'exam_order' | 'both';
  prescriptions?: Prescription[];
  examOrders?: ExamOrder[];
  status: 'pending' | 'ready' | 'picked_up' | 'cancelled';
  scheduledPickup?: Date;
  actualPickup?: Date;
  parkingSpot?: string;
}

export interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  quantity: number;
  instructions: string;
  prescribedBy: string;
  prescriptionDate: Date;
}

export interface ExamOrder {
  id: string;
  examType: string;
  laboratory: string;
  urgency: 'routine' | 'urgent' | 'stat';
  instructions: string;
  orderedBy: string;
  orderDate: Date;
}

// Staff Management
export interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'doctor' | 'nurse' | 'nutritionist' | 'psychologist' | 'anesthesiologist' | 'technician' | 'admin';
  specialties: string[];
  license: string;
  availability: WeeklyAvailability;
  isActive: boolean;
}

export interface WeeklyAvailability {
  [key: string]: DayAvailability; // key is DayOfWeek
}

export interface DayAvailability {
  isWorking: boolean;
  startTime: string;
  endTime: string;
  breaks?: TimeRange[];
}

export interface TimeRange {
  startTime: string;
  endTime: string;
}

// Inventory Management
export interface InventoryItem {
  id: string;
  name: string;
  category: 'medication' | 'supply' | 'equipment';
  quantity: number;
  unit: string;
  minimumStock: number;
  expirationDate?: Date;
  supplier: string;
  costPerUnit: number;
  location: string;
}

// AI Chat Interface
export interface ChatMessage {
  id: string;
  patientId: string;
  role: 'patient' | 'ai' | 'staff';
  content: string;
  timestamp: Date;
  context?: 'nutritional' | 'psychological' | 'medical' | 'general';
}

export interface AIChatSession {
  id: string;
  patientId: string;
  startTime: Date;
  endTime?: Date;
  messages: ChatMessage[];
  summary?: string;
}
