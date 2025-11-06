# Queueing Theory App

Uma aplicação web fullstack para análise de teoria de filas, permitindo a todos os usuários registrados no site usar funcionalidades e visualizar dados e cronômetros em tempo real.

## Funcionalidades

### Cronômetros
- **Chegadas**: Registre tempos de chegada de clientes.
- **Atendimentos**: Registre tempos de serviço, com suporte a múltiplos atendentes.
- **Tempo Real**: Todos os usuários veem atualizações instantâneas.
- **Configuração de Tempo**: Modo padrão ou personalizado.

### Dados
- **Importação**: Importe dados de CSV para filas.
- **Visualização**: Tabela de dados com filtros por fila.
- **Exportação**: Exporte dados para CSV.
- **Gerenciamento**: Exclua registros individuais ou limpe todos os dados.

### Dashboards
- **Cálculos de Métricas**: Calcule métricas de filas M/M/1 e M/M/c.
- **Gráficos**: Visualize probabilidades P(n) e gráficos cumulativos.
- **Serviços Salvos**: Salve e gerencie análises de filas.
- **Exportação**: Exporte dashboards para PDF.

### Simulações
- **Simulação Discreta de Eventos**: Simule filas com eventos.
- **Simulação Personalizada**: Configure simulações customizadas.

## Tecnologias
- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Firebase Firestore para banco de dados em tempo real
- **Gráficos**: Recharts
- **CSV**: PapaParse

## Instalação e Configuração

1. Clone o repositório:
   ```bash
   git clone <url>
   cd queueing-theory-app
   ```

2. Instale dependências:
   ```bash
   npm install
   ```

3. Configure Firebase:
   - Crie um projeto no [Firebase Console](https://console.firebase.google.com/).
   - Habilite Firestore Database.
   - Obtenha as chaves de API.
   - Preencha o arquivo `.env.local` com as credenciais.

4. Execute o projeto:
   ```bash
   npm run dev
   ```

5. Acesse `http://localhost:3000`.

## Uso

### Adicionando Filas
- Vá para "Cronômetros".
- Adicione filas de chegada ou atendimento.
- Para atendimento, especifique o número de atendentes.

### Registrando Eventos
- Clique nos botões dos cronômetros para registrar chegadas ou serviços.
- Para atendimento, o botão "Chegou no atendimento" bloqueia quando todos os atendentes estão ocupados.

### Analisando Dados
- Importe dados CSV em "Dados".
- Calcule métricas em "Dashboards".
- Visualize gráficos e salve serviços.

## Estrutura do Projeto
- `src/app/`: Páginas Next.js
- `src/components/`: Componentes React
- `src/lib/`: Utilitários, incluindo Firebase config

## Contribuição
1. Fork o projeto.
2. Crie uma branch para sua feature.
3. Commit suas mudanças.
4. Push para a branch.
5. Abra um Pull Request.

## Licença
Este projeto é licenciado sob a MIT License.
