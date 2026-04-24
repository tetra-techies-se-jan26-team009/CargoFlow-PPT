import api from "./api";

export const CLIENT_STATUS_META = {
    "In Transit": { bg: "#DBEAFE", color: "#1D4ED8", dot: "#3B82F6" },
    Delivered: { bg: "#D1FAE5", color: "#065F46", dot: "#10B981" },
    Pending: { bg: "#FEF3C7", color: "#92400E", dot: "#F59E0B" },
    Failed: { bg: "#FEE2E2", color: "#991B1B", dot: "#EF4444" },
};

const pick = (...values) => values.find((value) => value !== undefined && value !== null && value !== "");

const getNumber = (value, fallback = 0) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
};

export const mapClientShipmentStatus = (status) => {
    switch (status) {
        case "CREATED":
            return "Pending";
        case "ASSIGNED":
        case "OUT_FOR_DELIVERY":
        case "IN_TRANSIT":
            return "In Transit";
        case "DELIVERED":
            return "Delivered";
        case "FAILED":
        case "RETURN_TO_ORIGIN":
        case "CANCELLED":
            return "Failed";
        default:
            return status || "Pending";
    }
};

const formatDateTime = (value, fallback = "Not available") => {
    if (!value) return fallback;
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return String(value);
    return parsed.toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
};

const formatDate = (value, fallback = "Not available") => {
    if (!value) return fallback;
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return String(value);
    return parsed.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

const formatCurrency = (value) => {
    const amount = Number(value);
    if (!Number.isFinite(amount)) return "Not set";
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(amount);
};

export const getShipmentProgress = (shipment) => {
    const explicit = pick(
        shipment?.progress,
        shipment?.progress_percentage,
        shipment?.progressPercent,
        shipment?.completion_percentage,
    );

    if (explicit !== undefined) {
        return Math.max(0, Math.min(100, getNumber(explicit)));
    }

    switch (mapClientShipmentStatus(shipment?.status)) {
        case "Delivered":
            return 100;
        case "In Transit":
            return 65;
        case "Failed":
            return 45;
        default:
            return 10;
    }
};

// export const normalizeClientShipment = (shipment = {}) => {
//     const status = mapClientShipmentStatus(shipment.status);

//     return {
//         ...shipment,
//         id: pick(shipment.tracking_id, shipment.id, shipment.shipment_id, "N/A"),
//         from:
//             shipment.route?.origin ||
//             shipment.pickup_city ||
//             shipment.pickup_address?.city ||
//             "Not available",

//         to:
//             shipment.route?.destination ||
//             shipment.delivery_city ||
//             shipment.delivery_address?.city ||
//             "Not available",

//         status,
//         progress: getShipmentProgress(shipment),
//         pickupCoords: shipment.pickup_coords
//             ? {
//                 lat: shipment.pickup_coords.lat,
//                 lng: shipment.pickup_coords.lng
//             }
//             : {
//                 lat: shipment.pickup_address?.latitude,
//                 lng: shipment.pickup_address?.longitude
//             },

//         deliveryCoords: shipment.delivery_coords
//             ? {
//                 lat: shipment.delivery_coords.lat,
//                 lng: shipment.delivery_coords.lng
//             }
//             : {
//                 lat: shipment.delivery_address?.latitude,
//                 lng: shipment.delivery_address?.longitude
//             },
//         agentCoords: shipment.current_location
//             ? {
//                 lat: shipment.current_location.lat,
//                 lng: shipment.current_location.lng
//             }
//             : null,
//         agent: pick(
//             shipment.agent_name,
//             shipment.agent,
//             shipment.assigned_agent_name,
//             shipment.assigned_agent?.name,
//             "Unassigned",
//         ),

//         eta: formatDateTime(
//             pick(
//                 shipment.eta,
//                 shipment.estimated_delivery,
//                 shipment.estimated_delivery_at,
//                 shipment.expected_delivery_date,
//             ),
//         ),
//         kg: getNumber(pick(shipment.weight, shipment.weight_kg), 0),
//         price: getNumber(pick(shipment.price, shipment.amount, shipment.shipping_cost), 0),
//         priceLabel: formatCurrency(pick(shipment.price, shipment.amount, shipment.shipping_cost)),
//         date: formatDate(
//             pick(
//                 shipment.created_at,
//                 shipment.created_on,
//                 shipment.pickup_date,
//                 shipment.updated_at,
//             ),
//         ),
//         pickupLine1:
//             shipment.pickup_address?.line1 ||
//             shipment.route?.origin ||
//             "Not available",

//         deliveryLine1:
//             shipment.delivery_address?.line1 ||
//             shipment.route?.destination ||
//             "Not available",
//         receiverName: pick(shipment.receiver_name, shipment.receiver?.name, "Receiver"),
//         receiverPhone: pick(shipment.receiver_phone, shipment.receiver?.phone, "Not available"),
//         receiverEmail: pick(shipment.receiver_email, shipment.receiver?.email, "Not available"),
//     };
// };


export const normalizeClientShipment = (shipment = {}) => {
    const status = mapClientShipmentStatus(shipment.status);

    // ✅ move logic OUTSIDE return
    const routeString = shipment.route;

    let routeFrom = null;
    let routeTo = null;

    if (typeof routeString === "string" && routeString.includes("→")) {
        const parts = routeString.split("→").map(v => v.trim());
        routeFrom = parts[0];
        routeTo = parts[1];
    }

    return {
        ...shipment,

        id: pick(shipment.tracking_id, shipment.id, shipment.shipment_id, "N/A"),

        from:
            routeFrom ||
            shipment.route?.origin ||
            shipment.pickup_city ||
            shipment.pickup_address?.city ||
            "Not available",

        to:
            routeTo ||
            shipment.route?.destination ||
            shipment.delivery_city ||
            shipment.delivery_address?.city ||
            "Not available",

        status,
        progress: getShipmentProgress(shipment),

        pickupCoords: shipment.pickup_coords
            ? {
                lat: shipment.pickup_coords.lat,
                lng: shipment.pickup_coords.lng
            }
            : {
                lat: shipment.pickup_address?.latitude,
                lng: shipment.pickup_address?.longitude
            },

        deliveryCoords: shipment.delivery_coords
            ? {
                lat: shipment.delivery_coords.lat,
                lng: shipment.delivery_coords.lng
            }
            : {
                lat: shipment.delivery_address?.latitude,
                lng: shipment.delivery_address?.longitude
            },

        agentCoords: shipment.current_location
            ? {
                lat: shipment.current_location.lat,
                lng: shipment.current_location.lng
            }
            : null,

        agent: pick(
            shipment.agent_name,
            shipment.agent,
            shipment.assigned_agent_name,
            shipment.assigned_agent?.name,
            "Unassigned",
        ),

        eta: formatDateTime(
            pick(
                shipment.eta,
                shipment.estimated_delivery,
                shipment.estimated_delivery_at,
                shipment.expected_delivery_date,
            ),
        ),

        kg: getNumber(pick(shipment.weight, shipment.weight_kg), 0),

        price: getNumber(pick(shipment.price, shipment.amount, shipment.shipping_cost), 0),

        priceLabel: formatCurrency(pick(shipment.price, shipment.amount, shipment.shipping_cost)),

        date: formatDate(
            pick(
                shipment.created_at,
                shipment.created_on,
                shipment.pickup_date,
                shipment.updated_at,
            ),
        ),

        pickupLine1:
            shipment.pickup_address?.line1 ||
            shipment.route?.origin ||
            "Not available",

        deliveryLine1:
            shipment.delivery_address?.line1 ||
            shipment.route?.destination ||
            "Not available",

        receiverName: pick(shipment.receiver_name, shipment.receiver?.name, "Receiver"),
        receiverPhone: pick(shipment.receiver_phone, shipment.receiver?.phone, "Not available"),
        receiverEmail: pick(shipment.receiver_email, shipment.receiver?.email, "Not available"),
    };
};

export const buildClientNotifications = (shipments = []) =>
    shipments.slice(0, 3).map((shipment, index) => ({
        id: shipment.id || index + 1,
        icon:
            shipment.status === "Delivered"
                ? "✅"
                : shipment.status === "Failed"
                    ? "⚠️"
                    : shipment.status === "Pending"
                        ? "⏰"
                        : "",
        bg:
            shipment.status === "Delivered"
                ? "#D1FAE5"
                : shipment.status === "Failed"
                    ? "#FEE2E2"
                    : shipment.status === "Pending"
                        ? "#FEF3C7"
                        : "#DBEAFE",
        msg: `${shipment.id} is ${shipment.status.toLowerCase()} on ${shipment.from} to ${shipment.to}`,
        time: shipment.date,
        unread: index === 0,
    }));

export const deriveClientDashboardStats = (dashboard = {}, shipments = []) => {
    const activeShipments = getNumber(
        pick(dashboard.active_shipments, dashboard.activeShipments, dashboard.in_transit),
        shipments.filter((shipment) => shipment.status === "In Transit").length,
    );

    const deliveredShipments = getNumber(
        pick(dashboard.delivered_shipments, dashboard.deliveredShipments, dashboard.delivered),
        shipments.filter((shipment) => shipment.status === "Delivered").length,
    );

    const pendingPickups = getNumber(
        pick(dashboard.pending_pickups, dashboard.pendingPickups, dashboard.pending),
        shipments.filter((shipment) => shipment.status === "Pending").length,
    );

    const openInvoices = getNumber(
        pick(dashboard.open_invoices, dashboard.openInvoices, dashboard.pending_invoices),
        0,
    );

    const recentSource = pick(dashboard.recent_shipments, dashboard.recentShipments, shipments) || [];
    const recentShipments = recentSource.map(normalizeClientShipment).slice(0, 5);

    const activeShipment = normalizeClientShipment(
        pick(
            dashboard.active_shipment,
            dashboard.activeShipment,
            dashboard.latest_shipment,
            recentShipments.find((shipment) => shipment.status === "In Transit"),
            recentShipments[0],
            {},
        ),
    );

    return {
        activeShipments,
        deliveredShipments,
        pendingPickups,
        openInvoices,
        activeShipment,
        recentShipments,
    };
};

export const getClientDashboard = async () => {
    try {
        const res = await api.get("/api/v1/client/dashboard");
        return res.data;
    } catch (error) {
        console.error("Failed to fetch client dashboard data:", error);
        throw error;
    }
};

export const getTrackingInfo = async (trackingNumber) => {
    try {
        const res = await api.get(`/api/v1/client/track/${trackingNumber}`);
        return normalizeClientShipment(res.data?.shipment || res.data);
    } catch (error) {
        console.error("Failed to fetch tracking info:", error);
        throw error;
    }
};

export const getClientShipments = async () => {
    const res = await api.get("/api/v1/client/shipments");

    const shipments = res.data.shipments.map((s) => {
        const [from, to] = (s.route || "").split("→").map(v => v?.trim());

        return {
            id: s.tracking_id,
            from: from || "Unknown",
            to: to || "Unknown",
            agent: s.agent || "Unassigned",

            kg: parseFloat(s.weight) || 0,
            price: s.price,
            priceLabel: `₹${s.price?.toLocaleString()}`,

            date: s.date
                ? new Date(s.date).toLocaleDateString()
                : "Not available",

            progress: s.progress || 0,
            status: formatStatus(s.status),
            client: s.client
        };
    });

    return {
        shipments
    };
};


const formatStatus = (status) => {
    const map = {
        CREATED: "Pending",
        ASSIGNED: "In Transit",
        OUT_FOR_DELIVERY: "In Transit",
        DELIVERED: "Delivered",
        FAILED: "Failed",
    };

    return map[status] || status;
};

export const createShipment = async (data) => {
    try {
        const res = await api.post("/api/v1/client/shipments", data);
        return res.data;
    } catch (error) {
        console.error("Failed to create shipment:", error);
        throw error;
    }
};

export const createBusiness = async (data) => {
    try {
        const res = await api.post("/api/v1/client/business", data);
        return res.data;
    } catch (error) {
        console.error("Failed to create Business", error);
        throw error;
    }
};

export const updateBusiness = async (data) => {
    try {
        const res = await api.put("/api/v1/client/business", data);
        return res.data;
    } catch (error) {
        console.error("Failed to update Business", error);
        throw error;
    }
};

export const hasClientBusiness = (dashboardData) => {
    return !!dashboardData?.business?.name;
};