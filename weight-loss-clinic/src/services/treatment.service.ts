// Treatment Protocols Service for Weight Loss Clinic

import { Treatment, TreatmentPlan, TreatmentType, Medication } from '../types';

/**
 * Service for managing treatment protocols and medications
 */
export class TreatmentService {
  /**
   * Standard medication protocols
   */
  static readonly MEDICATION_PROTOCOLS = {
    tirzepatide: {
      name: 'Tirzepatide',
      activeIngredient: 'Tirzepatide',
      concentration: '2.5mg, 5mg, 7.5mg, 10mg, 12.5mg, 15mg',
      form: 'injection' as const,
      manufacturer: 'Eli Lilly',
      standardDosage: 'Start 2.5mg SC weekly, titrate up every 4 weeks',
      frequency: 'Weekly',
      duration: '16-52 weeks',
      instructions: 'Administer subcutaneously in abdomen, thigh, or upper arm. Rotate injection sites. Can be given any time of day, with or without meals.',
    },
    semaglutide: {
      name: 'Semaglutide',
      activeIngredient: 'Semaglutide',
      concentration: '0.25mg, 0.5mg, 1mg, 1.7mg, 2.4mg',
      form: 'injection' as const,
      manufacturer: 'Novo Nordisk',
      standardDosage: 'Start 0.25mg SC weekly, titrate up every 4 weeks to target 2.4mg',
      frequency: 'Weekly',
      duration: '16-68 weeks',
      instructions: 'Administer subcutaneously once weekly on the same day each week. Can be given any time of day, with or without meals.',
    },
    liraglutide: {
      name: 'Liraglutide',
      activeIngredient: 'Liraglutide',
      concentration: '0.6mg, 1.2mg, 1.8mg, 2.4mg, 3.0mg',
      form: 'injection' as const,
      manufacturer: 'Novo Nordisk',
      standardDosage: 'Start 0.6mg SC daily, increase by 0.6mg weekly to target 3.0mg',
      frequency: 'Daily',
      duration: 'Ongoing',
      instructions: 'Administer subcutaneously once daily at any time, independent of meals. Inject in abdomen, thigh, or upper arm.',
    },
    noripurum: {
      name: 'Noripurum',
      activeIngredient: 'Iron sucrose complex',
      concentration: '100mg/5mL',
      form: 'iv' as const,
      manufacturer: 'Various',
      standardDosage: '100-200mg IV per session',
      frequency: 'Weekly or bi-weekly',
      duration: '4-8 weeks',
      instructions: 'Administer by slow IV injection or infusion. Monitor for hypersensitivity reactions. Check iron studies before and after treatment.',
    },
    vitaminB12: {
      name: 'Vitamin B12 (Cyanocobalamin)',
      activeIngredient: 'Cyanocobalamin',
      concentration: '1000mcg/mL',
      form: 'injection' as const,
      manufacturer: 'Various',
      standardDosage: '1000mcg IM',
      frequency: 'Weekly to monthly',
      duration: 'Ongoing',
      instructions: 'Administer intramuscularly. Useful for patients with malabsorption or after bariatric surgery.',
    },
    vitaminD: {
      name: 'Vitamin D3',
      activeIngredient: 'Cholecalciferol',
      concentration: '50,000 IU',
      form: 'oral' as const,
      manufacturer: 'Various',
      standardDosage: '50,000 IU weekly or 1,000-2,000 IU daily',
      frequency: 'Weekly or daily',
      duration: 'Ongoing',
      instructions: 'Take with food for better absorption. Monitor 25-OH vitamin D levels.',
    },
    potassiumChloride: {
      name: 'Potassium Chloride',
      activeIngredient: 'Potassium chloride',
      concentration: '20-40 mEq',
      form: 'iv' as const,
      manufacturer: 'Various',
      standardDosage: '20-40 mEq in 1L IV fluid',
      frequency: 'As needed based on levels',
      duration: 'Until levels normalized',
      instructions: 'Dilute in IV fluids. Maximum rate 10-20 mEq/hour. Monitor serum potassium levels closely.',
    },
    hydration: {
      name: 'IV Hydration Solution',
      activeIngredient: 'Sodium chloride 0.9%',
      concentration: '1000mL',
      form: 'iv' as const,
      manufacturer: 'Various',
      standardDosage: '500-1000mL per session',
      frequency: 'As needed',
      duration: 'Single session or series',
      instructions: 'Standard IV hydration. Can add electrolytes or vitamins as needed.',
    },
  };

  /**
   * Create a standard treatment protocol
   */
  static createTreatmentProtocol(
    type: TreatmentType,
    prescribedBy: string,
    customizations?: Partial<Treatment>
  ): Omit<Treatment, 'id' | 'planId' | 'createdAt' | 'updatedAt'> {
    const baseProtocol = this.getBaseProtocol(type);

    return {
      type,
      ...baseProtocol,
      prescribedBy,
      startDate: new Date(),
      ...customizations,
    };
  }

  /**
   * Get base protocol for a treatment type
   */
  private static getBaseProtocol(type: TreatmentType): Partial<Treatment> {
    switch (type) {
      case 'tirzepatide':
        return {
          medication: {
            name: this.MEDICATION_PROTOCOLS.tirzepatide.name,
            activeIngredient: this.MEDICATION_PROTOCOLS.tirzepatide.activeIngredient,
            concentration: this.MEDICATION_PROTOCOLS.tirzepatide.concentration,
            form: this.MEDICATION_PROTOCOLS.tirzepatide.form,
            manufacturer: this.MEDICATION_PROTOCOLS.tirzepatide.manufacturer,
          },
          dosage: this.MEDICATION_PROTOCOLS.tirzepatide.standardDosage,
          frequency: this.MEDICATION_PROTOCOLS.tirzepatide.frequency,
          duration: this.MEDICATION_PROTOCOLS.tirzepatide.duration,
          instructions: this.MEDICATION_PROTOCOLS.tirzepatide.instructions,
        };

      case 'glp1_analog':
        return {
          medication: {
            name: this.MEDICATION_PROTOCOLS.semaglutide.name,
            activeIngredient: this.MEDICATION_PROTOCOLS.semaglutide.activeIngredient,
            concentration: this.MEDICATION_PROTOCOLS.semaglutide.concentration,
            form: this.MEDICATION_PROTOCOLS.semaglutide.form,
            manufacturer: this.MEDICATION_PROTOCOLS.semaglutide.manufacturer,
          },
          dosage: this.MEDICATION_PROTOCOLS.semaglutide.standardDosage,
          frequency: this.MEDICATION_PROTOCOLS.semaglutide.frequency,
          duration: this.MEDICATION_PROTOCOLS.semaglutide.duration,
          instructions: this.MEDICATION_PROTOCOLS.semaglutide.instructions,
        };

      case 'anemia_correction':
        return {
          medication: {
            name: this.MEDICATION_PROTOCOLS.noripurum.name,
            activeIngredient: this.MEDICATION_PROTOCOLS.noripurum.activeIngredient,
            concentration: this.MEDICATION_PROTOCOLS.noripurum.concentration,
            form: this.MEDICATION_PROTOCOLS.noripurum.form,
            manufacturer: this.MEDICATION_PROTOCOLS.noripurum.manufacturer,
          },
          dosage: this.MEDICATION_PROTOCOLS.noripurum.standardDosage,
          frequency: this.MEDICATION_PROTOCOLS.noripurum.frequency,
          duration: this.MEDICATION_PROTOCOLS.noripurum.duration,
          instructions: this.MEDICATION_PROTOCOLS.noripurum.instructions,
        };

      case 'vitamin_application':
        return {
          medication: {
            name: this.MEDICATION_PROTOCOLS.vitaminB12.name,
            activeIngredient: this.MEDICATION_PROTOCOLS.vitaminB12.activeIngredient,
            concentration: this.MEDICATION_PROTOCOLS.vitaminB12.concentration,
            form: this.MEDICATION_PROTOCOLS.vitaminB12.form,
            manufacturer: this.MEDICATION_PROTOCOLS.vitaminB12.manufacturer,
          },
          dosage: this.MEDICATION_PROTOCOLS.vitaminB12.standardDosage,
          frequency: this.MEDICATION_PROTOCOLS.vitaminB12.frequency,
          duration: this.MEDICATION_PROTOCOLS.vitaminB12.duration,
          instructions: this.MEDICATION_PROTOCOLS.vitaminB12.instructions,
        };

      case 'potassium_correction':
        return {
          medication: {
            name: this.MEDICATION_PROTOCOLS.potassiumChloride.name,
            activeIngredient: this.MEDICATION_PROTOCOLS.potassiumChloride.activeIngredient,
            concentration: this.MEDICATION_PROTOCOLS.potassiumChloride.concentration,
            form: this.MEDICATION_PROTOCOLS.potassiumChloride.form,
            manufacturer: this.MEDICATION_PROTOCOLS.potassiumChloride.manufacturer,
          },
          dosage: this.MEDICATION_PROTOCOLS.potassiumChloride.standardDosage,
          frequency: this.MEDICATION_PROTOCOLS.potassiumChloride.frequency,
          duration: this.MEDICATION_PROTOCOLS.potassiumChloride.duration,
          instructions: this.MEDICATION_PROTOCOLS.potassiumChloride.instructions,
        };

      case 'hydration':
        return {
          medication: {
            name: this.MEDICATION_PROTOCOLS.hydration.name,
            activeIngredient: this.MEDICATION_PROTOCOLS.hydration.activeIngredient,
            concentration: this.MEDICATION_PROTOCOLS.hydration.concentration,
            form: this.MEDICATION_PROTOCOLS.hydration.form,
            manufacturer: this.MEDICATION_PROTOCOLS.hydration.manufacturer,
          },
          dosage: this.MEDICATION_PROTOCOLS.hydration.standardDosage,
          frequency: this.MEDICATION_PROTOCOLS.hydration.frequency,
          duration: this.MEDICATION_PROTOCOLS.hydration.duration,
          instructions: this.MEDICATION_PROTOCOLS.hydration.instructions,
        };

      case 'nutritional_consultation':
        return {
          frequency: 'Weekly initially, then bi-weekly',
          duration: '12-24 weeks',
          instructions: 'Comprehensive nutritional assessment and personalized meal planning. Focus on sustainable lifestyle changes.',
        };

      case 'psychological_consultation':
        return {
          frequency: 'Weekly or bi-weekly',
          duration: 'Ongoing',
          instructions: 'Behavioral therapy, emotional eating assessment, body image counseling, and mental health support.',
        };

      case 'intragastric_balloon':
        return {
          frequency: 'Single procedure',
          duration: '6 months (balloon remains in place)',
          instructions: 'Endoscopic placement of intragastric balloon. Requires liquid diet for 2-3 days post-procedure, followed by gradual diet advancement.',
        };

      case 'bariatric_endoscopy':
        return {
          frequency: 'Single procedure',
          duration: 'Day procedure',
          instructions: 'Endoscopic sleeve gastroplasty or other endoscopic bariatric intervention. NPO after midnight before procedure.',
        };

      case 'bariatric_surgery':
        return {
          frequency: 'Single procedure',
          duration: '1-3 days hospitalization',
          instructions: 'Laparoscopic sleeve gastrectomy, gastric bypass, or other bariatric surgical procedure. Extensive pre-op preparation and post-op follow-up required.',
        };

      default:
        return {
          frequency: 'As prescribed',
          duration: 'As prescribed',
          instructions: 'Follow provider instructions',
        };
    }
  }

  /**
   * Calculate expected weight loss based on treatment type
   */
  static getExpectedWeightLoss(
    treatmentType: TreatmentType,
    initialWeight: number,
    durationWeeks: number
  ): {
    estimatedLoss: number;
    estimatedLossPercentage: number;
    timeframe: string;
  } {
    let percentageLoss = 0;

    switch (treatmentType) {
      case 'tirzepatide':
        percentageLoss = 15; // Average 15-20% weight loss
        break;
      case 'glp1_analog':
      case 'gip_analog':
        percentageLoss = 12; // Average 10-15% weight loss
        break;
      case 'intragastric_balloon':
        percentageLoss = 10; // Average 10-15% weight loss over 6 months
        break;
      case 'bariatric_endoscopy':
        percentageLoss = 15; // Average 15-20% weight loss
        break;
      case 'bariatric_surgery':
        percentageLoss = 30; // Average 25-35% weight loss
        break;
      case 'nutritional_consultation':
        percentageLoss = 5; // Average 5-10% weight loss with diet alone
        break;
      default:
        percentageLoss = 3;
    }

    const estimatedLoss = (initialWeight * percentageLoss) / 100;

    return {
      estimatedLoss,
      estimatedLossPercentage: percentageLoss,
      timeframe: `${durationWeeks} weeks`,
    };
  }

  /**
   * Get treatment prerequisites and contraindications
   */
  static getTreatmentRequirements(treatmentType: TreatmentType): {
    prerequisites: string[];
    contraindications: string[];
    monitoring: string[];
  } {
    const requirements = {
      prerequisites: [] as string[],
      contraindications: [] as string[],
      monitoring: [] as string[],
    };

    switch (treatmentType) {
      case 'tirzepatide':
      case 'glp1_analog':
        requirements.prerequisites = [
          'BMI ≥ 30 or BMI ≥ 27 with comorbidities',
          'Normal thyroid function',
          'No history of medullary thyroid cancer',
          'No history of pancreatitis',
        ];
        requirements.contraindications = [
          'Personal or family history of medullary thyroid carcinoma',
          'Multiple Endocrine Neoplasia syndrome type 2 (MEN 2)',
          'Pregnancy or breastfeeding',
          'History of severe gastrointestinal disease',
        ];
        requirements.monitoring = [
          'Weekly weight and vital signs',
          'Monthly metabolic panel',
          'Monitor for hypoglycemia if diabetic',
          'Assess for GI side effects',
        ];
        break;

      case 'bariatric_surgery':
        requirements.prerequisites = [
          'BMI ≥ 40 or BMI ≥ 35 with comorbidities',
          'Failed previous weight loss attempts',
          'Psychological evaluation clearance',
          'Comprehensive laboratory workup',
          'Cardiac clearance',
          'Nutritional assessment',
        ];
        requirements.contraindications = [
          'Unstable cardiac disease',
          'Untreated severe psychiatric disorder',
          'Active substance abuse',
          'Inability to comply with post-op requirements',
        ];
        requirements.monitoring = [
          'Daily vital signs post-op',
          'Weekly follow-up for first month',
          'Monthly labs for first year',
          'Lifelong vitamin supplementation',
          'Annual nutritional assessment',
        ];
        break;

      case 'intragastric_balloon':
        requirements.prerequisites = [
          'BMI 30-40',
          'Failed dietary interventions',
          'Upper endoscopy to rule out contraindications',
        ];
        requirements.contraindications = [
          'Previous gastric surgery',
          'Hiatal hernia > 5cm',
          'Active peptic ulcer disease',
          'Pregnancy',
        ];
        requirements.monitoring = [
          'Weekly follow-up first month',
          'Monthly thereafter',
          'Nutritional counseling',
          'Endoscopic removal after 6 months',
        ];
        break;

      case 'anemia_correction':
        requirements.prerequisites = [
          'Documented iron deficiency anemia',
          'Hemoglobin < 12 g/dL',
          'Low ferritin or transferrin saturation',
        ];
        requirements.contraindications = [
          'Iron overload disorders',
          'Active infection',
          'Allergy to iron preparations',
        ];
        requirements.monitoring = [
          'CBC before each infusion',
          'Monitor for infusion reactions',
          'Repeat iron studies after treatment',
        ];
        break;
    }

    return requirements;
  }
}
