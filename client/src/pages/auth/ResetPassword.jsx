import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FiArrowRight } from 'react-icons/fi';
import Button from '../../components/common/Button';
import { Input } from '../../components/common/FormControls';
import { authService } from '../../services/authService';
import { getErrorMessage } from '../../utils/formatters';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async ({ password }) => {
    try {
      setLoading(true);
      const response = await authService.resetPassword({ token, password });
      toast.success(response.message);
      navigate('/login', { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error, 'Unable to reset password'));
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
      <p className="eyebrow">New Password</p>
      <h1 className="mt-3 text-3xl font-bold text-white">Choose a new password</h1>
      <p className="mt-3 text-sm leading-6 text-slate-300">
        Your reset link is time-limited. Set a new password to regain access to your workspace.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <Input
          label="New Password"
          type="password"
          placeholder="Minimum 6 characters"
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 6, message: 'Minimum 6 characters' }
          })}
        />
        <Input
          label="Confirm Password"
          type="password"
          placeholder="Repeat your password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Please confirm the password',
            validate: (value) => value === watch('password') || 'Passwords do not match'
          })}
        />
        <Button type="submit" loading={loading}>
          Save New Password
          <FiArrowRight className="h-4 w-4" />
        </Button>
      </form>

      <div className="mt-8 border-t border-white/10 pt-6 text-sm">
        <Link to="/login" className="font-semibold text-cyan-300 transition-colors hover:text-cyan-200">
          Back to login
        </Link>
      </div>
    </motion.div>
  );
};

export default ResetPassword;
