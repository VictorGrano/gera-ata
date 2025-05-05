'use client';
import { useEffect, useRef, useState } from 'react';

interface Props {
  onTranscricao: (texto: string) => void;
}

export default function Transcricao({ onTranscricao }: Props) {
  const [texto, setTexto] = useState('');
  const [gravando, setGravando] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'pt-BR';
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event: any) => {
          let interim = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            if (result.isFinal) {
              setTexto(prev => {
                const novo = prev + ' ' + result[0].transcript;
                onTranscricao(novo);
                return novo;
              });
            } else {
              interim += result[0].transcript;
            }
          }
        };

        recognitionRef.current = recognition;
      } else {
        alert('Reconhecimento de voz não é suportado neste navegador.');
      }
    }
  }, []);

  const iniciar = () => {
    if (recognitionRef.current) {
      setGravando(true);
      recognitionRef.current.start();
    }
  };

  const parar = () => {
    if (recognitionRef.current) {
      setGravando(false);
      recognitionRef.current.stop();
    }
  };

  return (
    <div>
      <p className="mb-2">Transcrição:</p>
      <textarea className="w-full p-2 border" rows={6} value={texto} readOnly></textarea>
      <div className="mt-2 space-x-2">
        <button onClick={iniciar} disabled={gravando} className="px-4 py-2 bg-green-600 text-white rounded">Iniciar</button>
        <button onClick={parar} disabled={!gravando} className="px-4 py-2 bg-red-600 text-white rounded">Parar</button>
      </div>
    </div>
  );
}
