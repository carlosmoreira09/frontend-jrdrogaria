import React from "react";
import { useNavigate } from "react-router-dom";
import { useOrders } from "../../hooks/useOrders";
import { PurchaseOrder, OrderStatus } from "../../types/order";
import {
  Loader2,
  AlertCircle,
  Package,
  RefreshCw,
  Eye,
  Download,
} from "lucide-react";
import { orderApi } from "../../services/orderApi";

const statusColors: Record<OrderStatus, string> = {
  draft: "bg-gray-100 text-gray-700",
  confirmed: "bg-blue-100 text-blue-700",
  sent: "bg-yellow-100 text-yellow-700",
  delivered: "bg-emerald-100 text-emerald-700",
};

const statusLabels: Record<OrderStatus, string> = {
  draft: "Rascunho",
  confirmed: "Confirmado",
  sent: "Enviado",
  delivered: "Entregue",
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const OrderList: React.FC = () => {
  const navigate = useNavigate();
  const { data = [], isLoading, isError, error, refetch } = useOrders();

  const handleExport = async (orderId: number, orderNumber: string) => {
    try {
      const blob = await orderApi.export(orderId);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `pedido_${orderNumber}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Erro ao exportar:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <span className="ml-2 text-gray-600">Carregando pedidos...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-3" />
        <p className="text-red-600 font-medium">Erro ao carregar pedidos</p>
        <p className="text-sm text-gray-500 mt-1">{(error as Error)?.message || "Tente novamente"}</p>
        <button
          onClick={() => refetch()}
          className="mt-4 flex items-center gap-2 px-3 py-2 text-sm rounded bg-emerald-600 text-white hover:bg-emerald-700"
        >
          <RefreshCw className="h-4 w-4" />
          Tentar novamente
        </button>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold">Pedidos de Compra</h1>
            <p className="text-sm text-gray-600">Gerencie seus pedidos de compra</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Package className="h-12 w-12 text-gray-400 mb-3" />
          <p className="text-gray-600 font-medium">Nenhum pedido cadastrado</p>
          <p className="text-sm text-gray-500 mt-1">
            Gere pedidos a partir da comparação de preços
          </p>
          <button
            onClick={() => navigate("/quotation")}
            className="mt-4 px-3 py-2 text-sm rounded bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Ver cotações
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Pedidos de Compra</h1>
          <p className="text-sm text-gray-600">Gerencie seus pedidos de compra</p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-3 py-2 text-sm rounded border border-gray-300 hover:bg-gray-50"
        >
          <RefreshCw className="h-4 w-4" />
          Atualizar
        </button>
      </div>

      <div className="space-y-3">
        {data.map((order: PurchaseOrder) => (
          <div key={order.id} className="border rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="font-semibold">{order.orderNumber}</h2>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      statusColors[order.status]
                    }`}
                  >
                    {statusLabels[order.status]}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Fornecedor: {order.supplier?.supplier_name || "N/A"}
                </p>
                {order.quotationRequest && (
                  <p className="text-xs text-gray-500">
                    Cotação: {order.quotationRequest.name}
                  </p>
                )}
                <p className="text-lg font-bold text-emerald-600 mt-2">
                  {formatCurrency(order.totalValue)}
                </p>
                <p className="text-xs text-gray-500">
                  {order.items?.length || 0} itens
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/orders/${order.id}`)}
                  className="flex items-center gap-1 px-2 py-1 text-sm rounded border border-gray-300 hover:bg-gray-50"
                >
                  <Eye className="h-4 w-4" />
                  Detalhes
                </button>
                <button
                  onClick={() => handleExport(order.id, order.orderNumber)}
                  className="flex items-center gap-1 px-2 py-1 text-sm rounded border border-gray-300 hover:bg-gray-50"
                >
                  <Download className="h-4 w-4" />
                  Excel
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderList;
