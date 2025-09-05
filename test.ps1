# Simulação de chamada de pagamento para Pagar.me

# Defina sua chave de API do Pagar.me
$pagarmeApiKey = "sk_5a8d5c5ee81c45ac9568195d641088a4"

# Defina o endpoint de criação de pedido
$url = "https://api.pagar.me/core/v5/orders"

# Monte o corpo do pedido (exemplo simples)
$body = @{
    items = @(
        @{
            amount = 1000      # valor em centavos (R$ 10,00)
            description = "Produto de teste"
            quantity = 1
            code = "item-teste-1"
        }
    )
    customer = @{
        name = "Cliente Teste"
        email = "cliente@teste.com"
        type = "individual"
        document = "12345678909"
        phones = @{
            mobile_phone = @{
                country_code = "55"
                area_code = "11"
                number = "999999999"
            }
        }
    }
    payments = @(
        @{
            payment_method = "credit_card"
            credit_card = @{
                card = @{
                    number = "4111111111111111"
                    holder_name = "Cliente Teste"
                    exp_month = 12
                    exp_year = 30
                    cvv = "123"
                }
            }
        }
    )
} | ConvertTo-Json -Depth 10

# Monta o header de autenticação Basic
$base64Auth = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${pagarmeApiKey}:"))

# Realiza a requisição
$response = Invoke-RestMethod -Uri $url -Method Post -Headers @{
    "Authorization" = "Basic $base64Auth"
    "Content-Type"  = "application/json"
} -Body $body

# Exibe a resposta
$response | ConvertTo-Json -Depth 10
