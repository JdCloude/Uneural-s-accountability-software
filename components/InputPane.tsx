import React, { useState, useRef, useEffect } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { UploadIcon, PaperclipIcon, MicrophoneIcon } from './icons';

interface InputPaneProps {
  onProcess: (file: File | null, text: string) => void;
  isLoading: boolean;
}

const InputPane: React.FC<InputPaneProps> = ({ onProcess, isLoading }) => {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Fix: Cast window to `any` to access non-standard SpeechRecognition APIs which may not be in default TS DOM types.
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'es-CO';

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setDescription(prev => prev + finalTranscript + interimTranscript);
      };
      
      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
      
      recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsRecording(false);
      }
    } else {
        console.warn("Speech Recognition not supported in this browser.");
    }
  }, []);

  const handleToggleRecording = () => {
    if (!recognitionRef.current) return;
    
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setDescription(''); // Clear previous text
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };
  
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      setFile(event.dataTransfer.files[0]);
      event.dataTransfer.clearData();
    }
  };
  
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
  };

  const handleSubmit = () => {
    if (!file && !description) {
      alert('Por favor, sube un archivo o describe un movimiento.');
      return;
    }
    onProcess(file, description);
    setFile(null);
    setDescription('');
  };
  
  const triggerFileSelect = () => {
    if (isRecording) return;
    fileInputRef.current?.click();
  };

  return (
    <Card className="flex-shrink-0 w-96">
      <div className="flex flex-col h-full">
        <h2 className="text-lg font-semibold text-zinc-800 mb-4">Registrar Movimiento</h2>
        <p className="text-sm text-zinc-500 mb-6">
          Sube un archivo, describe la transacción o usa tu voz. La IA se encargará del resto.
        </p>
        
        <div 
          className={`flex flex-col items-center justify-center border-2 border-dashed border-zinc-300 rounded-lg p-8 mb-4 text-center transition-colors ${!isRecording ? 'cursor-pointer hover:border-magenta-400' : 'bg-zinc-100'}`}
          onClick={triggerFileSelect}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,application/pdf,audio/*,video/*"
            disabled={isRecording}
          />
          <UploadIcon className="w-10 h-10 text-zinc-400 mb-2" />
          <p className="text-sm font-medium text-zinc-700">Arrastra y suelta un archivo</p>
          <p className="text-xs text-zinc-500">o haz clic para seleccionar</p>
        </div>

        {file && !isRecording && (
          <div className="bg-magenta-50 text-magenta-700 text-sm rounded-md p-3 mb-4 flex items-center justify-between">
            <div className="flex items-center truncate">
              <PaperclipIcon className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">{file.name}</span>
            </div>
            <button onClick={() => setFile(null)} className="font-bold text-lg leading-none ml-2">&times;</button>
          </div>
        )}

        <div className="relative mb-4">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="O describe el movimiento aquí..."
              className="w-full p-3 pr-12 border border-zinc-300 rounded-md text-sm focus:ring-magenta-500 focus:border-magenta-500"
              rows={5}
              disabled={isRecording}
            ></textarea>
             <button
                onClick={handleToggleRecording}
                className={`absolute right-2 top-2 p-2 rounded-full transition-colors ${isRecording ? 'bg-magenta-600 text-white animate-pulse' : 'bg-zinc-100 text-zinc-600 hover:bg-magenta-100 hover:text-magenta-600'}`}
                aria-label={isRecording ? 'Detener grabación' : 'Iniciar grabación'}
            >
                <MicrophoneIcon className="w-5 h-5" />
            </button>
        </div>
        
        <Button onClick={handleSubmit} isLoading={isLoading}>
            {isLoading ? 'Procesando...' : 'Procesar con IA'}
        </Button>
      </div>
    </Card>
  );
};

export default InputPane;
