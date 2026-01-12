/**
 * Store Selector Component - v3 Multi-tenant
 * Dropdown para selecionar a loja ativa
 */

import { useTenantStore } from '../context/TenantStoreContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Store } from 'lucide-react';

export const StoreSelector = () => {
  const { stores, currentStore, setCurrentStore, isLoading } = useTenantStore();

  if (isLoading || stores.length === 0) {
    return null;
  }

  const handleStoreChange = (storeId: string) => {
    const store = stores.find((s) => s.id === Number(storeId));
    if (store) {
      setCurrentStore(store);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Store className="h-4 w-4 text-muted-foreground" />
      <Select
        value={currentStore?.id?.toString() || ''}
        onValueChange={handleStoreChange}
      >
        <SelectTrigger className="w-[140px] h-8">
          <SelectValue placeholder="Selecione a loja" />
        </SelectTrigger>
        <SelectContent>
          {stores.map((store) => (
            <SelectItem key={store.id} value={store.id.toString()}>
              {store.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default StoreSelector;
