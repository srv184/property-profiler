import type { ReactNode } from "react";
import { Leaf, Home, Star, ShieldAlert, Compass } from "lucide-react";
import type { BuyerProfile } from "@/types/buyerProfile";

interface Props {
  profile: BuyerProfile;
}

function SummaryBlock({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="border-b border-line-soft py-6 first:pt-0 last:border-b-0">
      <div className="mb-2.5 flex items-center gap-2 text-ink">
        {icon}
        <h3 className="font-serif text-lg">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export function ProfileSummary({ profile }: Props) {
  const { summary } = profile;
  const hasAvoid = summary.avoid_hard.length > 0 || summary.avoid_soft.length > 0;

  return (
    <div>
      <SummaryBlock icon={<Leaf size={17} strokeWidth={1.75} />} title="Your lifestyle">
        <p className="text-[15px] leading-relaxed text-ink/85">
          {summary.lifestyle}
        </p>
      </SummaryBlock>

      <SummaryBlock icon={<Home size={17} strokeWidth={1.75} />} title="Your property preference">
        <p className="text-[15px] leading-relaxed text-ink/85">
          {summary.property_preference}
        </p>
      </SummaryBlock>

      <SummaryBlock icon={<Star size={17} strokeWidth={1.75} />} title="What matters most">
        <ul className="flex flex-wrap gap-2">
          {summary.top_priorities.map((p) => (
            <li
              key={p}
              className="rounded-full border border-accent/20 bg-orange-50/50 px-3 py-1 text-sm font-medium text-ink"
            >
              {p}
            </li>
          ))}
        </ul>
      </SummaryBlock>

      {hasAvoid && (
        <SummaryBlock
          icon={<ShieldAlert size={17} strokeWidth={1.75} />}
          title="What to avoid"
        >
          <div className="space-y-2.5">
            {summary.avoid_hard.length > 0 && (
              <div>
                <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-faint">
                  Must avoid
                </span>
                <ul className="flex flex-wrap gap-2">
                  {summary.avoid_hard.map((d) => (
                    <li
                      key={d}
                      className="rounded-full border border-red-300 bg-red-50 px-3 py-1 text-sm font-medium text-red-800"
                    >
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {summary.avoid_soft.length > 0 && (
              <div>
                <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-faint">
                  Prefer to avoid
                </span>
                <ul className="flex flex-wrap gap-2">
                  {summary.avoid_soft.map((d) => (
                    <li
                      key={d}
                      className="rounded-full border border-line bg-canvas-sunken px-3 py-1 text-sm font-medium text-ink"
                    >
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </SummaryBlock>
      )}

      <SummaryBlock icon={<Compass size={17} strokeWidth={1.75} />} title="Your buying profile">
        <p className="text-[15px] leading-relaxed text-ink/85">
          {summary.buying_profile}
        </p>
      </SummaryBlock>
    </div>
  );
}
