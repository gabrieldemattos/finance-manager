"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

const FinanceNotFound = () => {
  const router = useRouter();

  const backToHome = () => router.push("/");

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="flex flex-col gap-5">
        <p className="text-2xl font-medium">Aplicação não encontrada!</p>
        <Button className="uppercase" onClick={backToHome}>
          Voltar ao início
        </Button>
      </div>
    </div>
  );
};

export default FinanceNotFound;
