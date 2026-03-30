import api from "./api";


// ---Dashboard----------------------------------------------------------------------------
export const getDashboard = async () => {
    try {
        const res = await api.get("/api/admin/dashboard");
        return res.data;
    } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        throw error;
    }
}

// ---Shipments Data-----------------------------------------------------------------------
export const getShipments = async () => {
    try {
        const res = await api.get("/api/admin/dashboard/shipments");
        return res.data;
    } catch (error) {
        console.error("Failed to fetch shipments data:", error);
        throw error;
    }
}

export const createShipment = async (data) => {
    try {
        const res = await api.post("/api/admin/shipments", data);
        return res.data;
    } catch (error) {
        console.error("Failed to create shipment:", error);
        throw error;
    }
}

// ---Agent Data-----------------------------------------------------------------------
export const getAgents = async () => {
    try {
        const res = await api.get("/api/admin/dashboard/agents");
        return res.data;
    } catch (error) {
        console.error("Failed to fetch agents data:", error);
        throw error;
    }
}

export const createAgent = async (data) => {
    try {
        const res = await api.post("/api/admin/delivery_agents", data);
        return res.data;
    } catch (error) {
        console.error("Failed to create agent:", error);
        throw error;
    }
}

export const updateAgent = async (agentId) => {
    try {
        const res = await api.patch(`/api/admin/delivery_agents/${agentId}/status`);
        return res.data;
    } catch (error) {
        console.error("Failed to update agent status:", error);
        throw error;
    }
}

// ---Clients Data-----------------------------------------------------------------------
export const getClients = async () => {
    try {
        const res = await api.get("/api/admin/dashboard/clients");
        return res.data;
    } catch (error) {
        console.error("Failed to fetch clients data:", error);
        throw error;
    }
}

export const createClient = async (data) => {
    try {
        const res = await api.post("/api/admin/business_clients" , data);
        return res.data;
    } catch (error) {
        console.error("Failed to create client:", error);
        throw error;
    }
}
