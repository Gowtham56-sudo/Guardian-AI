import { processSosAlert, type SosMessageInput } from "../_lib/sos";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const result = await processSosAlert((req.body ?? {}) as SosMessageInput);

    if (!result.ok) {
      return res.status(400).json({
        error: result.diagnostics[0] || "Invalid SOS request",
        diagnostics: result.diagnostics,
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      error: "Unexpected SOS processing failure",
      reason: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
