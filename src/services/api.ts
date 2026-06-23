import {
  Board,
  Task,
  seedBoards,
  seedTasks,
  Status,
  Priority } from
'../components/data';

/**
 * Task & Board API service
 * ==================================================================
 * Single integration point between the UI and the backend.
 *
 * Operating modes (auto-detected at runtime):
 *   1. SUPABASE      — VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY
 *   2. CUSTOM REST   — VITE_API_URL (also overridable from Settings UI)
 *   3. LOCAL         — no env vars → localStorage-backed mock store
 *
 * Settings can store a runtime override for the API URL at
 * localStorage["nexus.config.apiUrl"]. This lets the deployed app
 * point at a different backend without rebuilding.
 *
 * EXPECTED SUPABASE SCHEMA:
 *   create table boards (
 *     id text primary key, name text not null,
 *     color text default 'bg-cyan-500', created_at timestamptz default now()
 *   );
 *   create table tasks (
 *     id text primary key, board_id text references boards(id) on delete cascade,
 *     title text not null, description text default '',
 *     status text check (status in ('To Do','In Progress','Done')),
 *     priority text check (priority in ('Low','Medium','High')),
 *     due_date date not null, assignee jsonb,
 *     comments int default 0, attachments int default 0,
 *     completed_at timestamptz, created_at timestamptz default now()
 *   );
 *
 * REQUIRED ENV VARS on Vercel/Netlify:
 *   VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
 *   — or —
 *   VITE_API_URL
 */

export type ConnectionMode = 'local' | 'cloud';
type Backend = 'supabase' | 'rest' | 'none';

const STORAGE_TASKS = 'nexus.kanban.tasks.v2';
const STORAGE_BOARDS = 'nexus.kanban.boards.v2';
const STORAGE_API_OVERRIDE = 'nexus.config.apiUrl';

function readEnv() {
  let env: Record<string, string | undefined> = {};
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env)
    env = import.meta.env as any;
  } catch {}
  if (typeof process !== 'undefined' && process.env)
  env = { ...process.env, ...env };

  return {
    supabaseUrl: env.VITE_SUPABASE_URL || env.REACT_APP_SUPABASE_URL,
    supabaseKey: env.VITE_SUPABASE_ANON_KEY || env.REACT_APP_SUPABASE_ANON_KEY,
    apiUrl: env.VITE_API_URL || env.REACT_APP_API_URL
  };
}

function getRuntimeApiOverride(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(STORAGE_API_OVERRIDE);
  } catch {
    return null;
  }
}

function getActiveConfig() {
  const env = readEnv();
  const override = getRuntimeApiOverride();
  const apiUrl = override || env.apiUrl;
  if (env.supabaseUrl && env.supabaseKey) {
    return {
      backend: 'supabase' as Backend,
      supabaseUrl: env.supabaseUrl,
      supabaseKey: env.supabaseKey
    };
  }
  if (apiUrl) return { backend: 'rest' as Backend, apiUrl };
  return { backend: 'none' as Backend };
}

export function getBackendInfo() {
  const c = getActiveConfig();
  return { backend: c.backend, hasLiveApi: c.backend !== 'none' };
}

export const HAS_LIVE_API = getBackendInfo().hasLiveApi;

// ---------- LOCAL STORE (localStorage-backed) ----------
function load<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed as T : fallback;
  } catch {
    return fallback;
  }
}
function save<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

let localTasks: Task[] = load<Task[]>(STORAGE_TASKS, [...seedTasks]);
let localBoards: Board[] = load<Board[]>(STORAGE_BOARDS, [...seedBoards]);

const LATENCY = { local: 80, cloud: 320 };
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ---------- Supabase adapter ----------
function supabaseHeaders(key: string): HeadersInit {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
    Prefer: 'return=representation'
  };
}

function taskToRow(task: Partial<Task>): Record<string, unknown> {
  const r: Record<string, unknown> = {};
  if (task.id !== undefined) r.id = task.id;
  if (task.boardId !== undefined) r.board_id = task.boardId;
  if (task.title !== undefined) r.title = task.title;
  if (task.description !== undefined) r.description = task.description;
  if (task.status !== undefined) r.status = task.status;
  if (task.priority !== undefined) r.priority = task.priority;
  if (task.dueDate !== undefined) r.due_date = task.dueDate;
  if (task.assignee !== undefined) r.assignee = task.assignee;
  if (task.comments !== undefined) r.comments = task.comments;
  if (task.attachments !== undefined) r.attachments = task.attachments;
  if (task.completedAt !== undefined) r.completed_at = task.completedAt;
  return r;
}
function taskFromRow(row: Record<string, unknown>): Task {
  return {
    id: String(row.id),
    boardId: String(row.board_id ?? ''),
    title: String(row.title ?? ''),
    description: String(row.description ?? ''),
    status: row.status as Status,
    priority: row.priority as Priority,
    dueDate: String(row.due_date ?? ''),
    assignee: row.assignee as Task['assignee'],
    comments: Number(row.comments ?? 0),
    attachments: Number(row.attachments ?? 0),
    completedAt: row.completed_at ? String(row.completed_at) : undefined
  };
}
function boardToRow(b: Partial<Board>): Record<string, unknown> {
  const r: Record<string, unknown> = {};
  if (b.id !== undefined) r.id = b.id;
  if (b.name !== undefined) r.name = b.name;
  if (b.color !== undefined) r.color = b.color;
  return r;
}
function boardFromRow(row: Record<string, unknown>): Board {
  return {
    id: String(row.id),
    name: String(row.name ?? ''),
    color: String(row.color ?? 'bg-cyan-500'),
    createdAt: String(row.created_at ?? new Date().toISOString().slice(0, 10))
  };
}

async function supabaseReq<T>(path: string, init?: RequestInit): Promise<T> {
  const c = getActiveConfig();
  if (c.backend !== 'supabase') throw new Error('Supabase not configured');
  const res = await fetch(`${c.supabaseUrl}/rest/v1${path}`, {
    ...init,
    headers: { ...supabaseHeaders(c.supabaseKey!), ...(init?.headers ?? {}) }
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(
      `Supabase ${init?.method ?? 'GET'} ${path} (${res.status}): ${body || res.statusText}`
    );
  }
  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}

async function restReq<T>(path: string, init?: RequestInit): Promise<T> {
  const c = getActiveConfig();
  if (c.backend !== 'rest') throw new Error('REST not configured');
  const res = await fetch(`${c.apiUrl}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(
      `API ${init?.method ?? 'GET'} ${path} (${res.status}): ${body || res.statusText}`
    );
  }
  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}

// ---------- Public API ----------
export const taskApi = {
  async list(mode: ConnectionMode, boardId?: string): Promise<Task[]> {
    const c = getActiveConfig();
    if (mode === 'cloud' && c.backend === 'supabase') {
      const filter = boardId ?
      `&board_id=eq.${encodeURIComponent(boardId)}` :
      '';
      const rows = await supabaseReq<Record<string, unknown>[]>(
        `/tasks?select=*&order=created_at.desc${filter}`
      );
      return rows.map(taskFromRow);
    }
    if (mode === 'cloud' && c.backend === 'rest') {
      const q = boardId ? `?boardId=${encodeURIComponent(boardId)}` : '';
      return restReq<Task[]>(`/tasks${q}`);
    }
    await delay(LATENCY[mode]);
    return boardId ?
    localTasks.filter((t) => t.boardId === boardId) :
    [...localTasks];
  },

  async create(mode: ConnectionMode, task: Task): Promise<Task> {
    const c = getActiveConfig();
    if (mode === 'cloud' && c.backend === 'supabase') {
      const [row] = await supabaseReq<Record<string, unknown>[]>('/tasks', {
        method: 'POST',
        body: JSON.stringify(taskToRow(task))
      });
      return taskFromRow(row);
    }
    if (mode === 'cloud' && c.backend === 'rest') {
      return restReq<Task>('/tasks', {
        method: 'POST',
        body: JSON.stringify(task)
      });
    }
    await delay(LATENCY[mode]);
    localTasks = [task, ...localTasks];
    save(STORAGE_TASKS, localTasks);
    return task;
  },

  async update(
  mode: ConnectionMode,
  id: string,
  patch: Partial<Task>)
  : Promise<Task> {
    const c = getActiveConfig();
    if (mode === 'cloud' && c.backend === 'supabase') {
      const [row] = await supabaseReq<Record<string, unknown>[]>(
        `/tasks?id=eq.${encodeURIComponent(id)}`,
        { method: 'PATCH', body: JSON.stringify(taskToRow(patch)) }
      );
      if (!row) throw new Error(`Task ${id} not found`);
      return taskFromRow(row);
    }
    if (mode === 'cloud' && c.backend === 'rest') {
      return restReq<Task>(`/tasks/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(patch)
      });
    }
    await delay(LATENCY[mode]);
    let updated: Task | undefined;
    localTasks = localTasks.map((t) => {
      if (t.id !== id) return t;
      updated = { ...t, ...patch };
      return updated;
    });
    if (!updated) throw new Error(`Task ${id} not found`);
    save(STORAGE_TASKS, localTasks);
    return updated;
  },

  async remove(mode: ConnectionMode, id: string): Promise<void> {
    const c = getActiveConfig();
    if (mode === 'cloud' && c.backend === 'supabase') {
      await supabaseReq<void>(`/tasks?id=eq.${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { Prefer: 'return=minimal' }
      });
      return;
    }
    if (mode === 'cloud' && c.backend === 'rest') {
      await restReq<void>(`/tasks/${id}`, { method: 'DELETE' });
      return;
    }
    await delay(LATENCY[mode]);
    const before = localTasks.length;
    localTasks = localTasks.filter((t) => t.id !== id);
    if (localTasks.length === before) throw new Error(`Task ${id} not found`);
    save(STORAGE_TASKS, localTasks);
  }
};

export const boardApi = {
  async list(mode: ConnectionMode): Promise<Board[]> {
    const c = getActiveConfig();
    if (mode === 'cloud' && c.backend === 'supabase') {
      const rows = await supabaseReq<Record<string, unknown>[]>(
        '/boards?select=*&order=created_at.asc'
      );
      return rows.map(boardFromRow);
    }
    if (mode === 'cloud' && c.backend === 'rest') {
      return restReq<Board[]>('/boards');
    }
    await delay(LATENCY[mode]);
    return [...localBoards];
  },

  async create(mode: ConnectionMode, board: Board): Promise<Board> {
    const c = getActiveConfig();
    if (mode === 'cloud' && c.backend === 'supabase') {
      const [row] = await supabaseReq<Record<string, unknown>[]>('/boards', {
        method: 'POST',
        body: JSON.stringify(boardToRow(board))
      });
      return boardFromRow(row);
    }
    if (mode === 'cloud' && c.backend === 'rest') {
      return restReq<Board>('/boards', {
        method: 'POST',
        body: JSON.stringify(board)
      });
    }
    await delay(LATENCY[mode]);
    localBoards = [...localBoards, board];
    save(STORAGE_BOARDS, localBoards);
    return board;
  },

  async update(
  mode: ConnectionMode,
  id: string,
  patch: Partial<Board>)
  : Promise<Board> {
    const c = getActiveConfig();
    if (mode === 'cloud' && c.backend === 'supabase') {
      const [row] = await supabaseReq<Record<string, unknown>[]>(
        `/boards?id=eq.${encodeURIComponent(id)}`,
        { method: 'PATCH', body: JSON.stringify(boardToRow(patch)) }
      );
      if (!row) throw new Error(`Board ${id} not found`);
      return boardFromRow(row);
    }
    if (mode === 'cloud' && c.backend === 'rest') {
      return restReq<Board>(`/boards/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(patch)
      });
    }
    await delay(LATENCY[mode]);
    let updated: Board | undefined;
    localBoards = localBoards.map((b) => {
      if (b.id !== id) return b;
      updated = { ...b, ...patch };
      return updated;
    });
    if (!updated) throw new Error(`Board ${id} not found`);
    save(STORAGE_BOARDS, localBoards);
    return updated;
  },

  async remove(mode: ConnectionMode, id: string): Promise<void> {
    const c = getActiveConfig();
    if (mode === 'cloud' && c.backend === 'supabase') {
      await supabaseReq<void>(`/boards?id=eq.${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { Prefer: 'return=minimal' }
      });
      return;
    }
    if (mode === 'cloud' && c.backend === 'rest') {
      await restReq<void>(`/boards/${id}`, { method: 'DELETE' });
      return;
    }
    await delay(LATENCY[mode]);
    localBoards = localBoards.filter((b) => b.id !== id);
    localTasks = localTasks.filter((t) => t.boardId !== id);
    save(STORAGE_BOARDS, localBoards);
    save(STORAGE_TASKS, localTasks);
  }
};

export const configApi = {
  getApiOverride: getRuntimeApiOverride,
  setApiOverride(url: string | null) {
    if (typeof window === 'undefined') return;
    try {
      if (url) window.localStorage.setItem(STORAGE_API_OVERRIDE, url);else
      window.localStorage.removeItem(STORAGE_API_OVERRIDE);
    } catch {}
  },
  wipeLocalData() {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(STORAGE_TASKS);
      window.localStorage.removeItem(STORAGE_BOARDS);
    } catch {}
    localTasks = [...seedTasks];
    localBoards = [...seedBoards];
  }
};