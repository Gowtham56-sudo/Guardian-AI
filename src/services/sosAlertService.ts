import { emergencyContactService } from './emergencyContactService';

interface CoordinatesPayload {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

interface SosAlertPayload {
  triggerSource: 'button' | 'shake' | 'voice';
  coordinates?: CoordinatesPayload;
}

interface SosAlertResponse {
  ok: boolean;
  requestedWhatsappCount: number;
  requestedEmailCount: number;
  deliveredWhatsappCount: number;
  deliveredEmailCount: number;
  simulated: boolean;
  diagnostics?: string[];
}

function createMapLink(coordinates?: CoordinatesPayload): string {
  if (!coordinates) {
    return '';
  }

  return `https://maps.google.com/?q=${coordinates.latitude},${coordinates.longitude}`;
}

export async function sendSosAlert(payload: SosAlertPayload): Promise<SosAlertResponse> {
  const contacts = emergencyContactService.getEmergencyContacts();
  const profile = emergencyContactService.getProfile();

  const phones = contacts.map((contact) => contact.phone).filter(Boolean);
  const emails = [
    ...contacts.map((contact) => contact.email || ''),
    profile.email,
  ].filter(Boolean);

  try {
    const response = await fetch('/api/sos/alert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        triggerSource: payload.triggerSource,
        location: payload.coordinates,
        mapLink: createMapLink(payload.coordinates),
        userName: profile.fullName,
        userPhone: profile.phone,
        recipients: {
          phones,
          emails,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();

      if (response.status === 404) {
        return {
          ok: true,
          requestedWhatsappCount: phones.length,
          requestedEmailCount: emails.length,
          deliveredWhatsappCount: 0,
          deliveredEmailCount: 0,
          simulated: true,
          diagnostics: [
            'SOS backend endpoint is unavailable (404). Running in local simulation mode.',
          ],
        };
      }

      throw new Error(
        `Failed to send SOS alert: ${response.status}${errorText ? ` - ${errorText}` : ''}`
      );
    }

    return response.json() as Promise<SosAlertResponse>;
  } catch (error) {
    return {
      ok: true,
      requestedWhatsappCount: phones.length,
      requestedEmailCount: emails.length,
      deliveredWhatsappCount: 0,
      deliveredEmailCount: 0,
      simulated: true,
      diagnostics: [
        `SOS backend request failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      ],
    };
  }
}
