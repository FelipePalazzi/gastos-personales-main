    import { useState, useMemo, useCallback } from 'react';

    const useTableData = (initialData = [], initialPageSize = 10, initialSortKey = '', initialSortOrder = 'asc') => {
        const [orden, setOrden] = useState(initialSortOrder);
        const [columna, setColumna] = useState(initialSortKey); 
        const [page, setPage] = useState(0); 
        const [pageSize, setPageSize] = useState(initialPageSize);
        const [appliedFilters, setAppliedFilters] = useState({}); 
        const numberOfItemsPerPageList = [10, 15, 20, 50, 100];
        const numberOfPages = useMemo(() => Math.ceil(initialData.length / pageSize), [initialData, pageSize]);

        const sortedData = useMemo(() => {
            if (!columna || orden === 'none') return initialData;
            return [...initialData].sort((a, b) => {
                if (columna === 'importe') {
                    const importeA = a[a.monedamonto];
                    const importeB = b[b.monedamonto];
        
                    if (importeA < importeB) return orden === 'asc' ? -1 : 1;
                    if (importeA > importeB) return orden === 'asc' ? 1 : -1;
                    return 0;
                }
                if (a[columna] < b[columna]) return orden === 'asc' ? -1 : 1;
                if (a[columna] > b[columna]) return orden === 'asc' ? 1 : -1;
                return 0;
            });
        }, [initialData, columna, orden]);

        const currentData = useMemo(() => {
            const startIndex = page * pageSize;
            const endIndex = startIndex + pageSize;
            return sortedData.slice(startIndex, endIndex);
        }, [sortedData, page, pageSize]);

        const handleSort = useCallback((key) => {
            const nuevoOrden = columna === key
                ? orden === 'asc'
                    ? 'desc'
                    : orden === 'desc'
                        ? 'none'
                        : 'asc'
                : 'asc';

            setColumna(key);
            setOrden(nuevoOrden);
        }, [columna, orden]);

        const getIcon = (key) => {
            if (key !== columna) return ;
            return orden === 'asc' ? 'chevron-up' : orden === 'desc' ? 'chevron-down' : null;
        };

        const handlePageChange = useCallback((newPage) => {
            setPage(newPage);
        }, []);

        const handleItemsPerPageChange = useCallback((value) => {
            setPage(0);  // Reiniciar la página a 0 cuando se cambia el número de elementos por página
            setPageSize(value); // Actualiza pageSize
        }, []);      

        return {
            page,
            pageSize,
            numberOfPages,
            currentData,
            sortedData,
            appliedFilters,
            handleSort,
            getIcon,
            handlePageChange,
            handleItemsPerPageChange,
            numberOfItemsPerPageList
        };
    };

    export default useTableData;