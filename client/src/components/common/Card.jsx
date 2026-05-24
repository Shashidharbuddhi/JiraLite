import { motion } from 'framer-motion';

const Card = ({ children, className = '', hover = true, ...props }) => (
  <motion.div
    whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
    transition={{ duration: 0.25, ease: 'easeOut' }}
    className={`rounded-2xl border border-slate-200 bg-white/90 shadow-sm backdrop-blur-md transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/70 dark:border-slate-800 dark:bg-slate-900/85 dark:hover:shadow-slate-950/40 ${className}`}
    {...props}
  >
    {children}
  </motion.div>
);

export default Card;
