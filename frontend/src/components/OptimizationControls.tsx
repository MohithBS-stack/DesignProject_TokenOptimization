import React from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { ILLUSTRATIVE_MODELS } from '@/services/mockOptimizer';
import { OptimizationMode, TargetModel, OllamaStatus } from '@/types';
import { Zap, Sliders, ShieldAlert, AlertCircle, CheckCircle } from 'lucide-react';

export interface OptimizationControlsProps {
  mode: OptimizationMode;
  onModeChange: (mode: OptimizationMode) => void;
  targetModel: TargetModel;
  onTargetModelChange: (model: TargetModel) => void;
  onOptimize: () => void;
  isLoading: boolean;
  disabled: boolean;
  ollamaStatus?: OllamaStatus | null;
}

export const OptimizationControls: React.FC<OptimizationControlsProps> = ({
  mode,
  onModeChange,
  targetModel,
  onTargetModelChange,
  onOptimize,
  isLoading,
  disabled,
  ollamaStatus,
}) => {
  const isOllamaReady = Boolean(ollamaStatus?.connected && ollamaStatus?.model_installed);

  const modes: { id: OptimizationMode; title: string; desc: string }[] = [
    {
      id: 'balanced',
      title: 'Balanced',
      desc: 'Moderate compression, removes verbosity while maintaining prose flow (~25% target)',
    },
    {
      id: 'concise',
      title: 'Concise',
      desc: 'Aggressive compression, imperative directives, minimal conversational fluff (~40% target)',
    },
    {
      id: 'structure',
      title: 'Structure-focused',
      desc: 'Groups constraints into markdown headers and schema blocks for maximum parser clarity (~30% target)',
    },
  ];

  return (
    <Card
      title="Optimization Controls"
      subtitle="Configure compression profile and target frontier model"
      className="space-y-5"
    >
      {/* Local LLM Inference Engine Status Banner */}
      {isOllamaReady ? (
        <div className="flex items-start gap-2.5 p-3.5 bg-[#FFFFFF] border-2 border-[#2457C5] shadow-[2px_2px_0px_#2457C5] text-xs text-[#171717]">
          <CheckCircle className="w-4 h-4 text-[#2457C5] mt-0.5 shrink-0" />
          <div className="space-y-0.5">
            <span className="font-bold text-[#2457C5] uppercase tracking-wider font-mono">
              Local LLM Active ({ollamaStatus?.model || 'qwen2.5:1.5b'})
            </span>
            <p className="text-[11px] text-[#4A4A4A] leading-relaxed">
              Connected to local Ollama runtime. Real-time prompt optimization runs entirely on your
              machine with zero prompt data sent to the cloud.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-2.5 p-3.5 bg-[#FFFDF0] border-2 border-[#E53935] shadow-[2px_2px_0px_#E53935] text-xs text-[#171717]">
          <AlertCircle className="w-4 h-4 text-[#E53935] mt-0.5 shrink-0" />
          <div className="space-y-0.5">
            <span className="font-bold text-[#E53935] uppercase tracking-wider font-mono">Local Model Offline</span>
            <p className="text-[11px] text-[#4A4A4A] leading-relaxed">
              {ollamaStatus?.error ||
                "Cannot connect to Ollama at http://127.0.0.1:11434. Ensure 'ollama serve' is active and 'qwen2.5:1.5b' is downloaded."}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Mode Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[#171717] font-mono flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-[#171717]" />
            Optimization Mode
          </label>
          <div className="space-y-2">
            {modes.map((m) => (
              <label
                key={m.id}
                className={`flex items-start gap-3 p-3 border-2 cursor-pointer transition-all ${
                  mode === m.id
                    ? 'bg-[#FFFDF0] border-[#171717] shadow-[2px_2px_0px_#F2C230] text-[#171717]'
                    : 'bg-[#FFFFFF] border-[#D8D3C5] text-[#4A4A4A] hover:border-[#171717] hover:bg-[#FAF8F5]'
                }`}
              >
                <input
                  type="radio"
                  name="optimization-mode"
                  value={m.id}
                  checked={mode === m.id}
                  onChange={() => onModeChange(m.id)}
                  className="mt-1 text-[#2457C5] focus:ring-[#171717] accent-[#2457C5]"
                />
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-[#171717] uppercase tracking-wide flex items-center gap-1.5">
                    {m.title}
                  </div>
                  <p className="text-[11px] text-[#717171] leading-snug font-mono">{m.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Target Frontier Model Selector & Execute Action */}
        <div className="flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="target-model-select" className="text-xs font-bold uppercase tracking-wider text-[#171717] font-mono">
                Target Main LLM (Illustrative)
              </label>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#171717] bg-[#E7E3D9] px-2 py-0.5 border border-[#171717] shadow-[1px_1px_0px_#171717]">
                Phase 4 Gateway
              </span>
            </div>

            <select
              id="target-model-select"
              value={targetModel}
              onChange={(e) => onTargetModelChange(e.target.value as TargetModel)}
              className="w-full p-2.5 bg-[#FFFFFF] border-2 border-[#171717] text-[#171717] text-xs font-mono font-bold shadow-[2px_2px_0px_#171717] focus:outline-none focus:ring-2 focus:ring-[#2457C5] transition-all cursor-pointer"
            >
              {ILLUSTRATIVE_MODELS.map((model) => (
                <option key={model.id} value={model.id} className="bg-[#FFFFFF] text-[#171717]">
                  {model.name} ({model.provider}) &bull; {model.contextWindow}
                </option>
              ))}
            </select>

            <p className="text-[11px] text-[#717171] leading-relaxed font-mono">
              Select the intended destination model. In Phase 4, Argus will tailor the compression
              dialect to the specific frontier model's tokenizer.
            </p>
          </div>

          {/* Action Trigger */}
          <div className="pt-2">
            <Button
              variant="primary"
              size="lg"
              className="w-full font-black tracking-wider text-xs py-3.5 bg-[#2457C5] hover:bg-[#171717] text-[#FFFFFF] border-2 border-[#171717] shadow-[3px_3px_0px_#171717]"
              onClick={onOptimize}
              disabled={disabled || isLoading}
              isLoading={isLoading}
            >
              <Zap className="w-4 h-4 text-[#F2C230]" />
              <span>{isLoading ? 'Optimizing with Local LLM...' : 'Optimize Prompt'}</span>
            </Button>

            {disabled && !isLoading && (
              <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#717171] text-center mt-2.5 flex items-center justify-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-[#E53935]" />
                Enter prompt text above to enable optimization
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

