import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuotation, useGenerateSupplierLinks, useUpdateQuotation } from "../../hooks/useQuotations";
import { listSuppliers } from "../../services/supplierService.ts";
import { useQuery } from "@tanstack/react-query";
import { SupplierQuotation, QuotationStatus, QuotationItem } from "../../types/quotation";
import { Supplier } from "../../types/types";
import { Button } from "../../components/ui/button";
import {
  Loader2,
  AlertCircle,
  ArrowLeft,
  Copy,
  Check,
  Link2,
  Clock,
  CheckCircle,
  FileEdit,
  BarChart3,
  RefreshCw,
  Package,
  Share,
  Globe,
  Search,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const statusConfig: Record<QuotationStatus, { label: string; color: string }> = {
  draft: { label: "Rascunho", color: "bg-gray-100 text-gray-700" },
  open: { label: "Aberta", color: "bg-emerald-100 text-emerald-700" },
  closed: { label: "Fechada", color: "bg-yellow-100 text-yellow-700" },
  completed: { label: "Concluída", color: "bg-blue-100 text-blue-700" },
};

const supplierStatusConfig: Record<string, { icon: React.ReactNode; label: string }> = {
  pending: { icon: <Clock className="h-4 w-4 text-gray-500" />, label: "Aguardando" },
  in_progress: { icon: <FileEdit className="h-4 w-4 text-yellow-500" />, label: "Preenchendo" },
  submitted: { icon: <CheckCircle className="h-4 w-4 text-emerald-500" />, label: "Enviado" },
};

const QuotationDetailsV2: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const quotationId = Number(id);

  const { data: quotation, isLoading, isError, error, refetch } = useQuotation(quotationId);
  const generateLinksMutation = useGenerateSupplierLinks();
  const updateQuotationMutation = useUpdateQuotation();

  const { data: suppliersResponse } = useQuery({
    queryKey: ["suppliers"],
    queryFn: listSuppliers,
  });

  const suppliers: Supplier[] = suppliersResponse?.data || [];

  const [selectedSuppliers, setSelectedSuppliers] = useState<number[]>([]);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [copiedGenericLink, setCopiedGenericLink] = useState(false);
  const [showSupplierSelect, setShowSupplierSelect] = useState(false);
  const [searchProduct, setSearchProduct] = useState("");
  const [showLinks, setShowLinks] = useState(false);
  const [itemQuantities, setItemQuantities] = useState<Record<number, { JR: number; GS: number; BARAO: number; LB: number }>>({});
  const [pendingChanges, setPendingChanges] = useState<Set<number>>(new Set());

  const filteredItems = (quotation?.items || [])
    .filter((item) => {
      const productName = item.product?.product_name || "";
      return productName.toLowerCase().includes(searchProduct.toLowerCase());
    })
    .sort((a, b) => {
      const nameA = (a.product?.product_name || "").toLowerCase();
      const nameB = (b.product?.product_name || "").toLowerCase();
      return nameA.localeCompare(nameB, 'pt-BR');
    });

  // Get quantities for an item (from local state or original data)
  const getItemQuantities = (item: QuotationItem) => {
    const productId = item.product?.id || item.productId;
    if (itemQuantities[productId]) {
      return itemQuantities[productId];
    }
    return {
      JR: item.quantities?.JR ?? item.qty_jr ?? 0,
      GS: item.quantities?.GS ?? item.qty_gs ?? 0,
      BARAO: item.quantities?.BARAO ?? item.qty_barao ?? 0,
      LB: item.quantities?.LB ?? item.qty_lb ?? 0,
    };
  };

  const handleInlineQuantityChange = (productId: number, store: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setItemQuantities(prev => ({
      ...prev,
      [productId]: {
        ...(prev[productId] || getItemQuantities(quotation?.items?.find(i => (i.product?.id || i.productId) === productId)!)),
        [store]: numValue,
      },
    }));
    setPendingChanges(prev => new Set(prev).add(productId));
  };

  const handleSaveAllChanges = () => {
    if (!quotation?.items || pendingChanges.size === 0) return;
    
    const updatedItems = quotation.items.map((item) => {
      const productId = item.product?.id || item.productId;
      const quantities = itemQuantities[productId] || getItemQuantities(item);
      const total = quantities.JR + quantities.GS + quantities.BARAO + quantities.LB;
      return {
        productId,
        quantities,
        totalQuantity: total,
      };
    });

    updateQuotationMutation.mutate(
      {
        id: quotationId,
        payload: {
          name: quotation.name,
          deadline: quotation.deadline,
          items: updatedItems,
        },
      },
      {
        onSuccess: () => {
          setPendingChanges(new Set());
          refetch();
        },
      }
    );
  };

  const existingSupplierIds = quotation?.supplierQuotations?.map((sq) => sq.supplier?.id) || [];
  const availableSuppliers = suppliers.filter((s) => !existingSupplierIds.includes(s.id));

  const toggleSupplier = (id: number) => {
    setSelectedSuppliers((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleGenerateLinks = () => {
    if (selectedSuppliers.length === 0) return;
    generateLinksMutation.mutate(
      { id: quotationId, payload: { supplierIds: selectedSuppliers } },
      {
        onSuccess: () => {
          setSelectedSuppliers([]);
          setShowSupplierSelect(false);
          refetch();
        },
      }
    );
  };

  const copyToClipboard = (token: string) => {
    const url = `${window.location.origin}/supplier-quote/${token}`;
    navigator.clipboard.writeText(url);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const copyGenericLink = () => {
    const url = `${window.location.origin}/quote-open/${quotation?.public_token}`;
    console.log(quotation)
    navigator.clipboard.writeText(url);
    setCopiedGenericLink(true);
    setTimeout(() => setCopiedGenericLink(false), 2000);
  };

  const shareGenericLink = async () => {
    const url = `${window.location.origin}/quote-open/${quotation?.public_token}`;
    console.log(quotation)
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Cotação - ${quotation?.name}`,
          text: `Preencha a cotação aberta`,
          url,
        });
      } catch (err) {
        copyGenericLink();
        console.log(err)
      }
    } else {
      copyGenericLink();
    }
  };

  const shareLink = async (token: string, supplierName: string) => {
    const url = `${window.location.origin}/supplier-quote/${token}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Cotação - ${quotation?.name}`,
          text: `Preencha a cotação para ${supplierName}`,
          url,
        });
      } catch (err) {
        copyToClipboard(token);
        console.error(err)
      }
    } else {
      copyToClipboard(token);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <p className="text-gray-500">Carregando detalhes...</p>
      </div>
    );
  }

  if (isError || !quotation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <AlertCircle className="h-12 w-12 text-red-500 mb-3" />
        <p className="text-red-600 font-medium">Erro ao carregar cotação</p>
        <p className="text-sm text-gray-500 mt-1">{(error as Error)?.message || "Cotação não encontrada"}</p>
        <Button
          onClick={() => navigate("/v2/quotation")}
          className="mt-4"
          variant="outline"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para lista
        </Button>
      </div>
    );
  }

  const status = statusConfig[quotation.status] || statusConfig.draft;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold text-gray-900 truncate">{quotation.name}</h1>
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${status.color}`}>
              {status.label}
            </span>
          </div>
          {quotation.deadline && (
            <p className="text-sm text-gray-500 mt-1">
              Prazo: {new Date(quotation.deadline).toLocaleDateString("pt-BR")}
            </p>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/v2/quotation")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={() => navigate(`/v2/quotation/${quotationId}/comparison`)}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700"
        >
          <BarChart3 className="h-4 w-4 mr-2" />
          Comparar Preços
        </Button>
        <Button
          variant="outline"
          onClick={() => refetch()}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Toggle Links Button */}
      <button
        onClick={() => setShowLinks(!showLinks)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
      >
        <div className="flex items-center gap-2">
          <Link2 className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Links para Fornecedores</span>
          {quotation.supplierQuotations && quotation.supplierQuotations.length > 0 && (
            <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">
              {quotation.supplierQuotations.length}
            </span>
          )}
        </div>
        {showLinks ? (
          <ChevronUp className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        )}
      </button>

      {showLinks && (
        <>
          {/* Generic Link */}
          <div className="border rounded-lg overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="h-4 w-4 text-blue-600" />
                <h2 className="font-medium text-sm text-gray-800">Link Aberto</h2>
              </div>
              <p className="text-xs text-gray-600 mb-2">
                Qualquer fornecedor pode usar este link
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-white h-8 text-xs"
                  onClick={copyGenericLink}
                >
                  {copiedGenericLink ? (
                    <>
                      <Check className="h-3 w-3 mr-1 text-emerald-600" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 mr-1" />
                      Copiar Link
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white h-8"
                  onClick={shareGenericLink}
                >
                  <Share className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>

          {/* Supplier Links - Compacto para Mobile */}
      <div className="border rounded-lg overflow-hidden">
        <div className="px-3 py-2 bg-gray-50 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link2 className="h-4 w-4 text-gray-600" />
            <h2 className="font-medium text-sm text-gray-800">Fornecedores</h2>
            {quotation.supplierQuotations && quotation.supplierQuotations.length > 0 && (
              <span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">
                {quotation.supplierQuotations.length}
              </span>
            )}
          </div>
          {availableSuppliers.length > 0 && (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-2 text-xs"
              onClick={() => setShowSupplierSelect(!showSupplierSelect)}
            >
              <Link2 className="h-3 w-3 mr-1" />
              + Gerar
            </Button>
          )}
        </div>

        {/* Generate Links Form - Compacto */}
        {showSupplierSelect && availableSuppliers.length > 0 && (
          <div className="p-3 bg-emerald-50 border-b">
            <div className="flex flex-wrap gap-2 mb-2">
              {availableSuppliers.map((supplier) => (
                <label
                  key={supplier.id}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs cursor-pointer transition-colors ${
                    selectedSuppliers.includes(supplier.id!)
                      ? "bg-emerald-600 text-white"
                      : "bg-white border border-gray-300 text-gray-700"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedSuppliers.includes(supplier.id!)}
                    onChange={() => toggleSupplier(supplier.id!)}
                    className="sr-only"
                  />
                  {supplier.supplier_name}
                </label>
              ))}
            </div>
            <Button
              onClick={handleGenerateLinks}
              disabled={selectedSuppliers.length === 0 || generateLinksMutation.isPending}
              className="w-full h-8 text-xs bg-emerald-600 hover:bg-emerald-700"
            >
              {generateLinksMutation.isPending ? (
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
              ) : null}
              Gerar {selectedSuppliers.length || ""} Link{selectedSuppliers.length !== 1 ? "s" : ""}
            </Button>
          </div>
        )}

        {/* Supplier List - Compacto */}
        {quotation.supplierQuotations && quotation.supplierQuotations.length > 0 ? (
          <div className="divide-y max-h-[200px] overflow-y-auto">
            {quotation.supplierQuotations.map((sq: SupplierQuotation) => {
              const statusInfo = supplierStatusConfig[sq.status] || supplierStatusConfig.pending;
              return (
                <div key={sq.id} className="px-3 py-2 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    {statusInfo.icon}
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {sq.supplier?.supplier_name || "Fornecedor"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => copyToClipboard(sq.token_hash || sq.accessToken || '')}
                      className={`p-1.5 rounded-md transition-colors ${
                        copiedToken === (sq.token_hash || sq.accessToken)
                          ? "bg-emerald-100 text-emerald-600"
                          : "hover:bg-gray-100 text-gray-500"
                      }`}
                    >
                      {copiedToken === (sq.token_hash || sq.accessToken) ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => shareLink(sq.token_hash || sq.accessToken || '', sq.supplier?.supplier_name || "Fornecedor")}
                      className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500"
                    >
                      <Share className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-4 text-center text-gray-400">
            <p className="text-xs">Nenhum link gerado</p>
          </div>
        )}
      </div>
        </>
      )}

      {/* Items */}
      <div className="border rounded-lg overflow-hidden">
        <div className="px-3 py-2 bg-gray-50 border-b flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-gray-600" />
            <h2 className="font-medium text-sm text-gray-800">Produtos</h2>
            <span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">
              {filteredItems.length}/{quotation.items?.length || 0}
            </span>
          </div>
        </div>

        {/* Campo de Busca */}
        <div className="p-2 border-b">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchProduct}
              onChange={(e) => setSearchProduct(e.target.value)}
              placeholder="Buscar produto..."
              className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Save Button - Show when there are pending changes */}
        {pendingChanges.size > 0 && (
          <div className="p-2 border-b bg-emerald-50">
            <Button
              onClick={handleSaveAllChanges}
              disabled={updateQuotationMutation.isPending}
              className="w-full bg-emerald-600 hover:bg-emerald-700 h-8 text-sm"
            >
              {updateQuotationMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Salvar {pendingChanges.size} alteração{pendingChanges.size !== 1 ? "ões" : ""}
            </Button>
          </div>
        )}

        {filteredItems.length > 0 ? (
          <div className="divide-y max-h-[500px] overflow-y-auto">
            {filteredItems.map((item, idx) => {
              const productId = item.product?.id || item.productId;
              const quantities = getItemQuantities(item);
              const total = quantities.JR + quantities.GS + quantities.BARAO + quantities.LB;
              const hasChanges = pendingChanges.has(productId);
              
              return (
                <div 
                  key={idx} 
                  className={`p-3 md:p-4 ${hasChanges ? 'bg-emerald-50/50' : ''}`}
                >
                  {/* Product Name */}
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-gray-900 text-sm md:text-base truncate flex-1">
                      {item?.product?.product_name || `Produto #${productId}`}
                    </p>
                    <span className="text-xs md:text-sm font-semibold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full ml-2">
                      Total: {total}
                    </span>
                  </div>
                  
                  {/* Inline Inputs */}
                  <div className="grid grid-cols-4 gap-1.5 md:gap-3">
                    <div>
                      <label className="block text-[10px] md:text-xs font-medium text-gray-500 mb-0.5">JR</label>
                      <input
                        type="number"
                        min="0"
                        value={quantities.JR}
                        onChange={(e) => handleInlineQuantityChange(productId, 'JR', e.target.value)}
                        className="w-full border border-gray-300 rounded md:rounded-lg px-2 py-1.5 md:py-2 text-sm md:text-base text-center focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] md:text-xs font-medium text-gray-500 mb-0.5">GS</label>
                      <input
                        type="number"
                        min="0"
                        value={quantities.GS}
                        onChange={(e) => handleInlineQuantityChange(productId, 'GS', e.target.value)}
                        className="w-full border border-gray-300 rounded md:rounded-lg px-2 py-1.5 md:py-2 text-sm md:text-base text-center focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] md:text-xs font-medium text-gray-500 mb-0.5">BR</label>
                      <input
                        type="number"
                        min="0"
                        value={quantities.BARAO}
                        onChange={(e) => handleInlineQuantityChange(productId, 'BARAO', e.target.value)}
                        className="w-full border border-gray-300 rounded md:rounded-lg px-2 py-1.5 md:py-2 text-sm md:text-base text-center focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] md:text-xs font-medium text-gray-500 mb-0.5">LB</label>
                      <input
                        type="number"
                        min="0"
                        value={quantities.LB}
                        onChange={(e) => handleInlineQuantityChange(productId, 'LB', e.target.value)}
                        className="w-full border border-gray-300 rounded md:rounded-lg px-2 py-1.5 md:py-2 text-sm md:text-base text-center focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            <Search className="h-6 w-6 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">
              {searchProduct ? `Nenhum produto encontrado para "${searchProduct}"` : "Nenhum produto na lista"}
            </p>
          </div>
        )}
      </div>

    </div>
  );
};

export default QuotationDetailsV2;
