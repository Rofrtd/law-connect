# LawConnect LLM Tool

A lightweight full-stack Next.js application for exploring, refining, and managing LLM-generated structured content from natural-language prompts.

## Table of Contents

- [Getting Started](#getting-started)
- [Architecture & Design](#architecture--design)
- [Technology Stack](#technology-stack)
- [Testing Strategy](#testing-strategy)
- [Trade-offs & Assumptions](#trade-offs--assumptions)
- [Scalability & Extensibility](#scalability--extensibility)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Run database migrations
npm run db:migrate

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Available Scripts

```bash
npm run dev          # Start development server (port 3000)
npm run build        # Build for production
npm run start        # Start production server
npm run test         # Run unit tests with Vitest in watch mode
npm run e2e          # Run end-to-end tests (port 3001)
npm run db:migrate   # Run database migrations
```

## Architecture & Design

### Hexagonal Architecture (Ports & Adapters)

This project follows **Hexagonal Architecture** principles to maintain clean separation of concerns and testability:

```
┌─────────────────────────────────────────────┐
│           UI Layer (Next.js App)            │
│        (Server Actions, Components)         │
└────────────────┬────────────────────────────┘
                 │
┌────────────────▼────────────────────────────┐
│         Domain Layer (Business Logic)       │
│   /src/domain/{prompts,records,regenerate}  │
│          Pure TypeScript Functions          │
└────────┬────────────────────┬───────────────┘
         │                    │
┌────────▼────────┐  ┌───────▼──────────────┐
│  Database Port  │  │     LLM Port         │
│   (Drizzle)     │  │   (Interface)        │
└─────────────────┘  └──────────────────────┘
                              │
                     ┌────────▼─────────┐
                     │  LLM Adapters    │
                     │ - OpenAI Client  │
                     │ - Fake Client    │
                     └──────────────────┘
```

**Key Benefits:**

- **Domain logic is independent** of external APIs and databases
- **Easy to test**: Domain functions can be tested without mocking external dependencies
- **Flexible adapters**: Swap OpenAI for other LLM providers without touching business logic
- **Clear boundaries**: Each layer has a single responsibility

### LLM Integration Strategy

The LLM integration uses an **interface/adapter pattern** to decouple the application from external API complexities:

**1. Interface Definition** (`src/domain/llm/interface.ts`)

```typescript
interface LlmClient {
  generateRecords(prompt: string): Promise<LlmRecord[]>;
}
```

**2. Adapters** (`src/domain/llm/openAiClient.ts`, etc.)

- **OpenAI Adapter**: Uses OpenAI's structured output API
- **Fake Adapter**: Returns mock data for testing (activated via .env `LLM_MODE=fake`)

**3. Parse Layer** (`src/domain/llm/parse.ts`)
Even though OpenAI provides structured output, we implement our own parsing and validation layer to:

- Ensure type safety on our side
- Validate data format before persisting
- Handle edge cases gracefully
- Maintain control over data structure changes

## Technology Stack

### Core Framework

- **Next.js 16** (App Router): Server-side rendering, Server Actions, and optimized routing
- **React 19**: Latest features
- **TypeScript**: Type safety across the entire application

### Database & ORM

- **SQLite**:
  - Zero configuration
  - Perfect for local development and demos
  - File-based storage for easy deployment
- **Drizzle ORM**:
  - Type-safe SQL queries
  - Excellent TypeScript integration
  - Lightweight compared to Prisma/TypeORM
  - Schema migrations support

### UI & Styling

- **Tailwind CSS**: Utility-first styling for rapid development
- **Radix UI**: Accessible, unstyled component primitives

### Testing

- **Vitest**: Fast unit test runner (Vite-based)
- **Playwright**: E2E testing with real browser automation

### LLM Integration

- **OpenAI API**: GPT-4o-mini for document generation
- **Zod**: Runtime schema validation for LLM responses

## Testing Strategy

### Test-Driven Development (TDD) Approach

I've follow a **domain-first TDD approach**:

1. **Write domain tests first** (pure business logic)
2. **Implement domain functions** to pass tests
3. **Write action tests** (Server Actions layer)
4. **Write E2E tests** for critical user flows

### Test Layers

**1. Unit Tests** (`*.test.ts`)

- Domain logic (records, prompts, regenerate)
- LLM parsing and validation
- Server Actions
- Fast, isolated, no external dependencies

**2. End-to-End Tests** (`e2e/*.spec.ts`)

- Run on **port 3001** to avoid conflicts with dev server (port 3000)
- Uses fake LLM mode (`LLM_MODE=fake`) for deterministic results
- Separate test database (`db.e2e.sqlite`)
- Tests complete user flows: generate → edit → delete

**E2E Architecture:**

```bash
# E2E tests can run alongside dev server
Terminal 1: npm run dev        # Development on :3000
Terminal 2: npm run e2e        # Tests run on :3001
```

### Test Coverage Areas

- ✅ Record CRUD operations
- ✅ Prompt management and regeneration
- ✅ LLM response parsing and validation
- ✅ Server Action error handling
- ✅ Optimistic UI behavior (create, edit, delete)

## Trade-offs & Assumptions

### Assumptions

1. **Single user**: No authentication or multi-tenancy
2. **Local-first**: SQLite storage, no cloud deployment considerations yet
3. **Simple permissions**: All users can perform all actions
4. **Synchronous operations**: No background job processing

### Trade-offs

**SQLite vs PostgreSQL**

- ✅ Simpler setup, no external database needed
- ✅ Perfect for prototyping and demos
- ❌ Limited concurrent writes
- ❌ Not ideal for high-traffic production

**Server Actions vs API Routes**

- ✅ Less boilerplate, automatic type safety
- ✅ Better integration with React 19 features
- ❌ Tightly coupled to Next.js ecosystem
- ❌ Harder to consume from external clients

**Domain Purity**

- ✅ Highly testable business logic
- ✅ Easy to refactor and extend
- ❌ More initial architecture overhead
- ❌ Requires discipline to maintain boundaries

## Scalability & Extensibility

### Current Scalability Considerations

**Database:**

- File-based SQLite works for single-server deployment
- Migration path to PostgreSQL is straightforward (Drizzle supports both)
- Schema is normalized and indexed appropriately

**LLM Integration:**

- Interface pattern allows swapping providers easily
- Rate limiting and caching can be added at adapter level
- Batch processing can be implemented without domain changes

### Extension Points

**1. Multi-Provider LLM Support**

```typescript
// Easy to add new providers
class AnthropicClient implements LlmClient {
  async generateRecords(prompt: string) { ... }
}

class GeminiClient implements LlmClient {
  async generateRecords(prompt: string) { ... }
}
```

**2. Background Job Processing**

```typescript
// Add queue layer without changing domain
async function generateRecordsJob(promptId: string) {
  const prompt = await getPrompt(promptId);
  const records = await llmClient.generateRecords(prompt);
  await saveRecords(records);
}
```

**3. Real-time Updates**

- WebSocket layer can be added to push updates

**4. Multi-tenancy**

- Add `userId` or `organizationId` to schema

### Performance Optimizations

- Server Components for initial page load
- SQLite is fast for read-heavy workloads
- Next.js automatic code splitting

---

Built with ❤️ for LawConnect
