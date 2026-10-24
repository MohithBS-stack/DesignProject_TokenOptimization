import React from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { StatusBadge } from '@/components/StatusBadge';
import { useHealth } from '@/hooks/useHealth';
import {
  Layers,
  Cpu,
  ShieldCheck,
  Zap,
  CheckCircle2,
  RefreshCw,
  FolderTree,
  Server,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { health, isLoading, error, refetch } = useHealth(false);

  const apiStatus = health?.status === 'ok' ? 'online' : error ? 'offline' : 'idle';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Hero Section */}
      <section className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider bg-[#FFFFFF] text-[#171717] border-2 border-[#171717] shadow-[2px_2px_0px_#171717]">
          <Zap className="w-3.5 h-3.5 text-[#F2C230]" />
          <span>Prompt Optimization Middleware</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#171717] uppercase font-heading">
          Cost-Efficient LLM Inference Architecture
        </h1>
        <p className="text-base text-[#4A4A4A] max-w-3xl leading-relaxed">
          Argus employs a lightweight local model (Qwen2.5-1.5B-Instruct via Ollama) to compress,
          structure, and optimize prompts prior to main-LLM dispatch—reducing input token costs while
          strictly preserving intent and constraints.
        </p>
      </section>

      {/* Grid: Phase Status & Health Verification */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Foundation Status */}
        <Card
          title="Phase 1 Foundation"
          subtitle="Repository architecture & design system"
          badge={<StatusBadge status="online" label="Ready" />}
          className="lg:col-span-2"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <div className="flex items-start gap-3 p-3.5 bg-[#FAF8F5] border-2 border-[#D8D3C5] shadow-[2px_2px_0px_#171717]">
              <FolderTree className="w-5 h-5 text-[#2457C5] mt-0.5 shrink-0" />
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-[#171717] font-mono">Strict Directory Structure</h4>
                <p className="text-xs text-[#4A4A4A] mt-1">
                  Separated frontend, backend, docs, scripts, and workflows.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 bg-[#FAF8F5] border-2 border-[#D8D3C5] shadow-[2px_2px_0px_#171717]">
              <Layers className="w-5 h-5 text-[#2457C5] mt-0.5 shrink-0" />
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-[#171717] font-mono">Design Tokens & Themes</h4>
                <p className="text-xs text-[#4A4A4A] mt-1">
                  Warm ivory surfaces, geometric accents, accessible typography.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 bg-[#FAF8F5] border-2 border-[#D8D3C5] shadow-[2px_2px_0px_#171717]">
              <Server className="w-5 h-5 text-[#2457C5] mt-0.5 shrink-0" />
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-[#171717] font-mono">FastAPI & Pydantic</h4>
                <p className="text-xs text-[#4A4A4A] mt-1">
                  Centralized settings, modular routes, and validation schemas.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 bg-[#FAF8F5] border-2 border-[#D8D3C5] shadow-[2px_2px_0px_#171717]">
              <ShieldCheck className="w-5 h-5 text-[#2457C5] mt-0.5 shrink-0" />
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-[#171717] font-mono">Architectural Boundary</h4>
                <p className="text-xs text-[#4A4A4A] mt-1">
                  Frontend components contain no backend business logic.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Health Check Diagnostics */}
        <Card
          title="Backend Diagnostics"
          subtitle="Direct health endpoint verification"
          badge={
            <StatusBadge
              status={apiStatus}
              label={apiStatus === 'online' ? 'Online' : apiStatus === 'offline' ? 'Offline' : 'Standby'}
            />
          }
        >
          <div className="space-y-4">
            <p className="text-xs text-[#4A4A4A] font-mono">
              Verifies communication with <code className="text-[#2457C5] font-bold">/api/health</code>.
            </p>

            <div className="p-3.5 bg-[#FAF8F5] border-2 border-[#171717] shadow-[2px_2px_0px_#171717] font-mono text-xs text-[#171717] min-h-[90px] flex flex-col justify-center">
              {isLoading && (
                <div className="flex items-center gap-2 text-[#2457C5] font-bold">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Checking backend health...</span>
                </div>
              )}
              {!isLoading && health && (
                <div className="space-y-1">
                  <div className="text-[#2457C5] flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Status: {health.status}</span>
                  </div>
                  <div className="text-[#4A4A4A] text-[11px] font-bold">App: {health.app_name} v{health.version}</div>
                  <div className="text-[#717171] text-[10px]">Env: {health.environment} | {health.timestamp}</div>
                </div>
              )}
              {!isLoading && error && (
                <div className="text-[#E53935] space-y-1">
                  <div className="font-bold">Connection check:</div>
                  <div className="text-[11px] text-[#E53935]">{error}</div>
                </div>
              )}
              {!isLoading && !health && !error && (
                <span className="text-[#717171] italic">Click below to test backend connection</span>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full font-bold uppercase tracking-wider"
              onClick={() => void refetch()}
              isLoading={isLoading}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Verify Backend Health
            </Button>
          </div>
        </Card>
      </div>

      {/* Architecture Highlights */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold uppercase tracking-wider text-[#171717] font-mono flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[#2457C5]" />
          Planned Architecture Pipeline
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card className="border-l-4 border-l-[#E53935]">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#171717] font-mono">1. Intent Preservation</h3>
            <p className="text-xs text-[#4A4A4A] mt-2 leading-relaxed">
              Extracts task parameters, output formats, and semantic constraints into an immutable
              spec before compression.
            </p>
          </Card>

          <Card className="border-l-4 border-l-[#2457C5]">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#171717] font-mono">2. Local Prompt Optimization</h3>
            <p className="text-xs text-[#4A4A4A] mt-2 leading-relaxed">
              Qwen2.5-1.5B-Instruct runs on Ollama to remove redundant verbosity and optimize token
              density.
            </p>
          </Card>

          <Card className="border-l-4 border-l-[#F2C230]">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#171717] font-mono">3. Token Telemetry & Dispatch</h3>
            <p className="text-xs text-[#4A4A4A] mt-2 leading-relaxed">
              Dispatches to target frontier LLMs (e.g. OpenAI, Anthropic, Gemini) with input token
              savings metrics tracked in real-time.
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
};

