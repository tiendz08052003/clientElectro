import { createSelector } from "reselect";

export const getProduct = state => {
    return state.products.productList;
}

export const getBrand = state => {
    return state.products.brandList;
}

export const getColor = state => {
    return state.products.colorList;
}

export const getType = state => {
    return state.products.typeList;
}

export const getTypeSort = state => {
    return state.products.typeSort;
}

export const getQualities = state => {
    return state.products.quality;
}

export const getNumberPage = state => {
    return state.products.numberPage;
}

export const sideBarBrandList = state => {
    return state.sidebar.brand;
}

export const sideBarColorList = state => {
    return state.sidebar.color;
}

export const sideBarType = state => {
    return state.sidebar.type;
}

export const sideBarSelection = state => {
    return state.sidebar.selection;
}

export const getIdCatalog = state => {
    return state.headerFooter.catalog;
}

export const getProductCatalog = state => {
    return state.headerFooter.productCatalog;
}

export const getPriceCatalog = state => {
    return state.headerFooter.price;
}

export const getProductByProductCatalog = state => {
    const array = state.headerFooter?.productCatalog.filter(x => (
        state.headerFooter.catalog ? (x.idCatalog === state.headerFooter.catalog ? true : false) : false
    )
    )
    return array;
}

export const getUser = state => {
    return state.account.currentAccount;
}

export const getResultSearch = state => {
    return state.header.resultSearch;
}

export const getConditionSearch = state => {
    return state.header.conditionSearch;
}

export const getContentSearch = state => {
    return state.header.valueSearch;
}

export const combineAllCaseShop = createSelector(getProduct, getBrand, getColor, getType, getTypeSort, getQualities, getNumberPage, sideBarBrandList, sideBarColorList, sideBarType, sideBarSelection, getIdCatalog, getProductByProductCatalog, getPriceCatalog, (products, brands, colors, types, typeSort, quality, numberPage, brand, color, type, selection, catalog, ProductByProductCatalog, price) => {
    const list = products.filter(product => {
        let bool = false;
        if(catalog !== "")
        {
            ProductByProductCatalog.map(x => {
                if(x.idProduct === product._id)
                    bool = true;
            })
            if(bool === false)
                return bool;
        }
        if(brand.length !== 0){
            const child = brands.filter(x => (product.idBrand === x._id ? true : false))
            bool = brand.includes(child[0].name)
            if(bool === false)
                return bool;
        }
        if(color.length !== 0){
            const child = colors.filter(x => (product.idColor === x._id ? true : false))
            bool = color.includes(child[0].name) 
            if(bool === false)
                return bool;
        }
        if(type !== "")
        {
            bool = type === product.idType;
            if(bool === false)
                return bool;

        }
        if(selection !== "")
        {
            bool = selection === product.idSelection;
            if(bool === false)
                return bool;
        }
        if(Number(price.min) > 0 || Number(price.max) > 0)
        {
            if(Number(price.min) > 0 && Number(price.max) === 0)
            {
                if(product.discount && Number(price.min) <= product.discount)
                {
                    bool = true;
                }
                else if(!product.discount && Number(price.min) <= product.price)
                {
                    bool = true;
                }
            }
            else if(Number(price.max) > 0 && Number(price.min) === 0)
            {
                if(product.discount && Number(price.max) >= product.discount)
                {
                    bool = true;
                }
                else if(!product.discount && Number(price.max) >= product.price)
                {
                    bool = true;
                }
            }
            else
            {
                if(product.discount && Number(price.max) >= product.discount && Number(price.min) <= product.discount)
                {
                    bool = true;
                }
                else if(!product.discount && Number(price.max) >= product.price && Number(price.min) <= product.price)
                {
                    bool = true;
                }
            }
            if(bool === false)
            return bool;
        }
        return true;
    })

    switch(typeSort)
    {
        case "price": 
        {
            for(let i = 0; i < list.length - 1; i++)
            {
                let min = (list[i].discount ? list[i].discount : list[i].price);
                for(let j = i + 1; j < list.length; j++)
                {
                    if(min > (list[j].discount ? list[j].discount : list[j].price))
                    {
                        min = list[j].discount ? list[j].discount : list[j].price;
                        const z = list[i];
                        list[i] = list[j];
                        list[j] = z;
                    }
                }
            }
            break;
        }
        case "price-desc": 
        {
            for(let i = 0; i < list.length - 1; i++)
            {
                let max = (list[i].discount ? list[i].discount : list[i].price);
                for(let j = i + 1; j < list.length; j++)
                {
                    if(max < (list[j].discount ? list[j].discount : list[j].price))
                    {
                        max = list[j].discount ? list[j].discount : list[j].price;
                        const z = list[i];
                        list[i] = list[j];
                        list[j] = z;
                    }
                }
            }
            break;
        }
        case "date": 
        {
            for(let i = 0; i < list.length - 1; i++)
            {
                let date = list[i].updatedAt;
                for(let j = i + 1; j < list.length; j++)
                {
                    if(date < list[j].updatedAt)
                    {
                        date = list[j].updatedAt;
                        const z = list[i];
                        list[i] = list[j];
                        list[j] = z;
                    }
                }
            }
            break;
        }
        default: 
            break;
    }

    const listProduct = quality !== "-1" ? list.slice(numberPage * quality, (numberPage + 1) * quality) : list;

    return {
        list,
        listProduct,
    };
})  


export const combineAllCaseSearch = createSelector(getResultSearch, getConditionSearch, getType, getBrand, getColor,  getTypeSort, getQualities, getNumberPage, sideBarBrandList, sideBarColorList, getIdCatalog, getProductByProductCatalog, getPriceCatalog, (resultSearch, conditionSearch, types, brands, colors, typeSort, quality, numberPage, brand, color, catalog, ProductByProductCatalog, price) => {
    let listType;
    let products = [];
    if(conditionSearch === "")
    {
        products = resultSearch;
    }
    else
    {
        listType = types.filter(type => {
            return type.idSelection === conditionSearch ? true : false
        })    
        for(let i = 0; i < listType.length; i++)
        {
            products = resultSearch.filter(result => result.idType === listType[i]._id)
        }
    }
    
    const list = products.filter(product => {
        let bool = false;
        if(catalog !== "")
        {
            ProductByProductCatalog.map(x => {
                if(x.idProduct === product._id)
                    bool = true;
            })
            if(bool === false)
                return bool;
        }
        if(brand.length !== 0){
            const child = brands.filter(x => (product.idBrand === x._id ? true : false))
            bool = brand.includes(child[0].name)
            if(bool === false)
                return bool;
        }
        if(color.length !== 0){
            const child = colors.filter(x => (product.idColor === x._id ? true : false))
            bool = color.includes(child[0].name) 
            if(bool === false)
                return bool;
        }
        if(Number(price.min) > 0 || Number(price.max) > 0)
        {
            if(Number(price.min) > 0 && Number(price.max) === 0)
            {
                if(product.discount && Number(price.min) <= product.discount)
                {
                    bool = true;
                }
                else if(!product.discount && Number(price.min) <= product.price)
                {
                    bool = true;
                }
            }
            else if(Number(price.max) > 0 && Number(price.min) === 0)
            {
                if(product.discount && Number(price.max) >= product.discount)
                {
                    bool = true;
                }
                else if(!product.discount && Number(price.max) >= product.price)
                {
                    bool = true;
                }
            }
            else
            {
                if(product.discount && Number(price.max) >= product.discount && Number(price.min) <= product.discount)
                {
                    bool = true;
                }
                else if(!product.discount && Number(price.max) >= product.price && Number(price.min) <= product.price)
                {
                    bool = true;
                }
            }
            if(bool === false)
            return bool;
        }
        return true;
    })

    switch(typeSort)
    {
        case "price": 
        {
            for(let i = 0; i < list.length - 1; i++)
            {
                let min = (list[i].discount ? list[i].discount : list[i].price);
                for(let j = i + 1; j < list.length; j++)
                {
                    if(min > (list[j].discount ? list[j].discount : list[j].price))
                    {
                        min = list[j].discount ? list[j].discount : list[j].price;
                        const z = list[i];
                        list[i] = list[j];
                        list[j] = z;
                    }
                }
            }
            break;
        }
        case "price-desc": 
        {
            for(let i = 0; i < list.length - 1; i++)
            {
                let max = (list[i].discount ? list[i].discount : list[i].price);
                for(let j = i + 1; j < list.length; j++)
                {
                    if(max < (list[j].discount ? list[j].discount : list[j].price))
                    {
                        max = list[j].discount ? list[j].discount : list[j].price;
                        const z = list[i];
                        list[i] = list[j];
                        list[j] = z;
                    }
                }
            }
            break;
        }
        case "date": 
        {
            for(let i = 0; i < list.length - 1; i++)
            {
                let max = list[i].updatedAt;
                for(let j = i + 1; j < list.length; j++)
                {
                    if(max < list[j].updatedAt)
                    {
                        max = list[j].updatedAt;
                        const z = list[i];
                        list[i] = list[j];
                        list[j] = z;
                    }
                }
            }
            break;
        }
        default: 
            break;
    }

    const listProduct = quality !== "-1" ? list.slice(numberPage * quality, (numberPage + 1) * quality) : list;

    return {
        list,
        products,
        listProduct,
    };
})