import React, { useState } from "react";
import { CreateQuotationPayload } from "../../types/quotation";
import { useNavigate } from "react-router-dom";
import { useCreateQuotation } from "../../hooks/useQuotations";
import { Loader2, Plus, Trash2, ArrowLeft, Save } from "lucide-react";

const emptyRow = () => ({
  productId: 0,
  productName: "",
  quantities: { JR: 0, GS: 0, BARAO: 0, LB: 0 },
});

const CreateQuotation: React.FC = () => {
  const navigate = useNavigate();
  const createMutation = useCreateQuotation();
  const [form, setForm] = useState<CreateQuotationPayload>({
    name: "",
    deadline: "",
    items: [emptyRow()],
  });

  const handleItemChange = (index: number, key: string, value: string | number) => {
    setForm((prev) => {
      const items = [...(prev.items ?? [])];
      const current = { ...items[index] };
      if (key === "productName") current.productName = value as string;
      if (key === "productId") current.productId = Number(value);
      if (key in current.quantities) {
        current.quantities = { ...current.quantities, [key]: Number(value) };
      }
      items[index] = current;
      return { ...prev, items };
    });
  };

  const addRow = () => setForm((p) => ({ ...p, items: [...(p.items ?? []), emptyRow()] }));
  const removeRow = (index: number) =>
    setForm((p) => ({ ...p, items: (p.items ?? []).filter((_, i) => i !== index) }));

  const onSubmit = () => {
    const payload: CreateQuotationPayload = {
      name: form.name,
      deadline: form.deadline || undefined,
      items: (form.items ?? []).map((i) => ({
        productId: i.productId,
        quantities: i.quantities,
        totalQuantity:
          Number(i.quantities.JR) +
          Number(i.quantities.GS) +
          Number(i.quantities.BARAO) +
          Number(i.quantities.LB),
      })),
    };
    createMutation.mutate(payload, {
      onSuccess: () => {
        navigate("/quotation");
      },
    });
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Nova Cotação</h1>
        <p className="text-sm text-gray-600">Defina nome, prazo e itens.</p>
      </div>

      {createMutation.isError && (
        <p className="text-sm text-red-600">
          {(createMutation.error as Error)?.message || "Erro ao criar cotação"}
        </p>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Nome da cotação</label>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border rounded px-3 py-2 text-sm"
          placeholder="Ex: Cotação Janeiro 2026"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Prazo (opcional)</label>
        <input
          type="date"
          value={form.deadline}
          onChange={(e) => setForm({ ...form, deadline: e.target.value })}
          className="border rounded px-3 py-2 text-sm"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-700">Itens</p>
          <button
            onClick={addRow}
            className="flex items-center gap-1 text-sm px-2 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" />
            Adicionar
          </button>
        </div>

        {(form.items ?? []).map((item, idx) => (
          <div key={idx} className="border rounded p-3 space-y-2">
            <div className="flex gap-2">
              <input
                type="number"
                value={item.productId}
                onChange={(e) => handleItemChange(idx, "productId", e.target.value)}
                className="border rounded px-2 py-1 text-sm w-28"
                placeholder="ID produto"
              />
              <input
                value={item.productName}
                onChange={(e) => handleItemChange(idx, "productName", e.target.value)}
                className="flex-1 border rounded px-2 py-1 text-sm"
                placeholder="Nome (ajuda visual, opcional)"
              />
              <button
                onClick={() => removeRow(idx)}
                className="flex items-center gap-1 text-sm px-2 py-1 rounded border border-gray-300 hover:bg-gray-50 text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {["JR", "GS", "BARAO", "LB"].map((key) => (
                <div key={key} className="space-y-1">
                  <label className="text-xs text-gray-600">Qtd {key}</label>
                  <input
                    type="number"
                    value={(item.quantities as any)[key]}
                    onChange={(e) => handleItemChange(idx, key, e.target.value)}
                    className="border rounded px-2 py-1 text-sm w-full"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          disabled={createMutation.isPending}
          onClick={onSubmit}
          className="flex items-center gap-2 px-3 py-2 text-sm rounded bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {createMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Salvar cotação
            </>
          )}
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
  );
};

export default CreateQuotation;
