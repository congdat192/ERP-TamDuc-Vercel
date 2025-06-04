
interface CustomerStatsProps {
  totalDebt: string;
}

export function CustomerStats({ totalDebt }: CustomerStatsProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 mb-6 p-4">
      <div className="text-right">
        <span className="text-xl sm:text-2xl font-bold text-gray-900">{totalDebt}</span>
      </div>
    </div>
  );
}
