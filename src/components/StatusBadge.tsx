import React from "react";
import { Laptop, Wifi, Sparkles, HelpCircle } from "lucide-react";

export type BadgeStatus = "Live" | "On your device" | "Demo";

interface StatusBadgeProps {
  status: BadgeStatus;
  size?: "sm" | "md";
  showTooltip?: boolean;
  className?: string;
}

export function StatusBadge({
  status,
  size = "sm",
  showTooltip = false,
  className = "",
}: StatusBadgeProps) {
  const configs = {
    Live: {
      label: "Live",
      ariaLabel: "Status: Live (calls real backend)",
      tooltip: "Calls the real backend service. Data is processed in real time.",
      bg: "bg-emerald-50 text-emerald-800 border-emerald-200",
      dot: "bg-emerald-600",
      icon: Wifi,
    },
    "On your device": {
      label: "On your device",
      ariaLabel: "Status: On your device (runs entirely in browser)",
      tooltip: "Runs 100% locally in your browser. Nothing is sent over the network.",
      bg: "bg-indigo-50 text-indigo-800 border-indigo-200",
      dot: "bg-indigo-600",
      icon: Laptop,
    },
    Demo: {
      label: "Demo",
      ariaLabel: "Status: Demo (sample or static content)",
      tooltip: "Sample or static demonstration content for preview purposes.",
      bg: "bg-amber-50 text-amber-800 border-amber-200",
      dot: "bg-amber-600",
      icon: Sparkles,
    },
  };

  const config = configs[status];
  const Icon = config.icon;

  const sizeClasses =
    size === "sm"
      ? "text-[11px] px-2 py-0.5 gap-1.5"
      : "text-xs px-2.5 py-1 gap-2";

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold border shadow-2xs ${config.bg} ${sizeClasses} ${className}`}
      title={config.tooltip}
      aria-label={config.ariaLabel}
    >
      <Icon className="w-3 h-3 shrink-0" aria-hidden="true" />
      <span>{config.label}</span>
      {showTooltip && (
        <span
          className="cursor-help text-slate-400 hover:text-slate-600 ml-0.5"
          title={config.tooltip}
        >
          <HelpCircle className="w-3 h-3 inline" />
        </span>
      )}
    </span>
  );
}
