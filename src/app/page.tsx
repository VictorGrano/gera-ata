'use client';
import { useState } from 'react';
import Transcricao from './components/Transcricao';
import { Document, Packer, Paragraph, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';

export default function Home() {
  const [textoTranscrito, setTextoTranscrito] = useState('');
  const [ataFinal, setAtaFinal] = useState('');
  const [loading, setLoading] = useState(false);

  const gerarAta = async () => {
    setLoading(true);
    const resposta = await fetch('/api/gerarAta', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texto: textoTranscrito }),
    });

    const data = await resposta.json();
    if (data.resposta) {
      setAtaFinal(data.resposta);
    } else if (data.error) {
      setAtaFinal(`Erro: ${data.error}`);
    }
    setLoading(false);
  };

  const gerarDocx = async () => {
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: "ATA DE REUNIÃO",
              heading: HeadingLevel.HEADING_1,
            }),
            ...ataFinal.split('\n').map(linha =>
              new Paragraph(linha)
            ),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "AtaGerada.docx");
  };

  return (
    <main className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Gerador de ATA com IA</h1>
      <Transcricao onTranscricao={setTextoTranscrito} />

      <div className="flex flex-wrap gap-4 mt-4">
        <button
          onClick={gerarAta}
          disabled={loading}
          className={`px-4 py-2 rounded text-white ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {loading ? 'Gerando...' : 'Gerar ATA'}
        </button>

        {ataFinal && !loading && (
          <button
            onClick={gerarDocx}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
          >
            Baixar DOCX
          </button>
        )}
      </div>

      {loading && (
        <p className="mt-4 text-gray-600 italic">Aguarde, gerando a ata...</p>
      )}

      {ataFinal && !loading && (
        <div className="mt-4">
          <p className="mb-2 font-semibold">Resultado da ATA:</p>
          <textarea className="w-full p-2 border rounded" rows={10} value={ataFinal} readOnly></textarea>
        </div>
      )}
    </main>
  );
}
