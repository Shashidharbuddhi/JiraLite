export const formatDate = (value) => {
  if (!value) return 'No date';

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(value));
};

export const getProjectDeadline = (project) => project?.deadLine || project?.deadline || '';

export const toInputDate = (value) => {
  if (!value) return '';
  return new Date(value).toISOString().slice(0, 10);
};

export const getErrorMessage = (error, fallback = 'Something went wrong') => {
  const errors = error?.response?.data?.errors;
  if (Array.isArray(errors) && errors.length > 0) return errors[0].msg || fallback;
  return error?.response?.data?.message || error?.message || fallback;
};
