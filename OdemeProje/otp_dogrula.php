<?php
$data = json_decode(file_get_contents("php://input"), true);
$otp = $data['otp'];

$tokenData = json_decode(file_get_contents("token.json"), true);
$token = $tokenData['token_string'];

$payload = [
  'otp_code' => $otp,
  'token_string' => $token
];

$ch = curl_init("https://api.paythor.com/auth/verify-otp");
curl_setopt_array($ch, [
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_POST => true,
  CURLOPT_POSTFIELDS => json_encode($payload),
  CURLOPT_HTTPHEADER => ["Content-Type: application/json"]
]);

$response = curl_exec($ch);
curl_close($ch);

// Token'ı yeniden yaz
file_put_contents("token.json", json_encode([
  'token_string' => $token,
  'verified' => true
]));

echo "OTP doğrulandı, artık ödeme oluşturabilirsiniz.";
