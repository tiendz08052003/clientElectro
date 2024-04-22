import * as httpRequest from "~/utils/httpRequest";

export const getCombineDetailsCatalog_CombineType_Catalog = async () => {
    try {
        const res = httpRequest.get("combineDetailsCatalog_CombineType_Catalog");
        return res;
    } catch (error) {
        return "Error";
    }
}
