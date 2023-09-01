import * as httpRequest from "~/utils/httpRequest"

export const getCompare = async() => {
    try {
        const res = await httpRequest.get("compare");
        return res;
    } catch(err) {
        console.log(err);
    }
}

export const addCompare = async (data) => {
    try {
        const res = await httpRequest.post("compare/create/store", data);
        return res;
    } catch(err) {
        console.log(err);
    }
}


export const deleteCompare = async (id) => {
    try {
        const res = await httpRequest.deleteSingle("compare/delete/" + id);
        return res;
    } catch(err) {
        console.log(err);
    }
}


