import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOrder, useUpdateOrderStatus } from "../../hooks/useOrders";
import { OrderStatus, PurchaseOrderItem } from "../../types/order";
import { orderApi } from "../../services/orderApi";
import {
  Loader2,
  AlertCircle,
  ArrowLeft,
  Download,
  CheckCircle,
  Truck,
  Package,
  FileText,
} from "lucide-react";

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

const OrderDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const orderId = Number(id);

  const { data: order, isLoading, isError, error, refetch } = useOrder(orderId);
  const updateStatusMutation = useUpdateOrderStatus();

  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!order) return;
    setIsExporting(true);
    try {
      const blob = await orderApi.export(orderId);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `pedido_${order.orderNumber}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Erro ao exportar:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleStatusChange = (newStatus: OrderStatus) => {
    updateStatusMutation.mutate(
      { id: orderId, status: newStatus },
      { onSuccess: () => refetch() }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <span className="ml-2 text-gray-600">Carregando pedido...</span>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-3" />
        <p className="text-red-600 font-medium">Erro ao carregar pedido</p>
        <p className="text-sm text-gray-500 mt-1">
          {(error as Error)?.message || "Pedido não encontrado"}
        </p>
        <button
          onClick={() => navigate("/orders")}
          className="mt-4 flex items-center gap-2 px-3 py-2 text-sm rounded bg-emerald-600 text-white hover:bg-emerald-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para lista
        </button>
      </div>
    );
  }

  const totalByPharmacy = {
    JR: 0,
    GS: 0,
    BARAO: 0,
    LB: 0,
  };

  order.items?.forEach((item) => {
    totalByPharmacy.JR += item.quantities.JR * Number(item.unitPrice);
    totalByPharmacy.GS += item.quantities.GS * Number(item.unitPrice);
    totalByPharmacy.BARAO += item.quantities.BARAO * Number(item.unitPrice);
    totalByPharmacy.LB += item.quantities.LB * Number(item.unitPrice);
  });

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold">{order.orderNumber}</h1>
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
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-3 py-2 text-sm rounded bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {isExporting ? "Exportando..." : "Exportar Excel"}
          </button>
          <button
            onClick={() => navigate("v2/orders")}
            className="flex items-center gap-2 px-3 py-2 text-sm rounded border border-gray-300 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>
        </div>
      </div>

      {/* Status Actions */}
      {order.status !== "delivered" && (
        <div className="border rounded-lg p-4">
          <h2 className="font-semibold text-gray-800 mb-3">Alterar Status</h2>
          <div className="flex gap-2">
            {order.status === "draft" && (
              <button
                onClick={() => handleStatusChange("confirmed")}
                disabled={updateStatusMutation.isPending}
                className="flex items-center gap-2 px-3 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                <CheckCircle className="h-4 w-4" />
                Confirmar Pedido
              </button>
            )}
            {order.status === "confirmed" && (
              <button
                onClick={() => handleStatusChange("sent")}
                disabled={updateStatusMutation.isPending}
                className="flex items-center gap-2 px-3 py-2 text-sm rounded bg-yellow-600 text-white hover:bg-yellow-700 disabled:opacity-50"
              >
                <Truck className="h-4 w-4" />
                Marcar como Enviado
              </button>
            )}
            {order.status === "sent" && (
              <button
                onClick={() => handleStatusChange("delivered")}
                disabled={updateStatusMutation.isPending}
                className="flex items-center gap-2 px-3 py-2 text-sm rounded bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                <Package className="h-4 w-4" />
                Marcar como Entregue
              </button>
            )}
          </div>
        </div>
      )}

      {/* Summary by Pharmacy */}
      <div className="border rounded-lg p-4">
        <h2 className="font-semibold text-gray-800 mb-3">Resumo por Farmácia</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(["JR", "GS", "BARAO", "LB"] as const).map((pharmacy) => (
            <div key={pharmacy} className="bg-gray-50 rounded p-3 text-center">
              <p className="text-sm font-medium text-gray-600">{pharmacy}</p>
              <p className="text-lg font-bold">
                {formatCurrency(totalByPharmacy[pharmacy])}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t text-center">
          <p className="text-sm text-gray-600">Total do Pedido</p>
          <p className="text-2xl font-bold text-emerald-600">
            {formatCurrency(order.totalValue)}
          </p>
        </div>
      </div>

      {/* Items Table */}
      <div className="border rounded-lg p-4">
        <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Itens do Pedido ({order.items?.length || 0})
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-3 font-medium">Produto</th>
                <th className="text-center py-3 px-3 font-medium">JR</th>
                <th className="text-center py-3 px-3 font-medium">GS</th>
                <th className="text-center py-3 px-3 font-medium">BARÃO</th>
                <th className="text-center py-3 px-3 font-medium">LB</th>
                <th className="text-center py-3 px-3 font-medium">Preço Unit.</th>
                <th className="text-center py-3 px-3 font-medium">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item: PurchaseOrderItem, idx: number) => (
                <tr key={idx} className="border-t">
                  <td className="py-3 px-3">
                    {item.product?.product_name || item.productName || `Produto ${item.productId}`}
                  </td>
                  <td className="text-center py-3 px-3">{item.quantities.JR}</td>
                  <td className="text-center py-3 px-3">{item.quantities.GS}</td>
                  <td className="text-center py-3 px-3">{item.quantities.BARAO}</td>
                  <td className="text-center py-3 px-3">{item.quantities.LB}</td>
                  <td className="text-center py-3 px-3">
                    {formatCurrency(Number(item.unitPrice))}
                  </td>
                  <td className="text-center py-3 px-3 font-medium">
                    {formatCurrency(Number(item.subtotal))}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-emerald-50">
              <tr>
                <td colSpan={6} className="py-3 px-3 text-right font-bold">
                  Total:
                </td>
                <td className="text-center py-3 px-3 font-bold text-emerald-600">
                  {formatCurrency(order.totalValue)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
