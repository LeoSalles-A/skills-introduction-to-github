// Main Application Page

'use client';

import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-blue-900">
            Sistema de Gestão - Clínica de Emagrecimento
          </h1>
          <p className="text-gray-600 mt-1">
            Plataforma completa para tratamento de obesidade e emagrecimento
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="hero bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex-1">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Bem-vindo à Clínica de Emagrecimento
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Solução completa para tratamento de obesidade com tecnologia de ponta e IA
              </p>
              <div className="flex gap-4">
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                  Agendar Consulta
                </button>
                <button className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold">
                  Saiba Mais
                </button>
              </div>
            </div>
            <div className="flex-1 mt-8 md:mt-0 text-6xl text-center">
              🏥💊🩺
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Medication Management */}
          <div className="feature-card bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">💊</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Gestão de Medicamentos
            </h3>
            <p className="text-gray-600 mb-4">
              Administração de GLP-1, tirzepatida, vitaminas e correção de anemia com Noripurum
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✓ 13 Boxes de medicação</li>
              <li>✓ Entrega de medicação</li>
              <li>✓ Controle de estoque</li>
            </ul>
          </div>

          {/* AI Lab Analysis */}
          <div className="feature-card bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Análise Laboratorial com IA
            </h3>
            <p className="text-gray-600 mb-4">
              Interpretação inteligente de exames com recomendações personalizadas
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✓ Análise automatizada</li>
              <li>✓ Detecção de anormalidades</li>
              <li>✓ Sugestões de tratamento</li>
            </ul>
          </div>

          {/* Surgical Services */}
          <div className="feature-card bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🏥</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Serviços Cirúrgicos
            </h3>
            <p className="text-gray-600 mb-4">
              Cirurgia bariátrica, endoscopia e implante de balão intragástrico
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✓ 7 Salas cirúrgicas</li>
              <li>✓ 3 Salas de endoscopia</li>
              <li>✓ 7 Apartamentos</li>
            </ul>
          </div>

          {/* Telemedicine */}
          <div className="feature-card bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">💻</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Telemedicina
            </h3>
            <p className="text-gray-600 mb-4">
              Consultas virtuais com nutricionistas e psicólogos
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✓ 12 Consultórios virtuais</li>
              <li>✓ Suporte nutricional</li>
              <li>✓ Acompanhamento psicológico</li>
            </ul>
          </div>

          {/* Drive-Through */}
          <div className="feature-card bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🚗</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Drive-Through
            </h3>
            <p className="text-gray-600 mb-4">
              Retirada rápida de receitas e pedidos de exames
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✓ Estacionamento coberto</li>
              <li>✓ Serviço de manobrista</li>
              <li>✓ Atendimento rápido</li>
            </ul>
          </div>

          {/* Comprehensive Care */}
          <div className="feature-card bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Tratamento Completo
            </h3>
            <p className="text-gray-600 mb-4">
              Acompanhamento multidisciplinar personalizado
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✓ Plano nutricional</li>
              <li>✓ Suporte psicológico</li>
              <li>✓ Interface IA de suporte</li>
            </ul>
          </div>
        </div>

        {/* Statistics */}
        <div className="stats-section bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Nossa Infraestrutura
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="stat text-center">
              <p className="text-4xl font-bold text-blue-600">13</p>
              <p className="text-gray-600 mt-2">Boxes de Medicação</p>
            </div>
            <div className="stat text-center">
              <p className="text-4xl font-bold text-green-600">7</p>
              <p className="text-gray-600 mt-2">Salas Cirúrgicas</p>
            </div>
            <div className="stat text-center">
              <p className="text-4xl font-bold text-purple-600">12</p>
              <p className="text-gray-600 mt-2">Consultórios Virtuais</p>
            </div>
            <div className="stat text-center">
              <p className="text-4xl font-bold text-orange-600">7</p>
              <p className="text-gray-600 mt-2">Apartamentos</p>
            </div>
          </div>
        </div>

        {/* Treatment Options */}
        <div className="treatments-section mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Opções de Tratamento Disponíveis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              'Tirzepatida (GLP-1/GIP)',
              'Análogos de GLP-1',
              'Aplicação de Vitaminas',
              'Correção de Anemia',
              'Hidratação IV',
              'Correção de Potássio',
              'Balão Intragástrico',
              'Endoscopia Bariátrica',
              'Cirurgia Bariátrica',
            ].map((treatment, idx) => (
              <div
                key={idx}
                className="treatment-option bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all"
              >
                <p className="font-semibold">✓ {treatment}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12 py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-lg font-semibold mb-2">
            Clínica de Emagrecimento - Sistema de Gestão Integrado
          </p>
          <p className="text-gray-400 text-sm">
            Tecnologia avançada para transformação de vidas
          </p>
          <p className="text-gray-500 text-xs mt-4">
            © 2025 - Todos os direitos reservados
          </p>
        </div>
      </footer>
    </div>
  );
}
