// app/api/webhooks/pagarme/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const auth = req.headers.get("authorization");

    if (!auth || !auth.startsWith("Basic ")) {
      console.warn("⚠️ Sem credenciais no header Authorization");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const expected = "Basic " + Buffer.from(
      `${process.env.PAGARME_WEBHOOK_USER}:${process.env.PAGARME_WEBHOOK_PASSWORD}`
    ).toString("base64");

    if (auth !== expected) {
      console.warn("⚠️ Credenciais inválidas no webhook");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const event = body.type;

    switch (event) {
      case "order.paid":
        console.log("✅ Pagamento aprovado:", body.data.id);
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
    console.error("❌ Erro no webhook:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({ message: "Webhook ativo e funcionando!" });
}
