"use client"

import * as React from "react"
import {
  Area,
  AreaChart as RechartsAreaChart,
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

// Define a reusable context for chart configuration
const ChartContext = React.createContext<{
  colors: Record<string, string>
}>({
  colors: {},
})

export function ChartContainer({
  children,
  config,
  className,
}: {
  children: React.ReactNode
  config: Record<string, { label: string; color: string }>
  className?: string
}) {
  // Convert config to CSS variables
  const style = React.useMemo(() => {
    return Object.entries(config).reduce(
      (acc, [key, value]) => {
        acc[`--color-${key}`] = value.color
        return acc
      },
      {} as Record<string, string>,
    )
  }, [config])

  return (
    <ChartContext.Provider value={{ colors: Object.fromEntries(Object.entries(config).map(([key, value]) => [key, value.color])) }}>
      <div className={className} style={style}>
        {children}
      </div>
    </ChartContext.Provider>
  )
}

export function ChartTooltip({  ...props }: React.ComponentProps<typeof Tooltip>) {
  return (
    <Tooltip
      content={({ active, payload, label }) => {
        if (!active || !payload) return null

        return (
          <div className="rounded-lg border bg-background p-2 shadow-sm">
            <div className="grid grid-flow-col gap-2">
              <div className="font-medium">{label}</div>
            </div>
            <div className="mt-1 grid gap-1">
              {payload.map((data, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: data.color }} />
                  <span className="text-sm text-muted-foreground">{data.name}:</span>
                  <span className="text-sm font-medium">{data.value}</span>
                </div>
              ))}
            </div>
          </div>
        )
      }}
      {...props}
    />
  )
}

export function ChartTooltipContent({
  active,
  payload,
  label,

  indicator = "line",
  ...props
}: React.ComponentProps<typeof Tooltip> & {
  active?: boolean
  payload?: unknown[]
  label?: string
  indicator?: "line" | "dot" | "dashed"
}) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm" {...(props as React.HTMLAttributes<HTMLDivElement>)}>
      <div className="grid grid-flow-col gap-2">
        <div className="font-medium">{label}</div>
      </div>
      <div className="mt-1 grid gap-1">
        {payload.map((data, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className={`h-2 w-2 ${
                indicator === "line"
                  ? "h-0.5 w-4"
                  : indicator === "dashed"
                    ? "h-0.5 w-4 border-t-2 border-dashed"
                    : "rounded-full"
              }`}
              style={{ backgroundColor: data.color }}
            />
            <span className="text-sm text-muted-foreground">{data.name}:</span>
            <span className="text-sm font-medium">{data.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

interface ChartProps {
  data: unknown[]
  index: string
  categories: string[]
  colors: string[]
  valueFormatter?: (value: number) => string
  className?: string
}

export const AreaChart: React.FC<ChartProps> = ({
  data,
  index,
  categories,
  colors,
  valueFormatter = (value) => `${value}`,
  className,
}) => {
  return (
    <ResponsiveContainer width="100%" height="100%" className={className}>
      <RechartsAreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          {categories.map((category, i) => (
            <linearGradient key={category} id={`color-${category}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors[i % colors.length]} stopOpacity={0.8} />
              <stop offset="95%" stopColor={colors[i % colors.length]} stopOpacity={0.1} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis dataKey={index} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
        <YAxis tickFormatter={valueFormatter} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
        <ChartTooltip />
        <Legend />
        {categories.map((category, i) => (
          <Area
            key={category}
            type="monotone"
            dataKey={category}
            stroke={colors[i % colors.length]}
            fillOpacity={1}
            fill={`url(#color-${category})`}
          />
        ))}
      </RechartsAreaChart>
    </ResponsiveContainer>
  )
}

export const BarChart: React.FC<ChartProps> = ({
  data,
  index,
  categories,
  colors,
  valueFormatter = (value) => `${value}`,
  className,
}) => {
  return (
    <ResponsiveContainer width="100%" height="100%" className={className}>
      <RechartsBarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
        <XAxis dataKey={index} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
        <YAxis tickFormatter={valueFormatter} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
        <ChartTooltip />
        <Legend />
        {categories.map((category, i) => (
          <Bar key={category} dataKey={category} fill={colors[i % colors.length]} radius={[4, 4, 0, 0]} barSize={30} />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}

export const LineChart: React.FC<ChartProps> = ({
  data,
  index,
  categories,
  colors,
  valueFormatter = (value) => `${value}`,
  className,
}) => {
  return (
    <ResponsiveContainer width="100%" height="100%" className={className}>
      <RechartsLineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis dataKey={index} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
        <YAxis tickFormatter={valueFormatter} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
        <ChartTooltip />
        <Legend />
        {categories.map((category, i) => (
          <Line
            key={category}
            type="monotone"
            dataKey={category}
            stroke={colors[i % colors.length]}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}

export const PieChart: React.FC<ChartProps> = ({
  data,
  index,
  categories,
  colors,
  valueFormatter = (value) => `${value}`,
  className,
}) => {
  const RADIAN = Math.PI / 180
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    name,
  }: {
    cx: number
    cy: number
    midAngle: number
    innerRadius: number
    outerRadius: number
    percent: number
    name: string
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" fontSize={12}>
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%" className={className}>
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={80}
          fill="#8884d8"
          dataKey={categories[0]}
          nameKey={index}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip formatter={valueFormatter} />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  )
}
