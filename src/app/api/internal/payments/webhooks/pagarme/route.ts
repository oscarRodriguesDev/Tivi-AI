// app/api/webhooks/pagarme/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Pega o tipo do evento
    const event = body.type;

    switch (event) {
      case "order.paid":
        console.log("✅ Pagamento aprovado:", body.data.id);
        // atualizar status do pedido no DB
        break;
      case "order.payment_failed":
        console.log("❌ Pagamento recusado:", body.data.id);
        break;
      case "order.payment_processing":
        console.log("⏳ Pagamento em processamento:", body.data.id);
        break;
      case "order.canceled":
        console.log("⚠️ Pedido cancelado:", body.data.id);
        break;
      default:
        console.log("Evento ignorado:", event);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }
}
