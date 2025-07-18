# backend.py
from flask import Flask, request, jsonify
import joblib
import pandas as pd
import os
from geopy.distance import distance


app = Flask(__name__)
BASE_DIR = os.path.dirname(__file__)
model = joblib.load(os.path.join(BASE_DIR, "xgboost_model.pkl"))

postcode_df = pd.read_csv(
    os.path.join(BASE_DIR, "SG_postal.csv"), dtype={"postal_code": str}
)
postcode_to_latlng = {
    row["postal_code"]: (row["lat"], row["lon"]) for _, row in postcode_df.iterrows()
}

CITY_CENTER = (1.3521, 103.8198)

services = [
    "General House Cleaning",
    "Home Organizing",
    "Deep Cleaning",
    "Aircond Cleaning",
    "Carpet Cleaning",
    "Post-Renovation Cleaning",
    "Sofa or Mattress Cleaning",
    "Plumbing Services",
    "Air Conditioner Repair",
    "Electrical Repair",
    "Washing Machine Repair",
    "Refrigerator Repair",
    "Door & Lock Repair",
    "Ceiling Repair",
    "Furniture Assembly",
    "Mounting",
    "Painting & Touch-up Work",
    "Curtain or Blind Installation",
    "Minor Welding Jobs",
    "Kitchen Remodeling",
    "Tiling & Flooring",
    "Electrical Safety Check",
    "Gas Leak Detection",
    "Fire Extinguisher Servicing",
    "House Moving",
    "Large Item Delivery",
    "Small Item Delivery",
    "Lawn Mowing",
    "Gardening",
    "Tree Cutting",
    "Roof or Gutter Cleaning",
]

# map human-readable names to snake_case keys matching base_rates
service_key_map = {
    human: human.lower().replace(" & ", "_").replace(" ", "_").replace("-", "_")
    for human in services
}

base_rates = {
    "general_house_cleaning": 24,
    "home_organizing": 22,
    "deep_cleaning": 32,
    "aircond_cleaning": 40,
    "carpet_cleaning": 30,
    "post_renovation_cleaning": 60,
    "sofa_or_mattress_cleaning": 36,
    "plumbing_services": 60,
    "air_conditioner_repair": 58,
    "electrical_repair": 60,
    "washing_machine_repair": 54,
    "refrigerator_repair": 45,
    "door_lock_repair": 38,
    "ceiling_repair": 44,
    "furniture_assembly": 24,
    "mounting": 34,
    "painting_touch_up_work": 42,
    "curtain_or_blind_installation": 28,
    "minor_welding_jobs": 60,
    "kitchen_remodeling": 85,
    "tiling_flooring": 72,
    "electrical_safety_check": 38,
    "gas_leak_detection": 42,
    "fire_extinguisher_servicing": 38,
    "house_moving": 44,
    "large_item_delivery": 36,
    "small_item_delivery": 20,
    "lawn_mowing": 34,
    "gardening": 28,
    "tree_cutting": 48,
    "roof_or_gutter_cleaning": 52,
}


@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    pc = data["postcode"]
    # compute zone_center
    latlng = postcode_to_latlng[pc]
    dist_km = distance(CITY_CENTER, latlng).km
    print(f"Distance: {dist_km} km")
    zone = 1 if dist_km <= 10 else 0

    service_key = (
        data["service_type"]
        .lower()
        .replace(" & ", "_")
        .replace(" ", "_")
        .replace("-", "_")
    )
    base_rate_val = base_rates.get(service_key, 0)

    df = pd.DataFrame(
        [
            {
                "duration_hours": data["duration_hours"],
                "lead_time_hours": data["lead_time_hours"],
                "zone_center": zone,
                "severity_score": data["severity_score"],
                "gender_pref": int(data["gender_pref"]),
                "min_rating_required": data["min_rating_required"],
                "demand_supply_ratio": 1,
                **{
                    f"service_{sk}": int(service_key == sk)
                    for sk in service_key_map.values()
                },
                "base_rate": base_rate_val,
            }
        ]
    )

    # Predict
    feature_cols = getattr(model, "feature_names_in_", None) or getattr(
        model, "feature_names", None
    )
    features = df[feature_cols]
    pred = model.predict(features.values)[0]

    return jsonify({"predicted_price": round(float(pred), 2)})


if __name__ == "__main__":
    import os

    port = int(os.environ.get("PORT", 5000))
    # bind to 0.0.0.0 so Render’s router can see it
    app.run(host="0.0.0.0", port=port, debug=False)
