import { Panel } from "@/components/ui/Panel";

interface TrustRiskPanelProps {
  unsupportedClaim: string;
  trustLoss: string;
}

export function TrustRiskPanel({ unsupportedClaim, trustLoss }: TrustRiskPanelProps) {
  return (
    <Panel className="space-y-4 border-red-900/20 bg-red-950/10">
      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-red-500/80">
          Unsupported Claim
        </h3>
        <p className="text-sm leading-relaxed text-zinc-300">{unsupportedClaim}</p>
      </div>
      <div className="border-t border-red-900/20 pt-4">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-red-400/80">
          Trust Loss
        </h3>
        <p className="text-sm leading-relaxed text-red-200/80">{trustLoss}</p>
      </div>
    </Panel>
  );
}
