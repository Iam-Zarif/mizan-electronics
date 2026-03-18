import { AlertTriangle, RefreshCcw } from "lucide-react";

type ApiErrorStateProps = {
  title: string;
  description: string;
  onRetry: () => void;
};

export function ApiErrorState({
  title,
  description,
  onRetry,
}: ApiErrorStateProps) {
  return (
    <div className="rounded-[24px] border border-red-200 bg-red-50 p-5 text-red-800 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-100">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/70 dark:bg-white/10">
          <AlertTriangle size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-base font-bold">{title}</p>
          <p className="mt-1 text-sm leading-6 opacity-90">{description}</p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            <RefreshCcw size={15} />
            Retry
          </button>
        </div>
      </div>
    </div>
  );
}

type ApiEmptyStateProps = {
  title: string;
  description: string;
};

export function ApiEmptyState({ title, description }: ApiEmptyStateProps) {
  return (
    <div className="rounded-[24px] border border-dashed border-[#dbe4f4] bg-white px-5 py-10 text-center dark:border-white/10 dark:bg-[#161f36]">
      <p className="text-lg font-bold text-[#1f2638] dark:text-white">{title}</p>
      <p className="mt-2 text-sm text-[#7f8ba3]">{description}</p>
    </div>
  );
}

export function ApiSkeletonBlock({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="h-24 animate-pulse rounded-[24px] border border-[#e8edf7] bg-white dark:border-white/10 dark:bg-[#161f36]"
        />
      ))}
    </div>
  );
}
