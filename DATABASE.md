# Database Structure - Queueing Theory App

Este documento descreve a estrutura do banco de dados Firestore usado na aplicação de teoria de filas.

## Coleções

### `queues`

Armazena as filas definidas pelos usuários.

**Estrutura do Documento:**

- `name` (string): Nome da fila.
- `type` (string): "arrival" ou "service".
- `numAttendants` (number, opcional): Número de atendentes (apenas para service).

**Exemplo:**

```json
{
  "name": "Fila 1",
  "type": "service",
  "numAttendants": 2
}
```

### `data`

Armazena os registros de eventos de chegada e serviço.

**Estrutura do Documento:**

- `queue` (string): Nome da fila.
- `type` (string): "arrival" ou "service".
- `timestamp` (string): Timestamp ISO da criação.
- `totalTime` (number): Tempo total em ms.
- `element` (number): Número do elemento.
- `arriving` (string): Timestamp ISO de chegada.
- `exiting` (string): Timestamp ISO de saída (vazio para arrival).

**Exemplo:**

```json
{
  "queue": "Fila 1",
  "type": "service",
  "timestamp": "2023-10-01T10:00:00.000Z",
  "totalTime": 5000,
  "element": 1,
  "arriving": "2023-10-01T10:00:00.000Z",
  "exiting": "2023-10-01T10:00:05.000Z"
}
```

### `totals`

Armazena o contador total de elementos por fila.

**Estrutura do Documento (ID = nome da fila):**

- `total` (number): Número total de elementos.

**Exemplo:**

```json
{
  "total": 10
}
```

### `activeServices`

Armazena os serviços ativos em tempo real por fila.

**Estrutura do Documento (ID = nome da fila):**

- `currentServicing` (array): Array de objetos com `element`, `arrivedTime`, `startTime`.

**Exemplo:**

```json
{
  "currentServicing": [
    {
      "element": 1,
      "arrivedTime": 1696156800000,
      "startTime": "2023-10-01T10:00:00.000Z"
    }
  ]
}
```

### `services`

Armazena as análises salvas de filas.

**Estrutura do Documento:**

- `name` (string): Nome do serviço.
- `arrivalQueue` (string): Fila de chegada.
- `serviceQueue` (string): Fila de serviço.
- `metrics` (object): Métricas calculadas (lambda, mu, rho, etc.).

**Exemplo:**

```json
{
  "name": "Análise 1",
  "arrivalQueue": "Chegadas",
  "serviceQueue": "Atendimentos",
  "metrics": {
    "lambda": 0.5,
    "mu": 1.0,
    "rho": 0.5,
    "L": 1.0,
    "Lq": 0.25,
    "W": 2.0,
    "Wq": 0.5,
    "P": [0.5, 0.25, 0.125, ...]
  }
}
```

## Regras de Segurança

Configure as regras do Firestore para permitir leitura e escrita para usuários autenticados ou público, dependendo da necessidade. Para produção, considere autenticação.

## Notas

- Todos os dados são compartilhados em tempo real entre usuários.
- Use listeners `onSnapshot` para atualizações automáticas.
- Para limpar dados, delete documentos ou coleções conforme necessário.
