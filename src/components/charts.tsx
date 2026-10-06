"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export function BudgetDonut({
  data,
  colors,
  formatValue,
}: {
  data: { name: string; value: number }[];
  colors: string[];
  formatValue: (v: number) => string;
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" outerRadius={100}>
          {data.map((_, i) => (
            <Cell key={i} fill={colors[i % colors.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(v: number) => formatValue(v)} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function BurndownChart({
  data,
}: {
  data: { day: string; ideal: number; actual: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#d7e0e0" />
        <XAxis dataKey="day" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip />
        <Line type="monotone" dataKey="ideal" stroke="#9aa6a6" strokeDasharray="4 4" />
        <Line type="monotone" dataKey="actual" stroke="#009B9A" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
