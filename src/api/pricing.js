// src/api/pricing.js
import Constants from "expo-constants";

const API_URL =
  process.env.REACT_NATIVE_API_URL || // for Create React App/EAS builds
  process.env.API_URL || // for plain Node
  "https://handygo-ae37.onrender.com";

export async function getPriceEstimate(payload) {
  try {
    const res = await fetch(`${API_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    console.log("Response from pricing API:", res);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const { predicted_price } = await res.json();
    return predicted_price;
  } catch (e) {
    console.error("Pricing API error", e);
    throw e;
  }
}
