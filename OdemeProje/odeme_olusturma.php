<?php
$data = json_decode(file_get_contents("php://input"), true);
$amount = $data['amount'];
$desc = $data['description'];

$tokenData = json_decode(file_get_contents("token.json"), true);
if (!$tokenData['verified']) {
  echo json_encode(['error' => 'Token doğrulanmadı']);
  exit;
}

$payload = [
  'amount' => $amount,
  'currency' => 'TRY',
  'description' => $desc,
  'callback_url' => 'https://ornek.com/callback'
];

$ch = curl_init("https://api.paythor.com/v1/payments");
curl_setopt_array($ch, [
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_POST => true,
  CURLOPT_POSTFIELDS => json_encode($payload),
  CURLOPT_HTTPHEADER => [
    "Authorization: Bearer " . $tokenData['token_string'],
    "Content-Type: application/json"
  ]
]);

$response = curl_exec($ch);
curl_close($ch);
echo $response;
