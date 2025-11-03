import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg-gradient-start)] via-[var(--element-bg)] to-[var(--bg-gradient-end)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto text-center">
        <div className="mb-16">
          <Image
            src="/cronAppLogo.png"
            alt="Logo do Aplicativo de Teoria de Filas"
            width={112}
            height={112}
            className="h-28 w-auto mx-auto mb-4 animate-fade-in rounded-2xl shadow-2xl ring-4 ring-[var(--accent)]/20 hover:scale-105 transition-transform duration-300"
          />
          <h1 className="text-4xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-[var(--accent)] mb-6 animate-fade-in">
            Aplicativo de Teoria de Filas
          </h1>
          <p className="text-lg sm:text-xl text-[var(--text-secondary)] mb-8 max-w-3xl mx-auto leading-relaxed">
            Analise sistemas de filas medindo tempos de chegada, visualizando
            dados e explorando painéis com gráficos e métricas importantes.
            Mergulhe no mundo da teoria de filas com precisão e elegância.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              href="/chronometers"
              className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent)] text-white px-8 py-3 rounded-full font-semibold hover:from-[var(--accent)] hover:to-[var(--accent)] transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Iniciar Cronômetros
            </Link>
            <Link
              href="/data"
              className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent)] text-white px-8 py-3 rounded-full font-semibold hover:from-[var(--accent)] hover:to-[var(--accent)] transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Ver Dados
            </Link>
            <Link
              href="/dashboards"
              className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent)] text-white px-8 py-3 rounded-full font-semibold hover:from-[var(--accent)] hover:to-[var(--accent)] transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Ver Painéis
            </Link>
            <Link
              href="/simulations"
              className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent)] text-white px-8 py-3 rounded-full font-semibold hover:from-[var(--accent)] hover:to-[var(--accent)] transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Simulações
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="bg-[var(--element-bg)] p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-[var(--element-border)] group">
            <div className="w-16 h-16 bg-gradient-to-r from-[var(--accent)] to-[var(--accent)] rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-[var(--text-primary)]">
              Cronômetros
            </h2>
            <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
              Meça tempos de chegada para diferentes filas usando temporizadores
              integrados. Temporização precisa para análise de filas precisa.
            </p>
            <Link
              href="/chronometers"
              className="inline-flex items-center text-[var(--accent)] hover:text-[var(--accent)] font-semibold group-hover:translate-x-2 transition-transform duration-300"
            >
              Ir para Cronômetros
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
          <div className="bg-[var(--element-bg)] p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-[var(--element-border)] group">
            <div className="w-16 h-16 bg-gradient-to-r from-[var(--accent)] to-[var(--accent)] rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-[var(--text-primary)]">
              Dados
            </h2>
            <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
              Visualize e gerencie todos os dados registrados em um formato
              estruturado. Exporte para CSV para análise adicional.
            </p>
            <Link
              href="/data"
              className="inline-flex items-center text-[var(--accent)] hover:text-[var(--accent)] font-semibold group-hover:translate-x-2 transition-transform duration-300"
            >
              Ir para Dados
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
          <div className="bg-[var(--element-bg)] p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-[var(--element-border)] group">
            <div className="w-16 h-16 bg-gradient-to-r from-[var(--accent)] to-[var(--accent)] rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-[var(--text-primary)]">
              Painéis
            </h2>
            <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
              Explore gráficos e métricas importantes para análise de filas.
              Visualize seus dados com gráficos impressionantes.
            </p>
            <Link
              href="/dashboards"
              className="inline-flex items-center text-[var(--accent)] hover:text-[var(--accent)] font-semibold group-hover:translate-x-2 transition-transform duration-300"
            >
              Ir para Painéis
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
          <div className="bg-[var(--element-bg)] p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-[var(--element-border)] group">
            <div className="w-16 h-16 bg-gradient-to-r from-[var(--accent)] to-[var(--accent)] rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-[var(--text-primary)]">
              Simulações
            </h2>
            <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
              Simule sistemas de filas com parâmetros personalizados e visualize
              o comportamento da fila ao longo do tempo.
            </p>
            <Link
              href="/simulations"
              className="inline-flex items-center text-[var(--accent)] hover:text-[var(--accent)] font-semibold group-hover:translate-x-2 transition-transform duration-300"
            >
              Ir para Simulações
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
        <div className="mt-16 text-center">
          <p className="text-[var(--text-muted)] text-sm">
            Todos os dados são armazenados localmente no seu navegador. Exporte
            para CSV para análise adicional.
          </p>
        </div>
      </div>
    </div>
  );
}
