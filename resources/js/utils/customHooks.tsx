import {useCallback, useEffect, useRef, useState} from 'react';
import debounce from 'lodash/debounce';
import Swal from "sweetalert2";

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
export const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState({width: window.innerWidth});

    useEffect(() => {
        const handleResize = () => setWindowSize({width: window.innerWidth});

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowSize;
};

export const usePreview = () => {
    const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
    const [preview, setPreview] = useState<string>('');

    useEffect(() => {
        if (!selectedFile) {
            setPreview('');
            return;
        }

        const objectUrl = URL.createObjectURL(selectedFile);
        setPreview(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [selectedFile]);

    const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length === 1) {
            const fileType = files[0].type;
            if (!fileType.startsWith('image/')) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Selected file was not an image!",
                });
                setSelectedFile(undefined);
                return;
            } else {
                setSelectedFile(files[0]);
            }
        }
    };

    const reset = () => {
        setSelectedFile(undefined);
        setPreview('');
    };

    return {
        selectedFile,
        preview,
        onSelectFile,
        reset,
    };
};

export default useInfiniteScrollWithSearch;
