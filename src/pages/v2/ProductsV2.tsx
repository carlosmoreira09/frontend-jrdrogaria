import React, { useEffect, useRef, useState } from "react";
import { useToast } from "../../hooks/use-toast";
import { Product } from "../../types/types";
import { createProduct, deleteProduct, listProducts } from "../../services/productService.ts";
import ProductExcelUpload from "../../components/ProductExcelUpload";
import { Button } from "../../components/ui/button";
import {
  Search,
  Plus,
  Trash2,
  Package,
  Loader2,
  X,
} from "lucide-react";

const ProductsV2: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProductName, setNewProductName] = useState("");
  const [filterName, setFilterName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();
  const hasFetchedRef = useRef(false);

  const filteredProducts = products.filter((p) =>
    p?.product_name?.toLowerCase().includes(filterName.toLowerCase())
  );

  const fetchProducts = async () => {
    const result = await listProducts();
    if (result?.data) {
      setProducts(result.data);
    } else {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao listar produtos",
      });
    }
  };

  useEffect(() => {
    if (hasFetchedRef.current) return;

    const loadProducts = async () => {
      try {
        hasFetchedRef.current = true;
        await fetchProducts();
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim()) return;

    setIsAdding(true);
    try {
      const result = await createProduct({ product_name: newProductName });
      if (result?.data) {
        await fetchProducts();
        toast({
          title: "Sucesso",
          description: "Produto adicionado",
        });
        setNewProductName("");
        setShowAddForm(false);
      } else {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Erro ao cadastrar produto",
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: number | undefined) => {
    if (!id) return;
    
    try {
      const result = await deleteProduct(id);
      if (result?.message?.includes("deletado")) {
        toast({
          title: "Removido",
          description: "Produto removido com sucesso",
        });
        await fetchProducts();
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <p className="text-gray-500">Carregando produtos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Produtos</h1>
          <p className="text-sm text-gray-500">{products.length} cadastrados</p>
        </div>
        <div className="flex gap-2">
          <ProductExcelUpload onUploadComplete={fetchProducts} />
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-emerald-600 hover:bg-emerald-700"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Novo</span>
          </Button>
        </div>
      </div>

      {/* Add Product Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddProduct}
          className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg space-y-3"
        >
          <label className="text-sm font-medium text-gray-700">
            Nome do novo produto
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
              placeholder="Digite o nome do produto..."
              className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              autoFocus
            />
            <Button
              type="submit"
              disabled={isAdding || !newProductName.trim()}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isAdding ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Adicionar"
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setShowAddForm(false);
                setNewProductName("");
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </form>
      )}

      {/* Search Filter */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          placeholder="Buscar produto por nome..."
          className="w-full border rounded-lg pl-10 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        {filterName && (
          <button
            onClick={() => setFilterName("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filter info */}
      {filterName && (
        <p className="text-sm text-gray-500">
          Mostrando {filteredProducts.length} de {products.length} produtos
        </p>
      )}

      {/* Products List */}
      {filteredProducts.length > 0 ? (
        <div className="border rounded-lg divide-y overflow-hidden">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 active:bg-gray-100"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="p-2 bg-emerald-100 rounded-lg flex-shrink-0">
                  <Package className="h-4 w-4 text-emerald-600" />
                </div>
                <span className="text-sm font-medium text-gray-900 truncate">
                  {product.product_name}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(product.id)}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 flex-shrink-0 ml-2"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="border-2 border-dashed rounded-lg p-8 text-center text-gray-500">
          <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          {filterName ? (
            <>
              <p className="font-medium">Nenhum produto encontrado</p>
              <p className="text-sm">Tente buscar por outro nome</p>
            </>
          ) : (
            <>
              <p className="font-medium">Nenhum produto cadastrado</p>
              <p className="text-sm">Clique em "Novo" para adicionar</p>
            </>
          )}
        </div>
      )}

      {/* Product count footer */}
      {filteredProducts.length > 0 && (
        <p className="text-xs text-center text-gray-400 pt-2">
          {filteredProducts.length} produto{filteredProducts.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
};

export default ProductsV2;
