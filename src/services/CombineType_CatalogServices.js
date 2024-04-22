import * as httpRequest from "~/utils/httpRequest";

export const getCombineType_Catalog = async () => {
    try {
        const res = httpRequest.get("combineType_Catalog");
        return res;
    } catch (error) {
        return "Error";
    }
}
