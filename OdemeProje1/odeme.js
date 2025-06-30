// odeme.js
let token = "";

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const response = await fetch("https://api.paythor.com/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();
  token = data.token; // Token'ı sakla
  alert("Login başarılı!");
}

async function createPayment() {
  const amount = document.getElementById("amount").value;

  const response = await fetch("https://api.paythor.com/api/user/payment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      amount,
      currency: "TRY",
      note: "Test ödemesi"
    })
  });

  const data = await response.json();
  const link = data.payment_url;
  document.getElementById("linkAlani").innerText = `Ödeme Linki: ${link}`;
}
