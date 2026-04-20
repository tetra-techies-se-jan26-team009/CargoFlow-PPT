// scripts/simulateAgent.js
import api from "../utils/api";

export const simulateJourney = async (shipmentId, startCoords, endCoords) => {
  const totalSteps = 50;
  let currentStep = 0;

  const interval = setInterval(async () => {
    if (currentStep > totalSteps) {
      clearInterval(interval);
      return;
    }

    // Linear interpolation
    const lat = startCoords.lat + (endCoords.lat - startCoords.lat) * (currentStep / totalSteps);
    const lng = startCoords.lng + (endCoords.lng - startCoords.lng) * (currentStep / totalSteps);

    try {
      await api.post("/api/v1/agent/update/live-location", {
        lat,
        lng,
        shipment_id: shipmentId
      });
      console.log(`Step ${currentStep}: Location updated to ${lat}, ${lng}`);
    } catch (err) {
      console.error("Simulation sync failed" , err);
    }

    currentStep++;
  }, 3000); 
};