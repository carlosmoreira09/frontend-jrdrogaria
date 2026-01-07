import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuotations } from "../../hooks/useQuotations";
import { Button } from "../../components/ui/button";
import {
  Loader2,
  AlertCircle,
  FileText,
  RefreshCw,
  Plus,
  ChevronRight,
  Clock,
  CheckCircle,
  Send,
  Users,
} from "lucide-react";

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  draft: { label: "Rascunho", color: "bg-gray-100 text-gray-700", icon: <FileText className="h-3 w-3" /> },
  sent: { label: "Enviada", color: "bg-blue-100 text-blue-700", icon: <Send className="h-3 w-3" /> },
  in_progress: { label: "Em andamento", color: "bg-yellow-100 text-yellow-700", icon: <Clock className="h-3 w-3" /> },
  completed: { label: "Concluída", color: "bg-emerald-100 text-emerald-700", icon: <CheckCircle className="h-3 w-3" /> },
};

const QuotationListV2: React.FC = () => {
  const navigate = useNavigate();
  const { data = [], isLoading, isError, error, refetch } = useQuotations();

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  const getRespondedCount = (quotation: typeof data[0]) => {
    const submitted = quotation.supplierQuotations?.filter((sq) => sq.status === "submitted").length || 0;
    const total = quotation.supplierQuotations?.length || 0;
    return { submitted, total };
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <p className="text-gray-500">Carregando cotações...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <AlertCircle className="h-12 w-12 text-red-500 mb-3" />
        <p className="text-red-600 font-medium">Erro ao carregar cotações</p>
        <p className="text-sm text-gray-500 mt-1">{(error as Error)?.message || "Tente novamente"}</p>
        <Button
          onClick={() => refetch()}
          className="mt-4 bg-emerald-600 hover:bg-emerald-700"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Cotações</h1>
          <p className="text-sm text-gray-500">{data.length} cadastrada{data.length !== 1 ? "s" : ""}</p>
        </div>
        <Button
          onClick={() => navigate("/v2/quotation/create")}
          className="bg-emerald-600 hover:bg-emerald-700"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Nova</span>
        </Button>
      </div>

      {/* Empty State */}
      {data.length === 0 && (
        <div className="border-2 border-dashed rounded-lg p-8 text-center text-gray-500">
          <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p className="font-medium">Nenhuma cotação cadastrada</p>
          <p className="text-sm">Crie sua primeira cotação para começar</p>
          <Button
            onClick={() => navigate("/v2/quotation/create")}
            className="mt-4 bg-emerald-600 hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova cotação
          </Button>
        </div>
      )}

      {/* Quotation List */}
      {data.length > 0 && (
        <div className="space-y-3">
          {data.map((quotation) => {
            const { submitted, total } = getRespondedCount(quotation);
            return (
              <div
                key={quotation.id}
                onClick={() => navigate(`/v2/quotation/${quotation.id}`)}
                className="border rounded-lg p-4 bg-white hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {quotation.name}
                      </h3>
                      {getStatusBadge(quotation.status)}
                    </div>
                    
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <FileText className="h-3.5 w-3.5" />
                        {quotation.items?.length || 0} itens
                      </span>
                      {total > 0 && (
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" />
                          {submitted}/{total} respostas
                        </span>
                      )}
                      {quotation.deadline && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {new Date(quotation.deadline).toLocaleDateString("pt-BR")}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                </div>

                {/* Progress bar for responses */}
                {total > 0 && (
                  <div className="mt-3">
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 transition-all"
                        style={{ width: `${(submitted / total) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default QuotationListV2;
