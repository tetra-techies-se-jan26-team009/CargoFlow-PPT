import api from "./api";


// ---Dashboard----------------------------------------------------------------------------
export const getDashboard = async () => {
    try {
        const res = await api.get("/api/v1/admin/dashboard");
        return res.data;
    } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        throw error;
    }
}

// ---Shipments Data-----------------------------------------------------------------------
export const getShipments = async () => {
    try {
        const res = await api.get("/api/v1/admin/dashboard/shipments");
        return res.data;
    } catch (error) {
        console.error("Failed to fetch shipments data:", error);
        throw error;
    }
}

export const createShipment = async (data) => {
    try {
        const res = await api.post("/api/v1/admin/shipments", data);
        return res.data;
    } catch (error) {
        console.error("Failed to create shipment:", error);
        throw error;
    }
}

// ---Agent Data-----------------------------------------------------------------------
export const getAgents = async () => {
    try {
        const res = await api.get("/api/v1/admin/dashboard/agents");
        return res.data;
    } catch (error) {
        console.error("Failed to fetch agents data:", error);
        throw error;
    }
}

export const createAgent = async (data) => {
    try {
        const res = await api.post("/api/v1/admin/delivery_agents", data);
        return res.data;
    } catch (error) {
        console.error("Failed to create agent:", error);
        throw error;
    }
}

export const updateAgent = async (agentId) => {
    try {
        const res = await api.patch(`/api/v1/admin/delivery_agents/${agentId}/status`);
        return res.data;
    } catch (error) {
        console.error("Failed to update agent status:", error);
        throw error;
    }
}


export const updateAgentDetails = async (agentId, data) => {
    try {
        const res = await api.patch(`/api/v1/admin/delivery_agents/${agentId}`, data);
        return res.data;
    } catch (error) {
        console.error("Failed to update agent details:", error);
        throw error;
    }
};

// ---Clients Data-----------------------------------------------------------------------
export const getClients = async () => {
    try {
        const res = await api.get("/api/v1/admin/dashboard/clients");
        return res.data;
    } catch (error) {
        console.error("Failed to fetch clients data:", error);
        throw error;
    }
}

export const createClient = async (data) => {
    try {
        const res = await api.post("/api/v1/admin/business_clients" , data);
        return res.data;
    } catch (error) {
        console.error("Failed to create client:", error);
        throw error;
    }
}

export const updateClientProfile = async (dbId, updateData) => {
    // URL will now be .../business_clients/2 instead of .../CLT-002
    const response = await api.patch(`/api/v1/admin/business_clients/${dbId}`, updateData);
    return response.data;
};

// Fix for Block/Unblock
export const toggleClientStatus = async (dbId) => {
    const response = await api.patch(`/api/v1/admin/business_clients/${dbId}/status`);
    return response.data;
};
export const assignAgent = async (shipmentId, agentId) => {
    try {
        const res = await api.post(`/api/v1/admin/shipments/${shipmentId}/assign/${agentId}`);
        return res.data;
    } catch (error) {
        console.error("Failed to assign agent:", error);
        throw error;
    }
};

export const approveDuty = async (agentId) => {
    return await api.patch(`/api/v1/admin/agents/${agentId}/approve-duty`);
};

// ---Notifications-----------------------------------------------------------------------

export const deriveAdminNotifications = (dashboardData) => {
    const alerts = dashboardData?.alerts || [];
    
    return alerts.map(alert => ({
        id: alert.id,
        title: alert.title,
        desc: alert.message,
        time: alert.timestamp,
        type: alert.type, // 'warning', 'success', 'info'
        unread: true // In a real app, you'd compare with a 'lastSeen' timestamp in localStorage
    }));
};