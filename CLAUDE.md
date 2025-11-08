# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HeureDeVol is a pilot logbook application built with React, TypeScript, and Vite. The application tracks both real and virtual (gaming) flights with client-side data storage using IndexedDB. It's designed to support multiple logbooks, expandable data fields (carrier traps, air-to-air kills, etc.), and pilot-specific features like qualification expirations and statistics.
It aims to become a real product but is also a means to learn React as I am a novice React developer (though I am experienced at coding in C++, C#, SQL Server, Oracle).

## Specifications

Detailed specifications for planned or completed features are maintained in **SPECS.md**.
Always consult SPECS.md when implementing new features or modifying the data model.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production (runs TypeScript compiler then Vite build)
npm run build

# Lint the codebase
npm run lint

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/          # Shared/reusable components
│   └── ui/             # Generic UI components (Field, etc.)
├── features/           # Feature-based organization
│   └── flights/
│       ├── components/ # Flight-specific components (FlightForm)
│       └── queries.ts  # TanStack Query hooks for flights
├── lib/                # Third-party library wrappers
│   └── database/       # IndexedDB wrapper (modular structure)
│       ├── schema.ts            # Database schema definition
│       ├── database.ts          # Core HdvDatabase class
│       ├── settings-repository.ts   # Settings CRUD operations
│       ├── logbooks-repository.ts   # Logbooks CRUD operations
│       ├── flights-repository.ts    # Flights CRUD operations
│       └── index.ts             # Exports hdvDatabase singleton
├── types/              # Shared type definitions
│   ├── flight.ts       # Flight domain model
│   └── form.ts         # Form state management types
├── utils/              # Pure utility functions
│   └── date.ts         # Date manipulation helpers
└── constants/          # App-wide constants (ROUTES, etc.)
```

## Path Aliases

The project uses path aliases for cleaner imports:

```typescript
import { Flight } from "@/types/flight";
import { Field } from "@/components/ui/Field";
import { hdvDatabase } from "@/lib/database";
```

Available aliases: `@/components/*`, `@/features/*`, `@/lib/*`, `@/types/*`, `@/utils/*`, `@/constants/*`

## Architecture

### Data Layer

**IndexedDB with idb wrapper** (`src/lib/database/`)
- Modular structure with separate repository classes for each data store
- Single database: `HdvDatabase` with three object stores:
  - `settings` - App configuration (single 'default' key)
  - `logbooks` - Logbook definitions with `byCreated` index
  - `flights` - Flight records with indexes: `byLogbook`, `byDate`, `byAircraftType`, `byLogbookAndDate`
- Singleton instance exported as `hdvDatabase` from `index.ts`
- Repository pattern: Access methods via `hdvDatabase.settings.*`, `hdvDatabase.logbooks.*`, `hdvDatabase.flights.*`
- CRUD operations in separate repository files for better organization

**TanStack Query integration** (`src/features/flights/queries.ts`)
- Query hooks: `useFlights()`, `useFlightsByAircraftType(aircraftType)`
- Mutation hooks: `useAddFlight()`, `useUpdateFlight()`, `useDeleteFlight()`
- Automatic cache invalidation on mutations
- Query client configured in `main.tsx` with 5min stale time, 10min cache time
- React Query Devtools enabled in development

### State Management Pattern

The application uses a custom reducer-based form state management system:

**Form types** (`src/types/form.ts`)
- `FormField` interface with validation state (value, error, touched, type, label, name)
- `FormState` contains a dictionary of fields and submission state
- `FormActionType` enum and `FormAction` discriminated union for type-safe actions
- Actions: `FieldChange`, `FieldBlur`, `FormSubmit`, `FormSubmitSuccess`, `FormSubmitError`, `FormReset`

**Form implementation** (`src/features/flights/components/FlightForm.tsx`)
- Uses `useReducer` with Immer's `produce` for immutable updates
- Per-field validation on change via `validateField()` function
- Centralized initial state with field configurations
- Memoized handlers (`handleChange`, `handleBlur`, `handleSubmit`, `handleReset`) to prevent unnecessary re-renders
- Integrates with `useAddFlight()` mutation for database persistence
- Automatically resets form on successful submission

**Field component** (`src/components/ui/Field.tsx`)
- Memoized presentation component for individual form fields
- Handles both text/datetime-local and checkbox input types
- Unified error display logic
- Receives field state and callbacks as props

### Type System

**Flight type** (`src/types/flight.ts`)
- Core domain model with optional `id` (assigned by IndexedDB)
- `FlightFactory` class with static methods:
  - `empty()`: Creates blank flight with sensible defaults
  - `fromObject()`: Partial object to complete Flight conversion with defaults

**Form types** (`src/types/form.ts`)
- Generic form state management types
- Supports mixed field types (string, boolean, number)
- Validation and touched state per field

### Routing

React Router v7 setup (`src/App.tsx`):
- Routes defined in `src/constants/index.ts` as `ROUTES` constant
- `/` - Dashboard (placeholder)
- `/new-flight` - Flight entry form (FlightForm component)

### Styling

Tailwind CSS configured for utility-first styling with standard gray/blue color scheme.

## Key Dependencies

- **React 18.3**: Core UI framework
- **React Router DOM 7.1**: Client-side routing
- **Immer 10.1**: Immutable state updates in reducers
- **idb 8.0**: Promise-based IndexedDB wrapper
- **date-fns 4.1**: Date manipulation utilities
- **TanStack Query 5.64**: Data fetching, caching, and state management with devtools
- **Tailwind CSS 3.4**: Utility-first styling

## Development Notes

- Vite config uses `strictPort: true` for consistent dev server behavior and path aliases (`@/*`)
- TypeScript strict mode enabled with path alias support
- ESLint configured with React hooks and React Refresh plugins
- Feature-based folder organization for scalability
- TanStack Query integrated with automatic cache invalidation on mutations
- Form validation is basic - can be enhanced for production use

## Code Style

- **File naming**:
  - Use **kebab-case** for non-component files: `aircraft-type.ts`, `settings-repository.ts`, `queries.ts`
  - Use **PascalCase** for React component files: `FlightForm.tsx`, `Field.tsx`
  - Examples:
    - Correct: `src/types/aircraft-type.ts`, `src/components/ui/Field.tsx`
    - Incorrect: `src/types/aircraftType.ts`, `src/components/ui/field.tsx`

- **String quotes**: Always use double quotes (`"`) for strings in TypeScript/JavaScript files, not single quotes (`'`)
  - Correct: `import { Flight } from "@/types/flight";`
  - Incorrect: `import { Flight } from '@/types/flight';`

- **If statements**:
  - Single-line if statements are acceptable for **guard clauses** (early returns)
  - All other if statements should use braces for consistency
  - Examples:
    - Guard clauses (correct): `if (!user) return;` or `if (error) throw error;`
    - Everything else (use braces): `if (condition) { doSomething(); }`
