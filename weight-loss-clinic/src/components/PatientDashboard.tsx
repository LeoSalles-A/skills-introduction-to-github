// Patient Dashboard Component

import React from 'react';
import { Patient, TreatmentPlan, TreatmentProgress } from '../types';
import { PatientService } from '../services/patient.service';

interface PatientDashboardProps {
  patient: Patient;
  treatmentPlan?: TreatmentPlan;
  progressRecords?: TreatmentProgress[];
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({
  patient,
  treatmentPlan,
  progressRecords = [],
}) => {
  const bmiInfo = PatientService.getBMICategory(patient.bmi);
  const weightToLose = PatientService.calculateWeightToLose(
    patient.currentWeight,
    patient.targetWeight
  );
  const progress = PatientService.analyzeProgress(progressRecords);
  const eligibility = PatientService.assessTreatmentEligibility(patient);

  return (
    <div className="patient-dashboard p-6 bg-white rounded-lg shadow-lg">
      {/* Patient Header */}
      <div className="header mb-6 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-800">{patient.name}</h1>
        <p className="text-gray-600">
          {patient.email} | {patient.phone}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Status */}
        <div className="card bg-blue-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-3 text-blue-800">Status Atual</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Peso Atual:</span>
              <span className="text-lg font-bold">{patient.currentWeight} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Altura:</span>
              <span>{patient.height} cm</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">IMC:</span>
              <span className="text-lg font-bold">{patient.bmi}</span>
            </div>
            <div className="bg-blue-100 p-2 rounded">
              <p className="text-sm font-semibold">{bmiInfo.category}</p>
              <p className="text-xs text-gray-700">{bmiInfo.description}</p>
            </div>
          </div>
        </div>

        {/* Weight Loss Goal */}
        <div className="card bg-green-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-3 text-green-800">Meta de Peso</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Peso Alvo:</span>
              <span className="text-lg font-bold">{patient.targetWeight} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Peso a Perder:</span>
              <span className="text-lg font-bold text-red-600">
                {weightToLose.totalLoss} kg
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Percentual:</span>
              <span className="text-lg font-bold">{weightToLose.percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
              <div
                className="bg-green-600 h-4 rounded-full transition-all"
                style={{
                  width: `${progress.totalPercentageLost > 0 ? (progress.totalPercentageLost / weightToLose.percentage) * 100 : 0}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Progress */}
        {progressRecords.length > 0 && (
          <div className="card bg-purple-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-3 text-purple-800">Progresso</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Peso Perdido:</span>
                <span className="text-lg font-bold text-green-600">
                  {progress.totalWeightLost} kg
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Percentual Perdido:</span>
                <span className="text-lg font-bold">{progress.totalPercentageLost}%</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Média Semanal:</span>
                <span>{progress.averageWeeklyLoss} kg/semana</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Tendência:</span>
                <span
                  className={`font-semibold ${
                    progress.currentTrend === 'improving'
                      ? 'text-green-600'
                      : progress.currentTrend === 'declining'
                      ? 'text-red-600'
                      : 'text-yellow-600'
                  }`}
                >
                  {progress.currentTrend === 'improving'
                    ? '↑ Melhorando'
                    : progress.currentTrend === 'declining'
                    ? '↓ Desacelerando'
                    : '→ Estável'}
                </span>
              </div>
              {progress.milestones.length > 0 && (
                <div className="mt-3">
                  <p className="font-medium text-sm mb-1">Conquistas:</p>
                  <ul className="text-sm space-y-1">
                    {progress.milestones.map((milestone, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-yellow-500">🏆</span>
                        {milestone}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Treatment Plan */}
        {treatmentPlan && (
          <div className="card bg-yellow-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-3 text-yellow-800">Plano de Tratamento</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Status:</span>
                <span
                  className={`px-2 py-1 rounded text-sm font-semibold ${
                    treatmentPlan.status === 'active'
                      ? 'bg-green-200 text-green-800'
                      : treatmentPlan.status === 'completed'
                      ? 'bg-blue-200 text-blue-800'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {treatmentPlan.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Início:</span>
                <span>{new Date(treatmentPlan.startDate).toLocaleDateString('pt-BR')}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Tratamentos:</span>
                <span className="font-bold">{treatmentPlan.treatments.length}</span>
              </div>
              {treatmentPlan.calories && (
                <div className="mt-3 p-2 bg-yellow-100 rounded">
                  <p className="text-sm font-semibold">Plano Nutricional</p>
                  <p className="text-xs">Calorias: {treatmentPlan.calories} kcal/dia</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Eligibility */}
        <div className="card bg-gray-50 p-4 rounded-lg md:col-span-2">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">
            Elegibilidade para Tratamentos
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div
              className={`p-3 rounded text-center ${
                eligibility.pharmacotherapy ? 'bg-green-200' : 'bg-red-200'
              }`}
            >
              <p className="font-semibold text-sm">Farmacoterapia</p>
              <p className="text-2xl">{eligibility.pharmacotherapy ? '✓' : '✗'}</p>
            </div>
            <div
              className={`p-3 rounded text-center ${
                eligibility.intragastricBalloon ? 'bg-green-200' : 'bg-red-200'
              }`}
            >
              <p className="font-semibold text-sm">Balão Intragástrico</p>
              <p className="text-2xl">{eligibility.intragastricBalloon ? '✓' : '✗'}</p>
            </div>
            <div
              className={`p-3 rounded text-center ${
                eligibility.bariatricEndoscopy ? 'bg-green-200' : 'bg-red-200'
              }`}
            >
              <p className="font-semibold text-sm">Endoscopia Bariátrica</p>
              <p className="text-2xl">{eligibility.bariatricEndoscopy ? '✓' : '✗'}</p>
            </div>
            <div
              className={`p-3 rounded text-center ${
                eligibility.bariatricSurgery ? 'bg-green-200' : 'bg-red-200'
              }`}
            >
              <p className="font-semibold text-sm">Cirurgia Bariátrica</p>
              <p className="text-2xl">{eligibility.bariatricSurgery ? '✓' : '✗'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendation */}
      <div className="mt-6 p-4 bg-blue-100 rounded-lg border-l-4 border-blue-500">
        <h3 className="font-semibold text-blue-900 mb-2">Recomendação</h3>
        <p className="text-sm text-blue-800">{bmiInfo.recommendation}</p>
      </div>
    </div>
  );
};

export default PatientDashboard;
