WORDS:

word_id = pt:meditacao
word = palavra
stem = stem
lang = language

BOOK_INFO

id/asin/guid (procurar diferença)
title
authors
lang (precisa ?)

LOOKUPS

id
word_key = word_id
book_key = id/guid
usage = context

===========================

VOCABULARY

id = padrao
userId = userId
importId = importId
bookId = bookId
wordId = wordId
context = LOOKUPS.usage
learnCount = 0 padrao

===========================

## DECISÕES DE MAPEAMENTO

### BOOK_INFO - Qual ID usar?

**ASIN** (Amazon Standard Identification Number):

- Sempre 10 caracteres alfanuméricos
- Identificador oficial/padrão da Amazon
- Único no ecossistema Kindle
- **ESCOLHIDO** → mapeado para `kindleBookId`

**GUID**: ID interno do dispositivo Kindle (pode variar)
**id**: ID interno do vocab.db (formato complexo)

---

## ARQUITETURA DO UPLOAD

### Visão Geral

```
┌─────────────────────────────────────────────────────────┐
│  UPLOAD (Síncrono - Rápido)                             │
│  1. Parse vocab.db                                      │
│  2. Salvar Import                                       │
│  3. Salvar Books (upsert)                               │
│  4. Salvar Words (upsert) - SEM definições              │
│  5. Salvar Vocabulary (upsert)                          │
│  6. Disparar Job: "buscar-definitions"                  │
│  7. Retorna { importId, status: "processing" }          │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│  DEFINITIONS JOB (Background - Bull + Redis)            │
│  1. Busca words sem definição do importId               │
│  2. Processa em batches (ex: 50 palavras)               │
│  3. Rate limit controlado (ex: 10 req/segundo)          │
│  4. Salva em Definitions                                │
│  5. Atualiza progresso                                  │
│  6. Retry com backoff exponencial em falhas             │
└─────────────────────────────────────────────────────────┘
```

### Por que híbrido?

- **vocab.db típico**: até 10.000 palavras
- **APIs externas**: 2 chamadas por palavra (língua original + PT)
- **Tempo estimado síncrono**: 33+ minutos (inviável)
- **Solução**: Upload rápido + definitions em background

---

## FLUXO DE DEFINIÇÕES

### Regra por Language Enum (EN, PT, ES, FR)

| Língua da Palavra | Busca Definição | Busca Tradução (PT) |
| ----------------- | --------------- | ------------------- |
| PT                | ✅ PT           | ❌ N/A              |
| EN                | ✅ EN           | ✅ PT               |
| ES                | ✅ ES           | ✅ PT               |
| FR                | ✅ FR           | ✅ PT               |

### APIs Candidatas

**Definições:**

- FreeDictionary API (grátis, multi-língua)
- Wordnik (requer API key)
- Datamuse (grátis, limitado)

**Tradução:**

- DeepL API (pago, qualidade)
- LibreTranslate (grátis, self-hosted)
- Google Translate API (pago)

---

## PATTERNS UTILIZADOS

| Pattern               | Onde                     | Por quê                                     |
| --------------------- | ------------------------ | ------------------------------------------- |
| **Bulk/Upsert**       | Books, Words, Vocabulary | Reduz 10k queries para ~100 batches         |
| **Queue + Worker**    | Definitions              | Controle de concorrência, retry, rate limit |
| **Circuit Breaker**   | APIs externas            | Evita cascata de falhas                     |
| **Progress Tracking** | Import entity            | Usuário vê % completo                       |
| **Idempotência**      | Todo o fluxo             | Re-upload não duplica dados                 |

---

## ESTRUTURA DE PASTAS SUGERIDA

```
src/imports/
├── use-cases/
│   ├── upload-vocab-file.use-case.ts    # Parse + save (síncrono)
│   └── fetch-definitions.job.ts         # Background job
├── services/
│   ├── vocab-parser.service.ts          # Parse SQLite
│   ├── definition-fetcher.service.ts    # Orquestra APIs
│   └── api-providers/
│       ├── freedictionary.api.ts
│       └── linguee.api.ts
├── dto/
│   └── upload-vocab.dto.ts
└── entities/
    └── import.entity.ts                 # + status, progress
```

---

## DECISÕES PENDENTES

- [ ] Definir API de definições
- [ ] Definir API de tradução
- [ ] Definir estratégia de progress tracking (polling vs websocket)
- [ ] Definir retry policy (tentativas, backoff)
- [ ] Definir batch size ideal
- [ ] Definir rate limit de APIs

---

## DESAFIO: APIS EXTERNAS

### Por que é a parte mais complicada?

1. **Formatos diferentes** → Cada API retorna JSON de um jeito
2. **Rate limits** → Cada API tem um limite (requests/segundo)
3. **Falhas** → Timeout, 500, service down
4. **Línguas** → Nem toda API tem PT-BR, ES, FR
5. **Auth** → API keys, tokens, quotas

---

## ABORDAGEM INCREMENTAL (SIMPLES → ROBUSTO)

### Fase 1: MVP (UMA API, sem retry)

- ✅ Escolhe 1 API grátis (ex: FreeDictionary)
- ✅ 1 request por palavra
- ✅ Se falhar → pula, loga erro
- ✅ **Sem Bull, sem Redis, sem circuit breaker**

### Fase 2: Retry Básico

- ✅ 3 tentativas com `setTimeout`
- ✅ Resolve 80% das falhas transitórias

### Fase 3: Background Job

- ✅ Move pra fila (Bull)
- ✅ Agora pode levar minutos sem bloquear

### Fase 4: Múltiplas APIs

- ✅ Adiciona fallback (API 2 se API 1 falhar)
- ✅ Strategy pattern aqui

---

## PATTERNS PARA MÚLTIPLAS APIS

### 1. Strategy Pattern ⭐

**Trocar algoritmos (APIs) em runtime**

```typescript
// Interface comum
interface DefinitionProvider {
  fetch(word: string, lang: Language): Promise<Definition>;
}

// Implementações concretas
class FreeDictionaryProvider implements DefinitionProvider { ... }
class WordnikProvider implements DefinitionProvider { ... }

// Uso
const provider = this.getProvider(language); // Strategy
const definition = await provider.fetch(word, lang);
```

**Quando usar:** Quer trocar de API sem mudar o código cliente.

---

### 2. Adapter Pattern ⭐

**Normalizar respostas diferentes**

```typescript
// API 1 retorna: { word: '...', def: '...' }
// API 2 retorna: { entry: { text: '...' } }

// Adapter unifica
class FreeDictionaryAdapter {
  normalize(raw: FreeDictResponse): DefinitionDTO {
    return { word: raw.word, definition: raw.def };
  }
}
```

**Quando usar:** APIs com formatos de resposta diferentes.

---

### 3. Chain of Responsibility ⭐⭐

**Fallback cascata (se API 1 falha, tenta API 2)**

```typescript
const chain = new Chain([
  new FreeDictionaryHandler(), // grátis, tenta primeiro
  new WordnikHandler(), // pago, fallback
  new CacheHandler(), // último recurso
]);

const result = await chain.handle(word);
```

**Quando usar:** Quer resiliência e tem APIs "premium" como fallback.

---

### 4. Factory Pattern

**Criar provider baseado em critério (ex: língua)**

```typescript
class ProviderFactory {
  getProvider(lang: Language): DefinitionProvider {
    switch (lang) {
      case 'EN':
        return new EnglishDictionaryProvider();
      case 'PT':
        return new PriberamProvider();
      case 'ES':
        return new RAEProvider();
    }
  }
}
```

**Quando usar:** Lógica de seleção complexa.

---

### 5. Circuit Breaker ⭐⭐

**Evita chamar API quebrada repetidamente**

```typescript
@UseCircuitBreaker({
  service: 'FreeDictionary',
  timeout: 3000,
  fallback: () => cachedDefinition,
})
async fetchDefinition(word: string) { ... }
```

**Nota:** Não é nativo do NestJS. Usar `nestjs-circuit-breaker` ou interceptor custom.

**Quando usar:** APIs externas instáveis.

---

### 6. Retry Pattern (com Backoff)

**Tentar novamente com delay exponencial**

```typescript
@Retry({
  attempts: 3,
  delay: 1000, // 1s, 2s, 4s...
  on: [HttpException, TimeoutError],
})
async fetchDefinition(word: string) { ... }
```

**Quando usar:** Falhas transitórias (timeout, rate limit).

---

### 7. Rate Limiter Pattern

**Controlar chamadas por segundo**

```typescript
@RateLimit({
  limit: 10,      // 10 req
  timeframe: 1000, // por segundo
  strategy: 'sliding-window',
})
async fetchDefinition(word: string) { ... }
```

**Quando usar:** APIs com rate limit restritivo.

---

## ARQUITETURA COMPLETA (COMBINAÇÃO)

```
┌──────────────────────────────────────────────────────────┐
│  DefinitionFetcherService (Facade)                       │
│                                                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐         │
│  │  Factory   │→ │  Strategy  │→ │   Adapter  │         │
│  │ (por lang) │  │ (provider) │  │ (response) │         │
│  └────────────┘  └────────────┘  └────────────┘         │
│         ↓               ↓               ↓                │
│  ┌────────────────────────────────────────────┐         │
│  │         Circuit Breaker + Retry            │         │
│  └────────────────────────────────────────────┘         │
│         ↓                                                │
│  ┌────────────────────────────────────────────┐         │
│  │              Rate Limiter                  │         │
│  └────────────────────────────────────────────┘         │
└──────────────────────────────────────────────────────────┘
                         ↓
              ┌─────────────────────┐
              │  External APIs      │
              │  - FreeDictionary   │
              │  - Wordnik          │
              │  - Priberam (PT)    │
              └─────────────────────┘
```

---

## SUPORTE NO NESTJS

| Pattern                 | Nativo? | Como implementar                               |
| ----------------------- | ------- | ---------------------------------------------- |
| Circuit Breaker         | ❌      | `nestjs-circuit-breaker` ou interceptor custom |
| Retry                   | ❌      | `nestjs-retry` ou interceptor custom           |
| Rate Limiter            | ⚠️      | `@nestjs/throttler` (tem `@Throttle()`)        |
| Strategy                | ✅      | DI + interfaces (padrão Nest)                  |
| Adapter                 | ✅      | Services (padrão Nest)                         |
| Factory                 | ✅      | Provider factories (padrão Nest)               |
| Chain of Responsibility | ❌      | Implementação manual                           |

---

## RECOMENDAÇÃO PRA COMEÇAR

**Comece SIMPLES (Fase 1-2):**

1. UMA API (FreeDictionary - grátis, sem auth)
2. Retry básico (3 tentativas, delay fixo)
3. Síncrono primeiro, depois move pra fila

**Depois evolui (Fase 3-4):**

1. Adiciona Bull + Redis
2. Adiciona fallback (Chain of Responsibility)
3. Adiciona Circuit Breaker se necessário

**NestJS + Bull já resolve 90%** sem complexidade inicial.
