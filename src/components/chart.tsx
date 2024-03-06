"use client";

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom" as const,
    },
    title: {
      display: true,
      text: "Redimentos e Resgates (últimos 6 meses)",
      font: {
        size: 16,
      },
    },
  },
};

const labels = ["", "", "", "", "", ""];

interface ChartProps {
  moneyWithdraw: number[];
  monthlyProfits: number[];
}

const ChartComponent = ({ moneyWithdraw, monthlyProfits }: ChartProps) => {
  const data = {
    labels,
    datasets: [
      {
        label: "Resgate",
        data: moneyWithdraw,
        backgroundColor: "rgba(255, 51, 51, 0.7)",
        minBarLength: 10,
      },
      {
        label: "Rendimento",
        data: monthlyProfits,
        backgroundColor: "rgba(0, 230, 115, 0.7)",
        minBarLength: 10,
      },
    ],
  };

  return <Bar options={options} data={data} />;
};

export default ChartComponent;
