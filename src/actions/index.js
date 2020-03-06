export const ADD_PRODUCT_TO_CART = 'ADD_PRODUCT_TO_CART';
export const REMOVE_PRODUCT_FROM_CART = 'REMOVE_PRODUCT_FROM_CART';
export const UPDATE_USERNAME = 'UPDATE_USERNAME';
export const ADD_ITEMS = 'ADD_ITEMS';

export const addProductToCart = product => {
    return {
        type: ADD_PRODUCT_TO_CART,
        payload: product
    }
};
export const updateUsername = username => {
    return {
        type: UPDATE_USERNAME,
        username
    }
}

export const addItems = (items) => {
    return {
        type: ADD_ITEMS,
        items
    }
};

export const ADD_CATEGORY_TO_FILTER = 'ADD_BRAND_TO_FILTER';
export const REMOVE_CATEGORY_FROM_FILTER = 'REMOVE_BRAND_FROM_FILTER';

export const addCategoryToFilter = category => {
    return {
        type: ADD_CATEGORY_TO_FILTER,
        category
    }
};

export const removeCategoryFromFilter = category => {
    return  {
        type: REMOVE_CATEGORY_FROM_FILTER,
        category
    }
};

export const ORDER_BY_ASC = 'ORDER_BY_ASC';
export const ORDER_BY_DESC = 'ORDER_BY_DESC';
export const CLEAR_ORDER_BY_PRICE = 'CLEAR_ORDER_BY_PRICE';

export const orderByAsc = () => {
    return {
        type: ORDER_BY_ASC
    }
};

export const orderByDesc =  () => {
    return {
        type: ORDER_BY_DESC
    }
};

export const clearOrderBy = () => {
    return {
        type: CLEAR_ORDER_BY_PRICE
    }
};


export const PREV_PAGE = 'PREV_PAGE';
export const NEXT_PAGE = 'NEXT_PAGE';
export const GO_PAGE = 'GO_PAGE';
export const COUNT_ITEM = 'COUNT_ITEM';


export const nextPage = () => {
    return {
        type: NEXT_PAGE
    }
};

export const prevPage = () => {
    return {
        type: PREV_PAGE
    }
};

export const goPage = (n) => {
    return {
        type: GO_PAGE,
        currentPage: n
    }
};

export const countItem = (n) => {
    return {
        type: COUNT_ITEM,
        totalItemsCount: n
    }
}

