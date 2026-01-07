import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SupplierPricePayload } from "../../types/supplierPrice";
import { usePublicQuotation, useSaveSupplierPrices } from "../../hooks/usePublicQuotation";
import { Loader2, AlertCircle, Save, Send, CheckCircle } from "lucide-react";

const SupplierQuotationForm: React.FC = () => {
  const { token = "" } = useParams();
  const navigate = useNavigate();
  const { data: quotation, isLoading, isError, error } = usePublicQuotation(token);
  const saveMutation = useSaveSupplierPrices();
  const [prices, setPrices] = useState<Record<number, SupplierPricePayload>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (quotation?.items) {
      const initial: Record<number, SupplierPricePayload> = {};
      quotation.items.forEach((item) => {
        if (item.productId) {
          initial[item.productId] = { productId: item.productId, available: true };
        }
      });
      setPrices(initial);
    }
  }, [quotation]);

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
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <span className="ml-2 text-gray-600">Carregando cotação...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-xl font-semibold text-red-600">Link inválido ou expirado</h1>
        <p className="text-gray-500 mt-2">{(error as Error)?.message || "Verifique o link e tente novamente."}</p>
      </div>
    );
  }

  if (!quotation) return null;

  return (
    <div className="p-4 space-y-4">
      <div>
        <h1 className="text-xl font-semibold">{quotation.name}</h1>
        {quotation.deadline && (
          <p className="text-sm text-gray-600">Prazo: {new Date(quotation.deadline).toLocaleDateString()}</p>
        )}
      </div>

      {successMessage && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded">
          <CheckCircle className="h-5 w-5 text-emerald-600" />
          <span className="text-sm text-emerald-700">{successMessage}</span>
        </div>
      )}
      {saveMutation.isError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <span className="text-sm text-red-600">
            {(saveMutation.error as Error)?.message || "Erro ao salvar preços"}
          </span>
        </div>
      )}

      <div className="space-y-3">
        {quotation.items?.map((item) => (
          <div key={item.productId} className="border rounded p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{item.productName ?? `Produto ${item.productId}`}</p>
                <p className="text-xs text-gray-600">
                  Total: {item.totalQuantity ?? "-"} | JR {item.quantities.JR} | GS {item.quantities.GS} | BARAO{" "}
                  {item.quantities.BARAO} | LB {item.quantities.LB}
                </p>
              </div>
              <label className="text-xs text-gray-600 flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={prices[item.productId]?.available ?? true}
                  onChange={(e) => updatePrice(item.productId, "available", e.target.checked)}
                />
                Disponível
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs text-gray-600">Preço unitário</label>
                <input
                  type="number"
                  step="0.01"
                  value={prices[item.productId]?.unitPrice ?? ""}
                  onChange={(e) => updatePrice(item.productId, "unitPrice", e.target.value)}
                  className="border rounded px-2 py-1 text-sm w-full"
                  placeholder="0,00"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-600">Observação</label>
                <input
                  value={prices[item.productId]?.observation ?? ""}
                  onChange={(e) => updatePrice(item.productId, "observation", e.target.value)}
                  className="border rounded px-2 py-1 text-sm w-full"
                  placeholder="Ex: unidade diferente, prazo de entrega..."
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          disabled={saveMutation.isPending}
          onClick={() => submit(false)}
          className="flex items-center gap-2 px-3 py-2 text-sm rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
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
          className="flex items-center gap-2 px-3 py-2 text-sm rounded bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {saveMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          Enviar cotação
        </button>
      </div>
    </div>
  );
};

export default SupplierQuotationForm;
