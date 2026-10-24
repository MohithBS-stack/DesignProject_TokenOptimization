import React, { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { TokenEstimation, OptimizationStrategy, ValidationStatus } from '@/types';
import { Copy, Check, Edit3, ArrowRight, Layers, FileCode } from 'lucide-react';

export interface ComparisonViewProps {
  originalPrompt: string;
  optimizedPrompt: string;
  onOptimizedPromptChange: (val: string) => void;
  originalMetrics: TokenEstimation;
  optimizedMetrics: TokenEstimation;
  tokenReductionPercent: number;
  tokenSavings: number;
  tokenChangePercent?: number;
  strategy?: OptimizationStrategy;
  isPreserved?: boolean;
  validationStatus?: ValidationStatus;
  model?: string;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  originalPrompt,
  optimizedPrompt,
  onOptimizedPromptChange,
  originalMetrics,
  optimizedMetrics,
  tokenReductionPercent,
  tokenSavings,
  tokenChangePercent = 0,
  strategy = 'compress',
  isPreserved = false,
  validationStatus = 'passed',
  model = 'qwen2.5:1.5b',
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(optimizedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = optimizedPrompt;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header bar with comparison summary */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-[#FFFFFF] border-2 border-[#171717] shadow-[2px_2px_0px_#171717]">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#2457C5]" />
          <span className="text-sm font-bold uppercase tracking-wider text-[#171717] font-mono">
            Prompt Comparison & Diff View
          </span>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 bg-[#E7E3D9] text-[#171717] border border-[#171717] shadow-[1px_1px_0px_#171717]">
            Strategy: {strategy}
          </span>
          {isPreserved && (
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 bg-[#FFFDF0] text-[#171717] border border-[#171717] shadow-[1px_1px_0px_#F2C230]">
              Preserved
            </span>
          )}
          {validationStatus === 'fallback' && (
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 bg-[#FDF2F2] text-[#E53935] border border-[#E53935]">
              Fallback Baseline
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold bg-[#FAF8F5] px-3 py-1.5 border-2 border-[#171717] text-[#171717] shadow-[1.5px_1.5px_0px_#171717]">
            <span>{originalMetrics.estimatedTokens} est. tokens</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#2457C5]" />
            <span className={tokenSavings >= 0 ? 'text-[#2457C5] font-black' : 'text-[#E53935] font-black'}>
              {optimizedMetrics.estimatedTokens} est. tokens
            </span>
          </div>

          <div
            className={`text-xs font-mono uppercase tracking-wider px-2.5 py-1.5 font-bold border-2 border-[#171717] shadow-[1.5px_1.5px_0px_#171717] ${
              tokenSavings > 0
                ? 'bg-[#2457C5] text-[#FFFFFF]'
                : tokenSavings < 0
                ? 'bg-[#F2C230] text-[#171717]'
                : 'bg-[#E7E3D9] text-[#171717]'
            }`}
          >
            {tokenSavings > 0
              ? `-${tokenReductionPercent}% estimated tokens`
              : tokenSavings < 0
              ? `+${tokenChangePercent}% estimated expansion`
              : '0% change (preserved)'}
          </div>
        </div>
      </div>

      {/* Side-by-side prompt views */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Original Prompt (Read-only reference) */}
        <Card
          title="Original Prompt (Pre-Optimization)"
          subtitle="Reference input payload"
          badge={
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 bg-[#E7E3D9] text-[#171717] border border-[#171717] shadow-[1px_1px_0px_#171717]">
              ~{originalMetrics.estimatedTokens} tokens (est.)
            </span>
          }
          className="flex flex-col h-full bg-[#FFFFFF]"
        >
          <div className="flex-1 p-3.5 bg-[#FAF8F5] border-2 border-[#D8D3C5] text-[#171717] text-xs font-mono whitespace-pre-wrap leading-relaxed overflow-y-auto max-h-[360px] min-h-[220px]">
            {originalPrompt}
          </div>

          <div className="mt-2.5 flex items-center justify-between text-[10px] text-[#717171] font-mono font-bold uppercase tracking-wider">
            <span>{originalMetrics.charCount} characters</span>
            <span>Unmodified User Input</span>
          </div>
        </Card>

        {/* Right: Optimized Prompt (Interactive / Copyable / Editable) */}
        <Card
          title={isPreserved ? 'Preserved Prompt (Original Retained)' : 'Optimized Prompt (Rewritten)'}
          subtitle={
            isPreserved
              ? 'Original retained to guarantee safety and prevent distortion'
              : 'Actionable payload optimized for downstream execution'
          }
          badge={
            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-7 px-2.5 text-[11px] bg-[#FFFFFF] hover:bg-[#F2C230] text-[#171717] border-2 border-[#171717] shadow-[1px_1px_0px_#171717]"
                aria-label="Copy optimized prompt"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#2457C5]" />
                    <span className="text-[#2457C5] font-bold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </Button>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-1 h-7 px-2.5 text-[11px] font-bold uppercase tracking-wider font-mono bg-[#E7E3D9] hover:bg-[#171717] hover:text-[#FFFFFF] text-[#171717] border-2 border-[#171717] shadow-[1px_1px_0px_#171717] transition-colors cursor-pointer"
                title="Toggle manual edits"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditing ? 'Done Editing' : 'Edit'}</span>
              </button>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 bg-[#FFFDF0] text-[#171717] border-2 border-[#171717] shadow-[1px_1px_0px_#171717]">
                ~{optimizedMetrics.estimatedTokens} tokens (est.)
              </span>
            </div>
          }
          className="flex flex-col h-full bg-[#FFFFFF]"
        >
          {isEditing ? (
            <textarea
              value={optimizedPrompt}
              onChange={(e) => onOptimizedPromptChange(e.target.value)}
              className="flex-1 p-3.5 bg-[#FFFFFF] border-2 border-[#2457C5] text-[#171717] text-xs font-mono whitespace-pre-wrap leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-[#2457C5] shadow-[2px_2px_0px_#2457C5] max-h-[360px] min-h-[220px]"
              aria-label="Editable optimized prompt"
            />
          ) : (
            <div className="flex-1 p-3.5 bg-[#FFFFFF] border-2 border-[#171717] text-[#171717] text-xs font-mono whitespace-pre-wrap leading-relaxed overflow-y-auto max-h-[360px] min-h-[220px] shadow-[inset_1px_1px_0px_rgba(0,0,0,0.05)] selection:bg-[#F2C230] selection:text-[#171717]">
              {optimizedPrompt}
            </div>
          )}

          <div className="mt-2.5 flex items-center justify-between text-[10px] text-[#717171] font-mono font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1 text-[#2457C5]">
              <FileCode className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Manual fine-tuning active' : 'Click "Edit" to modify before copying'}</span>
            </span>
            <span className="text-[#4A4A4A]">
              {isPreserved
                ? 'Prompt preserved as safe baseline'
                : `Local Engine: ${model} · Strategy: ${strategy}`}
            </span>
          </div>
        </Card>
      </div>

      {/* Token Approximation Notice */}
      <div className="text-[11px] text-[#717171] font-mono uppercase tracking-wider px-1">
        * Token counts are approximations based on standard ~4 characters per token heuristics. Actual
        tokenization and cost savings are verified upon provider dispatch in Phase 4.
      </div>
    </div>
  );
};

