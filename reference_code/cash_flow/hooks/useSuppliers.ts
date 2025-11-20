import { useData } from '../contexts/DataContext';

export const useSuppliers = () => {
    const { suppliers, updateSuppliers } = useData();
    return { suppliers, updateSuppliers };
};
