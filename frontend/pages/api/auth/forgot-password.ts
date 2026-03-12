/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from "next";

const getBackendUrl = () => {
  if (process.env.NODE_ENV === "production" && process.env.BACKEND_URL) {
    return process.env.BACKEND_URL;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("BACKEND_URL environment variable is required in production");
  }

  return "http://127.0.0.1:5000";
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const BACKEND_URL = getBackendUrl();
    const backendRes = await fetch(`${BACKEND_URL}/api/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const data = await backendRes.json();
    return res.status(backendRes.status).json(data);
  } catch (err: any) {
    let errorMessage = "Unable to process forgot password request.";

    if (err.message?.includes("ECONNREFUSED") || err.message?.includes("fetch failed")) {
      errorMessage = "Cannot connect to authentication service. Please check if the backend server is running.";
    }

    return res.status(500).json({ success: false, message: errorMessage });
  }
}
