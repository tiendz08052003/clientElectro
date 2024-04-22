import * as httpRequest from "~/utils/httpRequest";

export const getCombineProduct_CombineDetailsCatalog_CombineType_Catalog = async () => {
    try {
        const res = httpRequest.get("combineProduct_CombineDetailsCatalog_CombineType_Catalog");
        return res;
    } catch (error) {
        return "Error";
    }
}
