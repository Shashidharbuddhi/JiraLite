import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { FiCheckCircle, FiMail, FiRefreshCw } from 'react-icons/fi';
import { verifyEmailRegistration } from '../../redux/slices/authSlice';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, user } = useSelector((state) => state.auth);

  useEffect(() => {
    let active = true;

    const runVerification = async () => {
      const result = await dispatch(verifyEmailRegistration(token));

      if (!active) {
        return;
      }

      if (verifyEmailRegistration.fulfilled.match(result)) {
        toast.success(result.payload.message);
        navigate('/', { replace: true });
        return;
      }

      toast.error(result.payload || 'Verification failed');
    };

    if (!user) {
      runVerification();
    }

    return () => {
      active = false;
    };
  }, [dispatch, navigate, token, user]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="glass-panel w-full max-w-[560px] rounded-[32px] p-6 sm:p-8"
    >
      <p className="eyebrow">Email Verification</p>
      <h1 className="mt-3 text-3xl font-bold text-white">
        {loading ? 'Verifying your Gmail...' : error ? 'Verification issue' : 'Workspace ready'}
      </h1>
      <p className="mt-3 text-sm leading-6 text-slate-300">
        {loading
          ? 'We are confirming your Gmail ownership and finishing workspace creation.'
          : error
            ? error
            : 'Your Gmail was verified and your account is ready.'}
      </p>

      <div className="mt-8 rounded-[24px] border border-white/10 bg-white/[0.03] p-5 text-sm text-slate-200">
        <div className="flex items-start gap-3">
          {loading ? <FiRefreshCw className="mt-0.5 h-5 w-5 animate-spin" /> : error ? <FiMail className="mt-0.5 h-5 w-5" /> : <FiCheckCircle className="mt-0.5 h-5 w-5 text-emerald-300" />}
          <div>
            <p className="font-semibold text-white">
              {loading ? 'Finishing setup' : error ? 'Link expired or invalid' : 'Verification complete'}
            </p>
            <p className="mt-1 text-slate-300">
              {loading
                ? 'This usually takes a moment.'
                : error
                  ? 'Request a fresh verification email by registering again with the same Gmail address.'
                  : 'You will be redirected into the app automatically.'}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-white/10 pt-6 text-sm">
        <Link to="/login" className="font-semibold text-cyan-300 transition-colors hover:text-cyan-200">
          Back to login
        </Link>
      </div>
    </motion.div>
  );
};

export default VerifyEmail;
