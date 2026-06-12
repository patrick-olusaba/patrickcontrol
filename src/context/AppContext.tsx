// ============================================================
// PatrickControl – App Context
// All shared state lives here. Access via useAppContext().
// ============================================================

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from 'react';
import type { Post, Comment, Hashtag, TeamMember, HashtagBundle } from '../types/types';
import {
  apiGetPosts,
  apiGetComments,
  apiGetHashtags,
  apiGetTeam,
  apiGetBundles,
  apiAddPost,
  apiUpdatePost,
  apiDeletePost,
  apiReplyComment,
} from '../services/api';

// ── State shape ────────────────────────────────────────────
interface AppState {
  posts: Post[];
  comments: Comment[];
  hashtags: Hashtag[];
  teamMembers: TeamMember[];
  hashtagBundles: HashtagBundle[];
  loading: boolean;
  toast: string | null;
}

const initialState: AppState = {
  posts: [],
  comments: [],
  hashtags: [],
  teamMembers: [],
  hashtagBundles: [],
  loading: true,
  toast: null,
};

// ── Actions ────────────────────────────────────────────────
type Action =
  | { type: 'INIT'; payload: Omit<AppState, 'loading' | 'toast'> }
  | { type: 'ADD_POST'; payload: Post }
  | { type: 'UPDATE_POST'; payload: Post }
  | { type: 'DELETE_POST'; id: string }
  | { type: 'REPLY_COMMENT'; id: string }
  | { type: 'SHOW_TOAST'; message: string }
  | { type: 'HIDE_TOAST' };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'INIT':
      return { ...state, ...action.payload, loading: false };

    case 'ADD_POST':
      return { ...state, posts: [action.payload, ...state.posts] };

    case 'UPDATE_POST':
      return {
        ...state,
        posts: state.posts.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
      };

    case 'DELETE_POST':
      return { ...state, posts: state.posts.filter((p) => p.id !== action.id) };

    case 'REPLY_COMMENT':
      return {
        ...state,
        comments: state.comments.map((c) =>
          c.id === action.id ? { ...c, replied: true } : c
        ),
      };

    case 'SHOW_TOAST':
      return { ...state, toast: action.message };

    case 'HIDE_TOAST':
      return { ...state, toast: null };

    default:
      return state;
  }
}

// ── Context ────────────────────────────────────────────────
interface AppContextValue {
  state: AppState;
  addPost: (post: Post) => void;
  updatePost: (post: Post) => void;
  deletePost: (id: string) => void;
  replyComment: (id: string) => void;
  showToast: (message: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load data on mount (Firebase with mock fallback)
  useEffect(() => {
    const load = async () => {
      const [posts, comments, hashtags, teamMembers, hashtagBundles] =
        await Promise.all([
          apiGetPosts(),
          apiGetComments(),
          apiGetHashtags(),
          apiGetTeam(),
          apiGetBundles(),
        ]);
      dispatch({ type: 'INIT', payload: { posts, comments, hashtags, teamMembers, hashtagBundles } });
    };
    load();
  }, []);

  // Sync mutations to Firebase when configured
  const addPost = async (post: Post) => {
    dispatch({ type: 'ADD_POST', payload: post });
    apiAddPost(post);
  };

  const updatePost = async (post: Post) => {
    dispatch({ type: 'UPDATE_POST', payload: post });
    apiUpdatePost(post);
  };

  const deletePost = async (id: string) => {
    dispatch({ type: 'DELETE_POST', id });
    apiDeletePost(id);
  };

  const replyComment = async (id: string) => {
    dispatch({ type: 'REPLY_COMMENT', id });
    apiReplyComment(id);
  };

  // Auto-dismiss toast after 3 seconds
  useEffect(() => {
    if (!state.toast) return;
    const t = setTimeout(() => dispatch({ type: 'HIDE_TOAST' }), 3000);
    return () => clearTimeout(t);
  }, [state.toast]);

  const value: AppContextValue = {
    state,
    addPost,
    updatePost,
    deletePost,
    replyComment,
    showToast: (message) => dispatch({ type: 'SHOW_TOAST', message }),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook — throws if used outside provider
export const useAppContext = (): AppContextValue => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used inside AppProvider');
  return ctx;
};
