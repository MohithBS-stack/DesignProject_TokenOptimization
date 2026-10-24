import React from 'react';
import { Card } from './Card';
import { OptimizationResult } from '@/types';
import { TrendingDown, TrendingUp, CheckCircle, ShieldCheck, Layers, Cpu, Clock, AlertTriangle, Tag, Info } from 'lucide-react';

export interface MetricsPanelProps {
  result: OptimizationResult;
}

export const MetricsPanel: React.FC<MetricsPanelProps> = ({ result }) => {
  const {
    originalMetrics,
    optimizedMetrics,
    tokenReductionPercent,
    tokenChangePercent,
    tokenSavings,
    charDelta,
    preservedConstraints,
    explicitConstraints,
    taskCategory,
    strategy,
    appliedStrategy,
    validationStatus,
    isPreserved,
    mode,
    targetModel,
    executionTimeMs,
    model,
  } = result;

  // Percentage of original tokens retained (can be > 100% if expanded)
  const retainedPercent = Math.max(
    10,
    Math.round(
      (optimizedMetrics.estimatedTokens / Math.max(1, originalMetrics.estimatedTokens)) * 100
    )
  );

  // Positive charDelta means final > original (expansion)
  const isExpanded = charDelta > 0 || tokenChangePercent > 0;

  // Accurate outcome badge states per Phase 3.2.2 requirements
  const getOutcomeBadge = () => {
    if (validationStatus === 'fallback') {
      return {
        label: 'Validation Fallback',
        icon: <AlertTriangle className="w-3.5 h-3.5 text-[#E53935]" />,
        className: 'bg-[#FDF2F2] border-2 border-[#E53935] text-[#E53935]',
      };
    }
    if (isPreserved) {
      return {
        label: 'Original Preserved — No Safe Improvement',
        icon: <CheckCircle className="w-3.5 h-3.5 text-[#171717]" />,
        className: 'bg-[#E7E3D9] border-2 border-[#171717] text-[#171717]',
      };
    }
    if (charDelta < 0) {
      return {
        label: 'Validated Rewrite — Shorter',
        icon: <CheckCircle className="w-3.5 h-3.5 text-[#2457C5]" />,
        className: 'bg-[#FFFFFF] border-2 border-[#2457C5] text-[#2457C5] shadow-[1.5px_1.5px_0px_#2457C5]',
      };
    }
    if (charDelta > 0) {
      return {
        label: 'Validated Rewrite — Expanded',
        icon: <Info className="w-3.5 h-3.5 text-[#171717]" />,
        className: 'bg-[#FFFDF0] border-2 border-[#F2C230] text-[#171717]',
      };
    }
    return {
      label: 'Validated Rewrite — Unchanged Length',
      icon: <CheckCircle className="w-3.5 h-3.5 text-[#2457C5]" />,
      className: 'bg-[#FFFFFF] border-2 border-[#171717] text-[#171717]',
    };
  };

  const badgeInfo = getOutcomeBadge();

  return (
    <Card
      title="Optimization & Efficiency Metrics"
      subtitle="Input-token and constraint analysis (heuristic approximation)"
      badge={
        <div className={`flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider ${badgeInfo.className}`}>
          {badgeInfo.icon}
          <span>{badgeInfo.label}</span>
        </div>
      }
      className="space-y-6"
    >
      {/* 4 Primary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Estimated Token Change Card */}
        <div className="p-4 bg-[#FFFFFF] border-2 border-[#171717] border-t-4 border-t-[#2457C5] shadow-[3px_3px_0px_#171717] space-y-1">
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#4A4A4A] flex items-center gap-1.5">
            {isExpanded ? (
              <TrendingUp className="w-3.5 h-3.5 text-[#F2C230]" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-[#2457C5]" />
            )}
            Estimated Token Change
          </div>
          <div className={`text-2xl sm:text-3xl font-black tracking-tight ${
            isExpanded ? 'text-[#171717]' : tokenSavings > 0 ? 'text-[#2457C5]' : 'text-[#171717]'
          }`}>
            {tokenSavings > 0 ? `-${tokenReductionPercent}%` : isExpanded ? `+${tokenChangePercent}%` : '0%'}
          </div>
          <div className="text-[11px] font-mono font-bold text-[#717171] uppercase tracking-wider">
            {tokenSavings > 0
              ? `Saved ~${tokenSavings} tokens (est.)`
              : isExpanded
              ? `Expanded ~${Math.abs(optimizedMetrics.estimatedTokens - originalMetrics.estimatedTokens)} tokens (est.)`
              : 'Preserved original length'}
          </div>
        </div>

        {/* Character Delta Card */}
        <div className="p-4 bg-[#FFFFFF] border-2 border-[#171717] border-t-4 border-t-[#F2C230] shadow-[3px_3px_0px_#171717] space-y-1">
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#4A4A4A] flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#171717]" />
            Character Delta
          </div>
          <div className="text-xl sm:text-2xl font-black tracking-tight text-[#171717]">
            {originalMetrics.charCount} &rarr; {optimizedMetrics.charCount}
          </div>
          <div className="text-[11px] font-mono font-bold text-[#717171] uppercase tracking-wider">
            {charDelta < 0
              ? `${Math.abs(charDelta)} chars removed (${charDelta})`
              : charDelta > 0
              ? `${charDelta} chars added (+${charDelta})`
              : 'Exact character parity (0)'}
          </div>
        </div>

        {/* Strategy & Task Category Card */}
        <div className="p-4 bg-[#FFFFFF] border-2 border-[#171717] border-t-4 border-t-[#E53935] shadow-[3px_3px_0px_#171717] space-y-1">
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#4A4A4A] flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-[#E53935]" />
            Optimization Strategy
          </div>
          <div className="text-xl sm:text-2xl font-black tracking-tight text-[#171717] capitalize">
            {appliedStrategy || strategy}
          </div>
          <div className="text-[11px] font-mono font-bold text-[#717171] uppercase tracking-wider capitalize">
            Profile: {mode} &bull; {taskCategory.replace('_', ' ')}
          </div>
        </div>

        {/* Local Model & Latency */}
        <div className="p-4 bg-[#FFFFFF] border-2 border-[#171717] border-t-4 border-t-[#171717] shadow-[3px_3px_0px_#171717] space-y-1">
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#4A4A4A] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#171717]" />
            Local Inference Latency
          </div>
          <div className="text-xl sm:text-2xl font-black tracking-tight text-[#171717] font-mono">
            {executionTimeMs.toLocaleString()} ms
          </div>
          <div className="text-[11px] font-mono font-bold text-[#717171] uppercase tracking-wider flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-[#2457C5]" />
            <span className="truncate">{model || 'qwen2.5:1.5b'}</span>
          </div>
        </div>
      </div>

      {/* Clean Comparison Visualization Bar */}
      <div className="space-y-3 p-4 bg-[#FAF8F5] border-2 border-[#171717] shadow-[2px_2px_0px_#171717]">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold uppercase tracking-wider text-[#171717] font-mono flex items-center gap-1.5">
            Estimated Token Footprint Comparison
          </span>
          <span className="font-mono font-bold text-[#717171] text-[11px] uppercase">
            Original: ~{originalMetrics.estimatedTokens} &bull; Final: ~{optimizedMetrics.estimatedTokens} (est. tokens)
          </span>
        </div>

        {/* Visual Token Bar */}
        <div className="space-y-2">
          {/* Baseline Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-[#717171] font-mono font-bold uppercase tracking-wider">
              <span>Original Prompt (Baseline)</span>
              <span>100%</span>
            </div>
            <div className="w-full h-3.5 bg-[#E7E3D9] border-2 border-[#171717] overflow-hidden">
              <div className="h-full bg-[#171717] w-full" />
            </div>
          </div>

          {/* Compressed or Expanded Bar */}
          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-[10px] text-[#171717] font-mono font-bold uppercase tracking-wider">
              <span className="text-[#2457C5] font-black">Final Payload</span>
              <span className={isExpanded ? 'text-[#E53935] font-black' : 'text-[#2457C5] font-black'}>
                {retainedPercent}% {isExpanded ? `(+${tokenChangePercent}% expansion)` : `(-${tokenReductionPercent}% input tokens)`}
              </span>
            </div>
            <div className="w-full h-4 bg-[#E7E3D9] border-2 border-[#171717] overflow-hidden flex">
              <div
                className={`h-full transition-all duration-500 ${
                  isExpanded ? 'bg-[#F2C230]' : 'bg-[#2457C5]'
                }`}
                style={{ width: `${Math.min(100, retainedPercent)}%` }}
              />
              {!isExpanded && retainedPercent < 100 && (
                <div
                  className="h-full bg-[#E53935]/20 border-l-2 border-[#E53935] transition-all duration-500"
                  style={{ width: `${100 - retainedPercent}%` }}
                  title={`Estimated ${tokenReductionPercent}% tokens reduced`}
                />
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 text-[10px] font-mono uppercase tracking-wider text-[#717171]">
          <span>{isExpanded ? 'Yellow: Clarified and expanded payload' : 'Blue: Optimized payload'}</span>
          <span>Heuristic tokenization (~4 chars/token)</span>
        </div>
      </div>

      {/* Explicit Constraints & Preserved Guardrails */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pt-2 border-t-2 border-[#171717]">
        <div className="space-y-2 flex-1">
          <div className="text-xs font-bold uppercase tracking-wider text-[#171717] font-mono flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2457C5]" />
            <span>Preserved Guardrails & Constraints:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {explicitConstraints && explicitConstraints.length > 0 ? (
              explicitConstraints.map((constraint, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono font-bold uppercase tracking-wider bg-[#FFFFFF] border-2 border-[#171717] text-[#171717] shadow-[1.5px_1.5px_0px_#171717]"
                >
                  <ShieldCheck className="w-3 h-3 text-[#2457C5]" />
                  {constraint}
                </span>
              ))
            ) : (
              preservedConstraints.map((constraint, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono font-bold uppercase tracking-wider bg-[#FFFFFF] border-2 border-[#171717] text-[#171717] shadow-[1.5px_1.5px_0px_#171717]"
                >
                  <ShieldCheck className="w-3 h-3 text-[#2457C5]" />
                  {constraint}
                </span>
              ))
            )}
          </div>
        </div>

        <div className="text-right text-[11px] font-mono font-bold uppercase tracking-wider text-[#717171] space-y-0.5 shrink-0">
          <div>Profile: <span className="text-[#171717] capitalize">{mode}</span></div>
          <div>Destination: <span className="text-[#171717]">{targetModel}</span></div>
          <div>Validation: <span className={validationStatus === 'passed' ? 'text-[#2457C5]' : 'text-[#E53935]'}>{validationStatus}</span></div>
        </div>
      </div>
    </Card>
  );
};
