const variants = {
  primary: 'bg-blue-600 text-white hover:bg-blue-500 active:bg-blue-700',
  secondary: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-[#1e293b] dark:bg-[#111827] dark:text-slate-300 dark:hover:bg-white/[0.03]',
  ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-white/[0.04] dark:hover:text-slate-200',
  danger: 'text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10'
};

const sizes = {
  sm: 'px-3 py-1.5 text-[12px]',
  md: 'px-3.5 py-2 text-[13px]',
  lg: 'px-4 py-2.5 text-sm',
  icon: 'h-8 w-8 p-0'
};

const Button = ({ children, variant = 'primary', size = 'md', className = '', loading = false, disabled, ...props }) => (
  <button
    disabled={disabled || loading}
    className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
    {...props}
  >
    {loading && <span className="h-3.5 w-3.5 animate-spin rounded-full border-[1.5px] border-current border-t-transparent" />}
    {children}
  </button>
);

export default Button;
