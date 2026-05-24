import { forwardRef } from 'react';

export const fieldClass =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-[#1e293b] dark:bg-[#18181b] dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:border-blue-400 dark:focus:ring-blue-400/20';

export const labelClass = 'text-[13px] font-medium text-slate-600 dark:text-slate-400';

export const errorClass = 'mt-1 text-[12px] font-medium text-rose-600 dark:text-rose-400';

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
