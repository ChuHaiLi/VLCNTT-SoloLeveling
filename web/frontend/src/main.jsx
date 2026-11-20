import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const LABELS = {
    safe: "Bình thường",
    alarm: "Vượt ngưỡng",
    "sensor-error": "Lỗi cảm biến",
    stale: "Mất dữ liệu",
    paused: "Đã tạm dừng",
    "angle-only": "Chỉ gửi góc",
};

function AlertSettings({ reading, thresholds, canSave, pending, feedback, onSave })
{
    const [draft, setDraft] = useState(null);
    const supportsSettings = typeof reading?.alertsEnabled === "boolean";
    const saved = {
        alertsEnabled: reading?.alertsEnabled ?? true,
        thresholdOn: String(thresholds?.on ?? 15),
        thresholdOff: String(thresholds?.off ?? 12),
    };
    const values = draft ?? saved;
    const { alertsEnabled, thresholdOn, thresholdOff } = values;
    const on = Number(thresholdOn);
    const off = Number(thresholdOff);
    const inRange = (text, number) => text.trim() !== "" && Number.isInteger(number) && number >= 0 && number <= 90;
    const onInvalid = !inRange(thresholdOn, on);
    const offInvalid = !inRange(thresholdOff, off) || (!onInvalid && off >= on);
    const changed = alertsEnabled !== saved.alertsEnabled || thresholdOn !== saved.thresholdOn || thresholdOff !== saved.thresholdOff;
    const error = onInvalid || !inRange(thresholdOff, off)
        ? "Nhập số nguyên từ 0° đến 90°."
        : offInvalid ? "Ngưỡng tắt phải nhỏ hơn ngưỡng bật." : null;

    function edit(field, value)
    {
        setDraft({ ...values, [field]: value });
    }

    async function submit(event)
    {
        event.preventDefault();
        if (canSave && !pending && changed && !error &&
            await onSave({ alertsEnabled, thresholdOn: on, thresholdOff: off }))
        {
            setDraft(null);
        }
    }

    return (
        <section className="card settings" aria-labelledby="settings-title">
            <h2 id="settings-title">Cài đặt cảnh báo</h2>
            <form onSubmit={submit} aria-busy={pending === "settings"} noValidate>
                <fieldset disabled={!canSave || Boolean(pending)}>
                    <legend>Khi đang giám sát</legend>
                    <div className="mode-options">
                        <label className="mode-option">
                            <input type="radio" name="alerts" checked={alertsEnabled} onChange={() => edit("alertsEnabled", true)} />
                            <span>Đo và cảnh báo</span>
                        </label>
                        <label className="mode-option">
                            <input type="radio" name="alerts" checked={!alertsEnabled} onChange={() => edit("alertsEnabled", false)} />
                            <span>Chỉ gửi góc</span>
                        </label>
                    </div>
                    <p className="field-hint">{alertsEnabled ? "Còi bật và tắt theo hai ngưỡng dưới đây." : "Web vẫn nhận góc và báo lỗi cảm biến. Còi luôn im."}</p>
                    <div className="threshold-fields">
                        <label htmlFor="threshold-off">Ngưỡng tắt
                            <span className="degree-input">
                                <input id="threshold-off" type="number" min="0" max="90" step="1" inputMode="numeric"
                                    value={thresholdOff} onChange={(event) => edit("thresholdOff", event.target.value)}
                                    aria-invalid={offInvalid} aria-describedby="threshold-help" />
                                <span aria-hidden="true">°</span>
                            </span>
                        </label>
                        <label htmlFor="threshold-on">Ngưỡng bật
                            <span className="degree-input">
                                <input id="threshold-on" type="number" min="0" max="90" step="1" inputMode="numeric"
                                    value={thresholdOn} onChange={(event) => edit("thresholdOn", event.target.value)}
                                    aria-invalid={onInvalid} aria-describedby="threshold-help" />
                                <span aria-hidden="true">°</span>
                            </span>
                        </label>
                    </div>
                    <p id="threshold-help" className={error ? "field-hint error" : "field-hint"}>
                        {error ?? "Giữa hai ngưỡng, cảnh báo giữ trạng thái trước đó."}
                    </p>
                </fieldset>
                <div className="settings-footer">
                    <button type="submit" disabled={!canSave || Boolean(pending) || !changed || Boolean(error)}>
                        {pending === "settings" ? "Đang lưu…" : "Lưu cài đặt"}
                    </button>
                    {reading && <span className="field-hint">Đang dùng {saved.thresholdOn}° / {saved.thresholdOff}°</span>}
                </div>
                {!canSave && <p className="field-hint">{reading && !supportsSettings ? "Cần firmware hỗ trợ cài đặt cảnh báo." : "Cần kết nối với ESP32 để lưu cài đặt."}</p>}
                <p className={`control-feedback ${feedback?.kind || ""}`} role="status">
                    {feedback?.text || (changed ? "Có thay đổi chưa lưu." : "")}
                </p>
            </form>
        </section>
    );
}

function App()
{
    const [packet, setPacket] = useState(null);
    const [backendError, setBackendError] = useState(false);
    const [pendingTarget, setPendingTarget] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const commandInFlight = useRef(false);
    const mounted = useRef(true);
    const statusRequest = useRef(0);

    async function refreshStatus()
    {
        const request = ++statusRequest.current;
        try
        {
            const response = await fetch("/api/status", { cache: "no-store", signal: AbortSignal.timeout(2500) });
            if (!response.ok)
            {
                throw new Error("Backend unavailable");
            }
            const data = await response.json();
            if (mounted.current && request === statusRequest.current)
            {
                setPacket(data);
                setBackendError(false);
            }
        }
        catch
        {
            if (mounted.current && request === statusRequest.current)
            {
                setBackendError(true);
            }
        }
    }

    useEffect(() =>
    {
        mounted.current = true;
        let refreshing = false;
        const refresh = async () =>
        {
            if (refreshing)
            {
                return;
            }
            refreshing = true;
            try
            {
                await refreshStatus();
            }
            finally
            {
                refreshing = false;
            }
        };
        refresh();
        const timer = setInterval(refresh, 1000);
        return () =>
        {
            mounted.current = false;
            clearInterval(timer);
        };
    }, []);

    const status = backendError ? "stale" : (packet?.status || "stale");
    const paused = status === "paused";
    const stale = status === "stale";
    const valid = !stale && !paused && packet?.reading?.sensorOk && Number.isFinite(packet.reading.angleDeg);
    const angleText = valid ? packet.reading.angleDeg.toLocaleString("vi-VN", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) : "—";
    const last = packet?.lastReceivedAt ? new Date(packet.lastReceivedAt).toLocaleString("vi-VN") : "Chưa có";
    const monitoringEnabled = stale ? null : packet?.reading?.monitoringEnabled;
    const controlSupported = typeof monitoringEnabled === "boolean";
    const canControl = controlSupported && packet?.brokerConnected && !backendError;
    const reading = stale ? null : packet?.reading;
    const monitoringFeedback = feedback?.section === "monitoring" ? feedback : null;
    const settingsFeedback = feedback?.section === "settings" ? feedback : null;
    const modeLabel = stale ? "Chưa có trạng thái mới" : paused ? "Đã tạm dừng" : "Đang giám sát";

    async function sendCommand(target, path, body, successText)
    {
        if (!canControl || commandInFlight.current)
        {
            return false;
        }
        commandInFlight.current = true;
        setPendingTarget(target);
        const section = target === "settings" ? "settings" : "monitoring";
        setFeedback({ section, kind: "pending", text: "Đang chờ ESP32 xác nhận…" });
        try
        {
            const response = await fetch(path, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
                signal: AbortSignal.timeout(6500),
            });
            const result = await response.json();
            if (!response.ok || result.confirmed !== true)
            {
                throw new Error(result.error || "Thiết bị chưa xác nhận lệnh.");
            }
            await refreshStatus();
            if (mounted.current)
            {
                setFeedback({ section, kind: "success", text: successText });
            }
            return true;
        }
        catch (error)
        {
            if (mounted.current)
            {
                setFeedback({ section, kind: "error", text: error.name === "TimeoutError" ? "Hết thời gian chờ. Kiểm tra trạng thái thiết bị trước khi thử lại." : error.message });
            }
            return false;
        }
        finally
        {
            commandInFlight.current = false;
            if (mounted.current)
            {
                setPendingTarget(null);
            }
        }
    }

    function sendMonitoring(enabled)
    {
        return sendCommand(enabled ? "start" : "pause", "/api/monitoring", { enabled },
            enabled ? "Đã bắt đầu đo." : "Đã tạm dừng đo.");
    }

    return (
        <main>
            <header className="page-header">
                <h1>Giám sát độ nghiêng của khay</h1>
                <p>Theo dõi góc nghiêng và điều chỉnh cảnh báo từ web.</p>
            </header>
            <div className="dashboard">
                <section className="card reading" aria-labelledby="reading-title">
                    <div className="reading-heading">
                        <h2 id="reading-title">Góc nghiêng</h2>
                        <span className={`mode-badge ${stale ? "unknown" : paused ? "paused" : "active"}`}>{modeLabel}</span>
                    </div>
                    <div className="angle">{angleText}{valid && <span>°</span>}</div>
                    <p className="reading-caption">So với mốc ngang đã hiệu chuẩn</p>
                    <p className={`status ${status}`} role="status">{LABELS[status]}</p>
                    <div className="control-actions" aria-busy={pendingTarget === "start" || pendingTarget === "pause"}>
                        <button type="button" onClick={() => sendMonitoring(true)} disabled={!canControl || Boolean(pendingTarget) || monitoringEnabled === true}>
                            {pendingTarget === "start" ? "Đang bắt đầu…" : "Bắt đầu giám sát"}
                        </button>
                        <button type="button" className="secondary" onClick={() => sendMonitoring(false)} disabled={!canControl || Boolean(pendingTarget) || monitoringEnabled === false}>
                            {pendingTarget === "pause" ? "Đang tạm dừng…" : "Tạm dừng giám sát"}
                        </button>
                    </div>
                    <p className={`control-feedback ${monitoringFeedback?.kind || ""}`} role="status">
                        {monitoringFeedback?.text || (!canControl ? "Cần kết nối với ESP32 để điều khiển." : "")}
                    </p>
                </section>
                <AlertSettings key={reading ? `${reading.deviceId}/${reading.bootId}` : "offline"}
                    reading={reading} thresholds={packet?.thresholds}
                    canSave={canControl && typeof reading?.alertsEnabled === "boolean"}
                    pending={pendingTarget} feedback={settingsFeedback}
                    onSave={(settings) => sendCommand("settings", "/api/alert-settings", settings, "ESP32 đã lưu cài đặt.")}
                />
                <section className="card details" aria-labelledby="device-title">
                    <h2 id="device-title">Trạng thái thiết bị</h2>
                    <dl>
                        <div><dt>Chế độ cảnh báo</dt><dd>{stale ? "Không rõ" : reading.alertsEnabled === false ? "Chỉ gửi góc" : "Đo và cảnh báo"}</dd></div>
                        <div><dt>Cảnh báo nghiêng</dt><dd>{stale ? "Không rõ" : reading.alarmOn ? "Đang cảnh báo" : "Tắt"}</dd></div>
                        <div><dt>Cảm biến</dt><dd>{stale ? "Không rõ" : paused ? "Chưa đo (tạm dừng)" : valid ? "OK" : "Lỗi"}</dd></div>
                        <div><dt>LED giám sát</dt><dd>{!controlSupported ? "Không rõ" : reading.modeLedOn ? "Sáng" : "Tắt"}</dd></div>
                    </dl>
                    {status === "sensor-error" && <p className="field-hint">{reading.alertsEnabled === false ? "Còi đang tắt theo chế độ Chỉ gửi góc." : "Còi bíp ngắn báo lỗi cảm biến."}</p>}
                </section>
                <section className="card details" aria-labelledby="connection-title">
                    <h2 id="connection-title">Kết nối</h2>
                    <dl>
                        <div><dt>Backend</dt><dd>{backendError ? "Không kết nối" : packet ? "Có phản hồi" : "Đang kết nối"}</dd></div>
                        <div><dt>MQTT broker</dt><dd>{backendError ? "Không rõ" : packet?.brokerConnected ? "Đã kết nối" : "Chưa kết nối"}</dd></div>
                        <div><dt>Bản tin cuối</dt><dd>{last}</dd></div>
                        <div><dt>Nguồn dữ liệu</dt><dd>{reading?.deviceId ?? "—"}</dd></div>
                        <div><dt>Độ cũ</dt><dd>{!backendError && packet?.ageMs != null ? `${(packet.ageMs / 1000).toLocaleString("vi-VN", { maximumFractionDigits: 1 })} giây` : "—"}</dd></div>
                    </dl>
                </section>
            </div>
            <p className="note">Đo độ nghiêng tĩnh khi khay đứng yên hoặc nghiêng chậm.</p>
        </main>
    );
}

createRoot(document.getElementById("root")).render(<App />);
