import * as httpRequest from '../utils/httpRequest'

export const getIDHardware = async () => {
    try {
        const res = await httpRequest.get("/machineId");
        return res;
    } catch (err) {
        console.log(err);
    }
}