import * as httpRequest from '~/utils/httpRequest'

export const getChat = async () => {
    try {
        const res = await httpRequest.get("chat")
        return res;
    }
    catch(err) {
        console.log(err);
    }
}

export const createChat = async (data) => {
    try {
        const res = await httpRequest.post("chat/create", data)
        return res;
    }
    catch(err) {
        console.log(err);
    } 
}

export const updateChat = async (id, data) => {
    try {
        const res = await httpRequest.patch(`chat/update/${id}`, data)
        return res;
    }
    catch(err) {
        console.log(err);
    }
}

export const deleteChat = async (id) => {
    try {
        const res = await httpRequest.deleteSingle(`chat/delete/${id}`)
        return res;
    }
    catch(err) {
        console.log(err);
    }
}

export const replaceChat = async (id, data) => {
    try {
        const res = await httpRequest.put(`chat/replace/${id}`, data)
        return res;
    }
    catch(err) {
        console.log(err);
    }
}
