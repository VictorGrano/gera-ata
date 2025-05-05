'use client';
interface Props {
  ata: string;
}

export default function VisualizadorAta({ ata }: Props) {
  if (!ata) return null;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">ATA Gerada:</h2>
      <pre className="whitespace-pre-wrap bg-gray-100 p-4 border rounded">{ata}</pre>
    </div>
  );
}