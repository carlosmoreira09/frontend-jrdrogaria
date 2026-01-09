import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuotation, useGenerateSupplierLinks } from "../../hooks/useQuotations";
import { listSuppliers } from "../../service/supplierService";
import { useQuery } from "@tanstack/react-query";
import { SupplierQuotation, QuotationStatus } from "../../types/quotation";
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

  const { data: suppliersResponse } = useQuery({
    queryKey: ["suppliers"],
    queryFn: listSuppliers,
  });

  const suppliers: Supplier[] = suppliersResponse?.data || [];

  const [selectedSuppliers, setSelectedSuppliers] = useState<number[]>([]);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [copiedGenericLink, setCopiedGenericLink] = useState(false);
  const [showSupplierSelect, setShowSupplierSelect] = useState(false);

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
    const url = `${window.location.origin}/quote-open/${quotation?.id || quotationId}`;
    navigator.clipboard.writeText(url);
    setCopiedGenericLink(true);
    setTimeout(() => setCopiedGenericLink(false), 2000);
  };

  const shareGenericLink = async () => {
    const url = `${window.location.origin}/quote-open/${quotation?.id || quotationId}`;
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

      {/* Generic Link */}
      <div className="border rounded-lg overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="h-5 w-5 text-blue-600" />
            <h2 className="font-semibold text-gray-800">Link Aberto</h2>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Qualquer fornecedor pode usar este link para enviar cotação
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 bg-white"
              onClick={copyGenericLink}
            >
              {copiedGenericLink ? (
                <>
                  <Check className="h-4 w-4 mr-1 text-emerald-600" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-1" />
                  Copiar Link Aberto
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-white"
              onClick={shareGenericLink}
            >
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Supplier Links */}
      <div className="border rounded-lg overflow-hidden">
        <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link2 className="h-5 w-5 text-gray-600" />
            <h2 className="font-semibold text-gray-800">Fornecedores Cadastrados</h2>
          </div>
          {availableSuppliers.length > 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowSupplierSelect(!showSupplierSelect)}
            >
              <Link2 className="h-4 w-4 mr-1" />
              Gerar Links
            </Button>
          )}
        </div>

        {/* Generate Links Form */}
        {showSupplierSelect && availableSuppliers.length > 0 && (
          <div className="p-4 bg-emerald-50 border-b">
            <p className="text-sm font-medium text-gray-700 mb-3">Selecione os fornecedores:</p>
            <div className="space-y-2 mb-3">
              {availableSuppliers.map((supplier) => (
                <label
                  key={supplier.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedSuppliers.includes(supplier.id!)
                      ? "bg-emerald-100 border-emerald-300"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedSuppliers.includes(supplier.id!)}
                    onChange={() => toggleSupplier(supplier.id!)}
                    className="rounded text-emerald-600"
                  />
                  <span className="text-sm font-medium">{supplier.supplier_name}</span>
                </label>
              ))}
            </div>
            <Button
              onClick={handleGenerateLinks}
              disabled={selectedSuppliers.length === 0 || generateLinksMutation.isPending}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              {generateLinksMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Link2 className="h-4 w-4 mr-2" />
              )}
              Gerar {selectedSuppliers.length} Link{selectedSuppliers.length !== 1 ? "s" : ""}
            </Button>
          </div>
        )}

        {/* Supplier List */}
        {quotation.supplierQuotations && quotation.supplierQuotations.length > 0 ? (
          <div className="divide-y">
            {quotation.supplierQuotations.map((sq: SupplierQuotation) => {
              const statusInfo = supplierStatusConfig[sq.status] || supplierStatusConfig.pending;
              return (
                <div key={sq.id} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {statusInfo.icon}
                      <span className="font-medium text-gray-900">
                        {sq.supplier?.supplier_name || "Fornecedor"}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">{statusInfo.label}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => copyToClipboard(sq.token_hash || sq.accessToken || '')}
                    >
                      {copiedToken === (sq.token_hash || sq.accessToken) ? (
                        <>
                          <Check className="h-4 w-4 mr-1 text-emerald-600" />
                          Copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-1" />
                          Copiar
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => shareLink(sq.token_hash || sq.accessToken || '', sq.supplier?.supplier_name || "Fornecedor")}
                    >
                      <Share className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <Link2 className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">Nenhum link gerado</p>
          </div>
        )}
      </div>

      {/* Items */}
      <div className="border rounded-lg overflow-hidden">
        <div className="p-4 bg-gray-50 border-b flex items-center gap-2">
          <Package className="h-5 w-5 text-gray-600" />
          <h2 className="font-semibold text-gray-800">
            Produtos ({quotation.items?.length || 0})
          </h2>
        </div>

        {quotation.items && quotation.items.length > 0 ? (
          <div className="divide-y max-h-[400px] overflow-y-auto">
            {quotation.items.map((item, idx) => (
              <div key={idx} className="p-3">
                <p className="font-medium text-gray-900 text-sm mb-1">
                  {item?.product?.product_name || `Produto #${item?.product?.id}`}
                </p>
                <div className="flex gap-3 text-[14px] text-gray-500">
                  {(item.qty_jr != null || item.qty_gs != null || item.qty_barao != null || item.qty_lb != null) ? (
                    <>
                      <span>JR: {item.qty_jr || 0}</span>
                      <span>GS: {item.qty_gs || 0}</span>
                      <span>BR: {item.qty_barao || 0}</span>
                      <span>LB: {item.qty_lb || 0}</span>
                    </>
                  ) : item.quantities ? (
                    <>
                      <span>JR: {item.quantities.JR || 0}</span>
                      <span>GS: {item.quantities.GS || 0}</span>
                      <span>BR: {item.quantities.BARAO || 0}</span>
                      <span>LB: {item.quantities.LB || 0}</span>
                    </>
                  ) : null}
                  <span className="font-medium text-gray-700 text-[14px]">
                    Total: {item.totalQuantity ?? item.quantity ?? 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <Package className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">Nenhum item</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuotationDetailsV2;
