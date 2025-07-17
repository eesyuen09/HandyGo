# backend.py
from flask import Flask, request, jsonify
import joblib
import numpy as np
import pandas as pd

app = Flask(__name__)
model = joblib.load('xgboost_model.pkl')

services = ["General House Cleaning",
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
      "Roof or Gutter Cleaning"
    ]

base_rates = {
    'general_house_cleaning': 24,
    'home_organizing': 22,
    'deep_cleaning': 32,
    'aircond_cleaning': 40,
    'carpet_cleaning': 30,
    'post_renovation_cleaning': 60,
    'sofa_or_mattress_cleaning': 36,
    'plumbing_services': 60,
    'air_conditioner_repair': 58,
    'electrical_repair': 60,
    'washing_machine_repair': 54,
    'refrigerator_repair': 45,
    'door_lock_repair': 38,
    'ceiling_repair': 44,
    'furniture_assembly': 24,
    'mounting': 34,
    'painting_touch_up_work': 42,
    'curtain_or_blind_installation': 28,
    'minor_welding_jobs': 60,
    'kitchen_remodeling': 85,
    'tiling_flooring': 72,
    'electrical_safety_check': 38,
    'gas_leak_detection': 42,
    'fire_extinguisher_servicing': 38,
    'house_moving': 44,
    'large_item_delivery': 36,
    'small_item_delivery': 20,
    'lawn_mowing': 34,
    'gardening': 28,
    'tree_cutting': 48,
    'roof_or_gutter_cleaning': 52
}

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json  # expects {"features": [...]}
    
    df = pd.DataFrame([{
      'duration_hours': data['duration_hours'],
      'lead_time_hours': data['lead_time_hours'],
      'zone_center': data['zone_center'],
      'severity_score': data['severity_score'],
      'gender_pref': int(data['gender_pref']),
      'min_rating_required': data['min_rating_required'],
      'demand_supply_ratio': data['demand_supply_ratio'],
      # one-hot for service type
      **{ f'service_{s}': int(data['service_type']==s) for s in services },
      'base_rate': base_rates[data['service_type']]
    }])

    # Predict
    features = df[model.feature_names_in_]  # ensure correct column order
    pred = model.predict(features.values)[0]

    return jsonify({ 'predicted_price': round(float(pred), 2) })

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    # bind to 0.0.0.0 so Render’s router can see it
    app.run(host='0.0.0.0', port=port, debug=False)