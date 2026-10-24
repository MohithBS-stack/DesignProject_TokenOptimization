import React, { useState } from 'react';
import { PromptEditor } from '@/components/PromptEditor';
import { OptimizationControls } from '@/components/OptimizationControls';
import { ComparisonView } from '@/components/ComparisonView';
import { MetricsPanel } from '@/components/MetricsPanel';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { apiService } from '@/services/api';
import { EXAMPLE_PROMPTS } from '@/services/mockOptimizer';
import {
  OptimizationMode,
  TargetModel,
  OptimizationResult,
  OptimizationStatus,
  ExamplePrompt,
  OllamaStatus,
} from '@/types';
import {
  Sparkles,
  Zap,
  AlertTriangle,
  Clock,
  Cpu,
} from 'lucide-react';

export interface WorkspacePageProps {
  ollamaStatus?: OllamaStatus | null;
}

export const WorkspacePage: React.FC<WorkspacePageProps> = ({ ollamaStatus }) => {
  const [rawPrompt, setRawPrompt] = useState<string>('');
  const [mode, setMode] = useState<OptimizationMode>('balanced');
  const [targetModel, setTargetModel] = useState<TargetModel>('gpt-4o');
  const [status, setStatus] = useState<OptimizationStatus>('idle');
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSelectExample = (example: ExamplePrompt) => {
    setRawPrompt(example.content);
    setErrorMessage(null);
  };

  const handleClear = () => {
    setRawPrompt('');
    setResult(null);
    setStatus('idle');
    setErrorMessage(null);
  };

  const handleOptimize = async () => {
    const trimmed = rawPrompt.trim();
    if (!trimmed) {
      setErrorMessage('Please enter or select a prompt before optimizing.');
      setStatus('error');
      return;
    }

    setErrorMessage(null);
    setStatus('optimizing');

    try {
      // Real backend API call to FastAPI -> Ollama (qwen2.5:1.5b)
      const optimizationResult = await apiService.optimizePrompt({
        prompt: trimmed,
        mode,
        target_model: targetModel,
      });

      setResult(optimizationResult);
      setStatus('success');
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred during prompt optimization'
      );
      setStatus('error');
    }
  };

  const handleOptimizedPromptChange = (updated: string) => {
    if (result) {
      setResult({
        ...result,
        optimizedPrompt: updated,
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Workspace Header / Banner */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider bg-[#FFFFFF] text-[#171717] border-2 border-[#171717] shadow-[2px_2px_0px_#171717]">
              <Sparkles className="w-3.5 h-3.5 text-[#2457C5]" />
              <span>Argus Prompt Optimization Workspace</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[#171717] uppercase font-heading mt-3">
              Optimize Input Tokens & Preserve Constraints
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#171717] bg-[#E7E3D9] px-3.5 py-2 border-2 border-[#171717] shadow-[2px_2px_0px_#171717] flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-[#2457C5]" />
              <span>Local Engine: {ollamaStatus?.model || 'qwen2.5:1.5b'}</span>
            </span>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-[#4A4A4A] max-w-3xl leading-relaxed font-sans">
          Prepare, compress, and refine prompts using local neural inference before dispatching to
          frontier LLMs. Select an optimization profile, evaluate token reduction, and inspect
          side-by-side output.
        </p>
      </section>

      {/* Error State Banner */}
      {status === 'error' && errorMessage && (
        <div
          role="alert"
          className="flex items-start justify-between gap-3 p-4 bg-[#FFFDF0] border-2 border-[#E53935] shadow-[3px_3px_0px_#E53935] text-[#171717]"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#E53935] mt-0.5 shrink-0" />
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#E53935] font-mono">Optimization Notice</h4>
              <p className="text-xs text-[#171717] mt-1 leading-relaxed font-mono">{errorMessage}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setErrorMessage(null)}
            className="text-xs font-bold bg-[#FFFFFF] border border-[#171717] hover:bg-[#FDF2F2] hover:text-[#E53935] shrink-0"
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* Primary Workspace Grid: Input & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Raw Prompt Editor */}
        <div className="lg:col-span-7 h-full">
          <PromptEditor
            value={rawPrompt}
            onChange={(val) => {
              setRawPrompt(val);
              if (errorMessage) setErrorMessage(null);
            }}
            onClear={handleClear}
            onSelectExample={handleSelectExample}
            disabled={status === 'optimizing'}
          />
        </div>

        {/* Right: Optimization Controls */}
        <div className="lg:col-span-5 h-full">
          <OptimizationControls
            mode={mode}
            onModeChange={setMode}
            targetModel={targetModel}
            onTargetModelChange={setTargetModel}
            onOptimize={handleOptimize}
            isLoading={status === 'optimizing'}
            disabled={rawPrompt.trim().length === 0}
            ollamaStatus={ollamaStatus}
          />
        </div>
      </div>

      {/* Loading State Animation */}
      {status === 'optimizing' && (
        <Card className="p-8 text-center border-2 border-[#171717] bg-[#FFFFFF] shadow-[4px_4px_0px_#2457C5]">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-14 h-14 mx-auto bg-[#F2C230] border-2 border-[#171717] shadow-[2px_2px_0px_#171717] flex items-center justify-center text-[#171717] animate-pulse">
              <Zap className="w-7 h-7 text-[#171717] animate-bounce" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-[#171717] uppercase tracking-wider font-heading">
                Optimizing Prompt with {mode.toUpperCase()} Profile...
              </h3>
              <p className="text-xs text-[#4A4A4A] leading-relaxed">
                Local model <code className="text-[#2457C5] font-mono font-bold bg-[#FAF8F5] px-1 py-0.5 border border-[#171717]">{ollamaStatus?.model || 'qwen2.5:1.5b'}</code> is
                extracting constraints and pruning tokens.
              </p>
            </div>
            <div className="flex items-center justify-center gap-4 text-[11px] font-mono font-bold uppercase tracking-wider text-[#2457C5]">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 animate-spin" /> Ollama local inference in progress
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* Success State: Results & Metrics */}
      {status === 'success' && result && (
        <section className="space-y-6 pt-2">
          {/* Metrics Panel */}
          <MetricsPanel result={result} />

          {/* Comparison View */}
          <ComparisonView
            originalPrompt={result.originalPrompt}
            optimizedPrompt={result.optimizedPrompt}
            onOptimizedPromptChange={handleOptimizedPromptChange}
            originalMetrics={result.originalMetrics}
            optimizedMetrics={result.optimizedMetrics}
            tokenReductionPercent={result.tokenReductionPercent}
            tokenSavings={result.tokenSavings}
            tokenChangePercent={result.tokenChangePercent}
            strategy={result.strategy}
            isPreserved={result.isPreserved}
            validationStatus={result.validationStatus}
            model={result.model}
          />
        </section>
      )}

      {/* Empty State / Initial Guidance (When idle and no result yet) */}
      {status === 'idle' && !result && (
        <Card className="p-10 border-2 border-dashed border-[#171717] bg-[#FAF8F5] text-center shadow-none">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-14 h-14 mx-auto bg-[#FFFFFF] border-2 border-[#171717] shadow-[2px_2px_0px_#171717] flex items-center justify-center text-[#171717]">
              <Zap className="w-6 h-6 text-[#2457C5]" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#171717] font-mono">
                Prompt Optimization Workspace Ready
              </h3>
              <p className="text-xs text-[#717171] leading-relaxed font-mono">
                Paste a prompt or select a sample above to optimize tokens with local neural inference.
              </p>
            </div>
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSelectExample(EXAMPLE_PROMPTS[0])}
                className="text-xs font-bold"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#2457C5]" />
                <span>Try Example: Code Review</span>
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

