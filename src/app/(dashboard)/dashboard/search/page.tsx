'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search as SearchIcon, Filter, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { searchUserHistory } from '@/lib/repositories/life-data';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Awaited<ReturnType<typeof searchUserHistory>>['data']>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);
    const result = await searchUserHistory(query);
    setResults(result.data ?? []);
    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Universal Search</h1>
        <p className="text-slate-400 mt-2">Search everything in your life database</p>
      </div>

      {/* Search Bar */}
      <Card className="border-slate-700 bg-slate-800/50">
        <div className="p-6">
          <div className="flex gap-3 mb-4">
            <div className="flex-1 flex items-center gap-3 bg-slate-900/50 px-4 py-3 rounded-lg border border-slate-700">
              <SearchIcon className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="What was I thinking about in January?"
                value={query}
                onKeyPress={handleKeyPress}
                className="flex-1 bg-transparent border-none text-white placeholder-slate-500 outline-none"
              />
            </div>
            <Button className="bg-gradient-to-r from-cyan-600 to-blue-600" onClick={handleSearch} disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            {[
              'Last 7 days',
              'Important only',
              'People',
              'Places',
              'Projects',
            ].map((filter) => (
              <Button key={filter} variant="ghost" size="sm">
                {filter}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Example Queries */}
      <Card className="border-slate-700 bg-slate-800/30">
        <div className="p-6">
          <p className="text-sm text-slate-400 mb-3">Try asking:</p>
          <div className="space-y-2">
            <p className="text-sm text-slate-300 cursor-pointer hover:text-cyan-400">
              💡 "What was I focused on three months ago?"
            </p>
            <p className="text-sm text-slate-300 cursor-pointer hover:text-cyan-400">
              🤔 "Why did I make this decision?"
            </p>
            <p className="text-sm text-slate-300 cursor-pointer hover:text-cyan-400">
              📍 "Show me everything connected to this project"
            </p>
            <p className="text-sm text-slate-300 cursor-pointer hover:text-cyan-400">
              📈 "How has this goal changed over time?"
            </p>
          </div>
        </div>
      </Card>

      {!hasSearched ? (
        <div className="space-y-4">
          <p className="text-slate-400 text-center py-8">Start typing to search your memories...</p>
        </div>
      ) : loading ? (
        <Card className="border-slate-700 bg-slate-800/50 p-6 text-slate-400">
          Searching your memories...
        </Card>
      ) : results.length === 0 ? (
        <Card className="border-dashed border-slate-700 bg-slate-800/30 p-10 text-center text-slate-400">
          No results found for "{query}". Try different keywords or broader search terms.
        </Card>
      ) : (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
            {results.length} Result{results.length !== 1 ? 's' : ''}
          </h2>
          {results.map((result) => (
            <Card
              key={result.id}
              className="border-slate-700 bg-slate-800/50 hover:bg-slate-800/70 transition-all cursor-pointer"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="px-2 py-1 bg-slate-700 text-xs font-semibold text-slate-300 rounded mr-3">
                      Memory
                    </span>
                    {result.importance ? (
                      <span className="px-2 py-1 bg-slate-700 text-xs font-semibold text-amber-300 rounded">
                        {result.importance}
                      </span>
                    ) : null}
                  </div>
                </div>
                <h3 className="font-semibold text-white mb-2">{result.title}</h3>
                <p className="text-sm text-slate-400 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {result.created_at ? new Date(result.created_at).toLocaleDateString() : 'No date'}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
