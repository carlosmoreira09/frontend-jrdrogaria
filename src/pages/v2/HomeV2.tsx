import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { quotationApi } from "../../services/quotationApi";
import { orderApi } from "../../services/orderApi";
import { getTotalAmount } from "../../service/generalService";
import { useStore } from "../../hooks/store";
import {
  FileText,
  ShoppingCart,
  Package,
  Truck,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  ChevronRight,
  BarChart3,
  Loader2,
} from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: "emerald" | "blue" | "amber" | "purple";
  onClick?: () => void;
}

const colorClasses = {
  emerald: {
    bg: "bg-emerald-50",
    icon: "bg-emerald-100 text-emerald-600",
    text: "text-emerald-700",
  },
  blue: {
    bg: "bg-blue-50",
    icon: "bg-blue-100 text-blue-600",
    text: "text-blue-700",
  },
  amber: {
    bg: "bg-amber-50",
    icon: "bg-amber-100 text-amber-600",
    text: "text-amber-700",
  },
  purple: {
    bg: "bg-purple-50",
    icon: "bg-purple-100 text-purple-600",
    text: "text-purple-700",
  },
};

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color,
  onClick,
}) => {
  const colors = colorClasses[color];
  
  return (
    <button
      onClick={onClick}
      className={`w-full p-4 rounded-2xl ${colors.bg} text-left transition-transform active:scale-[0.98]`}
    >
      <div className="flex items-start justify-between">
        <div className={`p-2 rounded-xl ${colors.icon}`}>{icon}</div>
        {onClick && <ChevronRight className="h-4 w-4 text-gray-400 mt-1" />}
      </div>
      <div className="mt-3">
        <p className={`text-2xl font-bold ${colors.text}`}>{value}</p>
        <p className="text-sm font-medium text-gray-700 mt-0.5">{title}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </button>
  );
};

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const QuickAction: React.FC<QuickActionProps> = ({
  title,
  description,
  icon,
  onClick,
}) => (
  <button
    onClick={onClick}
    className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm w-full text-left transition-all hover:shadow-md active:scale-[0.99]"
  >
    <div className="p-3 rounded-xl bg-emerald-100 text-emerald-600">{icon}</div>
    <div className="flex-1 min-w-0">
      <p className="font-semibold text-gray-900">{title}</p>
      <p className="text-sm text-gray-500 truncate">{description}</p>
    </div>
    <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
  </button>
);

interface StatusItemProps {
  label: string;
  count: number;
  color: string;
  icon: React.ReactNode;
}

const StatusItem: React.FC<StatusItemProps> = ({ label, count, color, icon }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
    <div className="flex items-center gap-3">
      <span className={color}>{icon}</span>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </div>
    <span className="text-sm font-bold text-gray-900">{count}</span>
  </div>
);

const HomeV2: React.FC = () => {
  const navigate = useNavigate();
  const { store } = useStore();

  const { data: totals, isLoading: loadingTotals } = useQuery({
    queryKey: ["totals", store],
    queryFn: () => getTotalAmount(store!),
    enabled: !!store,
  });

  const { data: quotations = [], isLoading: loadingQuotations } = useQuery({
    queryKey: ["quotations"],
    queryFn: quotationApi.list,
  });

  const { data: orders = [], isLoading: loadingOrders } = useQuery({
    queryKey: ["orders"],
    queryFn: orderApi.list,
  });

  const isLoading = loadingTotals || loadingQuotations || loadingOrders;

  // Calculate metrics
  const openQuotations = quotations.filter((q) => q.status === "open").length;
  const draftQuotations = quotations.filter((q) => q.status === "draft").length;
  const pendingOrders = orders.filter((o) => o.status === "draft" || o.status === "confirmed").length;
  const deliveredOrders = orders.filter((o) => o.status === "delivered").length;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

  const totalOrdersValue = orders.reduce((acc, o) => acc + Number(o.totalValue || 0), 0);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="py-4 space-y-6 ">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">Visão geral do sistema</p>
        </div>
        <button
          onClick={() => navigate("/v2/quotation/create")}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-medium shadow-lg shadow-emerald-200 active:scale-[0.98] transition-transform"
        >
          <Plus className="h-5 w-5" />
          <span className="hidden sm:inline">Nova Cotação</span>
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          title="Cotações"
          value={quotations.length}
          subtitle={`${openQuotations} abertas`}
          icon={<FileText className="h-5 w-5" />}
          color="emerald"
          onClick={() => navigate("/v2/quotation")}
        />
        <MetricCard
          title="Pedidos"
          value={orders.length}
          subtitle={`${pendingOrders} pendentes`}
          icon={<ShoppingCart className="h-5 w-5" />}
          color="blue"
          onClick={() => navigate("/v2/orders")}
        />
        <MetricCard
          title="Produtos"
          value={totals?.data?.totalProducts || 0}
          icon={<Package className="h-5 w-5" />}
          color="amber"
          onClick={() => navigate("/v2/products")}
        />
        <MetricCard
          title="Fornecedores"
          value={totals?.data?.totalSupplier || 0}
          icon={<Truck className="h-5 w-5" />}
          color="purple"
          onClick={() => navigate("/v2/supplier/home")}
        />
      </div>

      {/* Value Summary */}
      {totalOrdersValue > 0 && (
        <div className="p-4 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-emerald-100">Total em Pedidos</p>
              <p className="text-2xl font-bold">{formatCurrency(totalOrdersValue)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Ações Rápidas</h2>
        <div className="space-y-3">
          <QuickAction
            title="Nova Cotação"
            description="Crie uma nova solicitação de cotação"
            icon={<FileText className="h-5 w-5" />}
            onClick={() => navigate("/v2/quotation/create")}
          />
          <QuickAction
            title="Comparar Preços"
            description="Analise e compare preços dos fornecedores"
            icon={<BarChart3 className="h-5 w-5" />}
            onClick={() => navigate("/v2/quotation")}
          />
          <QuickAction
            title="Ver Pedidos"
            description="Acompanhe seus pedidos de compra"
            icon={<ShoppingCart className="h-5 w-5" />}
            onClick={() => navigate("/v2/orders")}
          />
        </div>
      </div>

      {/* Status Overview */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Status das Cotações</h2>
        <div>
          <StatusItem
            label="Rascunhos"
            count={draftQuotations}
            color="text-gray-500"
            icon={<Clock className="h-4 w-4" />}
          />
          <StatusItem
            label="Abertas"
            count={openQuotations}
            color="text-emerald-500"
            icon={<AlertCircle className="h-4 w-4" />}
          />
          <StatusItem
            label="Finalizadas"
            count={quotations.filter((q) => q.status === "completed").length}
            color="text-blue-500"
            icon={<CheckCircle className="h-4 w-4" />}
          />
        </div>
      </div>

      {/* Orders Status */}
      {orders.length > 0 && (
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Status dos Pedidos</h2>
          <div>
            <StatusItem
              label="Pendentes"
              count={pendingOrders}
              color="text-amber-500"
              icon={<Clock className="h-4 w-4" />}
            />
            <StatusItem
              label="Enviados"
              count={orders.filter((o) => o.status === "sent").length}
              color="text-blue-500"
              icon={<Truck className="h-4 w-4" />}
            />
            <StatusItem
              label="Entregues"
              count={deliveredOrders}
              color="text-emerald-500"
              icon={<CheckCircle className="h-4 w-4" />}
            />
          </div>
        </div>
      )}

      {/* Recent Activity Hint */}
      <div className="text-center py-4">
        <p className="text-xs text-gray-400">
          Deslize para baixo para atualizar
        </p>
      </div>
    </div>
  );
};

export default HomeV2;
