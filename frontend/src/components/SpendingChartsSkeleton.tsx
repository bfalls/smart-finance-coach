const SpendingChartsSkeleton = () => {
  return (
    <div className="animate-pulse rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="space-y-2 pb-4">
        <div className="h-3 w-24 rounded bg-slate-200" />
        <div className="h-5 w-40 rounded bg-slate-200" />
        <div className="h-4 w-64 rounded bg-slate-100" />
      </div>
      <div className="space-y-4">
        <div className="rounded-lg border border-dashed border-slate-200 bg-slate-100 p-4">
          <div className="h-4 w-36 rounded bg-slate-300" />
          <div className="mt-2 h-3 w-56 rounded bg-slate-200" />
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-6 rounded bg-slate-200" />
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-dashed border-slate-200 bg-slate-100 p-4">
          <div className="h-4 w-28 rounded bg-slate-300" />
          <div className="mt-2 h-3 w-48 rounded bg-slate-200" />
          <div className="mt-3 grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-8 rounded bg-slate-200" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpendingChartsSkeleton;
