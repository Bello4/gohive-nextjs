"use client";

interface InsuranceToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

export default function InsuranceToggle({
  value,
  onChange,
}: InsuranceToggleProps) {
  return (
    <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg">
      <div>
        <div className="font-medium text-gray-900">Apply Insurance</div>
        <div className="text-sm text-gray-500">
          Protect your package (2% of item value)
        </div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
      </label>
    </div>
  );
}
