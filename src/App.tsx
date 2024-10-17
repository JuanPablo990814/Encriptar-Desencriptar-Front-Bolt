import React, { useState, useEffect, ChangeEvent } from 'react';
import { Lock, Unlock, RefreshCw, Upload } from 'lucide-react';

function App() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [shift, setShift] = useState(3);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    console.log('App component rendered');
  }, []);

  const caesarCipher = (text: string, shift: number, encrypt: boolean) => {
    return text
      .split('')
      .map((char) => {
        if (char.match(/[a-z]/i)) {
          const code = char.charCodeAt(0);
          const isUpperCase = char === char.toUpperCase();
          const base = isUpperCase ? 65 : 97;
          const offset = encrypt ? shift : 26 - shift;
          return String.fromCharCode(((code - base + offset) % 26) + base);
        }
        return char;
      })
      .join('');
  };

  const handleEncrypt = () => {
    setOutput(caesarCipher(input, shift, true));
  };

  const handleDecrypt = () => {
    setOutput(caesarCipher(input, shift, false));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleFileEncrypt = async () => {
    if (!file) return;

    const text = await file.text();
    const encryptedText = caesarCipher(text, shift, true);
    
    const blob = new Blob([encryptedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `encrypted_${file.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Encriptar / Desencriptar</h1>
        
        <div className="mb-4">
          <label htmlFor="input" className="block text-sm font-medium text-gray-700 mb-1">
            Texto a procesar
          </label>
          <textarea
            id="input"
            className="w-full p-2 border rounded-md"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={4}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="shift" className="block text-sm font-medium text-gray-700 mb-1">
            Desplazamiento
          </label>
          <input
            type="number"
            id="shift"
            className="w-full p-2 border rounded-md"
            value={shift}
            onChange={(e) => setShift(Number(e.target.value))}
            min={1}
            max={25}
          />
        </div>

        <div className="flex justify-between mb-4">
          <button
            onClick={handleEncrypt}
            className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center"
          >
            <Lock className="mr-2" size={18} /> Encriptar
          </button>
          <button
            onClick={handleDecrypt}
            className="bg-green-500 text-white px-4 py-2 rounded-md flex items-center"
          >
            <Unlock className="mr-2" size={18} /> Desencriptar
          </button>
        </div>

        <div className="mb-4">
          <label htmlFor="output" className="block text-sm font-medium text-gray-700 mb-1">
            Resultado
          </label>
          <textarea
            id="output"
            className="w-full p-2 border rounded-md"
            value={output}
            readOnly
            rows={4}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
            Subir archivo
          </label>
          <input
            type="file"
            id="file"
            onChange={handleFileChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <button
          onClick={handleFileEncrypt}
          disabled={!file}
          className={`w-full bg-purple-500 text-white px-4 py-2 rounded-md flex items-center justify-center ${
            !file ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Upload className="mr-2" size={18} /> Encriptar archivo
        </button>
      </div>
    </div>
  );
}

export default App;