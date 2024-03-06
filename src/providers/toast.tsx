"use client";

import { ReactNode } from "react";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

const ToastProvider = ({ children }: { children: ReactNode }) => {
  return (
    <>
      {children}

      <div className="text-center">
        <ToastContainer />
      </div>
    </>
  );
};

export default ToastProvider;
