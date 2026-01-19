import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, AlertCircle, Send, Package, Search, User, Phone, CreditCard } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import apiClient from "../../lib/interceptor";
import logo from "../../assets/app-logo.jpeg";

interface SupplierPricePayload {
  productId: number;
  unitPrice?: number;
  available?: boolean;
  observation?: string;
}

interface SupplierData {
  supplierName: string;
  whatsAppNumber: string;
  paymentTerm: string;
}

// Helper to extract product name from item
const getProductName = (item: any): string => 
  item.product?.product_name || item.productName || "";

const getProductId = (item: any): number => 
  item.product?.id || item.productId;

export const HeaderQuotation = () => (
  <header className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg">
    <div className="max-w-4xl mx-auto px-4 py-4">
      <div className="flex items-center gap-3">
        <img src={logo} alt="JR Drogaria" className="h-12 w-12 rounded-full object-cover border-2 border-white/30" />
        <div>
          <h1 className="text-xl font-bold">JR Drogaria</h1>
          <p className="text-emerald-100 text-sm">Sistema de Cotações</p>
        </div>
      </div>
    </div>
  </header>
);

const AnonymousSupplierForm: React.FC = () => {
  const { token = "" } = useParams();
  const navigate = useNavigate();
  const [prices, setPrices] = useState<Record<number, SupplierPricePayload>>({});
  const [searchFilter, setSearchFilter] = useState("");
  const [supplierData, setSupplierData] = useState<SupplierData>({
    supplierName: "",
    whatsAppNumber: "",
    paymentTerm: "",
  });

  // Fetch quotation
  const { data: quotation, isLoading, isError, error } = useQuery({
    queryKey: ["anonymous-quotation", token],
    queryFn: async () => {
      const { data } = await apiClient.get(`/public/quotation-open/${token}`);
      return data.data;
    },
    enabled: !!token,
  });

  const items = quotation?.items || [];

  // Filter and sort items by product name
  const filteredItems = items
    .filter((item: any) => getProductName(item).toLowerCase().includes(searchFilter.toLowerCase()))
    .sort((a: any, b: any) => getProductName(a).toLowerCase().localeCompare(getProductName(b).toLowerCase(), 'pt-BR'));

  // Initialize prices
  useEffect(() => {
    if (items.length > 0) {
      const initial: Record<number, SupplierPricePayload> = {};
      items.forEach((item: any) => {
        const productId = getProductId(item);
        if (productId) {
          initial[productId] = { productId, available: true };
        }
      });
      setPrices(initial);
    }
  }, [items]);

  const updatePrice = (productId: number, key: keyof SupplierPricePayload, value: any) => {
    setPrices((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        productId,
        [key]: key === "unitPrice" ? Number(value) : value,
      },
    }));
  };

  // Submit mutation
  const submitMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        supplier: supplierData,
        prices: Object.values(prices),
      };
      const { data } = await apiClient.post(`/public/quotation-open/${token}/submit`, payload);
      return data;
    },
    onSuccess: () => {
      navigate("/supplier-quote/success");
    },
  });

  const handleSubmit = () => {
    if (!supplierData.supplierName.trim()) {
      alert("Por favor, informe o nome do fornecedor");
      return;
    }
    submitMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/30 to-gray-100"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(209 213 219 / 0.4) 1px, transparent 0)', backgroundSize: '24px 24px' }}>
        <HeaderQuotation />
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 80px)' }}>
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-emerald-600 mx-auto" />
            <p className="mt-3 text-gray-600">Carregando cotação...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50/30 to-gray-100"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(209 213 219 / 0.4) 1px, transparent 0)', backgroundSize: '24px 24px' }}>
        <HeaderQuotation />
        <div className="flex flex-col items-center justify-center text-center p-4" style={{ minHeight: 'calc(100vh - 80px)' }}>
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-600">Cotação não encontrada</h2>
            <p className="text-gray-500 mt-2">{(error as Error)?.message || "Verifique o link e tente novamente."}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!quotation) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/30 to-gray-100"
      style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(209 213 219 / 0.4) 1px, transparent 0)', backgroundSize: '24px 24px' }}>
      <HeaderQuotation />
      
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Quotation Info Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-emerald-600" />
                <h2 className="text-lg font-semibold text-gray-900">{quotation?.name}</h2>
              </div>
              {quotation?.deadline && (
                <p className="text-sm text-gray-500 mt-1">
                  Prazo: <span className="font-medium text-gray-700">{new Date(quotation.deadline).toLocaleDateString()}</span>
                </p>
              )}
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full">
              {items.length} {items.length === 1 ? 'produto' : 'produtos'}
            </span>
          </div>
        </div>

        {/* Supplier Data Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
          <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wide">Dados do Fornecedor</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                <User className="inline h-3 w-3 mr-1" />
                Nome / Empresa *
              </label>
              <input
                type="text"
                value={supplierData.supplierName}
                onChange={(e) => setSupplierData({ ...supplierData, supplierName: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Nome do fornecedor"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                <Phone className="inline h-3 w-3 mr-1" />
                WhatsApp
              </label>
              <input
                type="text"
                value={supplierData.whatsAppNumber}
                onChange={(e) => setSupplierData({ ...supplierData, whatsAppNumber: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="(00) 00000-0000"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                <CreditCard className="inline h-3 w-3 mr-1" />
                Prazo de Pagamento
              </label>
              <input
                type="text"
                value={supplierData.paymentTerm}
                onChange={(e) => setSupplierData({ ...supplierData, paymentTerm: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Ex: 30 dias"
              />
            </div>
          </div>
        </div>

        {submitMutation.isError && (
          <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-sm text-red-600">
              {(submitMutation.error as Error)?.message || "Erro ao enviar cotação"}
            </span>
          </div>
        )}

        {/* Products List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wide">Produtos para cotar a</h3>
            <span className="text-xs text-gray-500">{filteredItems.length} de {items.length}</span>
          </div>
          
          {/* Search Filter */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Buscar produto..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
            />
          </div>

          {/* Compact Product Cards */}
          <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
            {filteredItems.map((item: any) => {
              const productId = getProductId(item);
              const productName = getProductName(item) || `Produto ${productId}`;
              const isAvailable = prices[productId]?.available ?? true;
              return (
                <div 
                  key={productId} 
                  className={`bg-white rounded-lg border transition-all ${
                    isAvailable ? 'border-gray-200' : 'border-red-200 bg-red-50/50'
                  }`}
                >
                  <div className="p-3">
                    <div className="flex items-center gap-3">
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={isAvailable}
                        onChange={(e) => updatePrice(productId, "available", e.target.checked)}
                        className="h-4 w-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500 flex-shrink-0"
                      />
                      
                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{productName}</p>
                      </div>
                      
                      {/* Price Input */}
                      {isAvailable ? (
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-base text-gray-500">R$</span>
                          <input
                            type="number"
                            step="0.01"
                            value={prices[productId]?.unitPrice ?? ""}
                            onChange={(e) => updatePrice(productId, "unitPrice", e.target.value)}
                            className="w-32 border border-gray-500 rounded px-2 py-1 text-sm text-right focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="0,00"
                          />
                        </div>
                      ) : (
                        <span className="text-xs text-red-500 font-medium flex-shrink-0">Indisponível</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {filteredItems.length === 0 && (
              <div className="text-center py-8 text-gray-500 text-sm">
                Nenhum produto encontrado para "{searchFilter}"
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <button
            disabled={submitMutation.isPending || !supplierData.supplierName.trim()}
            onClick={handleSubmit}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Enviar cotação
          </button>
        </div>
      </main>
    </div>
  );
};

export default AnonymousSupplierForm;
