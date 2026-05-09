import { AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";

const outOfStock = ["Sambal"];
const lowStock = [{ name: "Gado-Gado", left: 18 }];

const InventoryReportStats = () => {
  const t = useTranslations("Inventory");
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle size={16} className="text-red-500" />
          <span className="text-sm font-semibold text-red-600">{t("outOfStock")}</span>
        </div>
        {outOfStock.map((item) => (
          <p key={item} className="text-sm text-red-400">• {item}</p>
        ))}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle size={16} className="text-yellow-500" />
          <span className="text-sm font-semibold text-yellow-600">{t("lowStockAlert")}</span>
        </div>
        {lowStock.map((item) => (
          <p key={item.name} className="text-sm text-yellow-500">
            • {item.name} ({item.left} {t("left")})
          </p>
        ))}
      </div>
    </div>
  );
};

export default InventoryReportStats;