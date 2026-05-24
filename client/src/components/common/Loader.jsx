const Loader = ({ label = 'Loading' }) => (
  <div className="flex min-h-40 items-center justify-center">
    <div className="flex items-center gap-2.5 text-[13px] text-slate-400">
      <span className="h-3.5 w-3.5 animate-spin rounded-full border-[1.5px] border-slate-300 border-t-blue-600 dark:border-slate-600 dark:border-t-blue-400" />
      {label}
    </div>
  </div>
);

export default Loader;
