import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuotation, useGenerateSupplierLinks } from "../../hooks/useQuotations";
import { listSuppliers } from "../../service/supplierService";
import { useQuery } from "@tanstack/react-query";
import { SupplierQuotation, QuotationStatus } from "../../types/quotation";
import { Supplier } from "../../types/types";
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
} from "lucide-react";

const statusColors: Record<QuotationStatus, string> = {
  draft: "bg-gray-100 text-gray-700",
  open: "bg-emerald-100 text-emerald-700",
  closed: "bg-yellow-100 text-yellow-700",
  completed: "bg-blue-100 text-blue-700",
};

const supplierStatusIcons: Record<string, React.ReactNode> = {
  pending: <Clock className="h-4 w-4 text-gray-500" />,
  in_progress: <FileEdit className="h-4 w-4 text-yellow-500" />,
  submitted: <CheckCircle className="h-4 w-4 text-emerald-500" />,
};

const QuotationDetails: React.FC = () => {
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <span className="ml-2 text-gray-600">Carregando detalhes...</span>
      </div>
    );
  }

  if (isError || !quotation) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-3" />
        <p className="text-red-600 font-medium">Erro ao carregar cotação</p>
        <p className="text-sm text-gray-500 mt-1">{(error as Error)?.message || "Cotação não encontrada"}</p>
        <button
          onClick={() => navigate("/quotation")}
          className="mt-4 flex items-center gap-2 px-3 py-2 text-sm rounded bg-emerald-600 text-white hover:bg-emerald-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para lista
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold">{quotation.name}</h1>
            <span className={`px-2 py-1 text-xs font-medium rounded ${statusColors[quotation.status]}`}>
              {quotation.status.toUpperCase()}
            </span>
          </div>
          {quotation.deadline && (
            <p className="text-sm text-gray-600 mt-1">
              Prazo: {new Date(quotation.deadline).toLocaleDateString("pt-BR")}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/quotation/${quotationId}/comparison`)}
            className="flex items-center gap-2 px-3 py-2 text-sm rounded bg-emerald-600 text-white hover:bg-emerald-700"
          >
            <BarChart3 className="h-4 w-4" />
            Comparar Preços
          </button>
          <button
            onClick={() => navigate("/quotation")}
            className="flex items-center gap-2 px-3 py-2 text-sm rounded border border-gray-300 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>
        </div>
      </div>

      {/* Supplier Links Section */}
      <div className="border rounded-lg p-4">
        <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Link2 className="h-5 w-5" />
          Links para Fornecedores
        </h2>

        {quotation.supplierQuotations && quotation.supplierQuotations.length > 0 ? (
          <div className="space-y-2 mb-4">
            {quotation.supplierQuotations.map((sq: SupplierQuotation) => (
              <div
                key={sq.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded border"
              >
                <div className="flex items-center gap-3">
                  {supplierStatusIcons[sq.status]}
                  <div>
                    <p className="font-medium">{sq.supplier?.supplier_name || "Fornecedor"}</p>
                    <p className="text-xs text-gray-500">
                      {sq.status === "submitted"
                        ? `Enviado em ${new Date(sq.submitted_at!).toLocaleDateString("pt-BR")}`
                        : sq.status === "in_progress"
                        ? "Em preenchimento"
                        : "Aguardando resposta"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-white px-2 py-1 rounded border">
                    {sq.accessToken.slice(0, 8)}...
                  </code>
                  <button
                    onClick={() => copyToClipboard(sq.accessToken)}
                    className="flex items-center gap-1 px-2 py-1 text-sm rounded border border-gray-300 hover:bg-gray-100"
                  >
                    {copiedToken === sq.accessToken ? (
                      <>
                        <Check className="h-4 w-4 text-emerald-600" />
                        Copiado
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copiar Link
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 mb-4">Nenhum link gerado ainda.</p>
        )}

        {/* Generate new links */}
        {availableSuppliers.length > 0 && (
          <div className="border-t pt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Gerar novos links:</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {availableSuppliers.map((supplier) => (
                <label
                  key={supplier.id}
                  className={`flex items-center gap-2 px-3 py-2 rounded border cursor-pointer transition-colors ${
                    selectedSuppliers.includes(supplier.id!)
                      ? "bg-emerald-50 border-emerald-300"
                      : "bg-white border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedSuppliers.includes(supplier.id!)}
                    onChange={() => toggleSupplier(supplier.id!)}
                    className="rounded text-emerald-600"
                  />
                  <span className="text-sm">{supplier.supplier_name}</span>
                </label>
              ))}
            </div>
            <button
              onClick={handleGenerateLinks}
              disabled={selectedSuppliers.length === 0 || generateLinksMutation.isPending}
              className="flex items-center gap-2 px-3 py-2 text-sm rounded bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {generateLinksMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Link2 className="h-4 w-4" />
              )}
              Gerar Links ({selectedSuppliers.length})
            </button>
          </div>
        )}
      </div>

      {/* Items Section */}
      <div className="border rounded-lg p-4">
        <h2 className="font-semibold text-gray-800 mb-3">
          Produtos da Cotação ({quotation.items?.length || 0} itens)
        </h2>
        {quotation.items && quotation.items.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-2">Produto</th>
                  <th className="text-center py-2 px-2">JR</th>
                  <th className="text-center py-2 px-2">GS</th>
                  <th className="text-center py-2 px-2">BARÃO</th>
                  <th className="text-center py-2 px-2">LB</th>
                  <th className="text-center py-2 px-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {quotation.items.map((item, idx) => (
                  <tr key={idx} className="border-b last:border-0">
                    <td className="py-2 px-2">{item.productName || `Produto #${item.productId}`}</td>
                    <td className="text-center py-2 px-2">{item.quantities.JR}</td>
                    <td className="text-center py-2 px-2">{item.quantities.GS}</td>
                    <td className="text-center py-2 px-2">{item.quantities.BARAO}</td>
                    <td className="text-center py-2 px-2">{item.quantities.LB}</td>
                    <td className="text-center py-2 px-2 font-medium">{item.totalQuantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Nenhum item adicionado.</p>
        )}
      </div>

      {/* Refresh Button */}
      <div className="flex justify-center">
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-3 py-2 text-sm rounded border border-gray-300 hover:bg-gray-50"
        >
          <RefreshCw className="h-4 w-4" />
          Atualizar dados
        </button>
      </div>
    </div>
  );
};

export default QuotationDetails;
