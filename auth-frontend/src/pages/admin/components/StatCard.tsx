interface StatCardProps {
  title: string;
  count: number;
  color?: "yellow" | "green" | "red" | "blue";
}

export const StatCard = ({ title, count, color = "blue" }: StatCardProps) => {
  const colorClasses = {
    yellow: "bg-yellow-500 text-yellow-900",
    green: "bg-green-500 text-green-900",
    red: "bg-red-500 text-red-900",
    blue: "bg-blue-500 text-blue-900",
  };
  
  return (
    <div className={`p-6 rounded-lg shadow-md ${colorClasses[color]}`}>
      <h2 className="text-lg font-medium">{title}</h2>
      <p className="mt-2 text-3xl font-bold">{count}</p>
    </div>
  );
};
