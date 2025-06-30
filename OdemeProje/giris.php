<?php
$data = json_decode(file_get_contents('php://input'), true);

$email = $data['email'];
$password = $data['password'];

$payload = [
  'auth_query' => [
    'auth_method' => 'email_password',
    'email' => $email,
    'password' => $password,
    'program_id' => 1,
    'app_id' => 102,
    'store_url' => ''
  ]
];

$ch = curl_init('https://api.paythor.com/auth/signin');
curl_setopt_array($ch, [
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_POST => true,
  CURLOPT_POSTFIELDS => json_encode($payload),
  CURLOPT_HTTPHEADER => ['Content-Type: application/json']
]);

$response = curl_exec($ch);
curl_close($ch);
$json = json_decode($response, true);

// Token'ı geçici olarak sakla
file_put_contents("token.json", json_encode($json['data'] ?? []));

echo "Giriş yapıldı, OTP giriniz.";
