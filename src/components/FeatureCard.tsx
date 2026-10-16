import React from "react";
import { LucideIcon } from "lucide-react";
import { StatusBadge, BadgeStatus } from "./StatusBadge";

export interface FeatureCardProps {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  badge: BadgeStatus;
  color: string;
  bg: string;
}

export function FeatureCard({
  title,
  description,
  icon: Icon,
  badge,
  color,
  bg,
}: FeatureCardProps) {
  return (
    <article className="flex flex-col p-6 rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#0D817C]/40 hover:shadow-md transition-all group">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center`}
        >
          <Icon className={`w-5 h-5 ${color}`} aria-hidden="true" />
        </div>
        <StatusBadge status={badge} />
      </div>

      <h3 className="text-lg font-bold text-[#172554] mb-2 group-hover:text-[#0D817C] transition-colors">
        {title}
      </h3>

      <p className="text-sm text-[#334155] leading-relaxed flex-1">
        {description}
      </p>
    </article>
  );
}
