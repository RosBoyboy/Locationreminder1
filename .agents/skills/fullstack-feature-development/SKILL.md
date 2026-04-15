---
name: fullstack-feature-development
description: 'Workflow for developing a new fullstack feature using Next.js and Supabase. Use when building a feature that requires database changes, server-side data fetching, and frontend components.'
---

# Fullstack Feature Development (Next.js & Supabase)

## Objective
To implement an end-to-end feature using Next.js (App Router) and Supabase, ensuring secure data access, proper server/client component fetching, and type safety.

## Workflow

### 1. Database & Schema Design
- Define the necessary tables, columns, and relationships in Supabase.
- Write and execute the SQL migrations.
- Update Row Level Security (RLS) policies to secure the new data.
- Regenerate TypeScript types for the Supabase models.

### 2. Backend Logic (Server Actions / Route Handlers)
- Create Next.js Server Actions or API Route Handlers for mutations (inserts, updates, deletes).
- Use the Supabase server client (e.g., `@/utils/supabase/server`) to interact with the database securely from the server.
- Validate incoming data and handle errors gracefully.

### 3. Frontend Integration (UI & Data Fetching)
- Fetch necessary data in Server Components where possible for optimal performance.
- Create interactive Client Components for forms or UI states that require user input.
- Connect Client Components to Server Actions for data mutation.
- Implement loading skeletons, pending states, and error boundaries.

### 4. End-to-End Review
- Test the full flow locally to ensure data is correctly displayed and mutated.
- Verify RLS policies are enforcing the correct permissions.
- Ensure the UI is responsive and accessible.