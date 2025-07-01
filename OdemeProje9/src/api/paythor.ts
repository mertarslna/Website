export async function login(auth_query: any) {
  const response = await fetch("https://api.paythor.com/auth/signin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ auth_query }),
  });
  return response.json();
}

export async function register(data: any) {
  const response = await fetch("https://api.paythor.com/auth/register/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function otpVerify(data: any) {
  const response = await fetch("https://api.paythor.com/otp/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function createPayment(token: string, data: any) {
  const response = await fetch("https://api.paythor.com/payment/create", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data),
  });
  return response.json();
} 