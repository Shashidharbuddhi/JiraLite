const Card = ({ children, className = '', hover = true, ...props }) => (
  <div
    className={`rounded-xl border border-slate-200 bg-white shadow-card dark:border-[#1e293b] dark:bg-[#111827] ${hover ? 'transition-all duration-150 hover:-translate-y-px hover:shadow-card-hover' : ''} ${className}`}
    {...props}
  >
    {children}
  </div>
);

export default Card;
