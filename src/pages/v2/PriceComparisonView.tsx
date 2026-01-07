import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { quotationApi } from "../../services/quotationApi.ts";
import { PriceComparison, SupplierTotal } from "../../types/quotation.ts";
import {
  Loader2,
  AlertCircle,
  ArrowLeft,
  Trophy,
  TrendingDown,
  Package,
  Users,
  DollarSign,
  Download,
  ShoppingCart,
} from "lucide-react";
import { useGenerateOrders } from "../../hooks/useOrders";

const formatCurrency = (value: number | null) => {
  if (value === null) return "-";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const PriceComparisonView: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const quotationId = Number(id);

  const [showOnlyBest, setShowOnlyBest] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingOrders, setIsExportingOrders] = useState(false);
  const generateOrdersMutation = useGenerateOrders();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["quotation-comparison", quotationId],
    queryFn: () => quotationApi.getComparison(quotationId),
    enabled: !!quotationId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <span className="ml-2 text-gray-600">Carregando comparação...</span>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-3" />
        <p className="text-red-600 font-medium">Erro ao carregar comparação</p>
        <p className="text-sm text-gray-500 mt-1">{(error as Error)?.message || "Tente novamente"}</p>
        <button
          onClick={() => navigate(`/v2/quotation/${quotationId}`)}
          className="mt-4 flex items-center gap-2 px-3 py-2 text-sm rounded bg-emerald-600 text-white hover:bg-emerald-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para cotação
        </button>
      </div>
    );
  }

  const suppliers = data.supplierTotals;
  const comparisons = showOnlyBest
    ? data.comparisons.filter((c) => c.bestPrice !== null)
    : data.comparisons;

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const blob = await quotationApi.exportComparison(quotationId);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `comparacao_${data.quotationName.replace(/\s+/g, "_")}.xlsx`);
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

  const handleExportOrders = async () => {
    setIsExportingOrders(true);
    try {
      const blob = await quotationApi.exportBestPrices(quotationId);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `pedidos_${data.quotationName.replace(/\s+/g, "_")}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Erro ao exportar pedidos:", err);
    } finally {
      setIsExportingOrders(false);
    }
  };

  const handleGenerateOrders = () => {
    if (confirm("Deseja gerar pedidos de compra com os melhores preços?")) {
      generateOrdersMutation.mutate(quotationId, {
        onSuccess: () => {
          navigate("/v2/orders");
        },
      });
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold">Comparação de Preços</h1>
          <p className="text-sm text-gray-600">{data.quotationName}</p>
        </div>
        <button
          onClick={() => navigate(`/v2/quotation/${quotationId}`)}
          className="flex items-center gap-2 px-3 py-2 text-sm rounded border border-gray-300 hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <Package className="h-4 w-4" />
            <span className="text-xs">Produtos</span>
          </div>
          <p className="text-2xl font-bold">{data.totalProducts}</p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <Users className="h-4 w-4" />
            <span className="text-xs">Fornecedores</span>
          </div>
          <p className="text-2xl font-bold">
            {data.respondedSuppliers}/{data.totalSuppliers}
          </p>
          <p className="text-xs text-gray-500">responderam</p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center gap-2 text-emerald-600 mb-1">
            <TrendingDown className="h-4 w-4" />
            <span className="text-xs">Economia Máxima</span>
          </div>
          <p className="text-2xl font-bold text-emerald-600">{formatCurrency(data.maxSavings)}</p>
          <p className="text-xs text-gray-500">comprando do melhor</p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <Trophy className="h-4 w-4" />
            <span className="text-xs">Melhor Geral</span>
          </div>
          {suppliers.length > 0 && (
            <>
              <p className="text-lg font-bold">
                {suppliers.sort((a, b) => b.productsWithBestPrice - a.productsWithBestPrice)[0]?.supplierName}
              </p>
              <p className="text-xs text-gray-500">
                {suppliers[0]?.productsWithBestPrice} melhores preços
              </p>
            </>
          )}
        </div>
      </div>

      {/* Supplier Totals */}
      <div className="border rounded-lg p-4">
        <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Resumo por Fornecedor
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {suppliers
            .sort((a, b) => a.totalValue - b.totalValue)
            .map((supplier: SupplierTotal, idx: number) => (
              <div
                key={supplier.supplierId}
                className={`p-3 rounded border ${
                  idx === 0 ? "bg-emerald-50 border-emerald-200" : "bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{supplier.supplierName}</span>
                  {idx === 0 && <Trophy className="h-4 w-4 text-emerald-600" />}
                </div>
                <p className="text-xl font-bold">{formatCurrency(supplier.totalValue)}</p>
                <p className="text-xs text-gray-500">
                  {supplier.productsWithBestPrice} melhores preços • {supplier.productsQuoted} cotados
                </p>
              </div>
            ))}
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showOnlyBest}
            onChange={(e) => setShowOnlyBest(e.target.checked)}
            className="rounded text-emerald-600"
          />
          <span className="text-sm">Mostrar apenas produtos com melhor preço</span>
        </label>
      </div>

      {/* Comparison Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-3 font-medium">Produto</th>
                <th className="text-center py-3 px-3 font-medium">Qtd</th>
                {suppliers.map((s: SupplierTotal) => (
                  <th key={s.supplierId} className="text-center py-3 px-3 font-medium">
                    {s.supplierName}
                  </th>
                ))}
                <th className="text-center py-3 px-3 font-medium bg-emerald-50">Melhor</th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((comp: PriceComparison) => (
                <tr key={comp.productId} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-3">
                    <p className="font-medium">{comp.productName}</p>
                  </td>
                  <td className="text-center py-3 px-3">{comp.totalQuantity}</td>
                  {suppliers.map((s: SupplierTotal) => {
                    const priceEntry = comp.prices.find((p) => p.supplierId === s.supplierId);
                    const isBest = comp.bestPrice?.supplierId === s.supplierId;
                    return (
                      <td
                        key={s.supplierId}
                        className={`text-center py-3 px-3 ${isBest ? "bg-emerald-50" : ""}`}
                      >
                        {priceEntry?.available ? (
                          <div>
                            <p className={`font-medium ${isBest ? "text-emerald-600" : ""}`}>
                              {isBest && <Trophy className="h-3 w-3 inline mr-1" />}
                              {formatCurrency(priceEntry.unitPrice)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatCurrency(priceEntry.totalPrice)}
                            </p>
                          </div>
                        ) : (
                          <span className="text-gray-400">Indisponível</span>
                        )}
                      </td>
                    );
                  })}
                  <td className="text-center py-3 px-3 bg-emerald-50">
                    {comp.bestPrice ? (
                      <div>
                        <p className="font-medium text-emerald-600">{comp.bestPrice.supplierName}</p>
                        <p className="text-xs text-gray-500">
                          Economia: {formatCurrency(comp.bestPrice.savings)}
                        </p>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={() => navigate(`/v2/quotation/${quotationId}`)}
          className="flex items-center gap-2 px-4 py-2 text-sm rounded border border-gray-300 hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center gap-2 px-4 py-2 text-sm rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
        >
          {isExporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {isExporting ? "Exportando..." : "Exportar Completo"}
        </button>
        <button
          onClick={handleExportOrders}
          disabled={isExportingOrders}
          className="flex items-center gap-2 px-4 py-2 text-sm rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
        >
          {isExportingOrders ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {isExportingOrders ? "Exportando..." : "Exportar Pedidos"}
        </button>
        <button
          onClick={handleGenerateOrders}
          disabled={generateOrdersMutation.isPending}
          className="flex items-center gap-2 px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {generateOrdersMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ShoppingCart className="h-4 w-4" />
          )}
          {generateOrdersMutation.isPending ? "Gerando..." : "Gerar Pedidos"}
        </button>
      </div>
    </div>
  );
};

export default PriceComparisonView;
