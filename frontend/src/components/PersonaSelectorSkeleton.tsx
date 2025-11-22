const PersonaSelectorSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="space-y-2 pb-3">
        <div className="h-3 w-24 rounded bg-slate-200" />
        <div className="h-5 w-52 rounded bg-slate-200" />
        <div className="h-4 w-64 rounded bg-slate-100" />
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-24 rounded-lg border border-slate-200 bg-slate-100 shadow-sm"
          />
        ))}
      </div>
    </div>
  );
};

export default PersonaSelectorSkeleton;
