import api from "./api";    

// ---Client Dashboard------------------------------------------------------------------------

export const getClientDashboard = async () => {
    try {
        const res = await api.get("/api/client/dashboard");
        return res.data;
    } catch (error) {
        console.error("Failed to fetch client dashboard data:", error);
    }
}

export const getTrackingInfo = async (trackingNumber) => {
    try {
        const res = await api.get(`/api/client/track/${trackingNumber}`);
        return res.data;
    } catch (error) {
        console.error("Failed to fetch tracking info:", error);
    }  
}

// ---Client Shipments------------------------------------------------------------------------

export const getClientShipments = async () => {
    try {
        const res = await api.get("/api/client/shipments");
        return res.data;
    } catch (error) {
        console.error("Failed to fetch client shipments:", error);
    }       
}