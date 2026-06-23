import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  Cloud,
  Database,
  Save,
  Trash2,
  User as UserIcon } from
'lucide-react';
import { AVATAR_COLORS, useProfile } from '../context/ProfileContext';
import { Toggle } from '../components/Toggle';
import { useToast } from '../context/ToastContext';
import { configApi, getBackendInfo } from '../services/api';
export function Settings() {
  const { profile, notifications, updateProfile, updateNotifications } =
  useProfile();
  const { toast } = useToast();
  const backend = getBackendInfo();
  const [name, setName] = useState(profile.name);
  const [apiUrl, setApiUrl] = useState<string>(configApi.getApiOverride() || '');
  const [wipeConfirm, setWipeConfirm] = useState(false);
  const handleSaveProfile = () => {
    updateProfile({
      name
    });
    toast('Profile saved', 'success');
  };
  const handleSaveApiUrl = () => {
    const trimmed = apiUrl.trim();
    configApi.setApiOverride(trimmed || null);
    toast(
      trimmed ?
      'API URL saved · reload to apply' :
      'API URL cleared · reload to apply',
      'success'
    );
  };
  const handleWipe = () => {
    if (!wipeConfirm) {
      setWipeConfirm(true);
      window.setTimeout(() => setWipeConfirm(false), 4000);
      return;
    }
    configApi.wipeLocalData();
    toast('Local data wiped. Reloading…', 'success');
    window.setTimeout(() => window.location.reload(), 600);
  };
  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
      <div className="max-w-3xl mx-auto flex flex-col gap-5">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Settings
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Manage your profile, notifications, and backend connection.
          </p>
        </div>

        {/* Profile */}
        <SettingsSection
          icon={<UserIcon className="w-4 h-4" />}
          title="Profile"
          description="Your identity in this workspace.">
          
          <div className="flex items-center gap-4">
            <div
              className={`w-16 h-16 rounded-full bg-gradient-to-br ${profile.color} flex items-center justify-center text-white text-lg font-semibold shadow-lg`}>
              
              {profile.initials}
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Display name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-lg bg-[#0a0a0c] border border-white/10 text-sm text-white outline-none focus:border-cyan-400/50 focus:shadow-[0_0_0_3px_rgba(34,211,238,0.1)] transition-all" />
              
            </div>
          </div>
          <div className="mt-4">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Avatar color
            </label>
            <div className="mt-2 flex gap-2 flex-wrap">
              {AVATAR_COLORS.map((c) =>
              <button
                key={c}
                onClick={() =>
                updateProfile({
                  color: c
                })
                }
                className={`w-9 h-9 rounded-full bg-gradient-to-br ${c} ring-offset-2 ring-offset-[#16161a] transition-all ${profile.color === c ? 'ring-2 ring-white scale-110' : 'hover:scale-110'}`}
                aria-label={`Select color ${c}`} />

              )}
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSaveProfile}
              disabled={name.trim() === profile.name}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 text-sm font-semibold transition-all shadow-[0_0_12px_rgba(34,211,238,0.3)]">
              
              <Save className="w-3.5 h-3.5" />
              Save profile
            </button>
          </div>
        </SettingsSection>

        {/* Notifications */}
        <SettingsSection
          icon={<Bell className="w-4 h-4" />}
          title="Notifications"
          description="Where you'd like to hear about activity.">
          
          <div className="divide-y divide-white/5">
            <Toggle
              checked={notifications.email}
              onChange={(v) =>
              updateNotifications({
                email: v
              })
              }
              label="Email notifications"
              description="Daily summary and task assignments via email." />
            
            <Toggle
              checked={notifications.desktop}
              onChange={(v) =>
              updateNotifications({
                desktop: v
              })
              }
              label="Desktop notifications"
              description="Real-time browser notifications for due tasks." />
            
          </div>
        </SettingsSection>

        {/* Connection */}
        <SettingsSection
          icon={<Cloud className="w-4 h-4" />}
          title="Backend connection"
          description="Configure where Cloud Sync points to.">
          
          <div className="flex items-center justify-between mb-3 px-3 py-2.5 rounded-lg bg-white/5 border border-white/5">
            <div className="flex items-center gap-2 text-sm">
              <span
                className={`w-1.5 h-1.5 rounded-full ${backend.hasLiveApi ? 'bg-emerald-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]' : 'bg-slate-500'}`} />
              
              <span className="text-slate-200">
                {backend.hasLiveApi ?
                `Connected (${backend.backend})` :
                'No backend configured'}
              </span>
            </div>
            <span className="text-xs text-slate-500">
              {backend.hasLiveApi ? 'Cloud Sync ready' : 'Local Mode only'}
            </span>
          </div>
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Custom API URL override
          </label>
          <div className="mt-1 flex gap-2">
            <input
              type="url"
              placeholder="https://api.your-domain.com"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg bg-[#0a0a0c] border border-white/10 text-sm text-white placeholder:text-slate-500 outline-none focus:border-cyan-400/50 focus:shadow-[0_0_0_3px_rgba(34,211,238,0.1)] transition-all" />
            
            <button
              onClick={handleSaveApiUrl}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-sm font-semibold transition-all shadow-[0_0_12px_rgba(34,211,238,0.3)]">
              
              <Save className="w-3.5 h-3.5" />
              Save
            </button>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            Overrides <code className="text-slate-400">VITE_API_URL</code> at
            runtime. Useful for switching between staging and production without
            rebuilding. Reload required.
          </p>
        </SettingsSection>

        {/* Danger zone */}
        <SettingsSection
          icon={<Database className="w-4 h-4" />}
          title="Local data"
          description="Manage data persisted to this browser.">
          
          <button
            onClick={handleWipe}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-all ${wipeConfirm ? 'bg-rose-400/15 border-rose-400/40 text-rose-300 shadow-[0_0_12px_rgba(251,113,133,0.3)]' : 'bg-white/5 border-white/10 text-slate-300 hover:border-rose-400/30 hover:text-rose-400'}`}>
            
            <Trash2 className="w-3.5 h-3.5" />
            {wipeConfirm ?
            'Tap again to confirm — wipes all local boards & tasks' :
            'Wipe all local mock data'}
          </button>
          <p className="mt-2 text-[11px] text-slate-500">
            Clears tasks and boards from this browser's local storage.
            Cloud-synced data is not affected.
          </p>
        </SettingsSection>
      </div>
    </div>);

}
function SettingsSection({
  icon,
  title,
  description,
  children





}: {icon: React.ReactNode;title: string;description: string;children: React.ReactNode;}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 8
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      className="rounded-2xl bg-[#16161a] border border-white/5 p-5">
      
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-cyan-400/10 text-cyan-400 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <div className="text-sm font-semibold text-white">{title}</div>
          <div className="text-xs text-slate-500">{description}</div>
        </div>
      </div>
      <div>{children}</div>
    </motion.div>);

}