// Shared between Server Actions and Client Components (no server-only import).
export type ActionState =
  | { status: 'idle' }
  | { status: 'success'; message?: string; id?: string }
  | { status: 'error'; message: string; fields?: Record<string, string[] | undefined> }

export const idle: ActionState = { status: 'idle' }
