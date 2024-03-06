import React from "react";

const Loading = () => {
  return (
    <div className="absolute left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="flex flex-col items-center gap-5">
        <div className="h-14 w-14 animate-spin rounded-full border-b-4 border-t-4 border-blue-800"></div>
        <p className="text-xl tracking-wider text-white text-opacity-70">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default Loading;
