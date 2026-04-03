import api from "./api";    

// ---Client Dashboard------------------------------------------------------------------------

export const getClientDashboard = async () => {
    try {
        const res = await api.get("/api/v1/client/dashboard");
        return res.data;
    } catch (error) {
        console.error("Failed to fetch client dashboard data:", error);
    }
}

export const getTrackingInfo = async (trackingNumber) => {
    try {
        const res = await api.get(`/api/v1/client/track/${trackingNumber}`);
        return res.data;
    } catch (error) {
        console.error("Failed to fetch tracking info:", error);
    }  
}

// ---Client Shipments------------------------------------------------------------------------

export const getClientShipments = async () => {
    try {
        const res = await api.get("/api/v1/client/shipments");
        return res.data;
    } catch (error) {
        console.error("Failed to fetch client shipments:", error);
    }       
}

export const createShipment = async (data) => {
    try {
        const res = await api.post("/api/v1/client/shipments", data);
        return res.data;
    } catch (error) {
        console.error("Failed to create shipment:", error);
        throw error;
    }
}

export const addBusiness = async (data) => {
    try {
        const res = await api.post("/api/v1/client/business" , data);
        return res.data ; 
    } catch (error) {
        console.error("Failed to create Business", error);
        throw error;
    }
}

export const updateBusiness = async (data) => {
    try {
        const res = await api.put("/api/v1/client/business" , data);
        return res.data ; 
    } catch (error) {
        console.error("Failed to update Business", error);
        throw error;
    }
}