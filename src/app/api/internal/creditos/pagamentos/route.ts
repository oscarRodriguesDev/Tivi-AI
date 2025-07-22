import { NextRequest, NextResponse } from 'next/server';
import pagarme from 'pagarme';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, paymentMethod, customer, card, pixExpiresIn, boletoExpiresIn } = body;

    // Conecte-se ao pagar.me com sua API_KEY
    const client = await pagarme.client.connect({
      api_key: process.env.PAGARME_API_KEY!,
    });

    let paymentData: any = {
      amount: amount, // valor em centavos
      customer: customer,
      payment_method: paymentMethod, // 'credit_card' | 'pix' | 'boleto'
    };

    if (paymentMethod === 'credit_card') {
      paymentData.card = card; // dados do cartão
    } else if (paymentMethod === 'pix') {
      paymentData.pix_expiration_date = new Date(Date.now() + (pixExpiresIn || 15) * 60 * 1000);
    } else if (paymentMethod === 'boleto') {
      paymentData.boleto_expiration_date = new Date(Date.now() + (boletoExpiresIn || 2) * 24 * 60 * 60 * 1000);
    }

    // Cria a transação
    const transaction = await client.transactions.create(paymentData);

    return NextResponse.json(transaction, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
