import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SupplierPricePayload } from "../../types/supplierPrice";
import { usePublicQuotation, useSaveSupplierPrices } from "../../hooks/usePublicQuotation";
import { Loader2, AlertCircle, Save, Send, CheckCircle, Package, Search } from "lucide-react";
import logo from "../../assets/app-logo.jpeg";

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

const SupplierQuotationForm: React.FC = () => {
  const { token = "" } = useParams();
  const navigate = useNavigate();
  const { data: supplierQuotation, isLoading, isError, error } = usePublicQuotation(token);
  const saveMutation = useSaveSupplierPrices();
  const [prices, setPrices] = useState<Record<number, SupplierPricePayload>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState("");

  // Extract quotation data from supplier quotation response
  const quotation = supplierQuotation?.quotationRequest;
  const items = quotation?.items || [];
  
  // Filter items by search term
  const filteredItems = items.filter((item: any) => {
    const productName = item.product?.product_name || item.productName || "";
    return productName.toLowerCase().includes(searchFilter.toLowerCase());
  });

  useEffect(() => {
    if (items.length > 0) {
      const initial: Record<number, SupplierPricePayload> = {};
      items.forEach((item: any) => {
        const productId = item.product?.id || item.productId;
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

  const submit = (finalSubmit: boolean) => {
    setSuccessMessage(null);
    const payload = Object.values(prices);
    saveMutation.mutate(
      { token, prices: payload, finalSubmit },
      {
        onSuccess: () => {
          if (finalSubmit) {
            navigate("/supplier-quote/success");
          } else {
            setSuccessMessage("Rascunho salvo com sucesso!");
          }
        },
      }
    );
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
            <h2 className="text-xl font-semibold text-red-600">Link inválido ou expirado</h2>
            <p className="text-gray-500 mt-2">{(error as Error)?.message || "Verifique o link e tente novamente."}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!supplierQuotation) return null;

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
              <p className="text-sm text-gray-500 mt-1">
                Fornecedor: <span className="font-medium text-gray-700">{supplierQuotation.supplier?.supplier_name}</span>
              </p>
              {quotation?.deadline && (
                <p className="text-sm text-gray-500">
                  Prazo: <span className="font-medium text-gray-700">{new Date(quotation.deadline).toLocaleDateString()}</span>
                </p>
              )}
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full">
              {items.length} {items.length === 1 ? 'produto' : 'produtos'}
            </span>
          </div>
        </div>

        {successMessage && (
          <div className="flex items-center gap-2 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
            <span className="text-sm text-emerald-700 font-medium">{successMessage}</span>
          </div>
        )}
        {saveMutation.isError && (
          <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-sm text-red-600">
              {(saveMutation.error as Error)?.message || "Erro ao salvar preços"}
            </span>
          </div>
        )}

        {/* Products List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wide">Produtos para cotar</h3>
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
          <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
            {filteredItems.map((item: any) => {
              const productId = item.product?.id || item.productId;
              const productName = item.product?.product_name || item.productName || `Produto ${productId}`;
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
                        <p className="text-xs text-gray-500">
                          Qtd: {item.totalQuantity ?? "-"} 
                          <span className="text-gray-300 mx-1">|</span>
                          JR:{item.quantities?.JR || 0} GS:{item.quantities?.GS || 0} BR:{item.quantities?.BARAO || 0} LB:{item.quantities?.LB || 0}
                        </p>
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

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            disabled={saveMutation.isPending}
            onClick={() => submit(false)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium rounded-xl border-2 border-gray-200 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50"
          >
            {saveMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Salvar rascunho
          </button>
          <button
            disabled={saveMutation.isPending}
            onClick={() => submit(true)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50"
          >
            {saveMutation.isPending ? (
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

export default SupplierQuotationForm;
