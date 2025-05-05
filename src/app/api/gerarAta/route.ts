import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { texto } = body;

  if (!texto) {
    return NextResponse.json({ error: 'Texto não fornecido' }, { status: 400 });
  }

  if (!process.env.GOOGLE_API_KEY) {
    return NextResponse.json({ error: 'API Key da Google não configurada' }, { status: 500 });
  }

  try {
    const resposta = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: `Você é um redator de atas em uma reunião. O Texto a seguir é o que você deve corrigir e passar para uma linguagem formal, separando o texto por pautas. Além disso, quando pedirem para não colocar alguma fala, você não irá colocar. Também evitará de colocar as possíveis brigas da reunião, deixando entre colchetes as informações que não foram fornecidas na hora da reunião:\n\n${texto}`}
            ]
          }
        ]
      }),
    });

    const data = await resposta.json();

    if (data.candidates && data.candidates.length > 0) {
      const respostaTexto = data.candidates[0].content.parts[0].text;
      return NextResponse.json({ resposta: respostaTexto });
    } else {
      return NextResponse.json({ error: 'Nenhuma resposta recebida da IA' }, { status: 500 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao acessar a API do Gemini' }, { status: 500 });
  }
}