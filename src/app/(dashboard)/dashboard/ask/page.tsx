'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getMemoryLibrary } from '@/lib/repositories/life-data';
import { Send, Lightbulb } from 'lucide-react';

export default function AskPage() {
  const [question, setQuestion] = useState('');
  const [memories, setMemories] = useState<Awaited<ReturnType<typeof getMemoryLibrary>>['data']>([]);
  const [loading, setLoading] = useState(true);
  const [isAsking, setIsAsking] = useState(false);

  useEffect(() => {
    let active = true;

    getMemoryLibrary(20)
      .then((result) => {
        if (active) setMemories(result.data ?? []);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleAsk = async () => {
    if (!question.trim()) return;
    
    setIsAsking(true);
    // TODO: Connect to AI backend when available
    // For now, this is a placeholder that will search memories
    setTimeout(() => {
      setIsAsking(false);
      setQuestion('');
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white">Ask Your Life</h1>
        <p className="text-slate-400 mt-2">Question your memories and gain AI-powered insights</p>
      </div>

      {/* Ask Interface */}
      <Card className="border-slate-700 bg-slate-800/50">
        <div className="p-6">
          <div className="space-y-4">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask anything about your memories, decisions, and life..."
              rows={4}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            />
            <div className="flex justify-end">
              <Button 
                className="bg-gradient-to-r from-cyan-600 to-blue-600"
                onClick={handleAsk}
                disabled={!question.trim() || isAsking}
              >
                <Send className="w-4 h-4 mr-2" />
                {isAsking ? 'Thinking...' : 'Ask'}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Example Questions */}
      <Card className="border-slate-700 bg-slate-800/30">
        <div className="p-6">
          <p className="text-sm text-slate-400 mb-3 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Try asking:
          </p>
          <div className="space-y-2">
            <p className="text-sm text-slate-300 cursor-pointer hover:text-cyan-400 transition-colors">
              🤔 "What were my biggest wins this quarter?"
            </p>
            <p className="text-sm text-slate-300 cursor-pointer hover:text-cyan-400 transition-colors">
              📊 "How have my goals evolved over the past year?"
            </p>
            <p className="text-sm text-slate-300 cursor-pointer hover:text-cyan-400 transition-colors">
              💡 "What patterns do you see in my decisions?"
            </p>
            <p className="text-sm text-slate-300 cursor-pointer hover:text-cyan-400 transition-colors">
              🎯 "Why did I prioritize these projects?"
            </p>
          </div>
        </div>
      </Card>

      {/* Memory Context */}
      <div className="space-y-4">
        <p className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Your Memory Context</p>
        {loading ? (
          <Card className="border-slate-700 bg-slate-800/50 p-6 text-slate-400">Loading memories...</Card>
        ) : memories.length === 0 ? (
          <Card className="border-dashed border-slate-700 bg-slate-800/30 p-10 text-center text-slate-400">
            No memories yet. Start capturing memories to enable AI insights.
          </Card>
        ) : (
          <div className="grid gap-3">
            {memories.slice(0, 5).map((memory) => (
              <Card key={memory.id} className="border-slate-700 bg-slate-800/50 p-4">
                <h4 className="font-medium text-white">{memory.title}</h4>
                <p className="text-xs text-slate-400 mt-1">
                  {memory.created_at ? new Date(memory.created_at).toLocaleDateString() : 'No date'}
                  {memory.importance ? ` · ${memory.importance}` : ''}
                </p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
