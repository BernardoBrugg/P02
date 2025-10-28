# Aplicativo de Teoria de Filas

Um aplicativo web para análise de sistemas de filas, desenvolvido com Next.js, TypeScript e Tailwind CSS. Permite medir tempos de chegada, visualizar dados e explorar painéis com métricas e gráficos importantes da Teoria das Filas.

## Funcionalidades

- **Cronômetros**: Adicione filas e meça tempos de chegada e saída de clientes.
- **Dados**: Visualize, gerencie e exporte os dados coletados em formato CSV.
- **Painéis**: Explore métricas de desempenho e gráficos interativos, incluindo comparações de tempos de espera, distribuições e taxas de chegada.

## Tecnologias Utilizadas

- **Next.js**: Framework React para aplicações web.
- **TypeScript**: Superset do JavaScript com tipagem estática.
- **Tailwind CSS**: Framework CSS utilitário para estilização.
- **Recharts**: Biblioteca para gráficos interativos.
- **KaTeX**: Para renderização de símbolos matemáticos.
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
- Botões para navegar diretamente para Cronômetros ou Painéis.
- Descrição das funcionalidades principais.

### Página de Cronômetros

- **Adicionar Filas**: Digite o nome da nova fila no campo e clique em "Adicionar Fila".
- **Iniciar Temporização**: Para cada fila, clique em "Chegando" quando um cliente chega e "Saindo" quando sai.
- **Parar**: Clique em "Parar" para resetar os cronômetros.
- Os dados são salvos automaticamente no navegador.

### Página de Dados

- Visualize todos os registros coletados em uma tabela.
- **Exportar para CSV**: Clique no botão para baixar os dados em formato CSV para análise externa.
- **Deletar Registros**: Use o ícone de lixeira para remover entradas indesejadas.

### Página de Painéis

- Exibe métricas calculadas por fila e gráficos.
- **Métricas**:
  - **W (Tempo Médio Total)**: Tempo médio que um cliente passa no sistema.
  - **Wq (Tempo Médio de Espera)**: Tempo médio de espera na fila.
  - **Ts (Tempo Médio de Serviço)**: Tempo médio de atendimento (simulado como 5s).
  - **λ (Taxa de Chegada)**: Número médio de chegadas por segundo.
  - **ρ (Utilização do Sistema)**: Fração do tempo que o servidor está ocupado.
- **Gráficos**:
  - **Comparação de Desempenho**: Barras comparando Wq e Ts entre filas.
  - **Distribuição da Espera**: Histograma de Wq para a fila com pior desempenho.
  - **Taxa de Chegada por Fila**: Barras mostrando λ por fila.
  - **Chegadas e Saídas Cumulativas**: Linha mostrando acumulação ao longo do tempo.

## Conceitos da Teoria das Filas

- **Clientes**: Entidades que demandam serviço (veículos).
- **Filas**: Pontos de espera (aproximações esquerda e direita).
- **Servidor**: Capacidade de atendimento (pistas da rua).
- **Disciplina**: Regra de atendimento (afluência dinâmica).
- As métricas ajudam a avaliar o desempenho, identificar gargalos e sugerir melhorias, como aumento de capacidade ou mudanças na sinalização.

## Teoria Matemática

Este aplicativo baseia-se na Teoria das Filas, especificamente no modelo M/M/1, onde as chegadas seguem um processo de Poisson (exponencial) e os tempos de serviço são exponenciais. O modelo assume um único servidor.

### Fórmulas Principais

- **λ (Taxa de Chegada)**: Calculada como o número total de chegadas dividido pelo tempo total de observação. Representa a taxa média de chegadas por unidade de tempo (segundos).

$$
λ = \frac{\text{Número de chegadas}}{\text{Tempo total}}
$$

- **Ts (Tempo Médio de Serviço)**: Simulado como 5 segundos neste aplicativo. Em um cenário real, seria calculado a partir dos dados medidos.

$$
Ts = \frac{1}{μ}
$$

Onde μ é a taxa de serviço.

- **μ (Taxa de Serviço)**: Inversa do tempo médio de serviço.

$$
μ = \frac{1}{Ts}
$$

- **ρ (Utilização do Sistema)**: Fração do tempo que o servidor está ocupado. Deve ser menor que 1 para estabilidade.

$$
ρ = \frac{λ}{μ}
$$

- **Wq (Tempo Médio de Espera na Fila)**: Tempo médio que um cliente espera na fila antes de ser atendido.

$$
Wq = \frac{ρ}{μ (1 - ρ)}
$$

- **W (Tempo Médio Total no Sistema)**: Tempo médio que um cliente passa no sistema, incluindo espera e serviço.

$$
W = Wq + Ts
$$

### Interpretação dos Gráficos

- **Comparação de Desempenho**: Compara Wq e Ts entre filas para identificar quais têm maiores tempos de espera relativos ao serviço.
- **Distribuição da Espera**: Mostra a frequência de diferentes tempos de espera na fila para a fila com pior desempenho, ajudando a entender a variabilidade.
- **Taxa de Chegada por Fila**: Visualiza λ para cada fila, indicando a carga de trabalho.
- **Chegadas e Saídas Cumulativas**: Plota o número acumulado de chegadas e saídas ao longo do tempo, útil para detectar padrões ou desequilíbrios.

Essas fórmulas assumem condições ideais; em aplicações reais, ajustes podem ser necessários para distribuições não-exponenciais.

## Estrutura do Projeto

```
src/
  app/
    layout.tsx          # Layout principal
    page.tsx            # Página inicial
    chronometers/page.tsx  # Página de cronômetros
    dashboards/page.tsx    # Página de painéis
    data/page.tsx          # Página de dados
  components/
    Chronometer.tsx     # Componente de cronômetro
    Nav.tsx             # Navegação
    TimestampCard.tsx   # Cartão de timestamp
    ClientLayout.tsx    # Layout do cliente
    ThemeProvider.tsx   # Provedor de tema
```

## Contribuição

Sinta-se à vontade para contribuir com melhorias. Abra issues ou pull requests no repositório.

## Licença

Este projeto é de código aberto e está sob a licença MIT.
