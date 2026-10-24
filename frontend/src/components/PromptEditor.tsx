import React from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { EXAMPLE_PROMPTS, estimateTokens } from '@/services/mockOptimizer';
import { ExamplePrompt } from '@/types';
import { Trash2, FileText, Sparkles, HelpCircle } from 'lucide-react';

export interface PromptEditorProps {
  value: string;
  onChange: (val: string) => void;
  onClear: () => void;
  onSelectExample: (example: ExamplePrompt) => void;
  disabled?: boolean;
}

export const PromptEditor: React.FC<PromptEditorProps> = ({
  value,
  onChange,
  onClear,
  onSelectExample,
  disabled = false,
}) => {
  const metrics = estimateTokens(value);

  return (
    <Card
      title="Raw Prompt Input"
      subtitle="Paste or write your full system or task prompt"
      badge={
        <div className="flex items-center gap-2">
          {value.trim().length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              disabled={disabled}
              className="text-[#171717] hover:bg-[#FDF2F2] hover:text-[#E53935] hover:border-[#E53935] text-xs py-1 px-2.5 font-bold"
              title="Clear current prompt"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </Button>
          )}
        </div>
      }
      className="flex flex-col h-full"
    >
      {/* Preset Example Selectors */}
      <div className="mb-4 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#171717] font-mono">
            <Sparkles className="w-3.5 h-3.5 text-[#2457C5]" />
            Load Sample Prompts
          </span>
          <span className="text-[11px] font-mono text-[#717171] uppercase tracking-wider">Click to inspect demo data</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {EXAMPLE_PROMPTS.map((ex) => (
            <button
              key={ex.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelectExample(ex)}
              className="flex items-start gap-2 p-2.5 bg-[#FFFFFF] border-2 border-[#171717] shadow-[2px_2px_0px_#171717] hover:bg-[#F2C230] text-left transition-all cursor-pointer group disabled:opacity-40 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            >
              <FileText className="w-4 h-4 text-[#2457C5] group-hover:text-[#171717] mt-0.5 shrink-0 transition-colors" />
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-[#171717] truncate font-sans">
                  {ex.title}
                </div>
                <div className="text-[10px] font-mono text-[#717171] group-hover:text-[#171717] uppercase tracking-wider truncate">{ex.category}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Textarea Input */}
      <div className="relative flex-1 flex flex-col min-h-[220px]">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="Enter a prompt with instructions, context, formatting requirements, or guidelines..."
          className="w-full flex-1 p-3.5 bg-[#FFFFFF] border-2 border-[#171717] text-[#171717] placeholder:text-[#888888] text-sm font-mono leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-[#2457C5] focus:border-[#2457C5] shadow-[2px_2px_0px_#171717] transition-all disabled:opacity-50"
          rows={10}
          aria-label="Raw prompt text input"
        />

        {/* Counter & Token Approximation Bar */}
        <div className="mt-3 pt-2.5 border-t-2 border-[#171717] flex flex-wrap items-center justify-between gap-2 text-xs text-[#4A4A4A] font-mono font-bold uppercase tracking-wider">
          <div className="flex items-center gap-3">
            <span>
              <strong className="text-[#171717] font-black">{metrics.charCount}</strong> chars
            </span>
            <span className="text-[#171717]">&bull;</span>
            <span title="Estimated using ~4 characters/token approximation">
              ~<strong className="text-[#2457C5] font-black">{metrics.estimatedTokens}</strong> tokens
              <span className="text-[10px] text-[#717171] ml-1">(est.)</span>
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-[#717171]">
            <HelpCircle className="w-3.5 h-3.5 text-[#171717]" />
            <span>~4 chars/token heuristic</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

