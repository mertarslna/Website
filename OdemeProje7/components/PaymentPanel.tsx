import React, { useState } from "react";

interface Props {
  sessionToken: string;
  onLogout: () => void;
}

const API_BASE = "https://api.paythor.com";

const PaymentPanel: React.FC<Props> = ({ sessionToken, onLogout }) => {
  const [amount, setAmount] = useState("");
  const [paymentLink, setPaymentLink] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreatePayment = async () => {
    setLoading(true);
    setPaymentLink("");
    try {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${sessionToken}`);
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        payment: {
          amount: amount,
          currency: "TRY",
          buyerFee: "0",
          method: "creditcard",
          merchantReference: "ORDER-123"
        },
        payer: {
          first_name: "John",
          last_name: "Doe",
          email: "john.doe@example.com",
          phone: "5000000000",
          address: {
            line_1: "123 Main St",
            city: "Istanbul",
            state: "Istanbul",
            postal_code: "07050",
            country: "TR"
          },
          ip: "127.0.0.1"
        },
        order: {
          cart: [
            {
              id: "PRD-123",
              name: "Product Name",
              type: "product",
              price: amount,
              quantity: 1
            }
          ],
          shipping: {
            first_name: "John",
            last_name: "Doe",
            phone: "5000000000",
            email: "john.doe@example.com",
            address: {
              line_1: "123 Main St",
              city: "Istanbul",
              state: "Istanbul",
              postal_code: "07050",
              country: "TR"
            }
          },
          invoice: {
            id: "cart_hash_123",
            first_name: "John",
            last_name: "Doe",
            price: amount,
            quantity: 1
          }
        }
      });

      const response = await fetch(`${API_BASE}/payment/create`, {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      });
      const data = await response.json();
      if (data.status === "success" && data.data && data.data.payment_link) {
        setPaymentLink(data.data.payment_link);
      } else {
        alert("Ödeme oluşturulamadı: " + (data.message || "Bilinmeyen hata"));
      }
    } catch (e: any) {
      alert("Hata: " + (e.message || e));
    }
    setLoading(false);
  };

  return (
    <div>
      <label>
        Tutar (TRY)
        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} disabled={loading} />
      </label>
      <button onClick={handleCreatePayment} disabled={loading || !amount}>Ödeme Linki Oluştur</button>
      {paymentLink && (
        <div style={{ marginTop: 16 }}>
          <b>Ödeme Linki:</b> <a href={paymentLink} target="_blank" rel="noopener noreferrer">{paymentLink}</a>
        </div>
      )}
      <div style={{ marginTop: 24 }}>
        <button onClick={onLogout} style={{ background: "none", color: "#d32f2f", border: "none", cursor: "pointer", textDecoration: "underline" }}>
          Çıkış Yap
        </button>
      </div>
    </div>
  );
};

export default PaymentPanel;
