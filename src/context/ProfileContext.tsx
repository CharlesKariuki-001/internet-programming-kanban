import React, {
  useCallback,
  useEffect,
  useState,
  createContext,
  useContext } from
'react';
export interface UserProfile {
  name: string;
  initials: string;
  color: string;
}
export interface NotificationSettings {
  email: boolean;
  desktop: boolean;
}
interface ProfileContextValue {
  profile: UserProfile;
  notifications: NotificationSettings;
  updateProfile: (patch: Partial<UserProfile>) => void;
  updateNotifications: (patch: Partial<NotificationSettings>) => void;
}
const ProfileContext = createContext<ProfileContextValue | null>(null);
const STORAGE_KEY = 'nexus.profile.v1';
const DEFAULT_PROFILE: UserProfile = {
  name: 'My Workspace',
  initials: 'ME',
  color: 'from-indigo-500 to-purple-600'
};
const DEFAULT_NOTIFICATIONS: NotificationSettings = {
  email: true,
  desktop: false
};
interface PersistedProfile {
  profile: UserProfile;
  notifications: NotificationSettings;
}
function load(): PersistedProfile {
  if (typeof window === 'undefined')
  return {
    profile: DEFAULT_PROFILE,
    notifications: DEFAULT_NOTIFICATIONS
  };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw)
    return {
      profile: DEFAULT_PROFILE,
      notifications: DEFAULT_NOTIFICATIONS
    };
    const parsed = JSON.parse(raw);
    return {
      profile: {
        ...DEFAULT_PROFILE,
        ...(parsed.profile ?? {})
      },
      notifications: {
        ...DEFAULT_NOTIFICATIONS,
        ...(parsed.notifications ?? {})
      }
    };
  } catch {
    return {
      profile: DEFAULT_PROFILE,
      notifications: DEFAULT_NOTIFICATIONS
    };
  }
}
export function ProfileProvider({ children }: {children: React.ReactNode;}) {
  const initial = load();
  const [profile, setProfile] = useState<UserProfile>(initial.profile);
  const [notifications, setNotifications] = useState<NotificationSettings>(
    initial.notifications
  );
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          profile,
          notifications
        })
      );
    } catch {}
  }, [profile, notifications]);
  const updateProfile = useCallback((patch: Partial<UserProfile>) => {
    setProfile((prev) => {
      const next = {
        ...prev,
        ...patch
      };
      // Auto-derive initials from name when name changes and initials not explicitly set
      if (patch.name && !patch.initials) {
        const words = patch.name.trim().split(/\s+/).filter(Boolean);
        next.initials =
        words.length === 0 ?
        'ME' :
        (words.length === 1 ?
        words[0].slice(0, 2) :
        words[0][0] + words[1][0]).
        toUpperCase();
      }
      return next;
    });
  }, []);
  const updateNotifications = useCallback(
    (patch: Partial<NotificationSettings>) => {
      setNotifications((prev) => ({
        ...prev,
        ...patch
      }));
    },
    []
  );
  return (
    <ProfileContext.Provider
      value={{
        profile,
        notifications,
        updateProfile,
        updateNotifications
      }}>
      
      {children}
    </ProfileContext.Provider>);

}
export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider');
  return ctx;
}
export const AVATAR_COLORS = [
'from-indigo-500 to-purple-600',
'from-cyan-500 to-blue-600',
'from-emerald-500 to-teal-600',
'from-rose-500 to-pink-600',
'from-amber-500 to-orange-600',
'from-violet-500 to-fuchsia-600'];