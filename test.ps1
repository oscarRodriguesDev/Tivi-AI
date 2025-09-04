# 1️⃣ Configura usuário e senha do webhook
$user = 'pagarmeCassio&Oscar'
$pass = 'F9vD7qL3xM8rT2pZ5bK1sH4wN6yV0jG8cR3aU2eX7mQ1fL9tB5'

# 2️⃣ Gera o header Authorization corretamente
$pair = "${user}:${pass}"  # usa {} para evitar erro de parsing
$bytes = [System.Text.Encoding]::ASCII.GetBytes($pair)
$base64 = [System.Convert]::ToBase64String($bytes)
$headers = @{
    "Authorization" = "Basic $base64"
}

# 3️⃣ Cria o body do webhook
$body = @{
    type = "order.paid"
    data = @{
        id = "comprando produto teste"
    }
} | ConvertTo-Json

# 4️⃣ Envia POST para o webhook
Invoke-WebRequest -Uri "https://pagarme.tiviai.com.br/api/webhooks/pagarme" `
    -Method POST `
    -Body $body `
    -ContentType "application/json" `
    -Headers $headers


    git add *
    git commit -m "teste"
    git push origin oscar