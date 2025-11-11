// AI-Powered Laboratory Analysis Service

import { LabResult, LabTest, AILabAnalysis, TreatmentType } from '../types';

/**
 * Service for AI-powered analysis of laboratory results
 * Integrates with OpenAI API for intelligent interpretation
 */
export class AILabAnalysisService {
  /**
   * Analyze laboratory results using AI
   */
  static async analyzeLabResults(labResult: LabResult): Promise<AILabAnalysis> {
    const tests = labResult.results as unknown as LabTest[];

    // Prepare analysis prompt
    const prompt = this.buildAnalysisPrompt(tests);

    // In production, this would call OpenAI API
    // For now, we'll return a structured analysis based on the results
    const analysis = this.performAnalysis(tests);

    return {
      ...analysis,
      generatedAt: new Date(),
    };
  }

  /**
   * Build analysis prompt for AI
   */
  private static buildAnalysisPrompt(tests: LabTest[]): string {
    let prompt = `Analyze the following laboratory results for a weight loss clinic patient:\n\n`;

    tests.forEach((test) => {
      prompt += `${test.name}: ${test.value} ${test.unit} (Reference: ${test.referenceRange}) - Status: ${test.status}\n`;
    });

    prompt += `\nProvide:
1. A comprehensive summary of the results
2. List of abnormalities and their clinical significance
3. Treatment recommendations specific to weight loss management
4. Risk assessment for weight loss interventions
5. Suggested treatments including medications (GLP-1 agonists, etc.) if appropriate`;

    return prompt;
  }

  /**
   * Perform rule-based analysis
   */
  private static performAnalysis(tests: LabTest[]): Omit<AILabAnalysis, 'generatedAt'> {
    const abnormalities: string[] = [];
    const recommendations: string[] = [];
    const suggestedTreatments: TreatmentType[] = [];
    let riskLevel: 'low' | 'medium' | 'high' = 'low';

    // Analyze each test
    tests.forEach((test) => {
      if (test.status === 'abnormal' || test.status === 'critical') {
        this.analyzeSpecificTest(test, abnormalities, recommendations, suggestedTreatments);
      }
    });

    // Determine overall risk level
    const criticalCount = tests.filter((t) => t.status === 'critical').length;
    const abnormalCount = tests.filter((t) => t.status === 'abnormal').length;

    if (criticalCount > 0) {
      riskLevel = 'high';
    } else if (abnormalCount >= 3) {
      riskLevel = 'medium';
    } else if (abnormalCount > 0) {
      riskLevel = 'low';
    }

    // Add general recommendations based on risk level
    if (riskLevel === 'high') {
      recommendations.push('Immediate medical consultation recommended before starting weight loss treatment');
      recommendations.push('Consider postponing intensive weight loss interventions until abnormalities are addressed');
    } else if (riskLevel === 'medium') {
      recommendations.push('Close monitoring during weight loss treatment recommended');
      recommendations.push('Follow-up laboratory tests in 4-6 weeks');
    }

    const summary = this.generateSummary(tests, abnormalities, riskLevel);

    return {
      summary,
      abnormalities,
      recommendations,
      riskAssessment: riskLevel,
      suggestedTreatments,
    };
  }

  /**
   * Analyze specific test results
   */
  private static analyzeSpecificTest(
    test: LabTest,
    abnormalities: string[],
    recommendations: string[],
    suggestedTreatments: TreatmentType[]
  ): void {
    const testName = test.name.toLowerCase();

    // Hemoglobin / Anemia analysis
    if (testName.includes('hemoglobin') || testName.includes('hematocrit')) {
      if (typeof test.value === 'number' && test.value < 12) {
        abnormalities.push(`Low ${test.name} (${test.value} ${test.unit}) indicates anemia`);
        recommendations.push('Iron supplementation recommended - consider Noripurum IV therapy');
        recommendations.push('Investigate cause of anemia before intensive weight loss treatment');
        suggestedTreatments.push('anemia_correction');
      }
    }

    // Potassium analysis
    if (testName.includes('potassium') || testName.includes('k+')) {
      if (typeof test.value === 'number') {
        if (test.value < 3.5) {
          abnormalities.push(`Low potassium (${test.value} ${test.unit}) - hypokalemia detected`);
          recommendations.push('Potassium replacement therapy required before weight loss interventions');
          recommendations.push('Monitor potassium levels closely during treatment');
          suggestedTreatments.push('potassium_correction');
        } else if (test.value > 5.5) {
          abnormalities.push(`High potassium (${test.value} ${test.unit}) - hyperkalemia detected`);
          recommendations.push('Investigate cause of hyperkalemia');
          recommendations.push('Contraindication for certain medications - use caution');
        }
      }
    }

    // Glucose / Diabetes analysis
    if (testName.includes('glucose') || testName.includes('hba1c')) {
      if (typeof test.value === 'number' && test.value > 126) {
        abnormalities.push(`Elevated fasting glucose (${test.value} ${test.unit}) suggests diabetes or prediabetes`);
        recommendations.push('GLP-1 receptor agonists (tirzepatide) may provide dual benefit for weight loss and glycemic control');
        recommendations.push('Consider endocrinology consultation');
        suggestedTreatments.push('tirzepatide');
        suggestedTreatments.push('glp1_analog');
      }
    }

    // Thyroid function
    if (testName.includes('tsh') || testName.includes('thyroid')) {
      if (test.status === 'abnormal') {
        abnormalities.push(`Abnormal thyroid function: ${test.name} = ${test.value} ${test.unit}`);
        recommendations.push('Thyroid disorder may affect weight loss - optimize thyroid function first');
        recommendations.push('Consider endocrinology referral for thyroid management');
      }
    }

    // Liver function
    if (testName.includes('alt') || testName.includes('ast') || testName.includes('liver')) {
      if (test.status === 'abnormal') {
        abnormalities.push(`Elevated liver enzymes: ${test.name} = ${test.value} ${test.unit}`);
        recommendations.push('Liver function should be monitored during weight loss treatment');
        recommendations.push('Consider hepatology consultation if enzymes significantly elevated');
      }
    }

    // Kidney function
    if (testName.includes('creatinine') || testName.includes('bun') || testName.includes('gfr')) {
      if (test.status === 'abnormal') {
        abnormalities.push(`Impaired kidney function: ${test.name} = ${test.value} ${test.unit}`);
        recommendations.push('Adjust medication dosages based on renal function');
        recommendations.push('Ensure adequate hydration during weight loss treatment');
        suggestedTreatments.push('hydration');
      }
    }

    // Vitamin deficiencies
    if (testName.includes('vitamin') || testName.includes('b12') || testName.includes('folate')) {
      if (test.status === 'abnormal') {
        abnormalities.push(`Vitamin deficiency detected: ${test.name} = ${test.value} ${test.unit}`);
        recommendations.push('Vitamin supplementation recommended before and during weight loss treatment');
        suggestedTreatments.push('vitamin_application');
      }
    }

    // Lipid panel
    if (testName.includes('cholesterol') || testName.includes('triglyceride') || testName.includes('ldl')) {
      if (test.status === 'abnormal') {
        abnormalities.push(`Dyslipidemia: ${test.name} = ${test.value} ${test.unit}`);
        recommendations.push('Weight loss treatment expected to improve lipid profile');
        recommendations.push('Monitor lipids during treatment');
      }
    }
  }

  /**
   * Generate summary of laboratory results
   */
  private static generateSummary(
    tests: LabTest[],
    abnormalities: string[],
    riskLevel: 'low' | 'medium' | 'high'
  ): string {
    const totalTests = tests.length;
    const abnormalTests = tests.filter((t) => t.status === 'abnormal' || t.status === 'critical').length;
    const criticalTests = tests.filter((t) => t.status === 'critical').length;

    let summary = `Laboratory analysis of ${totalTests} tests completed. `;

    if (abnormalTests === 0) {
      summary += 'All results within normal ranges. Patient is a good candidate for weight loss interventions including GLP-1 agonists, nutritional therapy, and if indicated, bariatric procedures.';
    } else {
      summary += `${abnormalTests} abnormal result${abnormalTests > 1 ? 's' : ''} identified`;

      if (criticalTests > 0) {
        summary += `, including ${criticalTests} critical finding${criticalTests > 1 ? 's' : ''}`;
      }

      summary += '. ';

      if (riskLevel === 'high') {
        summary += 'High-risk patient requiring medical optimization before intensive weight loss treatment. ';
      } else if (riskLevel === 'medium') {
        summary += 'Moderate risk - can proceed with weight loss treatment with close monitoring. ';
      } else {
        summary += 'Low risk - can proceed with standard weight loss protocols. ';
      }

      if (abnormalities.length > 0) {
        summary += 'Key findings require attention: ';
        summary += abnormalities.slice(0, 2).join('; ');
        if (abnormalities.length > 2) {
          summary += ` and ${abnormalities.length - 2} other finding${abnormalities.length - 2 > 1 ? 's' : ''}.`;
        }
      }
    }

    return summary;
  }

  /**
   * Get recommendations for specific treatment types based on lab results
   */
  static getTreatmentRecommendations(labAnalysis: AILabAnalysis): {
    approved: TreatmentType[];
    conditional: TreatmentType[];
    contraindicated: TreatmentType[];
  } {
    const approved: TreatmentType[] = [];
    const conditional: TreatmentType[] = [];
    const contraindicated: TreatmentType[] = [];

    // Base recommendations on risk level
    if (labAnalysis.riskAssessment === 'low') {
      approved.push(
        'tirzepatide',
        'glp1_analog',
        'nutritional_consultation',
        'psychological_consultation',
        'medication_delivery'
      );

      conditional.push(
        'bariatric_endoscopy',
        'intragastric_balloon',
        'bariatric_surgery'
      );
    } else if (labAnalysis.riskAssessment === 'medium') {
      conditional.push(
        'tirzepatide',
        'glp1_analog',
        'bariatric_endoscopy',
        'intragastric_balloon'
      );

      approved.push(
        'nutritional_consultation',
        'psychological_consultation'
      );

      contraindicated.push('bariatric_surgery');
    } else {
      // High risk
      approved.push(
        'nutritional_consultation',
        'psychological_consultation'
      );

      contraindicated.push(
        'bariatric_surgery',
        'intragastric_balloon',
        'bariatric_endoscopy'
      );

      conditional.push('tirzepatide', 'glp1_analog');
    }

    // Add suggested treatments from analysis
    labAnalysis.suggestedTreatments.forEach((treatment) => {
      if (!approved.includes(treatment) && !conditional.includes(treatment)) {
        approved.push(treatment);
      }
    });

    return {
      approved,
      conditional,
      contraindicated,
    };
  }
}
