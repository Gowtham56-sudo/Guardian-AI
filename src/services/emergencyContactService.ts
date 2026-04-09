export interface EmergencyContact {
  name: string;
  relation: string;
  phone: string;
  email?: string;
}

export interface GuardianProfile {
  fullName: string;
  email: string;
  phone: string;
}

const CONTACTS_KEY = 'guardian-emergency-contacts';
const PROFILE_KEY = 'guardian-profile';

const DEFAULT_CONTACTS: EmergencyContact[] = [
  { name: 'Dad', relation: 'Father', phone: '+919876543210', email: 'dad@example.com' },
  { name: 'Mom', relation: 'Mother', phone: '+919876543211', email: 'mom@example.com' },
];

const DEFAULT_PROFILE: GuardianProfile = {
  fullName: 'John Doe',
  email: 'john.doe@guardian.ai',
  phone: '+919876543212',
};

function parseJson<T>(rawValue: string | null, fallback: T): T {
  if (!rawValue) {
    return fallback;
  }

  try {
    return JSON.parse(rawValue) as T;
  } catch {
    return fallback;
  }
}

function sanitizeContacts(rawContacts: EmergencyContact[]): EmergencyContact[] {
  return rawContacts
    .map((contact) => ({
      name: contact.name?.trim() ?? '',
      relation: contact.relation?.trim() ?? '',
      phone: contact.phone?.trim() ?? '',
      email: contact.email?.trim() ?? '',
    }))
    .filter((contact) => contact.name && contact.relation && contact.phone);
}

function sanitizeProfile(rawProfile: Partial<GuardianProfile>): GuardianProfile {
  return {
    fullName: rawProfile.fullName?.trim() || DEFAULT_PROFILE.fullName,
    email: rawProfile.email?.trim() || DEFAULT_PROFILE.email,
    phone: rawProfile.phone?.trim() || DEFAULT_PROFILE.phone,
  };
}

export const emergencyContactService = {
  getEmergencyContacts(): EmergencyContact[] {
    const parsed = parseJson<EmergencyContact[]>(window.localStorage.getItem(CONTACTS_KEY), DEFAULT_CONTACTS);
    const normalized = sanitizeContacts(parsed);
    return normalized.length > 0 ? normalized : DEFAULT_CONTACTS;
  },

  setEmergencyContacts(contacts: EmergencyContact[]): void {
    window.localStorage.setItem(CONTACTS_KEY, JSON.stringify(sanitizeContacts(contacts)));
  },

  getProfile(): GuardianProfile {
    const parsed = parseJson<Partial<GuardianProfile>>(window.localStorage.getItem(PROFILE_KEY), DEFAULT_PROFILE);
    return sanitizeProfile(parsed);
  },

  setProfile(profile: Partial<GuardianProfile>): void {
    const merged = sanitizeProfile({ ...this.getProfile(), ...profile });
    window.localStorage.setItem(PROFILE_KEY, JSON.stringify(merged));
  },
};
