import { AnimatePresence, motion } from 'framer-motion';
import { IoClose } from 'react-icons/io5';

const Modal = ({ open, title, children, onClose }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 dark:bg-black/60"
        >
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="w-full max-w-xl rounded-xl border border-slate-200 bg-white shadow-modal dark:border-[#1e293b] dark:bg-[#111827]"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-[#1e293b]">
              <h2 className="font-heading text-base font-semibold text-slate-900">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/[0.06]"
                aria-label="Close modal"
              >
                <IoClose className="h-4 w-4" />
              </button>
            </div>
            <div className="px-5 py-5">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
