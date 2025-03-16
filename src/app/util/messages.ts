// utils/message.ts
import { toast, ToastOptions } from 'react-toastify';

// Função para exibir mensagens de sucesso
export const showSuccessMessage = (message: string, options?: ToastOptions) => {
  toast.success(message, options);
};

// Função para exibir mensagens de erro
export const showErrorMessage = (message: string, options?: ToastOptions) => {
  toast.error(message, options);
};

// Função para exibir mensagens de carregamento
export const showLoadingMessage = (message: string, options?: ToastOptions) => {
  toast.info(message, options);
};

// Função para exibir mensagens informativas
export const showInfoMessage = (message: string, options?: ToastOptions) => {
  toast.info(message, options);
};

// Função genérica que pode exibir qualquer tipo de mensagem
export const showCustomMessage = (
  type: 'success' | 'error' | 'info' | 'warning',
  message: string,
  options?: ToastOptions
) => {
  switch (type) {
    case 'success':
      return toast.success(message, options);
    case 'error':
      return toast.error(message, options);
    case 'info':
      return toast.info(message, options);
    case 'warning':
      return toast.warning(message, options);
    default:
      return toast(message, options);
  }
};
