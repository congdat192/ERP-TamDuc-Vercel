import { useData } from '../contexts/DataContext';

export const useCategories = () => {
    const { categories, updateCategories } = useData();
    return { categories, updateCategories };
};
