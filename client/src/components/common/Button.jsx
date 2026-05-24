import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-blue-600 text-white shadow-sm shadow-blue-600/20 hover:bg-blue-700',
  secondary: 'border border-slate-200 bg-white/90 text-slate-700 hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-slate-800',
  ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white',
  danger: 'text-rose-600 hover:bg-rose-50'
};

const sizes = {
  sm: 'px-3 py-2 text-xs',
  md: 'px-4 py-2.5 text-sm',
  icon: 'h-10 w-10 p-0'
};

const Button = ({ children, variant = 'primary', size = 'md', className = '', loading = false, disabled, ...props }) => (
  <motion.button
    whileHover={{ y: disabled || loading ? 0 : -1 }}
    whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
    disabled={disabled || loading}
    className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${className}`}
    {...props}
  >
    {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
    {children}
  </motion.button>
);

export default Button;
