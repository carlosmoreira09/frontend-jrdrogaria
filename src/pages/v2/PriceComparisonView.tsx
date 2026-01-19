import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { quotationApi } from "../../services/quotationApi.ts";
import { PriceComparison, SupplierTotal } from "../../types/quotation.ts";
import { OrderItemConfig } from "../../types/order.ts";
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
  Search,
  Minus,
  Plus,
  Edit2,
} from "lucide-react";
import { useGenerateOrders } from "../../hooks/useOrders";
import {Button} from "../../components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "../../components/ui/dialog.tsx";

const STORES = ['JR', 'GS', 'BARAO', 'LB'] as const;
type Store = typeof STORES[number];

const formatCurrency = (value: number | null) => {
  if (value === null) return "-";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

// Type for order item configuration in the dialog
interface OrderItemState {
  quantity: number;
  supplierId: number;
  supplierName: string;
  unitPrice: number;
  targetStore?: Store;
  isEditing?: boolean;
}

const PriceComparisonView: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const quotationId = Number(id);

  const [showOnlyBest, setShowOnlyBest] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingOrders, setIsExportingOrders] = useState(false);
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [orderItems, setOrderItems] = useState<Record<number, OrderItemState>>({});
  const [orderSearch, setOrderSearch] = useState("");
  const [globalStore, setGlobalStore] = useState<Store | undefined>(undefined);

  const generateOrdersMutation = useGenerateOrders();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["quotation-comparison", quotationId],
    queryFn: () => quotationApi.getComparison(quotationId),
    enabled: !!quotationId,
  });

  // Filter and sort products in order dialog (must be before early returns)
  const filteredOrderProducts = useMemo(() => {
    if (!data?.comparisons) return [];
    return data.comparisons
      .filter((comp: PriceComparison) =>
        comp.productName.toLowerCase().includes(orderSearch.toLowerCase())
      )
      .sort((a: PriceComparison, b: PriceComparison) =>
        a.productName.toLowerCase().localeCompare(b.productName.toLowerCase(), 'pt-BR')
      );
  }, [data?.comparisons, orderSearch]);

  // Calculate order totals (must be before early returns)
  const orderTotals = useMemo(() => {
    if (!data?.comparisons) return { items: 0, units: 0, value: 0 };
    let items = 0;
    let units = 0;
    let value = 0;
    data.comparisons.forEach((comp: PriceComparison) => {
      const item = orderItems[comp.productId];
      const qty = item?.quantity || 0;
      if (qty > 0 && item) {
        items++;
        units += qty;
        value += qty * item.unitPrice;
      }
    });
    return { items, units, value };
  }, [data?.comparisons, orderItems]);

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
  const sortedExtractedData = data.comparisons.sort((a, b) =>
      b.productName.toLowerCase().localeCompare(a.productName.toLowerCase(), 'pt-BR')
  );
  const comparisons = showOnlyBest
    ? sortedExtractedData.filter((c) => c.bestPrice !== null)
    : sortedExtractedData;

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

  // Initialize order items when opening dialog
  const initializeOrderItems = () => {
    if (data?.comparisons) {
      const initial: Record<number, OrderItemState> = {};
      data.comparisons.forEach((comp: PriceComparison) => {
        initial[comp.productId] = {
          quantity: comp.totalQuantity || 0,
          supplierId: comp.bestPrice?.supplierId || 0,
          supplierName: comp.bestPrice?.supplierName || '',
          unitPrice: comp.bestPrice?.unitPrice || 0,
          targetStore: undefined,
          isEditing: false,
        };
      });
      setOrderItems(initial);
      setGlobalStore(undefined);
    }
    setShowOrderDialog(true);
  };

  const updateOrderQuantity = (productId: number, delta: number) => {
    setOrderItems(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        quantity: Math.max(0, (prev[productId]?.quantity || 0) + delta)
      }
    }));
  };

  const setOrderQuantity = (productId: number, value: number) => {
    setOrderItems(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        quantity: Math.max(0, value)
      }
    }));
  };

  const toggleEditItem = (productId: number) => {
    setOrderItems(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        isEditing: !prev[productId]?.isEditing
      }
    }));
  };

  const updateItemSupplier = (productId: number, supplierId: number, supplierName: string, unitPrice: number) => {
    setOrderItems(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        supplierId,
        supplierName,
        unitPrice,
      }
    }));
  };

  const updateItemPrice = (productId: number, unitPrice: number) => {
    setOrderItems(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        unitPrice: Math.max(0, unitPrice),
      }
    }));
  };

  const updateItemStore = (productId: number, store: Store | undefined) => {
    setOrderItems(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        targetStore: store,
      }
    }));
  };

  const applyGlobalStore = (store: Store | undefined) => {
    setGlobalStore(store);
    setOrderItems(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(key => {
        updated[Number(key)] = {
          ...updated[Number(key)],
          targetStore: store,
        };
      });
      return updated;
    });
  };

  const handleGenerateOrders = () => {
    setShowOrderDialog(false);
    // Build orderItems array for the mutation
    const items: OrderItemConfig[] = Object.entries(orderItems)
      .filter(([, item]) => item.quantity > 0 && item.supplierId > 0)
      .map(([productId, item]) => ({
        productId: Number(productId),
        quantity: item.quantity,
        supplierId: item.supplierId,
        supplierName: item.supplierName,
        unitPrice: item.unitPrice,
        targetStore: item.targetStore,
      }));

    generateOrdersMutation.mutate(
      { quotationId, orderItems: items },
      {
        onSuccess: () => {
          navigate("/v2/orders");
        },
      }
    );
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
        <Button
            onClick={initializeOrderItems}
            disabled={generateOrdersMutation.isPending}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
        >
          {generateOrdersMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
              <ShoppingCart className="h-4 w-4" />
          )}
          {generateOrdersMutation.isPending ? "Gerando..." : "Gerar Pedidos"}
        </Button>
      </div>
      {/* Dialog para Definir Quantidades do Pedido */}
      <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Configurar Pedido</DialogTitle>
            <DialogDescription>
              Defina a quantidade, fornecedor e loja de destino para cada produto.
            </DialogDescription>
          </DialogHeader>
          
          {/* Summary */}
          <div className="grid grid-cols-3 gap-2 py-2">
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <p className="text-xs text-gray-500">Produtos</p>
              <p className="text-lg font-bold text-gray-900">{orderTotals.items}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <p className="text-xs text-gray-500">Unidades</p>
              <p className="text-lg font-bold text-gray-900">{orderTotals.units}</p>
            </div>
            <div className="bg-emerald-50 rounded-lg p-2 text-center">
              <p className="text-xs text-emerald-600">Total Estimado</p>
              <p className="text-lg font-bold text-emerald-600">{formatCurrency(orderTotals.value)}</p>
            </div>
          </div>

          {/* Global Store Selection */}
          <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
            <span className="text-xs font-medium text-blue-700">Loja para todos:</span>
            <select
              value={globalStore || ''}
              onChange={(e) => applyGlobalStore(e.target.value as Store || undefined)}
              className="text-xs border border-blue-200 rounded px-2 py-1 bg-white"
            >
              <option value="">Todas as lojas</option>
              {STORES.map(store => (
                <option key={store} value={store}>{store}</option>
              ))}
            </select>
            <span className="text-[10px] text-blue-600 ml-2">
              (deixe vazio para gerar mesma quantidade para todas)
            </span>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={orderSearch}
              onChange={(e) => setOrderSearch(e.target.value)}
              placeholder="Buscar produto..."
              className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Product List */}
          <div className="flex-1 overflow-y-auto min-h-0 max-h-[40vh] border rounded-lg divide-y">
            {filteredOrderProducts.map((comp: PriceComparison) => {
              const item = orderItems[comp.productId];
              const isEditing = item?.isEditing;
              
              return (
                <div key={comp.productId} className="p-3 space-y-2">
                  {/* Main Row */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{comp.productName}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className={item?.supplierId !== comp.bestPrice?.supplierId ? 'text-orange-600' : ''}>
                          {item?.supplierName || 'Sem fornecedor'}
                        </span>
                        <span>•</span>
                        <span>{formatCurrency(item?.unitPrice || 0)}/un</span>
                        {item?.targetStore && (
                          <>
                            <span>•</span>
                            <span className="text-blue-600 font-medium">{item.targetStore}</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {/* Edit Button */}
                    <button
                      onClick={() => toggleEditItem(comp.productId)}
                      className={`p-1.5 rounded-md transition-colors ${isEditing ? 'bg-emerald-100 text-emerald-600' : 'hover:bg-gray-100 text-gray-400'}`}
                      title="Editar fornecedor/preço"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateOrderQuantity(comp.productId, -1)}
                        className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 disabled:opacity-30"
                        disabled={!item?.quantity}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={item?.quantity || 0}
                        onChange={(e) => setOrderQuantity(comp.productId, parseInt(e.target.value) || 0)}
                        className="w-16 text-center border border-gray-200 rounded-md py-1 text-sm focus:ring-1 focus:ring-emerald-500"
                      />
                      <button
                        onClick={() => updateOrderQuantity(comp.productId, 1)}
                        className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="w-24 text-right">
                      <p className="text-sm font-medium text-emerald-600">
                        {item?.quantity && item?.unitPrice
                          ? formatCurrency(item.quantity * item.unitPrice)
                          : "-"}
                      </p>
                    </div>
                  </div>

                  {/* Edit Panel */}
                  {isEditing && (
                    <div className="bg-gray-50 rounded-lg p-3 space-y-3">
                      {/* Supplier Selection */}
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Fornecedor</label>
                        <div className="flex flex-wrap gap-1">
                          {comp.prices.filter(p => p.available).map(price => (
                            <button
                              key={price.supplierId}
                              onClick={() => updateItemSupplier(comp.productId, price.supplierId, price.supplierName, price.unitPrice ?? 0)}
                              className={`px-2 py-1 text-xs rounded-full transition-colors ${
                                item?.supplierId === price.supplierId
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-white border border-gray-300 hover:border-emerald-500'
                              }`}
                            >
                              {price.supplierName} - {formatCurrency(price.unitPrice)}
                              {price.supplierId === comp.bestPrice?.supplierId && (
                                <Trophy className="h-3 w-3 inline ml-1" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Custom Price */}
                      <div className="flex items-center gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Preço Unitário</label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item?.unitPrice || 0}
                            onChange={(e) => updateItemPrice(comp.productId, parseFloat(e.target.value) || 0)}
                            className="w-24 border border-gray-300 rounded px-2 py-1 text-sm"
                          />
                        </div>
                        
                        {/* Store Selection */}
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Loja</label>
                          <select
                            value={item?.targetStore || ''}
                            onChange={(e) => updateItemStore(comp.productId, e.target.value as Store || undefined)}
                            className="border border-gray-300 rounded px-2 py-1 text-sm"
                          >
                            <option value="">Todas</option>
                            {STORES.map(store => (
                              <option key={store} value={store}>{store}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            {filteredOrderProducts.length === 0 && (
              <div className="p-6 text-center text-gray-500 text-sm">
                Nenhum produto encontrado
              </div>
            )}
          </div>

          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setShowOrderDialog(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleGenerateOrders} 
              className="bg-green-600 text-white hover:bg-green-700"
              disabled={orderTotals.items === 0}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Gerar {orderTotals.items} Pedido{orderTotals.items !== 1 ? "s" : ""}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PriceComparisonView;
