import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface DemoLine {
  type: 'input' | 'output' | 'step';
  text: string;
  isTyping?: boolean;
}

export default function DemoTerminal() {
  const [lines, setLines] = useState<DemoLine[]>([]);
  const [activeLineIndex, setActiveLineIndex] = useState(0);

  const demoSequence: DemoLine[] = [
    { type: 'input', text: '> Create a PPT about AI trends 2024', isTyping: true },
    { type: 'step', text: '🤔 Analyzing your request...' },
    { type: 'step', text: '🛠️ Using PPT Agent to create presentation...' },
    { type: 'step', text: '✅ Done! Presentation created with 15 slides' },
    { type: 'output', text: 'Download: ai_trends_2024.pptx' },
  ];

  useEffect(() => {
    if (activeLineIndex >= demoSequence.length) return;

    const line = demoSequence[activeLineIndex];
    const delay = line.isTyping ? 100 : 800;

    const timer = setTimeout(() => {
      setLines((prev) => [...prev, line]);
      setActiveLineIndex((prev) => prev + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [activeLineIndex]);

  return (
    <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 font-mono text-sm overflow-hidden">
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
      </div>

      <div className="space-y-3 h-48 overflow-hidden">
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex items-start gap-2 ${
              line.type === 'input'
                ? 'text-indigo-400'
                : line.type === 'output'
                ? 'text-green-400'
                : 'text-blue-400'
            }`}
          >
            {line.type === 'input' && <span className="text-white">$</span>}
            {line.type === 'output' && <span className="text-green-500">→</span>}
            {line.type === 'step' && <span className="text-blue-400">→</span>}
            <span className="flex-1">
              {line.isTyping && activeLineIndex === lines.length ? (
                <span className="inline-block">
                  {line.text}
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="ml-1"
                  >
                    ▊
                  </motion.span>
                </span>
              ) : (
                line.text
              )}
            </span>
          </motion.div>
        ))}

        {activeLineIndex < demoSequence.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-zinc-500 flex items-center gap-2"
          >
            <span>$</span>
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              ▊
            </motion.span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
