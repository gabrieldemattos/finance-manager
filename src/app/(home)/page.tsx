"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect } from "react";
import Loading from "../loading";
import Image from "next/image";

export default function Home() {
  const { status, data } = useSession();
  const router = useRouter();
  const handleLoginClick = async () => {
    await signIn("google", {
      callbackUrl: "/finance",
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      return router.push("/");
    } else if (status === "authenticated") {
      router.push("/finance");
    }
  }, [status, data]);

  return (
    <div className="flex h-full flex-col items-center gap-10 bg-gray-50 pt-20">
      {status === "loading" && <Loading />}
      {status !== "loading" && status === "unauthenticated" && (
        <>
          <div className="flex flex-col items-center gap-2 px-4 text-center">
            <Image
              src="/logo.png"
              width={450}
              height={0}
              alt="logo gerenciador de finanças"
              priority={true}
              className="h-auto w-auto"
            />
            <p>Gerencie seu dinheiro de forma fácil e eficiente!</p>
          </div>

          <form
            className="flex min-w-80 flex-col gap-8 rounded border-2 bg-white p-10 text-center shadow-xl md:w-[500px] md:p-12"
            onSubmit={handleSubmit}
          >
            <p className="text-base font-bold text-black">
              Faça login com sua conta Google!
            </p>

            <button
              className="flex items-center rounded border-2 transition-all hover:bg-gray-50 hover:shadow-md"
              onClick={handleLoginClick}
            >
              <div className="h-full border-r p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="25"
                  height="25"
                  viewBox="0 0 48 48"
                >
                  <path
                    fill="#fbc02d"
                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                  ></path>
                  <path
                    fill="#e53935"
                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                  ></path>
                  <path
                    fill="#4caf50"
                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                  ></path>
                  <path
                    fill="#1565c0"
                    d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                  ></path>
                </svg>
              </div>

              <p className="w-full text-center font-semibold text-black text-opacity-80">
                Entrar com Google
              </p>
            </button>
          </form>
        </>
      )}
    </div>
  );
}
