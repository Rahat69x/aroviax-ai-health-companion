"use client";

import React, { useState } from "react";
import { Globe, Search, ExternalLink, AlertCircle, BookOpen, RefreshCw } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { searchTrustedSources, TRUSTED_SOURCE_LIST, TrustedSource } from "@/lib/trustedSources";

const QUICK_TOPICS = ["mental health", "diabetes", "hypertension", "Bangladesh", "medications", "nutrition", "vaccines"];

export function TrustedSourcesFinder() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TrustedSource[]>(TRUSTED_SOURCE_LIST);
  const [searched, setSearched] = useState(false);

  const handleSearch = (q?: string) => {
    const term = q !== undefined ? q : query;
    const result = searchTrustedSources(term);
    setResults(result.sources);
    setSearched(true);
  };

  const handleQuickTopic = (topic: string) => {
    setQuery(topic);
    handleSearch(topic);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0]">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-xl font-bold text-[#172554]">Trusted Medical Sources</h2>
          <StatusBadge status="Demo" />
        </div>
        <p className="text-sm text-[#64748B]">Browse verified public-health information sources. Links open the original organization websites. Sources are curated from WHO, CDC, NHS, NLM, and DGHS Bangladesh.</p>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
        <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-900">
          <strong>Source transparency:</strong> These are links to publicly available health education websites. MediSupport AI does not control their content. This is not a search engine — it is a curated, static directory of verified organizations. Always review findings with your healthcare provider.
        </p>
      </div>

      {/* Search */}
      <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] space-y-3">
        <form onSubmit={e => { e.preventDefault(); handleSearch(); }} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#64748B]" />
            <input
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by topic (e.g. diabetes, mental health, Bangladesh)"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm outline-none focus:border-[#0D817C]"
            />
          </div>
          <button type="submit"
            className="px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-[#0D817C] hover:bg-[#086B67] flex items-center gap-2">
            <Search className="w-4 h-4" /> Search
          </button>
        </form>
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-[#64748B] font-semibold">Quick topics:</span>
          {QUICK_TOPICS.map(t => (
            <button key={t} type="button" onClick={() => handleQuickTopic(t)}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#E8F6F4] hover:bg-[#0D817C] hover:text-white text-[#0D817C] border border-[#0D817C]/20 transition-colors">
              {t}
            </button>
          ))}
          {searched && (
            <button type="button" onClick={() => { setQuery(""); setResults(TRUSTED_SOURCE_LIST); setSearched(false); }}
              className="px-2.5 py-1 rounded-lg text-xs font-medium text-[#64748B] hover:bg-[#E8F6F4] flex items-center gap-1">
              <RefreshCw className="w-3 h-3" /> Show all
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-[#334155]">
            {results.length} source{results.length !== 1 ? "s" : ""} {searched && query ? `for "${query}"` : "available"}
          </span>
        </div>

        {results.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center">
            <BookOpen className="w-10 h-10 text-[#E2E8F0] mx-auto mb-3" />
            <p className="font-semibold text-[#334155]">No sources matched your search</p>
            <p className="text-sm text-[#64748B] mt-1">Try a broader topic or browse all sources.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {results.map(source => (
              <div key={source.id} className="bg-white rounded-2xl border border-[#E2E8F0] p-5 hover:border-[#0D817C]/40 transition-colors flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-[#E8F6F4] flex items-center justify-center shrink-0">
                    <Globe className="w-5 h-5 text-[#0D817C]" />
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${source.language === "both" ? "bg-purple-50 text-purple-700 border-purple-200" : "bg-[#E8F6F4] text-[#0D817C] border-[#0D817C]/20"}`}>
                    {source.language === "both" ? "EN + BN" : source.language.toUpperCase()}
                  </span>
                </div>
                <h4 className="font-bold text-[#172554] mb-1">{source.name}</h4>
                <p className="text-xs font-semibold text-[#0D817C] mb-2">{source.organization}</p>
                <p className="text-sm text-[#64748B] flex-1 leading-relaxed">{source.description}</p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {source.topics.slice(0, 3).map(t => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]">{t}</span>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
                  <span className="text-[10px] text-[#64748B]">Verified: {source.lastVerified}</span>
                  <a href={source.url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#0D817C] hover:bg-[#086B67] transition-colors">
                    Visit Source <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-[#64748B] text-center">
        MediSupport AI does not control or verify the real-time content of external websites. Links verified as of the dates shown above.
      </p>
    </div>
  );
}
