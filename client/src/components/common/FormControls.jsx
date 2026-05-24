import { forwardRef } from 'react';

export const fieldClass =
  'w-full rounded-xl border border-slate-200 bg-white/90 px-3 py-2.5 text-sm text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-400 dark:focus:ring-blue-500/20';

export const labelClass = 'text-sm font-medium text-slate-700 dark:text-slate-300';

export const errorClass = 'mt-1.5 text-xs font-medium text-rose-600';

export const Input = forwardRef(({ label, error, className = '', ...props }, ref) => (
  <div>
    {label && <label className={labelClass}>{label}</label>}
    <input ref={ref} className={`${fieldClass} ${label ? 'mt-1.5' : ''} ${className}`} {...props} />
    {error && <p className={errorClass}>{error}</p>}
  </div>
));

Input.displayName = 'Input';

export const Select = forwardRef(({ label, error, children, className = '', ...props }, ref) => (
  <div>
    {label && <label className={labelClass}>{label}</label>}
    <select ref={ref} className={`${fieldClass} ${label ? 'mt-1.5' : ''} ${className}`} {...props}>
      {children}
    </select>
    {error && <p className={errorClass}>{error}</p>}
  </div>
));

Select.displayName = 'Select';

export const Textarea = forwardRef(({ label, error, className = '', ...props }, ref) => (
  <div>
    {label && <label className={labelClass}>{label}</label>}
    <textarea ref={ref} className={`${fieldClass} ${label ? 'mt-1.5' : ''} ${className}`} {...props} />
    {error && <p className={errorClass}>{error}</p>}
  </div>
));

Textarea.displayName = 'Textarea';
