"use client";

import { DollarSignIcon, LogOut, Wallet } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const { status, data } = useSession();

  const handleLoginClick = async () => {
    await signIn("google", {
      callbackUrl: "/finance",
    });
  };

  const handleLogoutClick = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const handleDropdownClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const backToHome = () => {
    router.push("/");
  };

  return (
    <div className="flex items-center justify-between border-b px-6 py-2 shadow lg:px-14 xl:px-20 2xl:px-32">
      <Image
        src="/logo-header.png"
        width={170}
        height={0}
        priority={true}
        alt="logo gerenciador de finanças"
        className="w-16 cursor-pointer"
        onClick={backToHome}
      />

      {status === "authenticated" && data?.user && (
        <div className="relative">
          <div className="flex items-center gap-2">
            <Avatar
              onClick={handleDropdownClick}
              className="h-12 w-12 cursor-pointer"
            >
              <AvatarFallback>
                {data.user.name?.[0].toUpperCase()}
              </AvatarFallback>

              {data.user.image && (
                <AvatarImage className="rounded-full" src={data.user.image} />
              )}
            </Avatar>

            {isDropdownOpen && (
              <div
                className="absolute right-1 top-12 z-50 flex h-fit min-w-60 max-w-fit flex-col gap-5 rounded-md border bg-white p-4 shadow-lg"
                onMouseLeave={handleDropdownClick}
              >
                <div className="flex w-full items-center gap-3 rounded-lg border p-3 shadow-lg">
                  <Avatar>
                    {data.user.image && (
                      <AvatarImage
                        className="rounded-full"
                        src={data.user.image}
                      />
                    )}
                  </Avatar>

                  <p className="font-montserrat font-bold">
                    {data?.user?.name}
                  </p>
                </div>

                <div className="flex flex-col gap-2 capitalize">
                  <div
                    className="flex cursor-pointer items-center gap-3 rounded-xl p-2 hover:bg-gray-100 hover:bg-opacity-90"
                    onClick={() => router.push("/finance")}
                  >
                    <DollarSignIcon
                      className="bg-gray rounded-full bg-gray-300 bg-opacity-50 p-2"
                      width={37}
                      height={37}
                    />
                    <p className="font-semibold">minhas finanças</p>
                  </div>

                  <div
                    className="flex cursor-pointer items-center gap-3 rounded-xl p-2 hover:bg-gray-100 hover:bg-opacity-90"
                    onClick={() =>
                      router.push(`/my-wallet/${(data?.user as any)?.id}`)
                    }
                  >
                    <Wallet
                      className="bg-gray rounded-full bg-gray-300 bg-opacity-50 p-2"
                      width={37}
                      height={37}
                    />
                    <p className="font-semibold">minha carteira</p>
                  </div>

                  <div
                    className="flex cursor-pointer items-center gap-3 rounded-xl p-2 hover:bg-gray-100 hover:bg-opacity-90"
                    onClick={handleLogoutClick}
                  >
                    <LogOut
                      className="bg-gray rounded-full bg-gray-300 bg-opacity-50 p-2"
                      width={37}
                      height={37}
                    />
                    <p className="font-semibold">sair</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {status === "unauthenticated" && (
        <button
          onClick={handleLoginClick}
          className="font-medium hover:underline"
        >
          Entrar
        </button>
      )}
    </div>
  );
};

export default Header;
