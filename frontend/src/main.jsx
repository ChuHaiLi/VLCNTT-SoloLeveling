import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const LABELS = {
    safe: "Bình thường",
    alarm: "VƯỢT NGƯỠNG",
    "sensor-error": "LỖI CẢM BIẾN",
    stale: "DỮ LIỆU CŨ / MẤT LIÊN LẠC",
    paused: "ĐÃ TẠM DỪNG GIÁM SÁT",
};

function App()
{
    const [packet, setPacket] = useState(null);
    const [backendError, setBackendError] = useState(false);
    const [pendingTarget, setPendingTarget] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const commandInFlight = useRef(false);
    const mounted = useRef(true);

    async function refreshStatus()
    {
        const response = await fetch("/api/status", { cache: "no-store", signal: AbortSignal.timeout(2500) });
        if (!response.ok)
        {
            throw new Error("Backend unavailable");
        }
        const data = await response.json();
        if (mounted.current)
        {
            setPacket(data);
            setBackendError(false);
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
            catch
            {
                if (mounted.current)
                {
                    setBackendError(true);
                }
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
    const angleText = valid ? `${packet.reading.angleDeg.toFixed(1)}°` : "—";
    const last = packet?.lastReceivedAt ? new Date(packet.lastReceivedAt).toLocaleString("vi-VN") : "Chưa có";
    const monitoringEnabled = stale ? null : packet?.reading?.monitoringEnabled;
    const controlSupported = typeof monitoringEnabled === "boolean";
    const canControl = controlSupported && packet?.brokerConnected && !backendError;
    const pending = pendingTarget !== null;
    const modeLabel = stale ? "Chưa có trạng thái mới" : paused ? "Đã tạm dừng" : "Đang giám sát";

    async function sendMonitoring(enabled)
    {
        if (!canControl || commandInFlight.current)
        {
            return;
        }
        commandInFlight.current = true;
        setPendingTarget(enabled);
        setFeedback({ kind: "pending", text: "Đang chờ ESP32 xác nhận…" });
        try
        {
            const response = await fetch("/api/monitoring", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ enabled }),
                signal: AbortSignal.timeout(6500),
            });
            const result = await response.json();
            if (!response.ok || result.confirmed !== true)
            {
                throw new Error(result.error || "Thiết bị chưa xác nhận lệnh.");
            }
            try
            {
                await refreshStatus();
            }
            catch
            {
                if (mounted.current)
                {
                    setBackendError(true);
                }
            }
            if (mounted.current)
            {
                setFeedback({ kind: "success", text: enabled ? "ESP32 đã xác nhận bắt đầu giám sát và bật LED." : "ESP32 đã xác nhận tạm dừng giám sát và tắt LED." });
            }
        }
        catch (error)
        {
            if (mounted.current)
            {
                setFeedback({ kind: "error", text: error.name === "TimeoutError" ? "Hết thời gian chờ. Kiểm tra trạng thái thiết bị trước khi thử lại." : error.message });
            }
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

    return (
        <main>
            <header>
                <span className="eyebrow">VẬT LÝ CHO CÔNG NGHỆ THÔNG TIN • 24C11</span>
                <h1>Giám sát độ nghiêng của khay</h1>
                <p>Đo độ nghiêng tĩnh bằng ESP32 và MPU6050. Theo dõi số đo và bắt đầu hoặc tạm dừng giám sát từ website.</p>
            </header>
            <section className="control-panel" aria-labelledby="control-title">
                <div className="control-heading">
                    <div>
                        <h2 id="control-title">Chế độ giám sát</h2>
                        <p id="control-help">Tạm dừng sẽ ngừng đo và tắt còi. Thiết bị vẫn giữ kết nối để nhận lệnh bắt đầu.</p>
                    </div>
                    <span className={`mode-badge ${stale ? "unknown" : paused ? "paused" : "active"}`}>{modeLabel}</span>
                </div>
                <p className="led-state">LED báo chế độ: <strong>{stale || !controlSupported ? "Chưa rõ" : packet.reading.modeLedOn ? "Sáng — đang giám sát" : "Tắt — đã tạm dừng"}</strong></p>
                <div className="control-actions" aria-busy={pending}>
                    <button type="button" onClick={() => sendMonitoring(true)} disabled={!canControl || pending || monitoringEnabled === true} aria-describedby="control-help">
                        {pendingTarget === true ? "Đang bắt đầu…" : "Bắt đầu giám sát"}
                    </button>
                    <button type="button" className="secondary" onClick={() => sendMonitoring(false)} disabled={!canControl || pending || monitoringEnabled === false} aria-describedby="control-help">
                        {pendingTarget === false ? "Đang tạm dừng…" : "Tạm dừng giám sát"}
                    </button>
                </div>
                {!canControl && <p className="control-hint">{!stale && !controlSupported ? "Nguồn dữ liệu này chỉ hỗ trợ hiển thị. Chạy firmware mới để điều khiển thiết bị." : "Cần dữ liệu mới từ ESP32 và kết nối MQTT để gửi lệnh."}</p>}
                <p className={`control-feedback ${feedback?.kind || ""}`} role={feedback?.kind === "error" ? "alert" : "status"} aria-live="polite">{feedback?.text || "Trạng thái được cập nhật theo phản hồi của thiết bị."}</p>
            </section>
            <section className="cards">
                <article className="card highlight">
                    <span className="eyebrow">GÓC NGHIÊNG GẦN NHẤT CÒN HỢP LỆ</span>
                    <div className="angle">{angleText}</div>
                    <p>Đơn vị: độ (°) • độ nghiêng tổng từ X/Y/Z so với mốc ngang đã hiệu chuẩn</p>
                </article>
                <article className="card">
                    <span className="eyebrow">TRẠNG THÁI HIỆN TẠI</span>
                    <h2 className={`status ${status}`}>{LABELS[status] || "Chưa xác định"}</h2>
                    <dl>
                        <div><dt>Cảnh báo nghiêng</dt><dd>{stale ? "Không rõ (mất dữ liệu)" : packet.reading.alarmOn ? "Bật" : "Tắt"}</dd></div>
                        <div><dt>Cảm biến</dt><dd>{stale ? "Không rõ" : paused ? "Chưa đo (tạm dừng)" : valid ? "OK" : "Lỗi"}</dd></div>
                    </dl>
                    {status === "sensor-error" && <p>Còi bíp ngắn báo lỗi cảm biến; đây là tín hiệu riêng với cảnh báo nghiêng.</p>}
                </article>
                <article className="card">
                    <span className="eyebrow">NGƯỠNG CẢNH BÁO</span>
                    <dl>
                        <div><dt>Ngưỡng bật</dt><dd className="threshold">{packet?.thresholds?.on ?? 15}°</dd></div>
                        <div><dt>Ngưỡng tắt</dt><dd className="threshold">{packet?.thresholds?.off ?? 12}°</dd></div>
                    </dl>
                    <p>Giữa hai ngưỡng, giữ trạng thái cảnh báo trước đó. Các ngưỡng cần được kiểm chứng khi thử phần cứng thật.</p>
                </article>
                <article className="card">
                    <span className="eyebrow">KẾT NỐI VÀ THỜI ĐIỂM</span>
                    <dl>
                        <div><dt>Backend</dt><dd>{backendError ? "Không kết nối" : packet ? "Có phản hồi" : "Đang kết nối"}</dd></div>
                        <div><dt>MQTT broker</dt><dd>{packet?.brokerConnected ? "Đã kết nối" : "Chưa kết nối"}</dd></div>
                        <div><dt>Bản tin cuối</dt><dd>{last}</dd></div>
                        <div><dt>Nguồn dữ liệu</dt><dd>{packet?.reading?.deviceId ?? "—"}</dd></div>
                        <div><dt>Độ cũ</dt><dd>{packet?.ageMs != null ? `${(packet.ageMs / 1000).toFixed(1)} giây` : "—"}</dd></div>
                    </dl>
                </article>
            </section>
            <p className="note">Dùng khi khay đứng yên hoặc nghiêng chậm; chưa tách gia tốc khi xe chạy. Góc được ẩn khi tạm dừng, lỗi cảm biến hoặc mất dữ liệu quá 5 giây. Ngưỡng cảnh báo 15°/12° được giữ nguyên. Cần kiểm thử thêm với thiết bị thật.</p>
        </main>
    );
}

createRoot(document.getElementById("root")).render(<App />);
