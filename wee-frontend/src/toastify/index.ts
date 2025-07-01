import { Slide, toast, type ToastOptions, type ToastPosition } from 'react-toastify';

interface ToastProps {
  type: 'success' | 'error' | 'loading' | 'update' | 'dismiss' | 'render';
  iconType?: 'info' | 'success' | 'warning' | 'error' | 'default';
  message?: string;
  position?: ToastPosition;
  toastId?: string;
  render?: 'success' | 'error'; 
}

const defaultToastOptions: ToastOptions = {
  position: 'top-center',
  autoClose: 2000,
  pauseOnHover: false,
  pauseOnFocusLoss: false,
  closeOnClick: false,
  closeButton: false,
  transition: Slide,
};

export const Toastify = ({
  message,
  type,
  iconType,
  position,
  toastId,
  render,
}: ToastProps) => {
  const toastConfig: ToastOptions = {
    ...defaultToastOptions,
    position: position || defaultToastOptions.position,
    toastId: toastId || undefined,
    type: iconType,
  };

  switch (type) {
    case 'success':
      toast.success(message, toastConfig);
      return;

    case 'error':
      toast.error(message, toastConfig);
      return;

    case 'loading':
      toast.loading(message, toastConfig);
      return;

    case 'update':
      if (!toastId) return; // toastId 없으면 업데이트 불가
      toast.update(toastId, {
        ...toastConfig,
        render: message,
        type: render,
        autoClose: defaultToastOptions.autoClose,
        isLoading: false,
      });
      return;

    case 'dismiss':
      if (toastId) toast.dismiss(toastId);
      return;

    default:
      toast(message, toastConfig);
  }
};