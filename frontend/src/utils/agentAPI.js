import api from "./api";

/**
 * --- Agent Dashboard Data ---
 * Fetches the summary (stats) and active delivery details for the logged-in agent.
 * Maps to GET /api/v1/agent/dashboard
 */
export const getAgentDashboard = async () => {
    try {
        const res = await api.get("/api/v1/agent/dashboard");
        return res.data;
    } catch (error) {
        console.error("Failed to fetch agent dashboard data:", error);
        throw error;
    }
};

/**
 * --- Shipment Status Management ---
 * Updates the status of a specific shipment (e.g., to OUT_FOR_DELIVERY or DELIVERED).
 * Maps to PATCH /api/v1/agent/shipments/{id}/status
 */
export const updateShipmentStatus = async (shipmentId, status, remarks = "", paymentMethod = null) => {
    try {
        const payload = {
            status,
            remarks,
            payment_method: paymentMethod // This must be "CASH" or "DIGITAL"
        };
        console.log("SENDING PAYLOAD:", payload); // Debug this in your console!
        
        const res = await api.patch(`/api/v1/agent/shipments/${shipmentId}/status`, payload);
        return res.data;
    } catch (error) {
        console.error(`Failed to update shipment ${shipmentId} status:`, error);
        throw error;
    }
};

/**
 * --- Live Location Tracking ---
 * Updates the agent's current coordinates. 
 * Can optionally be linked to a specific shipment.
 * Maps to POST /api/v1/agent/update/live-location
 */
export const updateLiveLocation = async (lat, lng, shipmentId = null) => {
    try {
        const res = await api.post("/api/v1/agent/update/live-location", {
            lat,
            lng,
            shipment_id: shipmentId
        });
        return res.data;
    } catch (error) {
        // Log locally but avoid throwing to prevent breaking UI during background sync
        console.error("Failed to update live location:", error);
        return null;
    }
};


export const updateAgentProfile = async (profileData) => {
    return await api.patch("/api/auth/me", profileData);
};