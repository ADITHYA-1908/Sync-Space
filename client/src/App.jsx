import { useState, useEffect, useCallback } from 'react';

// Read API base URL from Vite environment variables (fallback to localhost:5000)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

function App() {
  const [healthData, setHealthData] = useState(null);
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [latency, setLatency] = useState(null);
  const [lastChecked, setLastChecked] = useState(null);

  const checkHealth = useCallback(async () => {
    setStatus('loading');
    setErrorMessage('');
    const startTime = performance.now();

    try {
      const response = await fetch(`${API_BASE_URL}/api/health`, {
        headers: { 'Accept': 'application/json' },
      });

      const roundTrip = Math.round(performance.now() - startTime);
      setLatency(roundTrip);

      if (!response.ok) {
        throw new Error(`Server responded with HTTP status ${response.status} (${response.statusText})`);
      }

      const data = await response.json();
      setHealthData(data);
      setStatus('success');
      setLastChecked(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Health check failed:', err);
      setStatus('error');
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Unable to connect to the backend server. Please verify it is running.'
      );
      setHealthData(null);
      setLastChecked(new Date().toLocaleTimeString());
    }
  }, []);

  // Run health check on initial component mount
  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navigation Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                SyncSpace
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                  Part 1 Foundation
                </span>
              </span>
              <p className="text-xs text-slate-400">Real-Time Team Communication Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white transition flex items-center gap-1.5"
            >
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-12 w-full space-y-10">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Welcome to SyncSpace
          </h1>
          <p className="text-slate-400 text-base sm:text-lg">
            Part 1 setup is complete. The React + Vite client and Node.js + Express backend are structured, configured, and ready for development.
          </p>
        </div>

        {/* Backend Health Check Card */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
            <div>
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                Backend System Status
                {status === 'loading' && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-normal">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    Checking...
                  </span>
                )}
                {status === 'success' && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-normal">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Connected
                  </span>
                )}
                {status === 'error' && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-rose-400 font-normal">
                    <span className="w-2 h-2 rounded-full bg-rose-400" />
                    Disconnected
                  </span>
                )}
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Monitors <code className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 font-mono text-xs">{API_BASE_URL}/api/health</code>
              </p>
            </div>

            <button
              id="refresh-health-btn"
              onClick={checkHealth}
              disabled={status === 'loading'}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-medium text-sm rounded-xl transition shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 self-start sm:self-auto cursor-pointer"
            >
              <svg
                className={`w-4 h-4 ${status === 'loading' ? 'animate-spin' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh Status</span>
            </button>
          </div>

          {/* Status Display States */}
          <div className="pt-6">
            {status === 'loading' && (
              <div className="py-10 flex flex-col items-center justify-center space-y-3">
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-slate-400">Pinging backend health check endpoint...</p>
              </div>
            )}

            {status === 'error' && (
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-5 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400 shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-rose-300">Backend Connection Failed</h3>
                    <p className="text-sm text-rose-200/80 mt-1">{errorMessage}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-rose-500/20 text-xs text-slate-300 space-y-1">
                  <p className="font-medium text-slate-200">How to resolve:</p>
                  <p>1. Open a terminal and run: <code className="bg-slate-900 px-1.5 py-0.5 rounded text-amber-300 font-mono">npm run server</code> or <code className="bg-slate-900 px-1.5 py-0.5 rounded text-amber-300 font-mono">npm run dev</code> from root.</p>
                  <p>2. Verify the backend port matches <code className="bg-slate-900 px-1.5 py-0.5 rounded text-slate-300 font-mono">{API_BASE_URL}</code> in <code className="bg-slate-900 px-1.5 py-0.5 rounded text-slate-300 font-mono">client/.env</code>.</p>
                </div>
              </div>
            )}

            {status === 'success' && healthData && (
              <div className="space-y-6">
                {/* Metric Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                    <span className="text-xs text-slate-400 block">Server Status</span>
                    <span className="text-lg font-bold text-emerald-400 uppercase mt-0.5 block">{healthData.status}</span>
                  </div>
                  <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                    <span className="text-xs text-slate-400 block">Round-Trip Latency</span>
                    <span className="text-lg font-bold text-slate-200 mt-0.5 block">{latency !== null ? `${latency} ms` : '—'}</span>
                  </div>
                  <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                    <span className="text-xs text-slate-400 block">Server Uptime</span>
                    <span className="text-lg font-bold text-slate-200 mt-0.5 block">{healthData.uptime || '—'}</span>
                  </div>
                  <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                    <span className="text-xs text-slate-400 block">Last Verified</span>
                    <span className="text-lg font-bold text-slate-200 mt-0.5 block">{lastChecked || '—'}</span>
                  </div>
                </div>

                {/* Raw JSON Response Card */}
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-medium">Raw Health Response Payload:</span>
                    <span className="text-emerald-400 font-mono">HTTP 200 OK</span>
                  </div>
                  <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-emerald-300 overflow-x-auto">
                    {JSON.stringify(healthData, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Project Architecture & Roadmap */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-white">SyncSpace Architecture & Roadmap</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Active</span>
                <span className="text-xs text-slate-500">Part 1</span>
              </div>
              <h3 className="font-semibold text-white">React 19 + Vite</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Modern client initialized with Tailwind CSS styling and environment-configured API layer.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Active</span>
                <span className="text-xs text-slate-500">Part 1</span>
              </div>
              <h3 className="font-semibold text-white">Node + Express</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                ES module backend with CORS handling, centralized error handler, and <code>/api/health</code> endpoint.
              </p>
            </div>

            <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-5 space-y-2 opacity-70">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-400">Upcoming</span>
                <span className="text-xs text-slate-500">Part 2+</span>
              </div>
              <h3 className="font-semibold text-slate-300">MongoDB + Mongoose</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Data persistence for users, workspaces, channels, messages, and direct conversations.
              </p>
            </div>

            <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-5 space-y-2 opacity-70">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-400">Upcoming</span>
                <span className="text-xs text-slate-500">Part 3+</span>
              </div>
              <h3 className="font-semibold text-slate-300">Socket.IO Real-Time</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Instant messaging, typing indicators, user online/offline status, and live channel updates.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        <p>SyncSpace — Full-Stack MERN Platform • Part 1 Setup Complete</p>
      </footer>
    </div>
  );
}

export default App;
