'use client';
import { useChat } from 'ai/react';
import { Mic, Send, RefreshCcw, Home } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Link from 'next/link';

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, reload, setInput } = useChat();

  const startVoice = () => {
    const recognition = new (window.webkitSpeechRecognition || (window as any).SpeechRecognition)();
    recognition.lang = 'id-ID';
    recognition.onresult = (event: any) => setInput(event.results[0][0].transcript);
    recognition.start();
  };

  return (
    <div className="flex h-screen bg-black text-white font-sans">
      {/* Sidebar Persisten (Simpel) */}
      <div className="w-64 border-r border-gray-800 p-4 hidden md:block">
        <h2 className="text-2xl font-black italic text-cyan-400 mb-8">chye-ai</h2>
        <div className="space-y-2">
          <p className="text-xs text-gray-500 uppercase tracking-widest">History</p>
          <div className="p-3 bg-gray-900 rounded-lg border border-cyan-900/30 text-sm">Obrolan Terakhir...</div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        <header className="p-4 border-b border-gray-800 flex justify-between">
          <Link href="/"><Home size={20} className="text-gray-400 hover:text-cyan-400" /></Link>
          <span className="text-cyan-400 text-sm font-mono tracking-tighter">LLAMA-4-SCOUT_ACTIVE</span>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(m => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-4 rounded-2xl max-w-[85%] ${m.role === 'user' ? 'bg-cyan-600 shadow-[0_0_15px_rgba(6,182,212,0.3)]' : 'bg-gray-900'}`}>
                <ReactMarkdown components={{
                  code({inline, className, children, ...props}: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div" {...props}>
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : ( <code className="bg-black px-1 rounded" {...props}>{children}</code> )
                  }
                }}>{m.content}</ReactMarkdown>
              </div>
            </div>
          ))}

          {/* Loading Neon Pulse */}
          {isLoading && (
            <div className="flex gap-2 items-center p-4">
              <div className="w-3 h-3 bg-cyan-400 rounded-full animate-[pulse_1s_infinite] shadow-[0_0_10px_#22d3ee]"></div>
              <p className="text-cyan-400 text-xs font-bold animate-pulse uppercase">chye-ai lagi ngetik...</p>
            </div>
          )}
        </div>

        {/* Form Input */}
        <div className="p-6 bg-gradient-to-t from-black via-black to-transparent">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex gap-2 items-center bg-gray-900 border border-gray-700 p-2 rounded-2xl focus-within:border-cyan-500 transition-all">
            <button type="button" onClick={startVoice} className="p-2 text-gray-400 hover:text-cyan-400"><Mic size={20} /></button>
            <input 
              className="flex-1 bg-transparent p-2 focus:outline-none" 
              placeholder="Gas tanya apa aja..." 
              value={input} 
              onChange={handleInputChange} 
            />
            <button type="submit" className="bg-cyan-500 p-2 rounded-xl text-black font-bold hover:scale-105 transition-transform">
              <Send size={20} />
            </button>
          </form>
          {messages.length > 0 && (
            <button onClick={() => reload()} className="mx-auto mt-4 flex items-center gap-1 text-xs text-gray-500 hover:text-cyan-400">
              <RefreshCcw size={12} /> Regenerate kalo kurang sreg
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
