import {useCallback, useEffect, useRef, useState} from 'react';
import debounce from 'lodash/debounce';

const useInfiniteScrollWithSearch = (route, searchTerm = '') => {
    const [data, setData] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const observerRef = useRef(null);

    const fetchData = async (term, page) => {
        try {
            const response = await fetch(route);
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const result = await response.json();
            setData(prevData => page === currentPage ? result.data : [...prevData, ...result.data]);
            setHasMore(result.currentPage < result.totalPages);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };

    const debouncedSearch = useCallback(
        debounce((term) => {
            setCurrentPage(currentPage);
            fetchData(term, currentPage).finally(() => setLoading(false));
        }, 1000),
        []
    );

    useEffect(() => {
        if (!searchTerm) {
            setData([]);
            setHasMore(true);
            setLoading(true);
            fetchData('', currentPage).finally(() => setLoading(false));
        } else {
            setLoading(true);
            debouncedSearch(searchTerm);
        }
    }, [route, searchTerm]);

    useEffect(() => {
        if (!hasMore) return;

        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setCurrentPage(prevPage => {
                    const nextPage = prevPage + 1;
                    fetchData(searchTerm, nextPage);
                    return nextPage;
                });
            }
        });

        const endOfList = document.querySelector(`.end-of-list-{}`);
        if (endOfList) observerRef.current.observe(endOfList);

        return () => {
            if (observerRef.current) observerRef.current.disconnect();
        };
    }, [hasMore, searchTerm, fetchData]);

    return {data, loading};
};

export default useInfiniteScrollWithSearch;
