import React, {useState} from 'react';
import {router} from "@inertiajs/react";
import {Pagination as PaginationMui} from "@mui/material";

function Pagination({links}: any) {

    const [currentPage, setCurrentPage] = useState(findActivePage());

    function findActivePage() {
        for (let i = 0; i < links.length; i++) {
            if (links[i].active) {
                return i;
            }
        }
        return 1;
    }

    const handlePageChange = (event: any, page: any) => {
        router.visit(`?page=${page}`);
        setCurrentPage(page);
    };

    return (
        <PaginationMui
            className=' p-2 rounded !mb-4 '
            count={links.length - 2}
            page={currentPage}
            onChange={handlePageChange}
            shape="rounded"
            style={{padding: 10}}
            size='large'
            sx={{'& .MuiPaginationItem-root': {color: 'white', fontWeight: 'bold'}}} // Change color to white

        />
    );
}

export default Pagination;
