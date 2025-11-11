// AI-Powered Laboratory Analysis Component

import React from 'react';
import { LabResult, AILabAnalysis } from '../types';
import { AILabAnalysisService } from '../services/ai-lab-analysis.service';

interface LabAnalysisProps {
  labResult: LabResult;
}

export const LabAnalysis: React.FC<LabAnalysisProps> = ({ labResult }) => {
  const aiAnalysis = labResult.aiAnalysis;

  if (!aiAnalysis) {
    return (
      <div className="lab-analysis p-6 bg-white rounded-lg shadow">
        <p className="text-gray-600">Análise de IA não disponível</p>
      </div>
    );
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getRiskLabel = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'Alto Risco';
      case 'medium':
        return 'Risco Moderado';
      case 'low':
        return 'Baixo Risco';
      default:
        return 'Desconhecido';
    }
  };

  const recommendations = AILabAnalysisService.getTreatmentRecommendations(aiAnalysis);

  return (
    <div className="lab-analysis p-6 bg-white rounded-lg shadow-lg space-y-6">
      <div className="header border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Análise Laboratorial com IA</h2>
        <p className="text-sm text-gray-600">
          Data do Exame: {new Date(labResult.testDate).toLocaleDateString('pt-BR')}
        </p>
        <p className="text-xs text-gray-500">
          Análise gerada em: {new Date(aiAnalysis.generatedAt).toLocaleString('pt-BR')}
        </p>
      </div>

      {/* Risk Assessment */}
      <div className={`risk-assessment p-4 rounded-lg border-2 ${getRiskColor(aiAnalysis.riskAssessment)}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Avaliação de Risco</h3>
            <p className="text-2xl font-bold mt-1">{getRiskLabel(aiAnalysis.riskAssessment)}</p>
          </div>
          <div className="text-5xl">
            {aiAnalysis.riskAssessment === 'high' && '⚠️'}
            {aiAnalysis.riskAssessment === 'medium' && '⚡'}
            {aiAnalysis.riskAssessment === 'low' && '✅'}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="summary bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Resumo</h3>
        <p className="text-gray-700">{aiAnalysis.summary}</p>
      </div>

      {/* Lab Results Table */}
      <div className="results">
        <h3 className="text-lg font-semibold mb-3">Resultados dos Exames</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Exame</th>
                <th className="border p-2 text-left">Resultado</th>
                <th className="border p-2 text-left">Referência</th>
                <th className="border p-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {(labResult.results as any[]).map((test, idx) => (
                <tr key={idx} className={test.status !== 'normal' ? 'bg-yellow-50' : ''}>
                  <td className="border p-2 font-medium">{test.name}</td>
                  <td className="border p-2">
                    <span className="font-semibold">
                      {test.value} {test.unit}
                    </span>
                  </td>
                  <td className="border p-2 text-sm text-gray-600">{test.referenceRange}</td>
                  <td className="border p-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        test.status === 'normal'
                          ? 'bg-green-100 text-green-800'
                          : test.status === 'critical'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {test.status === 'normal'
                        ? 'Normal'
                        : test.status === 'critical'
                        ? 'Crítico'
                        : 'Alterado'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Abnormalities */}
      {aiAnalysis.abnormalities.length > 0 && (
        <div className="abnormalities bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
          <h3 className="text-lg font-semibold text-red-900 mb-3">
            Anormalidades Detectadas ({aiAnalysis.abnormalities.length})
          </h3>
          <ul className="space-y-2">
            {aiAnalysis.abnormalities.map((abnormality, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-red-500 mt-1">⚠</span>
                <span className="text-gray-700">{abnormality}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      <div className="recommendations bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
        <h3 className="text-lg font-semibold text-purple-900 mb-3">
          Recomendações ({aiAnalysis.recommendations.length})
        </h3>
        <ul className="space-y-2">
          {aiAnalysis.recommendations.map((recommendation, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-purple-500 mt-1">💡</span>
              <span className="text-gray-700">{recommendation}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Suggested Treatments */}
      {aiAnalysis.suggestedTreatments.length > 0 && (
        <div className="treatments bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-900 mb-3">Tratamentos Sugeridos</h3>
          <div className="flex flex-wrap gap-2">
            {aiAnalysis.suggestedTreatments.map((treatment, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm font-medium"
              >
                {treatment.replace(/_/g, ' ').toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Treatment Recommendations by Category */}
      <div className="treatment-categories grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="approved bg-green-100 p-4 rounded-lg">
          <h4 className="font-semibold text-green-900 mb-2">✅ Aprovados</h4>
          <ul className="text-sm space-y-1">
            {recommendations.approved.map((treatment, idx) => (
              <li key={idx} className="text-green-800">
                • {treatment.replace(/_/g, ' ')}
              </li>
            ))}
          </ul>
        </div>

        <div className="conditional bg-yellow-100 p-4 rounded-lg">
          <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Condicional</h4>
          <ul className="text-sm space-y-1">
            {recommendations.conditional.map((treatment, idx) => (
              <li key={idx} className="text-yellow-800">
                • {treatment.replace(/_/g, ' ')}
              </li>
            ))}
          </ul>
        </div>

        <div className="contraindicated bg-red-100 p-4 rounded-lg">
          <h4 className="font-semibold text-red-900 mb-2">❌ Contraindicados</h4>
          <ul className="text-sm space-y-1">
            {recommendations.contraindicated.map((treatment, idx) => (
              <li key={idx} className="text-red-800">
                • {treatment.replace(/_/g, ' ')}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Review Section */}
      {labResult.reviewedBy && (
        <div className="review bg-gray-50 p-4 rounded-lg border-t-2 border-gray-300">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Revisão Médica</h3>
          <p className="text-sm text-gray-700">
            Revisado por: <span className="font-medium">{labResult.reviewedBy}</span>
          </p>
          {labResult.reviewDate && (
            <p className="text-sm text-gray-700">
              Data: {new Date(labResult.reviewDate).toLocaleString('pt-BR')}
            </p>
          )}
          {labResult.reviewNotes && (
            <p className="text-sm text-gray-700 mt-2 italic">{labResult.reviewNotes}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default LabAnalysis;
