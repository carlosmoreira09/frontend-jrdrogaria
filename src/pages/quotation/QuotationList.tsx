import React from "react";
import { useNavigate } from "react-router-dom";
import { SupplierQuotation } from "../../types/quotation";
import { useQuotations } from "../../hooks/useQuotations";
import { Loader2, AlertCircle, FileText, RefreshCw } from "lucide-react";

const QuotationList: React.FC = () => {
  const navigate = useNavigate();
  const { data = [], isLoading, isError, error, refetch } = useQuotations();

  const renderLinks = (links?: SupplierQuotation[]) => {
    if (!links || links.length === 0) return <span className="text-gray-500">Nenhum link gerado</span>;
    return (
      <ul className="space-y-1">
        {links.map((l) => (
          <li key={l.id} className="text-sm">
            <span className="font-medium">{l.supplier?.supplier_name ?? "Fornecedor"}</span>{" "}
            <span className="text-gray-600">({l.status})</span>{" "}
            <code className="bg-gray-100 px-1 rounded text-xs break-all">{l.accessToken}</code>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Cotações</h1>
          <p className="text-sm text-gray-600">Gerencie cotações e links para fornecedores.</p>
        </div>
        <button
          onClick={() => navigate("/quotation/create")}
          className="px-3 py-2 text-sm rounded bg-emerald-600 text-white hover:bg-emerald-700"
        >
          Nova cotação
        </button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          <span className="ml-2 text-gray-600">Carregando cotações...</span>
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mb-3" />
          <p className="text-red-600 font-medium">Erro ao carregar cotações</p>
          <p className="text-sm text-gray-500 mt-1">{(error as Error)?.message || "Tente novamente"}</p>
          <button
            onClick={() => refetch()}
            className="mt-4 flex items-center gap-2 px-3 py-2 text-sm rounded bg-emerald-600 text-white hover:bg-emerald-700"
          >
            <RefreshCw className="h-4 w-4" />
            Tentar novamente
          </button>
        </div>
      )}

      {!isLoading && !isError && data.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FileText className="h-12 w-12 text-gray-400 mb-3" />
          <p className="text-gray-600 font-medium">Nenhuma cotação cadastrada</p>
          <p className="text-sm text-gray-500 mt-1">Crie sua primeira cotação para começar</p>
          <button
            onClick={() => navigate("/quotation/create")}
            className="mt-4 px-3 py-2 text-sm rounded bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Nova cotação
          </button>
        </div>
      )}

      <div className="space-y-3">
        {data.map((q) => (
          <div key={q.id} className="border rounded p-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold">{q.name}</h2>
                <p className="text-sm text-gray-600">Status: {q.status}</p>
                {q.deadline && <p className="text-xs text-gray-500">Prazo: {new Date(q.deadline).toLocaleDateString()}</p>}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/quotation/${q.id}`)}
                  className="px-2 py-1 text-sm rounded border border-gray-300 hover:bg-gray-50"
                >
                  Detalhes
                </button>
                <button
                  onClick={() => navigate(`/shopping/price-comparison/${q.id}`)}
                  className="px-2 py-1 text-sm rounded border border-gray-300 hover:bg-gray-50"
                >
                  Comparar
                </button>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs font-semibold text-gray-700">Links de fornecedores</p>
              {renderLinks(q.supplierQuotations)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuotationList;
