import InventoryReportStats from "./InventoryReportStats";
import InventoryOverviewTable from "./InventoryOverviewTable";
import { useTranslations } from "next-intl";

const InventoryReportPage = () => {
  const t = useTranslations("Inventory");
  return (
    <div>
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
          <p className="text-sm text-gray-400 mt-1">{t("subtitle")}</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors">
          <span className="text-base leading-none">+</span> {t("addItem")}
        </button>
      </div>
      <InventoryReportStats />
      <InventoryOverviewTable />
    </div>
  );
};

export default InventoryReportPage;