export const orderByFilter = (arr, type ) => {
    if(!type) return arr;
    console.log('orderbYmethod', type);
    if(type === 'asc') {
        return arr.slice().sort((el1, el2) => el1.marketPrice - el2.marketPrice);
    } else {
        return arr.slice().sort((el1, el2) => el2.marketPrice - el1.marketPrice);
    }
};