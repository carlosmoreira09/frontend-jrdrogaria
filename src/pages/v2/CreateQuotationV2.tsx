import React, { useState, useEffect, useRef } from "react";
import { CreateQuotationPayload } from "../../types/quotation";
import { useNavigate } from "react-router-dom";
import { useCreateQuotation } from "../../hooks/useQuotations";
import { listProducts } from "../../service/productService";
import { Product } from "../../types/types";
import { Loader2, Trash2, Plus, ArrowLeft, Save, Search, Package, RotateCcw } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useToast } from "../../hooks/use-toast";
import {Input} from "../../components/ui/input.tsx";

interface QuotationItem {
  productId: number;
  productName: string;
  quantities: { JR: number; GS: number; BARAO: number; LB: number };
}

interface QuotationDraft {
  name: string;
  deadline: string;
  items: QuotationItem[];
}

const STORAGE_KEY = "quotation-draft-v2";

const CreateQuotationV2: React.FC = () => {
  const navigate = useNavigate();
  const createMutation = useCreateQuotation();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const hasRestoredRef = useRef(false);

  const [savedDraft, setSavedDraft] = useLocalStorage<QuotationDraft | null>(STORAGE_KEY, null);

  const [form, setForm] = useState<QuotationDraft>(() => {
    if (savedDraft && savedDraft.items?.length > 0) {
      return savedDraft;
    }
    return {
      name: "",
      deadline: "",
      items: [],
    };
  });

  useEffect(() => {
    if (savedDraft && savedDraft.items?.length > 0 && !hasRestoredRef.current) {
      hasRestoredRef.current = true;
      toast({
        title: "Rascunho restaurado",
        description: `${savedDraft.items.length} produto(s) restaurado(s) do último acesso.`,
      });
    }
  }, []);

  useEffect(() => {
    if (form.items.length > 0 || form.name) {
      setSavedDraft(form);
    }
  }, [form, setSavedDraft]);

  const clearDraft = () => {
    setSavedDraft(null);
    setForm({ name: "", deadline: "", items: [] });
    toast({
      title: "Rascunho limpo",
      description: "Os dados foram removidos.",
    });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await listProducts();
        if (result?.data) {
          setProducts(result.data);
        }
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredProducts = products.filter(
    (p) =>
      p.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !form.items.some((item) => item.productId === p.id)
  );

  const addProduct = (product: Product) => {
    setForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          productId: product.id!,
          productName: product.product_name || "",
          quantities: { JR: 0, GS: 0, BARAO: 0, LB: 0 },
        },
      ],
    }));
    setSearchTerm("");
    setShowDropdown(false);
  };

  const removeItem = (productId: number) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.productId !== productId),
    }));
  };

  const updateQuantity = (productId: number, key: string, value: number) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.productId === productId
          ? { ...item, quantities: { ...item.quantities, [key]: value } }
          : item
      ),
    }));
  };

  const getTotalQty = (item: QuotationItem) =>
    item.quantities.JR + item.quantities.GS + item.quantities.BARAO + item.quantities.LB;

  const onSubmit = () => {
    if (!form.name.trim()) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Informe o nome da cotação",
      });
      return;
    }
    if (form.items.length === 0) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Adicione pelo menos um produto",
      });
      return;
    }

    const payload: CreateQuotationPayload = {
      name: form.name,
      deadline: form.deadline || undefined,
      items: form.items.map((i) => ({
        productId: i.productId,
        quantities: i.quantities,
        totalQuantity: getTotalQty(i),
      })),
    };
    createMutation.mutate(payload, {
      onSuccess: () => {
        setSavedDraft(null);
        navigate("/v2/quotation");
      },
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Nova Cotação</h1>
          <p className="text-sm text-gray-500">
            {form.items.length} produto{form.items.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {form.items.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearDraft}
              className="text-gray-500 hover:text-red-500"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/v2/quotation")}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar
          </Button>
        </div>
      </div>

      {createMutation.isError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {(createMutation.error as Error)?.message || "Erro ao criar cotação"}
        </div>
      )}

      {/* Form */}
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-gray-700">Nome da cotação *</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Ex: Cotação Janeiro 2026"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Prazo (opcional)</label>
          <input
            type="date"
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Product Search */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Adicionar Produtos
        </label>
        <div ref={searchRef} className="relative">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                className="w-full border rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Buscar produto..."
                disabled={loadingProducts}
              />
            </div>
            {loadingProducts && <Loader2 className="h-5 w-5 animate-spin text-gray-400" />}
          </div>

          {showDropdown && searchTerm && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
              {filteredProducts.length > 0 ? (
                filteredProducts.slice(0, 20).map((product) => (
                  <button
                    key={product.id}
                    onClick={() => addProduct(product)}
                    className="w-full px-4 py-3 text-left text-sm hover:bg-emerald-50 active:bg-emerald-100 flex items-center gap-2"
                  >
                    <Package className="h-4 w-4 text-gray-400" />
                    <span className="flex-1 truncate">{product.product_name}</span>
                    <Plus className="h-4 w-4 text-emerald-600" />
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-gray-500">
                  Nenhum produto encontrado
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Items List */}
      {form.items.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">
              Itens ({form.items.length})
            </p>
            <p className="text-xs text-gray-500">
              Total: {form.items.reduce((acc, i) => acc + getTotalQty(i), 0)} un.
            </p>
          </div>

          <div className="border rounded-lg overflow-hidden divide-y max-h-[50vh] overflow-y-auto">
            {form.items.map((item) => (
              <div key={item.productId} className="p-2 bg-white flex items-center gap-2">
                <button
                  onClick={() => removeItem(item.productId)}
                  className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded flex-shrink-0"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
                <span className="text-sm font-medium text-gray-900 truncate flex-1 min-w-0">
                  {item.productName}
                </span>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {(["JR", "GS", "BARAO", "LB"] as const).map((key) => (
                    <div key={key} className="flex flex-col items-center">
                      <label className="text-[12px] text-gray-500">{key === "BARAO" ? "BR" : key}</label>
                      <Input
                        type="number"
                        min="0"
                        value={item.quantities[key] || ""}
                        onChange={(e) =>
                          updateQuantity(item.productId, key, Number(e.target.value) || 0)
                        }
                        className="w-28 border rounded px-1 py-0.5 text-xs text-center focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        placeholder="0"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {form.items.length === 0 && (
        <div className="border-2 border-dashed rounded-lg p-8 text-center text-gray-500">
          <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p className="font-medium">Nenhum produto adicionado</p>
          <p className="text-sm">Use a busca acima para adicionar produtos</p>
        </div>
      )}

      {/* Actions */}
      <div className="pt-4 border-t">
        <Button
          disabled={createMutation.isPending || form.items.length === 0}
          onClick={onSubmit}
          className="w-full bg-emerald-600 hover:bg-emerald-700 h-12"
        >
          {createMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Salvar Cotação ({form.items.length} itens)
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default CreateQuotationV2;
