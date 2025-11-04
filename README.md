# Teoria das filas: CronApp

Um aplicativo web para análise de sistemas de filas, desenvolvido com Next.js, TypeScript e Tailwind CSS. Permite medir tempos de chegada, visualizar dados, importar/exportar dados em CSV, explorar painéis com métricas e gráficos importantes da Teoria das Filas, e carregar estudos de caso pré-definidos.

## Funcionalidades

- **Cronômetros**: Adicione filas e meça tempos de chegada e saída de clientes.
- **Dados**: Visualize, gerencie, importe e exporte os dados coletados em formato CSV.
- **Painéis**: Explore métricas de desempenho e gráficos interativos, incluindo probabilidades de estado, comparações de tempos de espera e chegadas/saídas cumulativas.
- **Simulações**: Carregue estudos de caso pré-definidos para análise de diferentes cenários de sistemas de filas.

## Tecnologias Utilizadas

- **Next.js**: Framework React para aplicações web.
- **TypeScript**: Superset do JavaScript com tipagem estática.
- **Tailwind CSS**: Framework CSS utilitário para estilização.
- **Recharts**: Biblioteca para gráficos interativos.
- **KaTeX**: Para renderização de símbolos matemáticos.
- **PapaParse**: Para parsing de arquivos CSV.
- **LocalStorage**: Para armazenamento local de dados.

## Instalação

1. Clone o repositório:

   ```bash
   git clone <url-do-repositorio>
   cd queueing-theory-app
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Execute o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

4. Abra [http://localhost:3000](http://localhost:3000) no navegador.

## Manual do Usuário

### Página Inicial

- Apresenta uma visão geral do aplicativo.
- Botões para navegar diretamente para Cronômetros, Dados, Painéis ou Simulações.
- Descrição das funcionalidades principais.

### Página de Cronômetros

- **Adicionar Filas**: Digite o nome da nova fila no campo, selecione o tipo (Chegada ou Atendimento) e clique em "Adicionar Fila".
- **Iniciar Temporização**: Para filas de chegada, clique em "Start" para iniciar, "Stop" para parar, e "+1" para registrar uma chegada. Para filas de atendimento, clique em "Chegou no atendimento" e "Completou atendimento".
- Os dados são salvos automaticamente no navegador.

### Página de Dados

- Visualize todos os registros coletados em uma tabela.
- **Importar CSV**: Especifique o nome da fila e selecione um arquivo CSV no formato exportado para importar dados.
- **Exportar para CSV**: Clique no botão para baixar os dados de uma fila em formato CSV.
- **Deletar Registros**: Use o ícone de lixeira para remover entradas indesejadas.
- **Limpar Todos os Dados**: Remove todos os registros.

### Página de Painéis

- Exibe métricas calculadas por serviço e gráficos.
- **Métricas**:
  - **λ (Taxa de Chegada)**: Taxa média de chegadas por segundo.
  - **μ (Taxa de Atendimento)**: Taxa média de atendimentos por segundo.
  - **ρ (Utilização)**: Fração do tempo que o sistema está ocupado.
  - **L (Número Médio de Clientes no Sistema)**: Número médio de clientes no sistema.
  - **Lq (Número Médio de Clientes na Fila)**: Número médio de clientes na fila.
  - **W (Tempo Médio no Sistema)**: Tempo médio de permanência no sistema.
  - **Wq (Tempo Médio na Fila)**: Tempo médio de espera na fila.
  - **P(n) (Probabilidades de Estado)**: Probabilidades de ter n clientes no sistema.
- **Gráficos**:
  - **Gráfico Cumulativo**: Linha mostrando chegadas e saídas acumuladas ao longo do tempo.
  - **Gráfico de Probabilidades P(n)**: Barras mostrando as probabilidades de estado.

### Página de Simulações

- Carregue estudos de caso pré-definidos para analisar diferentes cenários.
- **Estudos Disponíveis**:
  - Sistema M/M/1 Estável (ρ = 0.5)
  - Sistema M/M/1 Sobrecarregado (ρ = 0.8)
  - Sistema M/M/1 Eficiente (ρ = 0.1)
- Clique em "Carregar Estudo" para adicionar o estudo aos serviços salvos e visualizar métricas e gráficos.

## Conceitos da Teoria das Filas

- **Clientes**: Entidades que demandam serviço.
- **Filas**: Pontos de espera.
- **Servidor**: Capacidade de atendimento.
- **Disciplina**: Regra de atendimento (ex.: FIFO).
- As métricas ajudam a avaliar o desempenho, identificar gargalos e sugerir melhorias.

## Teoria Matemática

Este aplicativo baseia-se na Teoria das Filas, especificamente no modelo M/M/1, onde as chegadas seguem um processo de Poisson e os tempos de serviço são exponenciais. O modelo assume um único servidor.

### Fórmulas Principais

- **λ (Taxa de Chegada)**: Calculada a partir dos intervalos entre chegadas.

- **μ (Taxa de Serviço)**: Inversa do tempo médio de serviço.

- **ρ (Utilização do Sistema)**:

$$
\rho = \frac{\lambda}{\mu}
$$

- **P0 (Probabilidade de Sistema Vazio)**:

$$
P_0 = 1 - \rho
$$

- **Pn (Probabilidades de Estado)**:

$$
P_n = P_0 \rho^n
$$

- **L (Número Médio de Clientes no Sistema)**:

$$
L = \frac{\rho}{1 - \rho}
$$

- **Lq (Número Médio de Clientes na Fila)**:

$$
L_q = \frac{\rho^2}{1 - \rho}
$$

- **W (Tempo Médio no Sistema)**:

$$
W = \frac{L}{\lambda}
$$

- **Wq (Tempo Médio na Fila)**:

$$
W_q = \frac{L_q}{\lambda}
$$

### Interpretação dos Gráficos

- **Gráfico Cumulativo**: Mostra a evolução de chegadas e saídas ao longo do tempo.
- **Gráfico de Probabilidades P(n)**: Visualiza a distribuição de estados do sistema.

## Estrutura do Projeto

```
src/
  app/
    layout.tsx          # Layout principal
    page.tsx            # Página inicial
    chronometers/page.tsx  # Página de cronômetros
    dashboards/page.tsx    # Página de painéis
    data/page.tsx          # Página de dados
    simulations/page.tsx   # Página de simulações
    about/page.tsx         # Página sobre
  components/
    Chronometer.tsx     # Componente de cronômetro
    Nav.tsx             # Navegação
    TimestampCard.tsx   # Cartão de timestamp
    ClientLayout.tsx    # Layout do cliente
    ThemeProvider.tsx   # Provedor de tema
    MathRenderer.tsx    # Renderizador de matemática
    Footer.tsx          # Rodapé
```

## Contribuição

Sinta-se à vontade para contribuir com melhorias. Abra issues ou pull requests no repositório.

## Licença

Este projeto é de código aberto e está sob a licença MIT.
