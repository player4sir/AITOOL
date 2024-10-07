import React, { useState, useEffect } from 'react';
import { Send, Copy, Check } from 'lucide-react';
import { usePollinationsChat } from '@pollinations/react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { GeneratedText } from '../types';

interface TextGeneratorProps {
  onTextGenerated: (text: GeneratedText) => void;
  setIsLoading: (isLoading: boolean) => void;
}

interface TextModel {
  name: string;
  type: string;
  censored: boolean;
  description: string;
  baseModel: boolean;
}

const TextGenerator: React.FC<TextGeneratorProps> = ({ onTextGenerated, setIsLoading }) => {
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('openai');
  const [models, setModels] = useState<TextModel[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const { sendUserMessage, messages } = usePollinationsChat([
    { role: "system", content: "You are a helpful AI assistant." }
  ], { 
    seed: -1,
    model: model as any
  });

  useEffect(() => {
    fetch('https://text.pollinations.ai/models')
      .then(response => response.json())
      .then(data => setModels(data))
      .catch(error => {
        console.error('Error fetching text models:', error);
        setError('Failed to load text models. Please try refreshing the page.');
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      await sendUserMessage(prompt);
      onTextGenerated({
        prompt,
        content: messages[messages.length - 1].content
      });
    } catch (error) {
      console.error('Error generating text:', error);
      setError(`Failed to generate text: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
      setPrompt('');
    }
  };

  const handleCopy = (content: string, index: number) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="mb-8">
      <div className="mb-4 h-[500px] overflow-y-auto p-4 bg-gray-50 rounded-lg shadow-inner">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block max-w-[80%] p-4 rounded-lg shadow-md ${
              msg.role === 'user' ? 'bg-purple-100 text-purple-900' : 'bg-white text-gray-900'
            }`}>
              <div className="flex justify-between items-start mb-2">
                <span className="font-semibold">{msg.role === 'user' ? 'You' : 'AI'}</span>
                {msg.role !== 'user' && (
                  <button
                    onClick={() => handleCopy(msg.content, index)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {copiedIndex === index ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                )}
              </div>
              <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  code({node, inline, className, children, ...props}) {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >{String(children).replace(/\n$/, '')}</SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    )
                  }
                }}
              >
                {msg.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your text prompt..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            rows={4}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Model</label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {models.map((modelOption) => (
              <option key={modelOption.name} value={modelOption.name}>
                {modelOption.name} - {modelOption.description}
              </option>
            ))}
          </select>
        </div>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        <button
          type="submit"
          className="w-full flex justify-center items-center bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-all"
          disabled={!prompt.trim()}
        >
          <Send size={16} className="mr-2" />
          发送消息
        </button>
      </form>
    </div>
  );
};

export default TextGenerator;