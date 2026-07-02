import { forwardRef } from 'react';

export const fieldClass =
  'w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-all focus:border-cyan-300/60 focus:bg-slate-950/60 focus:ring-4 focus:ring-cyan-400/10';

export const labelClass = 'text-xs font-semibold uppercase tracking-[0.18em] text-slate-400';

export const errorClass = 'mt-2 text-xs font-medium text-rose-300';

export const Input = forwardRef(({ label, error, className = '', ...props }, ref) => (
  <div>
    {label && <label className={labelClass}>{label}</label>}
    <input ref={ref} className={`${fieldClass} ${label ? 'mt-2' : ''} ${className}`} {...props} />
    {error && <p className={errorClass}>{error}</p>}
  </div>
));

Input.displayName = 'Input';

export const Select = forwardRef(({ label, error, children, className = '', ...props }, ref) => (
  <div>
    {label && <label className={labelClass}>{label}</label>}
    <select ref={ref} className={`${fieldClass} ${label ? 'mt-2' : ''} ${className}`} {...props}>
      {children}
    </select>
    {error && <p className={errorClass}>{error}</p>}
  </div>
));

Select.displayName = 'Select';

export const Textarea = forwardRef(({ label, error, className = '', ...props }, ref) => (
  <div>
    {label && <label className={labelClass}>{label}</label>}
    <textarea ref={ref} className={`${fieldClass} ${label ? 'mt-2' : ''} ${className}`} {...props} />
    {error && <p className={errorClass}>{error}</p>}
  </div>
));

Textarea.displayName = 'Textarea';
