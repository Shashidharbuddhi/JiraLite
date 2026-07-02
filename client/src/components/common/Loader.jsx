const Loader = ({ label = 'Loading workspace' }) => (
  <div className="flex min-h-[240px] items-center justify-center">
    <div className="glass-panel flex items-center gap-3 rounded-full px-5 py-3 text-sm text-slate-200">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-300/30 border-t-cyan-300" />
      {label}
    </div>
  </div>
);

export default Loader;
