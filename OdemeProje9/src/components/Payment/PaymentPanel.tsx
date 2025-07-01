import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { createPayment } from "../../api/paythor";

interface CartItem {
  id: string;
  name: string;
  type: string;
  price: string;
  quantity: number;
}

interface PaymentPanelProps {
  onLogout: () => void;
}

const defaultCart: CartItem[] = [
  { id: "PRD-123", name: "Product Name", type: "product", price: "50.00", quantity: 2 },
  { id: "DSC-SUMMER2024", name: "SUMMER2024 (10%)", type: "discount", price: "5.00", quantity: 1 },
  { id: "SHIP-1234", name: "Shipping", type: "shipping", price: "10.00", quantity: 1 },
  { id: "TAX-TOTAL-5678", name: "Tax", type: "tax", price: "9.00", quantity: 1 }
];

const defaultForm = {
  currency: "TRY",
  buyer_fee: "0",
  method: "creditcard",
  merchant_reference: "ORDER-123",
  payer_first_name: "Ahmet",
  payer_last_name: "Cinar",
  payer_email: "ahmet.cinar@example.com",
  payer_phone: "5000000000",
  payer_address_line_1: "123 Main St",
  payer_city: "Istanbul",
  payer_state: "Istanbul",
  payer_postal_code: "07050",
  payer_country: "TR",
  payer_ip: "127.0.0.1",
  shipping_first_name: "John",
  shipping_last_name: "Doe",
  shipping_phone: "5000000000",
  shipping_email: "john.doe@example.com",
  shipping_address_line_1: "456 Vasm St",
  shipping_city: "Los Angeles",
  shipping_state: "Los Angeles",
  shipping_postal_code: "08500",
  shipping_country: "USA",
  invoice_id: "cart_hash_123",
  invoice_first_name: "John",
  invoice_last_name: "Doe",
  invoice_quantity: 1
};

function calculateAmount(cart: CartItem[]): string {
  let total = 0;
  for (const item of cart) {
    const price = parseFloat(item.price) || 0;
    const qty = Number(item.quantity) || 0;
    if (item.type === "discount") {
      total -= price * qty;
    } else {
      total += price * qty;
    }
  }
  return total.toFixed(2);
}

type CartField = keyof Pick<CartItem, 'id' | 'name' | 'type' | 'price' | 'quantity'>;

const PaymentPanel: React.FC<PaymentPanelProps> = ({ onLogout }) => {
  //const { token } = useAuth();
  const token = localStorage.getItem("token");
  const [form, setForm] = useState({ ...defaultForm });
  const [cart, setCart] = useState<CartItem[]>([...defaultCart]);
  const [showCartModal, setShowCartModal] = useState(false);
  const [paymentLink, setPaymentLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const amount = calculateAmount(cart);

  useEffect(() => {
    if (!token) {
      onLogout();
    }
  }, [token, onLogout]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Cart Modal işlemleri
  const handleCartChange = (idx: number, field: CartField, value: string) => {
    const newCart = [...cart];
    if (field === "quantity") {
      newCart[idx][field] = Number(value);
    } else {
      newCart[idx][field] = value;
    }
    setCart(newCart);
  };
  const addCartRow = () => {
    setCart([...cart, { id: "", name: "", type: "product", price: "0.00", quantity: 1 }]);
  };
  const removeCartRow = (idx: number) => {
    setCart(cart.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setPaymentLink("");
    try {
      const result = await createPayment(token!, {
        payment: {
          amount: amount,
          currency: form.currency,
          buyer_fee: form.buyer_fee,
          method: form.method,
          merchant_reference: form.merchant_reference
        },
        payer: {
          first_name: form.payer_first_name,
          last_name: form.payer_last_name,
          email: form.payer_email,
          phone: form.payer_phone,
          address: {
            line_1: form.payer_address_line_1,
            city: form.payer_city,
            state: form.payer_state,
            postal_code: form.payer_postal_code,
            country: form.payer_country
          },
          ip: form.payer_ip
        },
        order: {
          cart: cart,
          shipping: {
            first_name: form.shipping_first_name,
            last_name: form.shipping_last_name,
            phone: form.shipping_phone,
            email: form.shipping_email,
            address: {
              line_1: form.shipping_address_line_1,
              city: form.shipping_city,
              state: form.shipping_state,
              postal_code: form.shipping_postal_code,
              country: form.shipping_country
            }
          },
          invoice: {
            id: form.invoice_id,
            first_name: form.invoice_first_name,
            last_name: form.invoice_last_name,
            price: amount,
            quantity: form.invoice_quantity
          }
        }
      });
      if (result.status === "success" && result.data.payment_link) {
        setPaymentLink(result.data.payment_link);
      } else {
        setError(result.message || "Ödeme oluşturulamadı");
      }
    } catch (err) {
      setError("Bir hata oluştu");
    }
    setLoading(false);
  };

  return (
    <div className="panel">
      <h2>Ödeme Oluştur</h2>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Alıcı Bilgileri</legend>
          <input name="payer_first_name" placeholder="Ad" value={form.payer_first_name} onChange={handleChange} />
          <input name="payer_last_name" placeholder="Soyad" value={form.payer_last_name} onChange={handleChange} />
          <input name="payer_email" placeholder="E-posta" value={form.payer_email} onChange={handleChange} />
          <input name="payer_phone" placeholder="Telefon" value={form.payer_phone} onChange={handleChange} />
          <input name="payer_address_line_1" placeholder="Adres" value={form.payer_address_line_1} onChange={handleChange} />
          <input name="payer_city" placeholder="Şehir" value={form.payer_city} onChange={handleChange} />
          <input name="payer_state" placeholder="İl" value={form.payer_state} onChange={handleChange} />
          <input name="payer_postal_code" placeholder="Posta Kodu" value={form.payer_postal_code} onChange={handleChange} />
          <input name="payer_country" placeholder="Ülke" value={form.payer_country} onChange={handleChange} />
          <input name="payer_ip" placeholder="IP" value={form.payer_ip} onChange={handleChange} />
        </fieldset>
        <fieldset>
          <legend>Kargo (Shipping) Bilgileri</legend>
          <input name="shipping_first_name" placeholder="Ad" value={form.shipping_first_name} onChange={handleChange} />
          <input name="shipping_last_name" placeholder="Soyad" value={form.shipping_last_name} onChange={handleChange} />
          <input name="shipping_phone" placeholder="Telefon" value={form.shipping_phone} onChange={handleChange} />
          <input name="shipping_email" placeholder="E-posta" value={form.shipping_email} onChange={handleChange} />
          <input name="shipping_address_line_1" placeholder="Adres" value={form.shipping_address_line_1} onChange={handleChange} />
          <input name="shipping_city" placeholder="Şehir" value={form.shipping_city} onChange={handleChange} />
          <input name="shipping_state" placeholder="İl" value={form.shipping_state} onChange={handleChange} />
          <input name="shipping_postal_code" placeholder="Posta Kodu" value={form.shipping_postal_code} onChange={handleChange} />
          <input name="shipping_country" placeholder="Ülke" value={form.shipping_country} onChange={handleChange} />
        </fieldset>
        <fieldset>
          <legend>Sepet (Ürünler)</legend>
          <button type="button" onClick={() => setShowCartModal(true)}>Sepeti Düzenle</button>
          <div style={{marginTop:18}}>
            <strong>Toplam Tutar (TRY): <span>{amount}</span></strong>
          </div>
        </fieldset>
        <fieldset>
          <legend>Fatura (Invoice) Bilgileri</legend>
          <input name="invoice_id" placeholder="Fatura ID" value={form.invoice_id} onChange={handleChange} />
          <input name="invoice_first_name" placeholder="Ad" value={form.invoice_first_name} onChange={handleChange} />
          <input name="invoice_last_name" placeholder="Soyad" value={form.invoice_last_name} onChange={handleChange} />
          <input name="invoice_quantity" type="number" placeholder="Adet" value={form.invoice_quantity} onChange={handleChange} />
        </fieldset>
        <fieldset>
          <legend>Ödeme Bilgileri</legend>
          <select name="currency" value={form.currency} onChange={handleChange}>
            <option value="TRY">TRY</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
          <input name="method" placeholder="Yöntem" value={form.method} onChange={handleChange} />
          <input name="merchant_reference" placeholder="Sipariş Referansı" value={form.merchant_reference} onChange={handleChange} />
        </fieldset>
        <button type="submit" disabled={loading}>{loading ? "Oluşturuluyor..." : "Ödeme Linki Oluştur"}</button>
      </form>
      {showCartModal && (
        <div style={{
          position:'fixed',
          top:0,
          left:0,
          width:'100vw',
          height:'100vh',
          background:'rgba(0,0,0,0.3)',
          zIndex:1000
        }} onClick={()=>setShowCartModal(false)}>
          <div
            style={{
              background:'#fff',
              padding:24,
              borderRadius:8,
              maxWidth:800,
              margin:'40px auto',
              position:'relative',
              overflowX: 'auto',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}
            onClick={e=>e.stopPropagation()}
          >
            <button style={{position:'absolute',top:8,right:8}} onClick={()=>setShowCartModal(false)}>&times;</button>
            <h3>Sepet (Ürünler)</h3>
            {cart.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display:'flex',
                  flexWrap:'nowrap',
                  gap:4,
                  marginBottom:8,
                  alignItems: 'center'
                }}
              >
                <input style={{flex:'1 1 80px', minWidth: 0, maxWidth: 100}} value={item.id} onChange={e => handleCartChange(idx, "id", e.target.value)} placeholder="ID" />
                <input style={{flex:'2 1 120px', minWidth: 0, maxWidth: 140}} value={item.name} onChange={e => handleCartChange(idx, "name", e.target.value)} placeholder="Ad" />
                <input style={{flex:'1 1 80px', minWidth: 0, maxWidth: 100}} value={item.type} onChange={e => handleCartChange(idx, "type", e.target.value)} placeholder="Tip" />
                <input style={{flex:'1 1 80px', minWidth: 0, maxWidth: 100}} value={item.price} type="number" step="0.01" onChange={e => handleCartChange(idx, "price", e.target.value)} placeholder="Fiyat" />
                <input style={{flex:'1 1 60px', minWidth: 0, maxWidth: 80}} value={item.quantity} type="number" onChange={e => handleCartChange(idx, "quantity", e.target.value)} placeholder="Adet" />
                <button type="button" style={{flex:'0 0 auto'}} onClick={()=>removeCartRow(idx)}>Sil</button>
              </div>
            ))}
            <button type="button" onClick={addCartRow}>Ürün Ekle</button>
            <div style={{marginTop:10}}>
              <strong>Toplam Tutar (TRY): <span>{amount}</span></strong>
            </div>
            <div style={{textAlign:'right',marginTop:18}}>
              <button type="button" onClick={()=>setShowCartModal(false)}>Kaydet ve Kapat</button>
            </div>
          </div>
        </div>
      )}
      {paymentLink && <div className="success">Ödeme Linki: <a href={paymentLink} target="_blank" rel="noopener noreferrer">{paymentLink}</a></div>}
      {error && <div className="error">{error}</div>}
      <button onClick={onLogout}>Çıkış Yap</button>
    </div>
  );
};

export default PaymentPanel; 