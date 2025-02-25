import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { 
  Bar, 
  BarChart as RechartsBarChart, 
  Line, 
  LineChart as RechartsLineChart, 
  Pie, 
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

// Sample data for charts
const revenueData = [
  { month: "Jan", revenue: 4000 },
  { month: "Feb", revenue: 3000 },
  { month: "Mar", revenue: 5000 },
  { month: "Apr", revenue: 7000 },
  { month: "May", revenue: 6000 },
  { month: "Jun", revenue: 8000 },
  { month: "Jul", revenue: 10000 },
  { month: "Aug", revenue: 9000 },
  { month: "Sep", revenue: 11000 },
  { month: "Oct", revenue: 12000 },
  { month: "Nov", revenue: 14000 },
  { month: "Dec", revenue: 16000 },
];

const userGrowthData = [
  { month: "Jan", users: 400 },
  { month: "Feb", users: 600 },
  { month: "Mar", users: 800 },
  { month: "Apr", users: 1200 },
  { month: "May", users: 1800 },
  { month: "Jun", users: 2400 },
  { month: "Jul", users: 3200 },
  { month: "Aug", users: 3800 },
  { month: "Sep", users: 4500 },
  { month: "Oct", users: 5200 },
  { month: "Nov", users: 5800 },
  { month: "Dec", users: 6500 },
];

const acquisitionData = [
  { name: "Organic Search", value: 400 },
  { name: "Direct", value: 300 },
  { name: "Referral", value: 300 },
  { name: "Social Media", value: 200 },
  { name: "Email", value: 100 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const chartConfig: ChartConfig = {
  revenue: {
    label: "Revenue",
    theme: {
      light: "#0088FE",
      dark: "#0088FE",
    },
  },
  users: {
    label: "Users",
    theme: {
      light: "#00C49F",
      dark: "#00C49F",
    },
  },
};

export const RevenueChart = () => {
  return (
    <div className="h-[300px] w-full">
      <ChartContainer config={chartConfig}>
        <RechartsLineChart data={revenueData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis 
            tickFormatter={(value) => `$${value}`}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="revenue"
            name="Revenue"
            stroke="var(--color-revenue)"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </RechartsLineChart>
      </ChartContainer>
    </div>
  );
};

export const UserGrowthChart = () => {
  return (
    <div className="h-[400px] w-full">
      <ChartContainer config={chartConfig}>
        <RechartsBarChart data={userGrowthData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          <Bar
            dataKey="users"
            name="Users"
            fill="var(--color-users)"
            radius={[4, 4, 0, 0]}
          />
        </RechartsBarChart>
      </ChartContainer>
    </div>
  );
};

export const AcquisitionChart = () => {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={acquisitionData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {acquisitionData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} users`, "Acquisition"]} />
          <Legend />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};