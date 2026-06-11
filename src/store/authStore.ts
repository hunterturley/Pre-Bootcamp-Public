import { create } from 'zustand';

import { clearSessionToken, getSessionToken, signIn as apiSignIn } from '../api/client';
import { deleteSecure, getSecure, setSecure } from '../storage/secure';

/**
 * Session/auth state. The app is gated on this: until a token is restored or
 * issued, the scan tabs are hidden behind the sign-in screen.
 *
 * v1 auth is intentionally thin (email -> token via the proxy `/auth`
 * endpoint). Phase 3 ties this to real Switchboard accounts.
 */

const EMAIL_KEY = 'switchboard.email';

export type AuthStatus = 'restoring' | 'signedOut' | 'signedIn';

type AuthState = {
  status: AuthStatus;
  email: string | null;
  error: string | null;
  submitting: boolean;

  restore: () => Promise<void>;
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  status: 'restoring',
  email: null,
  error: null,
  submitting: false,

  restore: async () => {
    const token = await getSessionToken();
    if (!token) {
      set({ status: 'signedOut' });
      return;
    }
    const email = await getSecure(EMAIL_KEY);
    set({ status: 'signedIn', email });
  },

  signIn: async (email) => {
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes('@')) {
      set({ error: 'Enter a valid email address.' });
      return;
    }
    set({ submitting: true, error: null });
    try {
      await apiSignIn(trimmed);
      await setSecure(EMAIL_KEY, trimmed);
      set({ status: 'signedIn', email: trimmed, submitting: false });
    } catch (err) {
      set({
        submitting: false,
        error:
          err instanceof Error
            ? `Could not sign in. ${err.message}`
            : 'Could not sign in. Check your connection.',
      });
    }
  },

  signOut: async () => {
    await clearSessionToken();
    await deleteSecure(EMAIL_KEY);
    set({ status: 'signedOut', email: null, error: null });
  },
}));
