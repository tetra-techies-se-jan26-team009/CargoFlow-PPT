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
export const updateLiveLocation = async (pincode, shipmentId = null) => {
    try {
        const res = await api.post("/api/v1/agent/update/live-location", {
            pincode,
            shipment_id: shipmentId
        });
        return res.data;
    } catch (error) {
        console.error("Failed to update live location:", error);
        return null;
    }
};

export const updateAgentProfile = async (profileData) => {
    return await api.patch("/api/auth/me", profileData);
};

/**
 * --- Duty Status Management ---
 * Updates the agent's availability (ON_DUTY, OFF_DUTY).
 * Maps to PATCH /api/v1/agent/update/duty-status
 */
export const updateDutyStatus = async (status) => {
    try {
        const res = await api.patch("/api/v1/agent/update/duty-status", {
            status: status.toUpperCase() // Ensure it matches backend Enum (ON_DUTY / OFF_DUTY)
        });
        return res.data;
    } catch (error) {
        console.error("Failed to update duty status:", error);
        throw error;
    }
};


export const buildAgentNotifications = (shipments = [], agent = {}) => {
  const notifications = [];

  // 🔹 Assignment notifications
  shipments
    .filter(s => s.status === "ASSIGNED")
    .slice(0, 3)
    .forEach((s, index) => {
      notifications.push({
        id: s.id,
        title: "New Delivery Assigned",
        desc: `${s.tracking_number} assigned to you`,
        time: "Just now",
        type: "info",
        read: index !== 0
      });
    });

  // 🔹 Active delivery
  const active = shipments.find(s => s.status === "OUT_FOR_DELIVERY");

  if (active) {
    notifications.unshift({
      id: "active",
      title: "Delivery In Progress",
      desc: `${active.tracking_number} is out for delivery`,
      type: "info",
      read: false
    });
  }

  // 🔹 Duty status
  if (agent?.duty_status) {
    notifications.unshift({
      id: "duty",
      title: "Duty Status",
      desc: `You are ${agent.duty_status.replace("_", " ")}`,
      type: "success",
      read: false
    });
  }

  return notifications;
};