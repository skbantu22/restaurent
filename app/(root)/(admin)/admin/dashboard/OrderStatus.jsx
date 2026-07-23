"use client";

import React, { useEffect, useState } from "react";
import { Label, Pie, PieChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import useFetch from "@/hooks/useFetch";

export const description = "Order Status Chart";

const chartConfig = {
  pending: {
    label: "Pending",
    color: "#3b82f6",
  },
  confirmed: {
    label: "Confirmed",
    color: "#8b5cf6",
  },
  preparing: {
    label: "Preparing",
    color: "#f59e0b",
  },
  ready: {
    label: "Ready",
    color: "#06b6d4",
  },
  out_for_delivery: {
    label: "Out For Delivery",
    color: "#0ea5e9",
  },
  delivered: {
    label: "Delivered",
    color: "#22c55e",
  },
  cancelled: {
    label: "Cancelled",
    color: "#ef4444",
  },
};

export function OrderStatus() {
  const [chartData, setChartData] = useState([]);

  const { data: orderStatus, loading } = useFetch(
    "/api/dashboard/admin/order-status",
  );

  useEffect(() => {
    if (orderStatus?.success) {
      const newData = orderStatus.data.map((item) => ({
        status: item._id || "pending",
        count: item.count || 0,
        fill: chartConfig[item._id]?.color || "#9ca3af",
      }));

      setChartData(newData);
    }
  }, [orderStatus]);

  const totalOrders = chartData.reduce(
    (sum, item) => sum + Number(item.count || 0),
    0,
  );

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  const colors = {
    pending: "bg-blue-500",
    confirmed: "bg-purple-500",
    preparing: "bg-yellow-500",
    ready: "bg-cyan-500",
    out_for_delivery: "bg-sky-500",
    delivered: "bg-green-500",
    cancelled: "bg-red-500",
  };

  return (
    <div>
      <Card className="flex flex-col border-0 shadow-none">
        <CardHeader className="items-center pb-0">
          <CardTitle>Orders Status</CardTitle>
        </CardHeader>

        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />

              <Pie
                data={chartData}
                dataKey="count"
                nameKey="status"
                innerRadius={60}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (!viewBox?.cx || !viewBox?.cy) return null;

                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalOrders}
                        </tspan>

                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy + 22}
                          className="fill-muted-foreground text-sm"
                        >
                          Orders
                        </tspan>
                      </text>
                    );
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="mt-4">
        <ul className="space-y-3 text-sm">
          {chartData.map((item) => {
            const status = item.status || "pending";

            return (
              <li key={status} className="flex justify-between items-center">
                <span className="capitalize">
                  {status
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                </span>

                <span
                  className={`${
                    colors[status] || "bg-gray-500"
                  } text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-semibold`}
                >
                  {item.count}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
