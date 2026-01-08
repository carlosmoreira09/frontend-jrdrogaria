# Frontend - Sistema de Cotações JR Drogaria

Interface web para gerenciamento de cotações, fornecedores, produtos e pedidos de compra para farmácias.

## 📋 Sobre o Sistema

O sistema oferece **duas abordagens** para gerenciar cotações de preços com fornecedores:

### V1 - Importação via Excel (Fluxo Manual)

**Páginas**: `/shopping-list`, `/price-comparison/:id`

1. **Criar Lista de Compras**: Selecione produtos e defina quantidades por loja (JR, GS, BARÃO, LB)
2. **Exportar CSV**: Baixe arquivo para enviar aos fornecedores
3. **Importar Respostas**: Upload dos arquivos Excel preenchidos pelos fornecedores
4. **Comparar Preços**: Visualize tabela comparativa com destaque para melhores preços

**Ideal para**: Fornecedores que preferem trabalhar com Excel

### V2 - Links de Cotação (Fluxo Automatizado) ⭐

**Páginas**: `/v2/home`, `/v2/quotations`, `/v2/quotation/:id`, `/v2/comparison/:id`

1. **Criar Cotação**: Selecione produtos da base cadastrada
2. **Gerar Links**: Crie links únicos por fornecedor ou link genérico aberto
3. **Compartilhar**: Copie ou compartilhe links via WhatsApp
4. **Acompanhar**: Veja status em tempo real (Aguardando, Preenchendo, Enviado)
5. **Comparar**: Comparação automática de preços recebidos
6. **Gerar Pedidos**: Crie pedidos de compra com os melhores preços

**Páginas Públicas** (para fornecedores):
- `/supplier-quote/:token` - Formulário para fornecedor cadastrado
- `/quote-open/:id` - Formulário para fornecedor anônimo

**Ideal para**: Processo ágil, sem troca de arquivos

## 🛠️ Tecnologias

- **React 18** + **TypeScript**
- **Vite** para build
- **TailwindCSS** para estilos
- **shadcn/ui** + **Radix UI** para componentes
- **React Query** para gerenciamento de estado
- **React Router** para navegação
- **React Hook Form** + **Zod** para formulários
- **Recharts** para gráficos
- **Lucide** para ícones

## 📁 Estrutura de Páginas

```
src/pages/
├── Home.tsx                    # Dashboard principal
├── AdminLogin.tsx              # Login do admin
├── AppLayout.tsx               # Layout com sidebar
│
├── product/                    # Gestão de produtos
├── supplier/                   # Gestão de fornecedores
│
├── shoppinglist/               # V1 - Fluxo Excel
│   ├── ShoppingList.tsx        # Criar/editar lista
│   └── PriceComparison.tsx     # Comparar preços (import Excel)
│
├── v2/                         # V2 - Fluxo Links
│   ├── HomeV2.tsx              # Dashboard V2
│   ├── QuotationListV2.tsx     # Listar cotações
│   ├── CreateQuotationV2.tsx   # Criar cotação
│   ├── QuotationDetailsV2.tsx  # Detalhes + gerar links
│   └── PriceComparisonView.tsx # Comparar preços
│
├── orders/                     # Pedidos de compra
│
└── public/                     # Páginas públicas (fornecedores)
    ├── SupplierQuotationForm.tsx    # Form com token
    ├── AnonymousSupplierForm.tsx    # Form anônimo
    └── SupplierSuccess.tsx          # Confirmação
```

## 🚀 Instalação

```bash
# Instalar dependências
npm install

# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## ⚙️ Configuração

Altere o endpoint da API em `src/lib/interceptor.ts`:

```typescript
export const apiClient = axios.create({
    baseURL: 'https://api.jrdrogaria.com.br/api/v1',
});
```

## 🎨 Componentes UI

O projeto utiliza **shadcn/ui** com os seguintes componentes:

- Button, Card, Dialog, Table
- Select, Input, Label
- Tabs, Accordion, Tooltip
- Toast (sonner)
- E mais...

## 📱 Funcionalidades

| Módulo | Funcionalidades |
|--------|-----------------|
| **Produtos** | CRUD, importação em lote |
| **Fornecedores** | CRUD, contatos, condições |
| **Lista de Compras (V1)** | Criar lista, exportar CSV, importar preços |
| **Cotações (V2)** | Criar, gerar links, acompanhar status |
| **Comparação** | Tabela comparativa, melhor preço destacado |
| **Pedidos** | Gerar a partir de cotação, exportar Excel |

## 👤 Autor

**Carlos Moreira**
