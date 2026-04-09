<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/ae0bbc08-7cc4-4293-922b-ff4716cc9552

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. (Optional for SOS alerts) Configure WhatsApp and email providers in `.env.local`:
   - WhatsApp via smsalert.co:
      - `SMSALERT_WHATSAPP_API_KEY`
      - `SMSALERT_WHATSAPP_SENDER_ID`
      - `SMSALERT_WHATSAPP_ROUTE` (optional; defaults to `whatsapp`)
      - `SMSALERT_WHATSAPP_URL` (optional; defaults to `https://www.smsalert.co.in/api/mwhatsapp.php`)
      - `SMSALERT_WHATSAPP_DEFAULT_COUNTRY_CODE` (optional; defaults to `91`)
      - `SMSALERT_WHATSAPP_TEXT_PARAM` (optional; defaults to `text`)
      - `SMSALERT_WHATSAPP_APIKEY_PARAM` (optional; defaults to `apikey`)
      - `SMSALERT_WHATSAPP_MOBILE_PARAM` (optional; defaults to `mobileno`)
      - `SMSALERT_WHATSAPP_SENDER_PARAM` (optional; defaults to `sender`)
      - `SMSALERT_WHATSAPP_ROUTE_PARAM` (optional; defaults to `route`)
    - Email via EmailJS:
       - `EMAILJS_SERVICE_ID`
       - `EMAILJS_TEMPLATE_ID`
       - `EMAILJS_PUBLIC_KEY`
       - `EMAILJS_PRIVATE_KEY` (optional)
       - `EMAILJS_FROM_NAME` (optional; defaults to `GuardianAI Alerts`)
5. Run the app:
   `npm run dev`

## SOS Alert Delivery Notes

- If smsalert.co WhatsApp settings are not configured, WhatsApp alerts are not delivered.
- If EmailJS settings are not configured, email alerts are not delivered.
- The app reports partial delivery when only some channels succeed, and falls back to a simulated success when no configured channel delivers.

## Vercel Deployment Notes

- Deploy the project root (not only the `dist` folder), so Vercel can deploy both frontend and serverless API routes under `api/`.
- Required Vercel environment variable:
   - `GEMINI_API_KEY`
- Optional Vercel environment variables for SOS channels:
   - `EMAILJS_SERVICE_ID`
   - `EMAILJS_TEMPLATE_ID`
   - `EMAILJS_PUBLIC_KEY`
   - `EMAILJS_PRIVATE_KEY`
   - `EMAILJS_FROM_NAME`
   - `SMSALERT_WHATSAPP_API_KEY`
   - `SMSALERT_WHATSAPP_SENDER_ID`
   - `SMSALERT_WHATSAPP_ROUTE`
   - `SMSALERT_WHATSAPP_URL`
   - `SMSALERT_WHATSAPP_DEFAULT_COUNTRY_CODE`
   - `SMSALERT_WHATSAPP_TEXT_PARAM`
   - `SMSALERT_WHATSAPP_APIKEY_PARAM`
   - `SMSALERT_WHATSAPP_MOBILE_PARAM`
   - `SMSALERT_WHATSAPP_SENDER_PARAM`
   - `SMSALERT_WHATSAPP_ROUTE_PARAM`

## Gemini API key blocked (403 PERMISSION_DENIED)

If you see an error like "Your API key was reported as leaked", that key has been blocked by Google and cannot be reused.

1. Revoke/delete the compromised key in Google AI Studio.
2. Create a new Gemini API key.
3. Update `GEMINI_API_KEY` in your deployment environment (for Vercel: Project Settings -> Environment Variables).
4. Redeploy so serverless functions pick up the new key.

Never commit real secrets into repository files such as `.env.example`.
