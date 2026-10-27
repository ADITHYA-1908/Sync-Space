import React from 'react';
import { Activity, RefreshCw, X, CheckCircle2, AlertCircle, Clock, Server, ShieldCheck } from 'lucide-react';

export const HealthStatusModal = ({
  isOpen,
  onClose,
  healthData,
  healthStatus,
  latency,
  lastChecked,
  onRefresh,
  errorMessage,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="health-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 id="health-modal-title" className="text-base font-semibold text-white">
                SyncSpace System Health
              </h2>
              <p className="text-xs text-slate-400">Part 1 Express Backend Diagnostic</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Main Status Banner */}
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 ${
              healthStatus === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                : healthStatus === 'loading'
                ? 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
            }`}
          >
            {healthStatus === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
            {healthStatus === 'loading' && <RefreshCw className="w-5 h-5 text-amber-400 animate-spin shrink-0 mt-0.5" />}
            {healthStatus === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}

            <div className="flex-1">
              <div className="font-semibold text-sm">
                {healthStatus === 'success' && 'Backend Connected & Operating Normally'}
                {healthStatus === 'loading' && 'Checking backend status...'}
                {healthStatus === 'error' && 'Backend Unreachable'}
              </div>
              <p className="text-xs mt-1 text-slate-300">
                {healthStatus === 'success' && (healthData?.message || 'Server responding on /api/health')}
                {healthStatus === 'loading' && 'Querying http://localhost:5000/api/health'}
                {healthStatus === 'error' && (errorMessage || 'Ensure the Express server is running on port 5000.')}
              </p>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
              <span className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
                <Clock className="w-3.5 h-3.5" /> Latency
              </span>
              <span className="text-base font-semibold text-white">
                {latency !== null ? `${latency} ms` : '—'}
              </span>
            </div>

            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
              <span className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
                <Server className="w-3.5 h-3.5" /> Uptime
              </span>
              <span className="text-base font-semibold text-white">
                {healthData?.uptime || '—'}
              </span>
            </div>

            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
              <span className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Environment
              </span>
              <span className="text-base font-semibold text-white uppercase text-xs tracking-wider">
                {healthData?.environment || 'dev'}
              </span>
            </div>
          </div>

          {/* Raw Response Payload */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-medium">Raw Payload (GET /api/health):</span>
              <span>Last checked: {lastChecked || 'just now'}</span>
            </div>
            <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-emerald-400 overflow-x-auto max-h-40">
              {healthData ? JSON.stringify(healthData, null, 2) : '// No response data available'}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-900/60">
          <span className="text-xs text-slate-500">
            Endpoint: <code className="text-slate-400">/api/health</code>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              disabled={healthStatus === 'loading'}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${healthStatus === 'loading' ? 'animate-spin' : ''}`} />
              <span>Ping Server</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
