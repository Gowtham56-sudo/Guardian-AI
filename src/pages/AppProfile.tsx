import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { User, Shield, Bell, Lock, Eye, LogOut, ChevronRight, Heart, Smartphone, X } from 'lucide-react';

type SettingsPanel = 'personal' | 'notifications' | 'wearable' | 'privacy' | 'appearance' | null;
type ThemeMode = 'light' | 'dark';

interface WearableDevice {
  id: string;
  name: string;
  battery: number;
}

export default function AppProfile() {
  const [profileName, setProfileName] = useState('John Doe');
  const [statusMessage, setStatusMessage] = useState('');
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeSettingsPanel, setActiveSettingsPanel] = useState<SettingsPanel>(null);
  const [contacts, setContacts] = useState([
    { name: 'Dad', phone: '+1 (555) 000-1234', relation: 'Father' },
    { name: 'Mom', phone: '+1 (555) 000-5678', relation: 'Mother' },
  ]);
  const [newContact, setNewContact] = useState({ name: '', relation: '', phone: '' });
  const [personalInfo, setPersonalInfo] = useState({
    fullName: 'John Doe',
    email: 'john.doe@guardian.ai',
    phone: '+1 (555) 111-2233',
  });
  const [notificationSettings, setNotificationSettings] = useState({
    push: true,
    sms: true,
    email: false,
    communityAlerts: true,
  });
  const [wearableSettings, setWearableSettings] = useState({
    connected: true,
    autoSyncHealth: true,
    fallDetection: true,
    batteryOptimization: false,
  });
  const [connectedWearable, setConnectedWearable] = useState<WearableDevice | null>({
    id: 'guardian-watch',
    name: 'Guardian Watch',
    battery: 85,
  });
  const [isScanningWearables, setIsScanningWearables] = useState(false);
  const [availableWearables, setAvailableWearables] = useState<WearableDevice[]>([]);
  const [privacySettings, setPrivacySettings] = useState({
    biometricLock: true,
    shareSosLocation: true,
    saveLocationHistory: false,
  });
  const [appearanceSettings, setAppearanceSettings] = useState({
    highContrast: false,
    reduceMotion: false,
    textScale: 'normal',
    themeMode: 'light' as ThemeMode,
  });

  useEffect(() => {
    const storedTheme = window.localStorage.getItem('guardian-theme');
    setAppearanceSettings((prev) => ({
      ...prev,
      themeMode: storedTheme === 'dark' ? 'dark' : 'light',
    }));
  }, []);

  const applyThemePreference = (mode: ThemeMode) => {
    window.localStorage.setItem('guardian-theme', mode);
    window.dispatchEvent(new CustomEvent<ThemeMode>('guardian-theme-change', { detail: mode }));
  };

  const openSettingsPanel = (panel: Exclude<SettingsPanel, null>) => {
    setActiveSettingsPanel(panel);
    setIsSettingsOpen(true);
  };

  const closeSettingsPanel = () => {
    setIsSettingsOpen(false);
    setActiveSettingsPanel(null);
  };

  const saveSettingsPanel = () => {
    const panelName =
      activeSettingsPanel === 'personal'
        ? 'Personal Information'
        : activeSettingsPanel === 'notifications'
          ? 'Notification Settings'
          : activeSettingsPanel === 'wearable'
            ? 'Wearable Integration'
            : activeSettingsPanel === 'privacy'
              ? 'Privacy & Security'
              : 'App Appearance';

    if (activeSettingsPanel === 'appearance') {
      applyThemePreference(appearanceSettings.themeMode);
    }

    setStatusMessage(`${panelName} updated successfully.`);
    closeSettingsPanel();
  };

  const menuItems = [
    {
      icon: <User size={20} aria-hidden="true" />,
      label: 'Personal Information',
      color: 'text-blue-700',
      bg: 'bg-blue-50',
      action: () => openSettingsPanel('personal'),
    },
    {
      icon: <Shield size={20} aria-hidden="true" />,
      label: 'Emergency Contacts',
      color: 'text-red-700',
      bg: 'bg-red-50',
      action: () => {
        setIsAddContactOpen(true);
        setStatusMessage('Manage emergency contacts.');
      },
    },
    {
      icon: <Bell size={20} aria-hidden="true" />,
      label: 'Notification Settings',
      color: 'text-amber-800',
      bg: 'bg-amber-50',
      action: () => openSettingsPanel('notifications'),
    },
    {
      icon: <Smartphone size={20} aria-hidden="true" />,
      label: 'Wearable Integration',
      color: 'text-purple-800',
      bg: 'bg-purple-50',
      action: () => openSettingsPanel('wearable'),
    },
    {
      icon: <Lock size={20} aria-hidden="true" />,
      label: 'Privacy & Security',
      color: 'text-green-800',
      bg: 'bg-green-50',
      action: () => openSettingsPanel('privacy'),
    },
    {
      icon: <Eye size={20} aria-hidden="true" />,
      label: 'App Appearance',
      color: 'text-slate-700',
      bg: 'bg-slate-50',
      action: () => openSettingsPanel('appearance'),
    },
  ];

  const handleEditProfile = () => {
    const enteredName = window.prompt('Update your display name:', profileName);
    if (!enteredName) {
      return;
    }

    const trimmedName = enteredName.trim();
    if (!trimmedName) {
      setStatusMessage('Name cannot be empty.');
      return;
    }

    setProfileName(trimmedName);
    setPersonalInfo((prev) => ({ ...prev, fullName: trimmedName }));
    setStatusMessage('Profile name updated successfully.');
  };

  const handleAddContact = () => {
    const { name, relation, phone } = newContact;
    if (!name.trim() || !relation.trim() || !phone.trim()) {
      setStatusMessage('Please fill in all contact fields.');
      return;
    }

    setContacts((prev) => [
      ...prev,
      {
        name: name.trim(),
        relation: relation.trim(),
        phone: phone.trim(),
      },
    ]);

    setNewContact({ name: '', relation: '', phone: '' });
    setIsAddContactOpen(false);
    setStatusMessage('Trusted contact added successfully.');
  };

  const handleContactAction = (name: string) => {
    setStatusMessage(`${name} details opened.`);
  };

  const handleLogout = () => {
    const shouldLogout = window.confirm('Do you want to logout from GuardianAI?');
    if (!shouldLogout) {
      return;
    }

    setStatusMessage('Logged out successfully.');
  };

  const scanWearableDevices = () => {
    setIsScanningWearables(true);
    setStatusMessage('Scanning for nearby wearable devices...');

    window.setTimeout(() => {
      setAvailableWearables([
        { id: 'guardian-watch-v2', name: 'Guardian Watch v2', battery: 92 },
        { id: 'safeband-x', name: 'SafeBand X', battery: 67 },
        { id: 'pulse-ring-pro', name: 'Pulse Ring Pro', battery: 54 },
      ]);
      setIsScanningWearables(false);
      setStatusMessage('Scan complete. Select a device to connect.');
    }, 1200);
  };

  const connectWearableDevice = (device: WearableDevice) => {
    setConnectedWearable(device);
    setWearableSettings((prev) => ({ ...prev, connected: true }));
    setStatusMessage(`${device.name} connected successfully.`);
  };

  const disconnectWearableDevice = () => {
    setConnectedWearable(null);
    setWearableSettings((prev) => ({ ...prev, connected: false }));
    setStatusMessage('Wearable device disconnected.');
  };

  const initials = profileName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col gap-8 pb-24"
    >
      <h1 className="text-2xl font-bold text-slate-900">Profile</h1>

      {statusMessage && (
        <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-800">
          {statusMessage}
        </div>
      )}

      {/* Profile Header */}
      <div className="flex flex-col items-center gap-4 py-4">
        <div className="relative">
          <div className="h-24 w-24 rounded-full bg-blue-700 flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-xl">
            {initials || 'GU'}
          </div>
          <button
            onClick={handleEditProfile}
            aria-label="Edit Profile Picture"
            className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-white shadow-lg border border-slate-100 flex items-center justify-center text-blue-700 hover:bg-slate-50 transition-colors"
          >
            <User size={16} aria-hidden="true" />
          </button>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-900">{profileName}</h2>
          <p className="text-sm text-slate-600">Guardian ID: #G-8829</p>
        </div>
      </div>

      {/* Safety Score Card */}
      <div className="rounded-3xl bg-gradient-to-br from-blue-700 to-blue-800 p-6 text-white shadow-xl shadow-blue-200" role="region" aria-label="Safety Performance">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium opacity-90 uppercase tracking-widest">Safety Score</span>
          <Heart size={20} fill="white" aria-hidden="true" />
        </div>
        <div className="flex items-end gap-2">
          <span className="text-4xl font-bold">98</span>
          <span className="text-lg opacity-90 mb-1" aria-label="out of 100">/ 100</span>
        </div>
        <p className="mt-4 text-xs opacity-90 leading-relaxed">
          Your safety score is excellent. You've shared your trip 12 times this week and updated your emergency contacts recently.
        </p>
      </div>

      {/* Trusted Contacts Section */}
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-slate-900">Trusted Contacts</h2>
          <button
            onClick={() => setIsAddContactOpen(true)}
            className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
          >
            + Add New
          </button>
        </div>
        <div className="space-y-3">
          {contacts.map((contact, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                  {contact.name[0]}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{contact.name}</p>
                  <p className="text-[10px] text-slate-500">{contact.relation} • {contact.phone}</p>
                </div>
              </div>
              <button
                onClick={() => handleContactAction(contact.name)}
                className="text-slate-400 hover:text-red-500 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Wearable Status */}
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <Smartphone size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">{connectedWearable?.name ?? 'No Device Connected'}</p>
            <p className={`text-xs font-medium ${wearableSettings.connected ? 'text-green-600' : 'text-slate-500'}`}>
              {wearableSettings.connected
                ? `Connected • ${connectedWearable?.battery ?? 0}% Battery`
                : 'Disconnected'}
            </p>
          </div>
        </div>
        <div className={`h-2 w-2 rounded-full ${wearableSettings.connected ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`} />
      </div>

      {/* Menu List */}
      <div className="space-y-2">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={item.action}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-white shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-xl ${item.bg} ${item.color}`}>
                {item.icon}
              </div>
              <span className="font-semibold text-slate-700">{item.label}</span>
            </div>
            <ChevronRight size={20} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
          </button>
        ))}
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-red-50 text-red-700 font-bold hover:bg-red-100 transition-colors"
      >
        <LogOut size={20} aria-hidden="true" />
        Logout
      </button>

      <AnimatePresence>
        {isAddContactOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-end justify-center p-4"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="w-full max-w-md rounded-t-[40px] bg-white p-8 pb-12 space-y-5"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Add Trusted Contact</h2>
                <button
                  onClick={() => setIsAddContactOpen(false)}
                  className="rounded-full bg-slate-100 p-2 text-slate-500"
                  aria-label="Close Add Contact"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-3">
                <input
                  value={newContact.name}
                  onChange={(event) => setNewContact((prev) => ({ ...prev, name: event.target.value }))}
                  placeholder="Contact Name"
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <input
                  value={newContact.relation}
                  onChange={(event) => setNewContact((prev) => ({ ...prev, relation: event.target.value }))}
                  placeholder="Relationship"
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <input
                  value={newContact.phone}
                  onChange={(event) => setNewContact((prev) => ({ ...prev, phone: event.target.value }))}
                  placeholder="Phone Number"
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsAddContactOpen(false)}
                  className="flex-1 rounded-2xl bg-slate-100 py-4 text-sm font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddContact}
                  className="flex-1 rounded-2xl bg-blue-700 py-4 text-sm font-bold text-white shadow-lg shadow-blue-200"
                >
                  Save Contact
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSettingsOpen && activeSettingsPanel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-sm flex items-end justify-center p-4"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="w-full max-w-md rounded-t-[40px] bg-white p-8 pb-12 space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">
                  {activeSettingsPanel === 'personal' && 'Personal Information'}
                  {activeSettingsPanel === 'notifications' && 'Notification Settings'}
                  {activeSettingsPanel === 'wearable' && 'Wearable Integration'}
                  {activeSettingsPanel === 'privacy' && 'Privacy & Security'}
                  {activeSettingsPanel === 'appearance' && 'App Appearance'}
                </h2>
                <button
                  onClick={closeSettingsPanel}
                  className="rounded-full bg-slate-100 p-2 text-slate-500"
                  aria-label="Close Settings"
                >
                  <X size={20} />
                </button>
              </div>

              {activeSettingsPanel === 'personal' && (
                <div className="space-y-3">
                  <input
                    value={personalInfo.fullName}
                    onChange={(event) => setPersonalInfo((prev) => ({ ...prev, fullName: event.target.value }))}
                    placeholder="Full Name"
                    className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <input
                    value={personalInfo.email}
                    onChange={(event) => setPersonalInfo((prev) => ({ ...prev, email: event.target.value }))}
                    placeholder="Email"
                    className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <input
                    value={personalInfo.phone}
                    onChange={(event) => setPersonalInfo((prev) => ({ ...prev, phone: event.target.value }))}
                    placeholder="Phone"
                    className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              )}

              {activeSettingsPanel === 'notifications' && (
                <div className="space-y-3">
                  <label className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    Push Notifications
                    <input
                      type="checkbox"
                      checked={notificationSettings.push}
                      onChange={(event) => setNotificationSettings((prev) => ({ ...prev, push: event.target.checked }))}
                    />
                  </label>
                  <label className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    SMS Alerts
                    <input
                      type="checkbox"
                      checked={notificationSettings.sms}
                      onChange={(event) => setNotificationSettings((prev) => ({ ...prev, sms: event.target.checked }))}
                    />
                  </label>
                  <label className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    Email Alerts
                    <input
                      type="checkbox"
                      checked={notificationSettings.email}
                      onChange={(event) => setNotificationSettings((prev) => ({ ...prev, email: event.target.checked }))}
                    />
                  </label>
                  <label className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    Community Alert Updates
                    <input
                      type="checkbox"
                      checked={notificationSettings.communityAlerts}
                      onChange={(event) => setNotificationSettings((prev) => ({ ...prev, communityAlerts: event.target.checked }))}
                    />
                  </label>
                </div>
              )}

              {activeSettingsPanel === 'wearable' && (
                <div className="space-y-3">
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <p className="text-sm font-semibold text-slate-800">
                      {connectedWearable ? `Connected: ${connectedWearable.name}` : 'No wearable connected'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {connectedWearable ? `${connectedWearable.battery}% battery remaining` : 'Scan and connect a nearby wearable device.'}
                    </p>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={scanWearableDevices}
                        className="flex-1 rounded-xl bg-blue-700 py-2 text-xs font-bold text-white"
                        disabled={isScanningWearables}
                      >
                        {isScanningWearables ? 'Scanning...' : 'Scan Devices'}
                      </button>
                      <button
                        onClick={disconnectWearableDevice}
                        className="flex-1 rounded-xl bg-red-50 py-2 text-xs font-bold text-red-700"
                        disabled={!connectedWearable}
                      >
                        Disconnect
                      </button>
                    </div>
                  </div>

                  {availableWearables.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Available Devices</p>
                      {availableWearables.map((device) => (
                        <div
                          key={device.id}
                          className="rounded-2xl border border-slate-100 bg-white px-4 py-3 flex items-center justify-between"
                        >
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{device.name}</p>
                            <p className="text-xs text-slate-500">Battery {device.battery}%</p>
                          </div>
                          <button
                            onClick={() => connectWearableDevice(device)}
                            className="rounded-lg bg-purple-100 px-3 py-1 text-xs font-bold text-purple-800"
                          >
                            Connect
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <label className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    Auto Sync Health Data
                    <input
                      type="checkbox"
                      checked={wearableSettings.autoSyncHealth}
                      onChange={(event) => setWearableSettings((prev) => ({ ...prev, autoSyncHealth: event.target.checked }))}
                    />
                  </label>
                  <label className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    Fall Detection
                    <input
                      type="checkbox"
                      checked={wearableSettings.fallDetection}
                      onChange={(event) => setWearableSettings((prev) => ({ ...prev, fallDetection: event.target.checked }))}
                    />
                  </label>
                  <label className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    Battery Optimization
                    <input
                      type="checkbox"
                      checked={wearableSettings.batteryOptimization}
                      onChange={(event) => setWearableSettings((prev) => ({ ...prev, batteryOptimization: event.target.checked }))}
                    />
                  </label>
                </div>
              )}

              {activeSettingsPanel === 'privacy' && (
                <div className="space-y-3">
                  <label className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    Biometric Lock
                    <input
                      type="checkbox"
                      checked={privacySettings.biometricLock}
                      onChange={(event) => setPrivacySettings((prev) => ({ ...prev, biometricLock: event.target.checked }))}
                    />
                  </label>
                  <label className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    Share SOS Location
                    <input
                      type="checkbox"
                      checked={privacySettings.shareSosLocation}
                      onChange={(event) => setPrivacySettings((prev) => ({ ...prev, shareSosLocation: event.target.checked }))}
                    />
                  </label>
                  <label className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    Save Location History
                    <input
                      type="checkbox"
                      checked={privacySettings.saveLocationHistory}
                      onChange={(event) => setPrivacySettings((prev) => ({ ...prev, saveLocationHistory: event.target.checked }))}
                    />
                  </label>
                </div>
              )}

              {activeSettingsPanel === 'appearance' && (
                <div className="space-y-3">
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <p className="text-sm text-slate-700 mb-2">Theme</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setAppearanceSettings((prev) => ({ ...prev, themeMode: 'light' }))}
                        className={`rounded-xl py-2 text-xs font-bold ${appearanceSettings.themeMode === 'light' ? 'bg-blue-700 text-white' : 'bg-white text-slate-700 border border-slate-200'}`}
                      >
                        Light Theme
                      </button>
                      <button
                        onClick={() => setAppearanceSettings((prev) => ({ ...prev, themeMode: 'dark' }))}
                        className={`rounded-xl py-2 text-xs font-bold ${appearanceSettings.themeMode === 'dark' ? 'bg-blue-700 text-white' : 'bg-white text-slate-700 border border-slate-200'}`}
                      >
                        Dark Theme
                      </button>
                    </div>
                  </div>
                  <label className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    High Contrast Mode
                    <input
                      type="checkbox"
                      checked={appearanceSettings.highContrast}
                      onChange={(event) => setAppearanceSettings((prev) => ({ ...prev, highContrast: event.target.checked }))}
                    />
                  </label>
                  <label className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    Reduce Motion
                    <input
                      type="checkbox"
                      checked={appearanceSettings.reduceMotion}
                      onChange={(event) => setAppearanceSettings((prev) => ({ ...prev, reduceMotion: event.target.checked }))}
                    />
                  </label>
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <p className="text-sm text-slate-700 mb-2">Text Size</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setAppearanceSettings((prev) => ({ ...prev, textScale: 'normal' }))}
                        className={`rounded-xl py-2 text-xs font-bold ${appearanceSettings.textScale === 'normal' ? 'bg-blue-700 text-white' : 'bg-white text-slate-700 border border-slate-200'}`}
                      >
                        Normal
                      </button>
                      <button
                        onClick={() => setAppearanceSettings((prev) => ({ ...prev, textScale: 'large' }))}
                        className={`rounded-xl py-2 text-xs font-bold ${appearanceSettings.textScale === 'large' ? 'bg-blue-700 text-white' : 'bg-white text-slate-700 border border-slate-200'}`}
                      >
                        Large
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={closeSettingsPanel}
                  className="flex-1 rounded-2xl bg-slate-100 py-4 text-sm font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={saveSettingsPanel}
                  className="flex-1 rounded-2xl bg-blue-700 py-4 text-sm font-bold text-white shadow-lg shadow-blue-200"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
