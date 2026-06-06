import { useState } from 'react';
import { MonitorPlay, Send, Target, Loader2, Sparkles, AlertCircle, Mail, Lightbulb, PlayCircle, Calendar, Video, Hash } from 'lucide-react';

const WEBHOOK_URL = "https://n8n.ianman.com/webhook/youtube-channel-automation";

const getFuzzyKey = (obj: any, keywords: string[]) => {
  if (!obj || typeof obj !== 'object') return undefined;
  const keys = Object.keys(obj);
  const matchedKey = keys.find(k => {
    const lowerK = k.toLowerCase().replace(/[^a-z0-9]/g, '');
    return keywords.every(kw => lowerK.includes(kw.toLowerCase()));
  });
  return matchedKey ? obj[matchedKey] : undefined;
};

const renderOutput = (data: any) => {
  let strategy = null;
  if (data && typeof data === 'object') {
    if (Array.isArray(data)) {
      strategy = getFuzzyKey(data[0], ['strategy']) || data[0];
    } else {
      strategy = getFuzzyKey(data, ['strategy']) || data;
    }
  }

  const channelName = getFuzzyKey(strategy, ['channel', 'name']);
  if (strategy && channelName) {
    const channelDesc = getFuzzyKey(strategy, ['channel', 'desc']);
    
    const videoIdeasRaw = getFuzzyKey(strategy, ['video', 'idea']) || {};
    const videoIdeas = Array.isArray(videoIdeasRaw) ? videoIdeasRaw : Object.values(videoIdeasRaw);
    
    const seoKeywordsRaw = getFuzzyKey(strategy, ['seo', 'keyword']) || {};
    const seoKeywords = Array.isArray(seoKeywordsRaw) ? seoKeywordsRaw : Object.values(seoKeywordsRaw);

    const schedule = getFuzzyKey(strategy, ['schedule']) || {};
    
    const bestDaysRaw = getFuzzyKey(schedule, ['day']);
    const bestDays = Array.isArray(bestDaysRaw) ? bestDaysRaw.join(', ') : (typeof bestDaysRaw === 'object' && bestDaysRaw ? Object.values(bestDaysRaw).join(', ') : bestDaysRaw);
    
    const bestTime = getFuzzyKey(schedule, ['time']);
    const freq = getFuzzyKey(schedule, ['frequenc']);
    const formatNote = getFuzzyKey(schedule, ['format']) || getFuzzyKey(schedule, ['note']);
    
    const contentMixRaw = getFuzzyKey(strategy, ['content', 'mix']) || getFuzzyKey(strategy, ['content', 'rotat']) || getFuzzyKey(strategy, ['content', 'pillar']) || getFuzzyKey(schedule, ['content']);
    const contentMix = contentMixRaw ? (Array.isArray(contentMixRaw) ? contentMixRaw : Object.values(contentMixRaw)) : null;

    const sampleTitle = getFuzzyKey(strategy, ['sample', 'title']);
    const sampleDesc = getFuzzyKey(strategy, ['sample', 'desc']);

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
        {/* Header Section */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="bg-indigo-50 p-3 rounded-lg text-indigo-600 shrink-0">
              <MonitorPlay className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">{channelName}</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{channelDesc}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Video Ideas */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center">
              <Lightbulb className="w-4 h-4 mr-2 text-amber-500" />
              Video Ideas
            </h4>
            <ul className="space-y-3">
              {videoIdeas.map((idea: any, idx: number) => (
                <li key={idx} className="flex items-start text-sm text-slate-700">
                  <PlayCircle className="w-4 h-4 mr-3 mt-0.5 text-slate-400 shrink-0" />
                  <span>{String(idea)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Posting Schedule */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-blue-500" />
              Posting Schedule
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-sm text-slate-500">Frequency</span>
                <span className="text-sm font-semibold text-slate-800">{freq || 'N/A'}</span>
              </div>

              {bestDays && (
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-sm text-slate-500">Best Day(s)</span>
                  <span className="text-sm font-semibold text-slate-800 text-right">{bestDays}</span>
                </div>
              )}

              {bestTime && (
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-sm text-slate-500">Best Time</span>
                  <span className="text-sm font-semibold text-slate-800">{bestTime}</span>
                </div>
              )}

              {formatNote && (
                <p className="text-xs text-slate-500 italic mt-2">
                  {formatNote}
                </p>
              )}

              {contentMix && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Content Mix / Rotation</span>
                  <ul className="space-y-1.5">
                    {contentMix.map((item: any, idx: number) => (
                      <li key={idx} className="text-xs text-slate-600 flex items-start">
                        <span className="w-1 h-1 rounded-full bg-blue-400 mt-1.5 mr-2 shrink-0" />
                        <span>{String(item)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sample Video */}
        <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center">
            <Video className="w-4 h-4 mr-2 text-rose-500" />
            Sample Video Concept
          </h4>
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <h5 className="font-semibold text-slate-900 mb-2">{sampleTitle}</h5>
            <p className="text-sm text-slate-600 whitespace-pre-wrap">{sampleDesc}</p>
          </div>
        </div>

        {/* SEO Keywords */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center">
            <Hash className="w-4 h-4 mr-2 text-emerald-500" />
            SEO Keywords
          </h4>
          <div className="flex flex-wrap gap-2">
            {seoKeywords.map((kw: any, idx: number) => (
              <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full border border-slate-200">
                {String(kw)}
              </span>
            ))}
          </div>
        </div>

      </div>
    );
  }

  // Fallback for non-matching JSON or plain text
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm text-left">
        <pre className="whitespace-pre-wrap font-mono text-sm text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-100 overflow-x-auto">
          {typeof data === 'object' ? JSON.stringify(data, null, 2) : data}
        </pre>
      </div>
    </div>
  );
};

function App() {
  const [formData, setFormData] = useState({
    businessName: '',
    industry: '',
    targetAudience: '',
    businessGoal: '',
    contentFrequency: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [outputData, setOutputData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json().catch(async () => {
        // Fallback for text response
        return await response.text();
      });

      setOutputData(data);
    } catch (err) {
      console.error(err);
      setError("Failed to communicate with n8n webhook. Make sure the URL is correct and the webhook is active.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center space-x-4">
          <img
            src="https://www.essnps.com/wp-content/uploads/2025/07/ESSNPS%C2%AE.svg"
            alt="ESSNPS Logo"
            className="h-10 w-auto"
          />
          <div className="hidden sm:block border-l border-slate-200 pl-4 py-1">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Channel Automation</h1>
            <p className="text-xs text-slate-500 font-medium">Generate AI-powered YouTube content strategies</p>
          </div>
        </div>
        <div className="flex items-center">
          <a
            href="mailto:rfq@essnps.com"
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-colors border border-transparent hover:border-slate-200"
          >
            <Mail className="w-4 h-4 text-indigo-500" />
            <span className="hidden sm:inline">rfq@essnps.com</span>
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* LEFT SIDE: Input Panel (35%) */}
          <div className="w-full lg:w-[35%]">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-lg font-semibold flex items-center text-slate-800">
                  <Target className="w-5 h-5 mr-2 text-blue-600" />
                  Strategy Parameters
                </h2>
                <p className="text-sm text-slate-500 mt-1">Configure your business details to generate a custom strategy.</p>
              </div>

              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Business Name</label>
                    <select
                      name="businessName"
                      required
                      value={formData.businessName}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm bg-white"
                    >
                      <option value="" disabled>Select a company</option>
                      <option value="https://www.essnps.com">ESSNPS</option>
                      <option value="https://www.enwps.com">ENWPS</option>
                      <option value="https://www.eaxprts.com">EAXPRTS</option>
                      <option value="https://www.essgeeks.com">ESSGEEKS</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Industry</label>
                    <select
                      name="industry"
                      required
                      value={formData.industry}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm bg-white"
                    >
                      <option value="" disabled>Select an industry</option>
                      <option value="Heavy Industries">Heavy Industries</option>
                      <option value="Discrete Manufacturing">Discrete Manufacturing</option>
                      <option value="Oil & Gas">Oil & Gas</option>
                      <option value="Melting, Heating & Welding Industry">Melting, Heating & Welding Industry</option>
                      <option value="Pipe Manufacturing, Cutting/Shearing">Pipe Manufacturing, Cutting/Shearing</option>
                      <option value="Material Handling">Material Handling</option>
                      <option value="Food & Pharma">Food & Pharma</option>
                      <option value="Special Purpose Machinery">Special Purpose Machinery</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Target Audience</label>
                    <textarea
                      name="targetAudience"
                      required
                      value={formData.targetAudience}
                      onChange={handleChange}
                      placeholder="e.g. Global manufacturing companies, EPC contractors, and industrial enterprises looking for reliable sourcing, procurement, and detail engineering services."
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm resize-none placeholder:text-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Business Goal</label>
                    <select
                      name="businessGoal"
                      required
                      value={formData.businessGoal}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm bg-white"
                    >
                      <option value="" disabled>Select a goal</option>
                      <option value="Supply Chain Optimization">Supply Chain Optimization</option>
                      <option value="Cost Reduction">Cost Reduction</option>
                      <option value="Improved Quality">Improved Quality</option>
                      <option value="Efficient Resource Management">Efficient Resource Management</option>
                      <option value="Sustainable Sourcing">Sustainable Sourcing</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Content Frequency</label>
                    <select
                      name="contentFrequency"
                      required
                      value={formData.contentFrequency}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm bg-white"
                    >
                      <option value="" disabled>Select frequency</option>
                      <option value="1 Video Per Week">1 Video Per Week</option>
                      <option value="2 Videos Per Week">2 Videos Per Week</option>
                      <option value="3 Videos Per Week">3 Videos Per Week</option>
                    </select>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex items-center justify-center py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition-all shadow-sm focus:ring-2 focus:ring-slate-900/20 focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed group"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Generating Strategy...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-2 text-yellow-400 group-hover:scale-110 transition-transform" />
                          Generate Strategy
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Output Panel (65%) */}
          <div className="w-full lg:w-[65%]">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 h-full min-h-[600px] flex flex-col overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold flex items-center text-slate-800">
                    <Send className="w-5 h-5 mr-2 text-indigo-600" />
                    Generated Strategy Output
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">AI-generated content plan tailored to your inputs.</p>
                </div>
              </div>

              <div className="flex-1 p-6 bg-slate-50/30 overflow-auto">
                {isLoading ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400">
                    <div className="relative">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <Sparkles className="w-8 h-8 text-blue-600 animate-pulse" />
                      </div>
                      <Loader2 className="w-6 h-6 text-blue-600 animate-spin absolute -bottom-1 -right-1" />
                    </div>
                    <p className="text-lg font-medium text-slate-600">Analyzing parameters...</p>
                    <p className="text-sm text-slate-500 mt-2 text-center max-w-sm">
                      Our AI is crafting a bespoke YouTube strategy based on your industry and goals.
                    </p>
                  </div>
                ) : error ? (
                  <div className="h-full flex flex-col items-center justify-center text-red-500">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                      <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <p className="text-lg font-medium text-red-600">Generation Failed</p>
                    <p className="text-sm text-red-500/80 mt-2 text-center max-w-sm">
                      {error}
                    </p>
                  </div>
                ) : outputData ? (
                  renderOutput(outputData)
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400">
                    <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mb-5 rotate-3 shadow-inner">
                      <MonitorPlay className="w-10 h-10 text-slate-300" />
                    </div>
                    <p className="text-lg font-medium text-slate-500">Waiting for strategy generation...</p>
                    <p className="text-sm text-slate-400 mt-2 text-center max-w-sm">
                      Fill out the form on the left and click "Generate Strategy" to receive your custom YouTube content plan.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;
