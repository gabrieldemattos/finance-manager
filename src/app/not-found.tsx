import Link from "next/link";
import React from "react";

const NotFoundPage = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-1">
      <p className="text-3xl font-medium tracking-wider text-opacity-70">
        Page not found
      </p>
      <p>
        Volte para a página{" "}
        <Link href="/" className="text-blue-600 underline underline-offset-4">
          inicial.
        </Link>
      </p>
    </div>
  );
};

export default NotFoundPage;
