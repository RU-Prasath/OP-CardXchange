interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange }) => (
  <div className="flex gap-4 border-b border-gray-700 mb-6">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onChange(tab.id)}
        className={`py-2 px-4 font-semibold rounded-t-lg transition ${
          activeTab === tab.id ? "bg-gray-700 text-white" : "text-gray-400 hover:text-white"
        }`}
      >
        {tab.label}
      </button>
    ))}
  </div>
);
