import { NextResponse } from "next/server";


export async function GET(req: Request) {
    try {
 
      return NextResponse.json({"recado":"Essa rota da api não pode ser acessivel por usuarios externos"});
    } catch (error) {
      return NextResponse.json({ error: "Erro interno do servidor!" }, { status: 500 });
    }
  }