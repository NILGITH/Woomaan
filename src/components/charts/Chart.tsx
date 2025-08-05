
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  ChartData,
  ChartOptions,
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

type DataObject = { [key: string]: unknown };

interface ChartProps {
  type?: "line" | "bar" | "pie";
  data: ChartData<"line" | "bar" | "pie"> | DataObject[];
  options?: ChartOptions<"line" | "bar" | "pie">;
  title?: string;
  xKey?: string;
  yKey?: string;
  color?: string;
}

export default function Chart({ type = "line", data, options, title, xKey, yKey, color }: ChartProps) {
  
  const chartData: ChartData<"line" | "bar" | "pie"> = (Array.isArray(data) && xKey && yKey) ? {
    labels: data.map(item => item[xKey] as string),
    datasets: [
      {
        label: title || "Dataset",
        data: data.map(item => item[yKey] as number),
        backgroundColor: color ? `${color}33` : "rgba(75, 192, 192, 0.2)",
        borderColor: color || "rgba(75, 192, 192, 1)",
        borderWidth: 2,
        pointBackgroundColor: color || "rgba(75, 192, 192, 1)",
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.3
      },
    ],
  } : data as ChartData<"line" | "bar" | "pie">;

  const defaultOptions: ChartOptions<"line" | "bar" | "pie"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: !!title,
        text: title,
      },
    },
    scales: {
        y: {
            beginAtZero: true
        }
    }
  };

  const chartOptions = { ...defaultOptions, ...options };

  const ChartComponent = () => {
    switch(type) {
      case "bar":
        return <Bar options={chartOptions as ChartOptions<"bar">} data={chartData as ChartData<"bar">} />;
      case "pie":
        return <Pie options={chartOptions as ChartOptions<"pie">} data={chartData as ChartData<"pie">} />;
      default:
        return <Line options={chartOptions as ChartOptions<"line">} data={chartData as ChartData<"line">} />;
    }
  };

  return <div className="h-96 w-full">{ChartComponent()}</div>;
}
