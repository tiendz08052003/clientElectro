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

export const getCatalog = state => {
    return state.products.catalogList;
}

export const getCombineType_Catalog = state => {
    return state.products.combineType_CatalogList;
}

export const getDetailsType = state => {
    return state.products.detailsTypeList;
}

export const getDetailsCatalog = state => {
    return state.products.detailsCatalogList;
}

export const getCombineDetailsCatalog_CombineType_Catalog = state => {
    return state.products.combineDetailsCatalog_CombineType_CatalogList;
}

export const getCombineProduct_CombineDetailsCatalog_CombineType_Catalog = state => {
    return state.products.combineProduct_CombineDetailsCatalog_CombineType_Catalog;
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

export const getSideBarType = state => {
    return state.sidebar.type;
}

export const getSideBarDetailsType = state => {
    return state.sidebar.detailsType;
}

export const getIdDetailsCatalog = state => {
    return state.headerFooter.idDetailsCatalog;
}

export const getPriceCatalog = state => {
    return state.headerFooter.price;
}

export const getListCombineProduct_CombineDetailsCatalog_CombineType_Catalog = state => {
    let listCombineProduct_CombineDetailsCatalog_combineType_CatalogList = state.products.combineProduct_CombineDetailsCatalog_CombineType_CatalogList;
    let listCombineDetailsCatalog_combineType_CatalogList = state.products.combineDetailsCatalog_CombineType_CatalogList;
    let idDetailsCatalog = state.headerFooter.idDetailsCatalog;

    const getListCombineDetailsCatalog_combineType_CatalogList = listCombineDetailsCatalog_combineType_CatalogList.filter(x => x.idDetailsCatalog === idDetailsCatalog);
    const getListCombineProduct_CombineDetailsCatalog_combineType_CatalogList = listCombineProduct_CombineDetailsCatalog_combineType_CatalogList.filter(x => {
            const arr = getListCombineDetailsCatalog_combineType_CatalogList.filter(y => {
                return x.idCombineDetailsCatalog_CombineType_Catalog === y._id
            });
            if(arr.length)
                return true;
            return false;
        }
    );
    return getListCombineProduct_CombineDetailsCatalog_combineType_CatalogList;
}

export const getUser = state => {
    return state.account.currentAccount;
}

export const getResultSearch = state => {
    return state.header.resultSearch;
}

export const getConditionSearch_ = state => {
    return state.header.conditionSearch;
}

export const getContentSearch = state => {
    return state.header.valueSearch;
}

export const combineAllCaseShop = createSelector(getProduct, getDetailsType, getBrand, getColor, getTypeSort, getQualities, getNumberPage, sideBarBrandList, sideBarColorList, getSideBarType, getSideBarDetailsType, getIdDetailsCatalog, getListCombineProduct_CombineDetailsCatalog_CombineType_Catalog, getPriceCatalog, (products, detailsTypes, brands, colors, typeSort, quality, numberPage, brand, color, type, detailsType, idDetailsCatalog, listCombineProduct_CombineDetailsCatalog_CombineType_Catalog, price) => {
    const list = products.filter(product => {
        let bool = false;
        if(idDetailsCatalog !== "")
        {
            listCombineProduct_CombineDetailsCatalog_CombineType_Catalog.map(x => {
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
            let arrIdDetailsType = detailsTypes.filter(detailsType => detailsType.idType === type)
            let idArray = arrIdDetailsType.map(item => item._id);
            bool = idArray.includes(product.idDetailsType)
            if(bool === false)
                return bool;

        }
        if(detailsType !== "")
        {
            bool = detailsType === product.idDetailsType;
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


export const combineAllCaseSearch = createSelector(getResultSearch, getConditionSearch_, getDetailsType, getBrand, getColor,  getTypeSort, getQualities, getNumberPage, sideBarBrandList, sideBarColorList, getIdDetailsCatalog, getListCombineProduct_CombineDetailsCatalog_CombineType_Catalog, getPriceCatalog, (resultSearch, conditionSearch, detailsTypes,brands, colors, typeSort, quality, numberPage, brand, color, catalog, listCombineProduct_CombineDetailsCatalog_CombineType_Catalog, price) => {
    let products = [];
    if(conditionSearch === "")
    {
        products = resultSearch;
    }
    else
    {
        const listDetailsType = detailsTypes.filter(x => x.idType === conditionSearch)
        products = resultSearch.filter(result => {
            const list = listDetailsType.filter(element => {
                return result.idDetailsType === element._id
            })
            if(list.length)
                return true;
            return false;
        })
    }
    const list = products.filter(product => {
        let bool = false;
        if(catalog !== "")
        {
            listCombineProduct_CombineDetailsCatalog_CombineType_Catalog.map(x => {
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