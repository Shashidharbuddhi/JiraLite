const Loader = ({ label = 'Loading' }) => (
  <div className="flex min-h-40 items-center justify-center">
    <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
      {label}
    </div>
  </div>
);

export default Loader;
