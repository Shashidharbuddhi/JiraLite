import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FiArrowRight, FiMail } from 'react-icons/fi';
import Button from '../../components/common/Button';
import { Input } from '../../components/common/FormControls';
import { authService } from '../../services/authService';
import { getErrorMessage } from '../../utils/formatters';

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: ''
    }
  });

  const onSubmit = async (values) => {
    try {
      setLoading(true);
      const response = await authService.forgotPassword(values);
      setSubmitted(true);
      toast.success(response.message);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Unable to send reset link'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="glass-panel w-full max-w-[520px] rounded-[32px] p-6 sm:p-8"
    >
      <p className="eyebrow">Password Recovery</p>
      <h1 className="mt-3 text-3xl font-bold text-white">Reset your password</h1>
      <p className="mt-3 text-sm leading-6 text-slate-300">
        Enter your email and we will send a secure reset link that expires in 15 minutes.
      </p>

      {submitted ? (
        <div className="mt-8 rounded-[24px] border border-emerald-300/20 bg-emerald-400/10 p-5 text-sm text-emerald-100">
          <div className="flex items-start gap-3">
            <FiMail className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-semibold">Reset email sent</p>
              <p className="mt-1 text-emerald-100/80">
                If an account exists for that email address, the reset link is on its way.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
          <Input
            label="Email Address"
            type="email"
            placeholder="you@company.com"
            error={errors.email?.message}
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+$/i, message: 'Enter a valid email' }
            })}
          />
          <Button type="submit" loading={loading}>
            Send Reset Link
            <FiArrowRight className="h-4 w-4" />
          </Button>
        </form>
      )}

      <div className="mt-8 border-t border-white/10 pt-6 text-sm">
        <Link to="/login" className="font-semibold text-cyan-300 transition-colors hover:text-cyan-200">
          Back to login
        </Link>
      </div>
    </motion.div>
  );
};

export default ForgotPassword;
