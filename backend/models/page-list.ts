interface PageMetadata {
    currentPage : number,
    pageSize : number,
    totalPageCount : number,
    totalItemsCount : number,
    hasPrevPage : boolean,
    hasNextPage : boolean
}

interface PageList<T>{
    data : T,
    pageMetadata : PageMetadata
}

export const createPageList = <T>(data : T, currentPage : number, pageSize : number, totalItemsCount : number) => {
    const totalPageCount = Math.ceil(totalItemsCount / pageSize);
    const pageMetadata : PageMetadata  = {
        currentPage,
        pageSize,
        totalItemsCount,
        totalPageCount,
        hasPrevPage : currentPage > 1,
        hasNextPage : totalPageCount > currentPage
    }

    const result : PageList<T> = {
        data,
        pageMetadata
    }

    return result;
}