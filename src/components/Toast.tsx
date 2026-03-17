'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface ToastCtx { show: (msg: string) => void; }
const ToastContext = createContext<ToastCtx>({ show: () => {} });
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState('');
  const [visible, setVisible] = useState(false);

  const show = useCallback((m: string) => {
    setMsg(m);
    setVisible(true);
    setTimeout(() => setVisible(false), 2800);
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className={`toast-container ${visible ? 'show' : ''}`}>{msg}</div>
    </ToastContext.Provider>
  );
}
