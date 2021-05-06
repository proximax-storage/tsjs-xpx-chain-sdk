import React, { useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type NotificationContextType = {
  successToast: (msg: string) => void;
  warnToast: (msg: string) => void;
  errorToast: (msg: string) => void;
};

const NotificationContext = React.createContext<
  Partial<NotificationContextType>
>({});

const useNotification = () => {
  return useContext(NotificationContext);
};

const NotificationProvider: React.FC = ({ children }) => {
  const toastConfig = {
    autoClose: 2500,
  };

  const successToast = (msg: string) => {
    return toast.success(msg, toastConfig);
  };

  const warnToast = (msg: string) => {
    return toast.warn(msg, toastConfig);
  };

  const errorToast = (msg: string) => {
    return toast.error(msg, toastConfig);
  };

  const value = {
    successToast,
    warnToast,
    errorToast,
  };

  return (
    <NotificationContext.Provider value={value}>
      <ToastContainer newestOnTop />
      {children}
    </NotificationContext.Provider>
  );
};

export { useNotification, NotificationProvider };
