import React from 'react';
import {router} from "@inertiajs/react";
import {Pagination as PaginationMui, PaginationItem} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

function Pagination({links, currentPage, lastPage}: any) {


    const handlePageChange = (event: any, page: any) => {

        router.visit(`?page=${page}`);
    };

    return (
        <PaginationMui
            className=' p-2 rounded !mb-4 '
            count={lastPage}
            page={currentPage}
            renderItem={(item) =>
                <PaginationItem
                    slots={{previous: ArrowBackIcon, next: ArrowForwardIcon}}
                    {...item}
                />}
            onChange={handlePageChange}
            shape="rounded"
            style={{padding: 10}}
            size='large'
            sx={{'& .MuiPaginationItem-root': {color: 'white', fontWeight: 'bold'}}}

        />
    );
}

export default Pagination;
