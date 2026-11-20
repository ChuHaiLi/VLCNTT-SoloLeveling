import express from "express";
import { calculateStatus, STALE_MS } from "./state.mjs";

export function createApp({ getState, setMonitoring })
{
    const app = express();
    app.disable("x-powered-by");

    app.get("/api/status", (_request, response) =>
    {
        const { latest, lastReceivedAt, brokerConnected } = getState();
        const now = Date.now();
        const status = calculateStatus(latest, lastReceivedAt, now, STALE_MS);
        response.set("Cache-Control", "no-store");
        response.json({
            status,
            brokerConnected,
            lastReceivedAt: lastReceivedAt ? new Date(lastReceivedAt).toISOString() : null,
            ageMs: lastReceivedAt ? now - lastReceivedAt : null,
            thresholds: latest ? { on: latest.thresholdOn, off: latest.thresholdOff } : { on: 15, off: 12 },
            reading: status === "stale" ? null : latest,
        });
    });

    app.get("/api/health", (_request, response) =>
    {
        response.json({ service: "tilt-tray-backend", ok: true, brokerConnected: getState().brokerConnected });
    });

    app.post("/api/monitoring", express.json({ limit: "1kb" }), async (request, response) =>
    {
        const body = request.body;
        if (!body || Array.isArray(body) || typeof body.enabled !== "boolean" || Object.keys(body).length !== 1)
        {
            response.status(400).json({ error: "Gửi JSON chỉ gồm enabled: true hoặc false." });
            return;
        }
        response.set("Cache-Control", "no-store");
        try
        {
            response.json(await setMonitoring(body.enabled));
        }
        catch (error)
        {
            response.status(error.statusCode || 500).json({ error: error.message });
        }
    });

    app.use((error, _request, response, _next) =>
    {
        response.status(error.status === 413 ? 413 : 400).json({ error: "JSON không hợp lệ hoặc vượt giới hạn 1 KB." });
    });

    return app;
}
