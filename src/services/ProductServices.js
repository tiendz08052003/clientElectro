//Thư viện request
import * as httpRequest from '~/utils/httpRequest';

export const shop = async () => {
    try {
        const res = await httpRequest.get('product');
        return res;
    }
    catch (error) {
        console.log(error)
    }
}

export const search = async (q) => {
    try {
        const res = await httpRequest.get("product/search", { 
            params: {
                q
            },
        })
        return res;
    }
    catch(err) {
        console.log(err)
    }
}

export const searchByElasticsearch = async (q) => {
    try {
        const res = await httpRequest.get("product/elasticsearch/searchElasticsearch", { 
            params: {
                q
            },
        })
        return res;
    }
    catch(err) {
        console.log(err)
    }
}

export const synchronizedElasticsearch = async () => {
    try {
        const res = await httpRequest.post("product/elasticsearch/synchronized")
        return res;
    }
    catch(err) {
        console.log(err)
    }
}