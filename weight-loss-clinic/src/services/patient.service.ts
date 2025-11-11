// Patient Management Service

import { Patient, TreatmentPlan, TreatmentProgress } from '../types';

/**
 * Service for managing patient records and progress tracking
 */
export class PatientService {
  /**
   * Calculate BMI
   */
  static calculateBMI(weightKg: number, heightCm: number): number {
    const heightM = heightCm / 100;
    return Number((weightKg / (heightM * heightM)).toFixed(1));
  }

  /**
   * Get BMI category
   */
  static getBMICategory(bmi: number): {
    category: string;
    description: string;
    recommendation: string;
  } {
    if (bmi < 18.5) {
      return {
        category: 'Underweight',
        description: 'BMI below normal range',
        recommendation: 'Weight loss treatment not recommended. Consider nutritional counseling for healthy weight gain.',
      };
    } else if (bmi >= 18.5 && bmi < 25) {
      return {
        category: 'Normal weight',
        description: 'BMI within healthy range',
        recommendation: 'Weight loss treatment not typically indicated unless specific medical condition requires it.',
      };
    } else if (bmi >= 25 && bmi < 30) {
      return {
        category: 'Overweight',
        description: 'BMI above normal range',
        recommendation: 'Lifestyle modifications, nutritional counseling, and exercise recommended. Medication may be considered if comorbidities present.',
      };
    } else if (bmi >= 30 && bmi < 35) {
      return {
        category: 'Obesity Class I',
        description: 'Moderate obesity',
        recommendation: 'Candidate for intensive lifestyle intervention, pharmacotherapy (GLP-1 agonists), nutritional support, and psychological counseling.',
      };
    } else if (bmi >= 35 && bmi < 40) {
      return {
        category: 'Obesity Class II',
        description: 'Severe obesity',
        recommendation: 'Strong candidate for pharmacotherapy, intragastric balloon, endoscopic procedures, and may consider bariatric surgery if comorbidities present.',
      };
    } else {
      return {
        category: 'Obesity Class III',
        description: 'Morbid obesity',
        recommendation: 'Optimal candidate for comprehensive treatment including pharmacotherapy, bariatric surgery, endoscopic procedures, and multidisciplinary support.',
      };
    }
  }

  /**
   * Calculate ideal body weight using Devine formula
   */
  static calculateIdealWeight(heightCm: number, gender: 'M' | 'F' | 'Other'): number {
    const heightInches = heightCm / 2.54;

    if (gender === 'M') {
      return 50 + 2.3 * (heightInches - 60);
    } else {
      return 45.5 + 2.3 * (heightInches - 60);
    }
  }

  /**
   * Calculate total weight to lose
   */
  static calculateWeightToLose(currentWeight: number, targetWeight: number): {
    totalLoss: number;
    percentage: number;
  } {
    const totalLoss = currentWeight - targetWeight;
    const percentage = (totalLoss / currentWeight) * 100;

    return {
      totalLoss: Number(totalLoss.toFixed(1)),
      percentage: Number(percentage.toFixed(1)),
    };
  }

  /**
   * Track patient progress
   */
  static analyzeProgress(progressRecords: TreatmentProgress[]): {
    totalWeightLost: number;
    totalPercentageLost: number;
    averageWeeklyLoss: number;
    currentTrend: 'improving' | 'stable' | 'declining';
    milestones: string[];
  } {
    if (progressRecords.length === 0) {
      return {
        totalWeightLost: 0,
        totalPercentageLost: 0,
        averageWeeklyLoss: 0,
        currentTrend: 'stable',
        milestones: [],
      };
    }

    // Sort by date
    const sorted = [...progressRecords].sort((a, b) => a.date.getTime() - b.date.getTime());

    const firstRecord = sorted[0];
    const lastRecord = sorted[sorted.length - 1];

    const totalWeightLost = firstRecord.weight - lastRecord.weight;
    const totalPercentageLost = (totalWeightLost / firstRecord.weight) * 100;

    // Calculate average weekly loss
    const daysDiff = (lastRecord.date.getTime() - firstRecord.date.getTime()) / (1000 * 60 * 60 * 24);
    const weeksDiff = daysDiff / 7;
    const averageWeeklyLoss = weeksDiff > 0 ? totalWeightLost / weeksDiff : 0;

    // Determine trend (comparing last 4 weeks vs previous period)
    let currentTrend: 'improving' | 'stable' | 'declining' = 'stable';
    if (sorted.length >= 4) {
      const recent = sorted.slice(-4);
      const recentLoss = recent[0].weight - recent[recent.length - 1].weight;
      const recentWeeks = (recent[recent.length - 1].date.getTime() - recent[0].date.getTime()) / (1000 * 60 * 60 * 24 * 7);
      const recentWeeklyLoss = recentWeeks > 0 ? recentLoss / recentWeeks : 0;

      if (recentWeeklyLoss > averageWeeklyLoss * 1.1) {
        currentTrend = 'improving';
      } else if (recentWeeklyLoss < averageWeeklyLoss * 0.9) {
        currentTrend = 'declining';
      }
    }

    // Identify milestones
    const milestones: string[] = [];
    if (totalPercentageLost >= 5) milestones.push('5% weight loss achieved');
    if (totalPercentageLost >= 10) milestones.push('10% weight loss achieved');
    if (totalPercentageLost >= 15) milestones.push('15% weight loss achieved');
    if (totalPercentageLost >= 20) milestones.push('20% weight loss achieved');

    return {
      totalWeightLost: Number(totalWeightLost.toFixed(1)),
      totalPercentageLost: Number(totalPercentageLost.toFixed(1)),
      averageWeeklyLoss: Number(averageWeeklyLoss.toFixed(2)),
      currentTrend,
      milestones,
    };
  }

  /**
   * Assess patient eligibility for treatments
   */
  static assessTreatmentEligibility(patient: Patient): {
    pharmacotherapy: boolean;
    intragastricBalloon: boolean;
    bariatricEndoscopy: boolean;
    bariatricSurgery: boolean;
    reasons: string[];
  } {
    const bmi = patient.bmi;
    const reasons: string[] = [];

    const eligibility = {
      pharmacotherapy: false,
      intragastricBalloon: false,
      bariatricEndoscopy: false,
      bariatricSurgery: false,
      reasons,
    };

    // Pharmacotherapy (GLP-1 agonists, etc.)
    if (bmi >= 30 || (bmi >= 27 && patient.medicalHistory.chronicDiseases.length > 0)) {
      eligibility.pharmacotherapy = true;
      reasons.push('Meets BMI criteria for pharmacotherapy');
    } else {
      reasons.push('BMI too low for pharmacotherapy (requires BMI ≥30 or ≥27 with comorbidities)');
    }

    // Intragastric Balloon
    if (bmi >= 30 && bmi <= 40) {
      eligibility.intragastricBalloon = true;
      reasons.push('Meets BMI criteria for intragastric balloon (30-40)');
    } else if (bmi < 30) {
      reasons.push('BMI too low for intragastric balloon (requires BMI 30-40)');
    } else {
      reasons.push('BMI too high for balloon - consider surgery instead');
    }

    // Bariatric Endoscopy
    if (bmi >= 30) {
      eligibility.bariatricEndoscopy = true;
      reasons.push('Meets BMI criteria for bariatric endoscopy');
    } else {
      reasons.push('BMI too low for bariatric endoscopy (requires BMI ≥30)');
    }

    // Bariatric Surgery
    if (bmi >= 40 || (bmi >= 35 && patient.medicalHistory.chronicDiseases.length > 0)) {
      eligibility.bariatricSurgery = true;
      reasons.push('Meets BMI criteria for bariatric surgery');
    } else {
      reasons.push('BMI too low for bariatric surgery (requires BMI ≥40 or ≥35 with comorbidities)');
    }

    return eligibility;
  }

  /**
   * Generate patient summary report
   */
  static generatePatientSummary(
    patient: Patient,
    treatmentPlan?: TreatmentPlan,
    progress?: TreatmentProgress[]
  ): string {
    let summary = `PATIENT SUMMARY\n`;
    summary += `================\n\n`;

    summary += `Name: ${patient.name}\n`;
    summary += `Age: ${this.calculateAge(patient.dateOfBirth)} years\n`;
    summary += `Gender: ${patient.gender}\n\n`;

    summary += `CURRENT STATUS\n`;
    summary += `--------------\n`;
    summary += `Weight: ${patient.currentWeight} kg\n`;
    summary += `Height: ${patient.height} cm\n`;
    summary += `BMI: ${patient.bmi} (${this.getBMICategory(patient.bmi).category})\n`;
    summary += `Target Weight: ${patient.targetWeight} kg\n`;

    const weightToLose = this.calculateWeightToLose(patient.currentWeight, patient.targetWeight);
    summary += `Weight to Lose: ${weightToLose.totalLoss} kg (${weightToLose.percentage}%)\n\n`;

    if (patient.medicalHistory.chronicDiseases.length > 0) {
      summary += `MEDICAL HISTORY\n`;
      summary += `---------------\n`;
      summary += `Chronic Diseases: ${patient.medicalHistory.chronicDiseases.join(', ')}\n`;
    }

    if (patient.medicalHistory.allergies.length > 0) {
      summary += `Allergies: ${patient.medicalHistory.allergies.join(', ')}\n`;
    }

    if (patient.medicalHistory.medications.length > 0) {
      summary += `Current Medications: ${patient.medicalHistory.medications.join(', ')}\n`;
    }

    summary += `\n`;

    if (treatmentPlan) {
      summary += `ACTIVE TREATMENT PLAN\n`;
      summary += `--------------------\n`;
      summary += `Status: ${treatmentPlan.status}\n`;
      summary += `Start Date: ${treatmentPlan.startDate.toLocaleDateString()}\n`;
      summary += `Number of Treatments: ${treatmentPlan.treatments.length}\n\n`;
    }

    if (progress && progress.length > 0) {
      const progressAnalysis = this.analyzeProgress(progress);
      summary += `PROGRESS\n`;
      summary += `--------\n`;
      summary += `Total Weight Lost: ${progressAnalysis.totalWeightLost} kg (${progressAnalysis.totalPercentageLost}%)\n`;
      summary += `Average Weekly Loss: ${progressAnalysis.averageWeeklyLoss} kg\n`;
      summary += `Current Trend: ${progressAnalysis.currentTrend}\n`;

      if (progressAnalysis.milestones.length > 0) {
        summary += `Milestones: ${progressAnalysis.milestones.join(', ')}\n`;
      }
    }

    const eligibility = this.assessTreatmentEligibility(patient);
    summary += `\nTREATMENT ELIGIBILITY\n`;
    summary += `--------------------\n`;
    summary += `Pharmacotherapy: ${eligibility.pharmacotherapy ? 'Yes' : 'No'}\n`;
    summary += `Intragastric Balloon: ${eligibility.intragastricBalloon ? 'Yes' : 'No'}\n`;
    summary += `Bariatric Endoscopy: ${eligibility.bariatricEndoscopy ? 'Yes' : 'No'}\n`;
    summary += `Bariatric Surgery: ${eligibility.bariatricSurgery ? 'Yes' : 'No'}\n`;

    return summary;
  }

  /**
   * Calculate age from date of birth
   */
  private static calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    let age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - dateOfBirth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
      age--;
    }

    return age;
  }
}
