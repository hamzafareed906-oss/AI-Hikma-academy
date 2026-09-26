import React from 'react';
import { X, Server, Check, Activity, ShieldCheck, Zap, Cpu } from 'lucide-react';
import { EDUCATION_SERVERS, EducationServer } from '../data/curricula';

interface ServerSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedServerId: string;
  onSelectServer: (server: EducationServer) => void;
  isRtl: boolean;
}

export const ServerSelectorModal: React.FC<ServerSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedServerId,
  onSelectServer,
  isRtl,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-3xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Education AI Server & Engine Nodes
                <span className="flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active Mesh
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Inspect and switch the neural cluster and compute grid processing your education queries.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Safety & Uptime Banner */}
        <div className="px-6 py-3 bg-emerald-50 dark:bg-emerald-950/20 border-b border-emerald-100 dark:border-emerald-900/40 flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-200">
          <div className="flex items-center gap-2 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <span>Strict Educational Safety Guard Active: Zero NSFW, Academic & Islamic Adab Filter Enforced.</span>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1"><Cpu className="w-3.5 h-3.5" /> High-Performance TPU</span>
            <span className="flex items-center gap-1"><Activity className="w-3.5 h-3.5 text-emerald-500" /> Avg Latency: 22ms</span>
          </div>
        </div>

        {/* Server List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {EDUCATION_SERVERS.map((srv) => {
            const isSelected = selectedServerId === srv.id;
            return (
              <div
                key={srv.id}
                onClick={() => {
                  onSelectServer(srv);
                  onClose();
                }}
                className={`p-4 rounded-xl border cursor-pointer transition relative ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 shadow-md ring-1 ring-blue-500'
                    : 'border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl mt-0.5">{srv.flag}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {srv.name}
                        </h4>
                        {srv.isDefault && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                            Recommended
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {srv.location} • <span className="font-medium text-slate-700 dark:text-slate-300">{srv.provider}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right">
                      <div className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 flex items-center justify-end gap-1">
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        {srv.pingMs} ms
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Uptime {srv.uptime}
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                        isSelected
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 mb-2 pl-9">
                  {srv.description}
                </p>

                <div className="pl-9 flex items-center gap-2 text-[11px] text-blue-700 dark:text-blue-300 font-medium">
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    🎯 Specialization: {srv.specialization}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
