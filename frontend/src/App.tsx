import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { WorkspacePage } from '@/pages/WorkspacePage';
import { HomePage } from '@/pages/HomePage';
import { useHealth } from '@/hooks/useHealth';
import { useOllamaStatus } from '@/hooks/useOllamaStatus';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'workspace' | 'system'>('workspace');
  const { health, error: healthError } = useHealth(true);
  const { status: ollamaStatus } = useOllamaStatus(true);

  const apiStatus = health?.status === 'ok' ? 'online' : healthError ? 'offline' : 'idle';
  const isOllamaReady = Boolean(ollamaStatus?.connected && ollamaStatus?.model_installed);

  return (
    <div className="min-h-screen bg-[#F3F0E8] text-[#171717] flex flex-col font-sans selection:bg-[#F2C230] selection:text-[#171717]">
      <Header
        apiStatus={apiStatus}
        ollamaStatus={ollamaStatus}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <main className="flex-1">
        {activeTab === 'workspace' ? (
          <WorkspacePage ollamaStatus={ollamaStatus} />
        ) : (
          <HomePage />
        )}
      </main>
      <footer className="border-t-2 border-[#171717] bg-[#FFFFFF] py-6 text-xs text-[#4A4A4A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-black text-[#171717] uppercase tracking-wider font-heading">Argus</span>
            <span className="text-[#171717] font-bold">&bull;</span>
            <span className="text-[#4A4A4A] font-mono uppercase tracking-wide text-[11px]">Understand. Optimize. Execute.</span>
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px] text-[#4A4A4A] uppercase tracking-wider">
            <span>Phase 3: Real Local Inference</span>
            <span className="text-[#171717] font-bold">&bull;</span>
            <span className={`font-bold ${isOllamaReady ? 'text-[#2457C5]' : 'text-[#E53935]'}`}>
              Local LLM: {isOllamaReady ? `Active (${ollamaStatus?.model})` : 'Offline'}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;

