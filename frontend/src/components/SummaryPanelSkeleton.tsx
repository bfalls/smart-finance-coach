const SummaryPanelSkeleton = () => {
  return (
    <div className="animate-pulse rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="space-y-2 pb-4">
        <div className="h-3 w-24 rounded bg-slate-200" />
        <div className="h-5 w-40 rounded bg-slate-200" />
        <div className="h-4 w-64 rounded bg-slate-100" />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="rounded-lg border border-slate-200 bg-slate-100 p-4 shadow-sm"
          >
            <div className="h-3 w-24 rounded bg-slate-200" />
            <div className="mt-3 h-6 w-32 rounded bg-slate-300" />
            <div className="mt-2 h-3 w-28 rounded bg-slate-200" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SummaryPanelSkeleton;
