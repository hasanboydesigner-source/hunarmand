import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { createPortal } from "react-dom";

export default function AdminCraftsmen({ craftsmen, handleVerifyCraftsman }) {
  const [craftsmenSearchQ, setCraftsmenSearchQ] = useState("");
  const [selectedCraftsman, setSelectedCraftsman] = useState(null);
  const [showCraftsmanModal, setShowCraftsmanModal] = useState(false);

  const filteredCraftsmen = craftsmen.filter(
    (c) =>
      (c?.name?.toLowerCase() || '').includes(craftsmenSearchQ.toLowerCase()) ||
      (c?.region?.toLowerCase() || '').includes(craftsmenSearchQ.toLowerCase()),
  );

  const openCraftsmanDetail = (c) => {
    setSelectedCraftsman(c);
    setShowCraftsmanModal(true);
  };

  return (
    <div className="animate-fadeIn">
      <div className="admin-header">
        <h1>Hunarmandlar</h1>
      </div>
      <div className="admin-card">
        <div className="admin-card-toolbar">
          <input
            className="form-input"
            placeholder="Hunarmand yoki viloyatni qidirish..."
            style={{ maxWidth: 280 }}
            value={craftsmenSearchQ}
            onChange={(e) => setCraftsmenSearchQ(e.target.value)}
          />
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Ism</th>
              <th>Viloyat</th>
              <th>Mutaxassislik</th>
              <th>Mahsulot</th>
              <th>Reyting</th>
              <th>Holat</th>
              <th>Amal</th>
            </tr>
          </thead>
          <tbody>
            {filteredCraftsmen.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    textAlign: "center",
                    padding: 40,
                    color: "var(--text-muted)",
                  }}
                >
                  Usta topilmadi
                </td>
              </tr>
            ) : (
              filteredCraftsmen.map((c) => (
                <tr key={c.id}>
                  <td>
                    <strong>{c.name}</strong>
                  </td>
                  <td>{c.region}</td>
                  <td>{c.specialty}</td>
                  <td>{c.totalProducts}</td>
                  <td>⭐ {Number(c.rating || 0).toFixed(1)}</td>
                  <td>
                    <span
                      className={`badge ${c.isVerified ? "badge-success" : "badge-warning"}`}
                    >
                      {c.isVerified ? "Tasdiqlangan" : "Kutilmoqda"}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => openCraftsmanDetail(c)}
                      >
                        Ko'rish
                      </button>
                      {!c.isVerified && (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleVerifyCraftsman(c.id)}
                        >
                          <CheckCircle2 size={12} />
                          Tasdiqlash
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Craftsman Detail Modal ── */}
      {showCraftsmanModal &&
        selectedCraftsman &&
        createPortal(
          <div
            className="admin-modal-overlay"
            onClick={() => setShowCraftsmanModal(false)}
          >
            <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
              <div className="admin-modal-header">
                <h3>Hunarmand ma'lumotlari</h3>
                <button
                  className="admin-modal-close"
                  onClick={() => setShowCraftsmanModal(false)}
                >
                  <XCircle size={18} />
                </button>
              </div>
              <div className="admin-modal-body">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                  }}
                >
                  <div>
                    <strong style={{ fontSize: 16 }}>
                      {selectedCraftsman.name}
                    </strong>
                    <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
                      Sohasi: {selectedCraftsman.specialty} · Tajribasi:{" "}
                      {selectedCraftsman.yearsExp} yil
                    </p>
                  </div>
                  <div
                    style={{
                      borderTop: "1px solid var(--border-light)",
                      paddingTop: "12px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                      }}
                    >
                      Bio
                    </span>
                    <p
                      style={{ fontSize: 13, lineHeight: "1.4", marginTop: 4 }}
                    >
                      {selectedCraftsman.bio || "Bio kiritilmagan."}
                    </p>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "12px",
                      borderTop: "1px solid var(--border-light)",
                      paddingTop: "12px",
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontSize: 11,
                          color: "var(--text-muted)",
                          textTransform: "uppercase",
                        }}
                      >
                        Viloyat / Shahar
                      </span>
                      <p style={{ fontWeight: 600, fontSize: 14 }}>
                        {selectedCraftsman.region} /{" "}
                        {selectedCraftsman.city || selectedCraftsman.region}
                      </p>
                    </div>
                    <div>
                      <span
                        style={{
                          fontSize: 11,
                          color: "var(--text-muted)",
                          textTransform: "uppercase",
                        }}
                      >
                        Aloqa (WhatsApp)
                      </span>
                      <p style={{ fontWeight: 600, fontSize: 14 }}>
                        {selectedCraftsman.whatsapp || "Kiritilmagan"}
                      </p>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "12px",
                      borderTop: "1px solid var(--border-light)",
                      paddingTop: "12px",
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontSize: 11,
                          color: "var(--text-muted)",
                          textTransform: "uppercase",
                        }}
                      >
                        Mahsulotlar soni
                      </span>
                      <p style={{ fontWeight: 600, fontSize: 14 }}>
                        {selectedCraftsman.totalProducts}
                      </p>
                    </div>
                    <div>
                      <span
                        style={{
                          fontSize: 11,
                          color: "var(--text-muted)",
                          textTransform: "uppercase",
                        }}
                      >
                        Reyting
                      </span>
                      <p style={{ fontWeight: 600, fontSize: 14 }}>
                        ⭐ {Number(selectedCraftsman.rating || 0).toFixed(1)} (
                        {selectedCraftsman.reviewCount} ta sharh)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="admin-modal-footer">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowCraftsmanModal(false)}
                >
                  Yopish
                </button>
                {!selectedCraftsman.isVerified && (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      handleVerifyCraftsman(selectedCraftsman.id);
                      setShowCraftsmanModal(false);
                    }}
                  >
                    Tasdiqlash
                  </button>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
