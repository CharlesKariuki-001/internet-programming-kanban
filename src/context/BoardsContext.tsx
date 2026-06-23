import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  createContext,
  useContext } from
'react';
import { Board, seedBoards } from '../components/data';
import { boardApi } from '../services/api';
import { useConnection } from './ConnectionContext';
import { useToast } from './ToastContext';
interface BoardsContextValue {
  boards: Board[];
  activeBoardId: string;
  activeBoard: Board | undefined;
  isLoading: boolean;
  setActiveBoardId: (id: string) => void;
  createBoard: (name: string, color?: string) => Promise<Board | null>;
  renameBoard: (id: string, name: string) => Promise<void>;
  deleteBoard: (id: string) => Promise<void>;
}
const BoardsContext = createContext<BoardsContextValue | null>(null);
const ACTIVE_BOARD_KEY = 'nexus.kanban.activeBoard';
const BOARD_COLORS = [
'bg-cyan-500',
'bg-rose-500',
'bg-amber-500',
'bg-emerald-500',
'bg-violet-500',
'bg-pink-500'];

export function BoardsProvider({ children }: {children: React.ReactNode;}) {
  const { mode } = useConnection();
  const { toast } = useToast();
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeBoardId, setActiveBoardIdState] = useState<string>(() => {
    if (typeof window === 'undefined') return seedBoards[0].id;
    return window.localStorage.getItem(ACTIVE_BOARD_KEY) || seedBoards[0].id;
  });
  const boardsRef = useRef<Board[]>([]);
  boardsRef.current = boards;
  const refetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await boardApi.list(mode);
      setBoards(data);
      if (data.length > 0 && !data.find((b) => b.id === activeBoardId)) {
        setActiveBoardIdState(data[0].id);
      }
    } catch (err) {
      toast(
        err instanceof Error ? err.message : 'Failed to load boards',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  }, [mode, activeBoardId, toast]);
  useEffect(() => {
    void refetch();
  }, [mode]);
  const setActiveBoardId = useCallback((id: string) => {
    setActiveBoardIdState(id);
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(ACTIVE_BOARD_KEY, id);
      } catch {}
    }
  }, []);
  const createBoard = useCallback(
    async (name: string, color?: string) => {
      const newBoard: Board = {
        id: `b_${Date.now()}`,
        name: name.trim(),
        color:
        color || BOARD_COLORS[boardsRef.current.length % BOARD_COLORS.length],
        createdAt: new Date().toISOString().slice(0, 10)
      };
      setBoards((prev) => [...prev, newBoard]);
      setActiveBoardId(newBoard.id);
      try {
        await boardApi.create(mode, newBoard);
        toast(`Board "${newBoard.name}" created`, 'success');
        return newBoard;
      } catch (err) {
        setBoards((prev) => prev.filter((b) => b.id !== newBoard.id));
        toast(
          err instanceof Error ? err.message : 'Failed to create board',
          'error'
        );
        return null;
      }
    },
    [mode, setActiveBoardId, toast]
  );
  const renameBoard = useCallback(
    async (id: string, name: string) => {
      const previous = boardsRef.current;
      setBoards((prev) =>
      prev.map((b) =>
      b.id === id ?
      {
        ...b,
        name
      } :
      b
      )
      );
      try {
        await boardApi.update(mode, id, {
          name
        });
        toast('Board renamed', 'success');
      } catch (err) {
        setBoards(previous);
        toast(
          err instanceof Error ? err.message : 'Failed to rename board',
          'error'
        );
      }
    },
    [mode, toast]
  );
  const deleteBoard = useCallback(
    async (id: string) => {
      if (boardsRef.current.length <= 1) {
        toast('Keep at least one board', 'error');
        return;
      }
      const previous = boardsRef.current;
      const target = previous.find((b) => b.id === id);
      setBoards((prev) => prev.filter((b) => b.id !== id));
      if (activeBoardId === id) {
        const next = previous.find((b) => b.id !== id);
        if (next) setActiveBoardId(next.id);
      }
      try {
        await boardApi.remove(mode, id);
        if (target) toast(`Board "${target.name}" deleted`, 'success');
      } catch (err) {
        setBoards(previous);
        toast(
          err instanceof Error ? err.message : 'Failed to delete board',
          'error'
        );
      }
    },
    [mode, activeBoardId, setActiveBoardId, toast]
  );
  const activeBoard = boards.find((b) => b.id === activeBoardId);
  return (
    <BoardsContext.Provider
      value={{
        boards,
        activeBoardId,
        activeBoard,
        isLoading,
        setActiveBoardId,
        createBoard,
        renameBoard,
        deleteBoard
      }}>
      
      {children}
    </BoardsContext.Provider>);

}
export function useBoards() {
  const ctx = useContext(BoardsContext);
  if (!ctx) throw new Error('useBoards must be used within BoardsProvider');
  return ctx;
}