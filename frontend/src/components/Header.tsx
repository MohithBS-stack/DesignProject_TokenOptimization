import React from 'react';
import { StatusBadge } from './StatusBadge';
import { OllamaStatus } from '@/types';
import { Shield, Sparkles, Cpu, Server, Activity } from 'lucide-react';

export interface HeaderProps {
  apiStatus?: 'online' | 'offline' | 'idle';
  ollamaStatus?: OllamaStatus | null;
  activeTab?: 'workspace' | 'system';
  onTabChange?: (tab: 'workspace' | 'system') => void;
}

export const Header: React.FC<HeaderProps> = ({
  apiStatus = 'idle',
  ollamaStatus,
  activeTab = 'workspace',
  onTabChange,
}) => {
  const isOllamaReady = Boolean(ollamaStatus?.connected && ollamaStatus?.model_installed);

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-[#171717] bg-[#FFFFFF] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-4">
          {/* Brand & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#171717] border-2 border-[#171717] shadow-[2px_2px_0px_#E53935] flex items-center justify-center text-[#FFFFFF] shrink-0">
              <Shield className="w-5 h-5 text-[#F2C230]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-[#171717] tracking-wider text-xl font-heading uppercase">
                  Argus
                </span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 bg-[#F2C230] text-[#171717] border border-[#171717] shadow-[1px_1px_0px_#171717]">
                  Phase 3
                </span>
              </div>
              <p className="text-[11px] text-[#4A4A4A] hidden sm:block tracking-widest uppercase font-mono font-medium">
                Understand. Optimize. Execute.
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          {onTabChange && (
            <nav className="flex items-center gap-1.5 bg-[#E7E3D9] p-1 border-2 border-[#171717] shadow-[2px_2px_0px_#171717] text-xs font-bold uppercase tracking-wider">
              <button
                type="button"
                onClick={() => onTabChange('workspace')}
                className={`flex items-center gap-1.5 px-3 py-1.5 transition-all cursor-pointer ${
                  activeTab === 'workspace'
                    ? 'bg-[#171717] text-[#FFFFFF] border-2 border-[#171717] shadow-[1px_1px_0px_#2457C5]'
                    : 'text-[#171717] hover:bg-[#FFFFFF] border-2 border-transparent'
                }`}
              >
                <Sparkles className={`w-3.5 h-3.5 ${activeTab === 'workspace' ? 'text-[#F2C230]' : 'text-[#171717]'}`} />
                <span>Workspace</span>
              </button>
              <button
                type="button"
                onClick={() => onTabChange('system')}
                className={`flex items-center gap-1.5 px-3 py-1.5 transition-all cursor-pointer ${
                  activeTab === 'system'
                    ? 'bg-[#171717] text-[#FFFFFF] border-2 border-[#171717] shadow-[1px_1px_0px_#E53935]'
                    : 'text-[#171717] hover:bg-[#FFFFFF] border-2 border-transparent'
                }`}
              >
                <Activity className={`w-3.5 h-3.5 ${activeTab === 'system' ? 'text-[#E53935]' : 'text-[#171717]'}`} />
                <span>System Status</span>
              </button>
            </nav>
          )}

          {/* Connection Indicators */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Real Local Optimizer Status (Phase 3 Active Connection) */}
            <div
              className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-bold uppercase tracking-wider border-2 border-[#171717] shadow-[1.5px_1.5px_0px_#171717] ${
                isOllamaReady
                  ? 'bg-[#FFFFFF] text-[#171717]'
                  : 'bg-[#FDF2F2] border-[#E53935] text-[#E53935]'
              }`}
              title={
                isOllamaReady
                  ? `Connected to Ollama: ${ollamaStatus?.model}`
                  : ollamaStatus?.error || 'Local Ollama model offline'
              }
            >
              <Cpu className={`w-3.5 h-3.5 ${isOllamaReady ? 'text-[#2457C5]' : 'text-[#E53935]'}`} />
              <span>Local LLM:</span>
              <span className={`font-mono text-[11px] ${isOllamaReady ? 'text-[#2457C5]' : 'text-[#E53935]'}`}>
                {isOllamaReady ? `Connected (${ollamaStatus?.model || 'qwen2.5:1.5b'})` : 'Offline / Standby'}
              </span>
            </div>

            {/* Main LLM Gateway Status (Marked clearly as Disconnected in Phase 3) */}
            <div
              className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-bold uppercase tracking-wider bg-[#E7E3D9] border-2 border-[#171717] text-[#4A4A4A] shadow-[1.5px_1.5px_0px_#171717]"
              title="Cloud frontier LLM gateway scheduled for Phase 4"
            >
              <Server className="w-3.5 h-3.5 text-[#717171]" />
              <span>Main LLM:</span>
              <span className="text-[#717171] font-mono text-[11px]">Disconnected (Phase 4)</span>
            </div>

            {/* FastAPI Backend Status */}
            <StatusBadge
              status={apiStatus}
              label={
                apiStatus === 'online'
                  ? 'API Online'
                  : apiStatus === 'offline'
                  ? 'API Offline'
                  : 'API Standby'
              }
            />
          </div>
        </div>

        {/* Mobile Sub-bar for Connection Status */}
        <div className="lg:hidden flex items-center justify-between py-2 border-t border-[#171717] text-[10px] text-[#4A4A4A] font-mono font-bold uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 ${isOllamaReady ? 'bg-[#2457C5]' : 'bg-[#E53935]'}`} />
            <span>Local LLM: {isOllamaReady ? 'Online (qwen2.5:1.5b)' : 'Offline'}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-[#717171]" />
            <span>Main Gateway: Standby</span>
          </div>
        </div>
      </div>
    </header>
  );
};

