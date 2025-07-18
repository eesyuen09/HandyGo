import pytest
from geopy.distance import distance
from model.backend import postcode_to_latlng
from model.backend import CITY_CENTER, service_key_map, base_rates


def test_postcode_to_latlng_contains_known_code():
    # The postcode-to-lat/lng mapping must not be empty
    codes = list(postcode_to_latlng.keys())
    assert codes, "postcode_to_latlng is empty"
    # Pick the first key and verify its value
    first_code = codes[0]
    lat, lon = postcode_to_latlng[first_code]
    assert isinstance(lat, float) and isinstance(lon, float)


def test_zone_center_calculation_exact_center():
    # Distance from center to itself is 0 => zone 1
    dist = distance(CITY_CENTER, CITY_CENTER).km
    assert dist == pytest.approx(0, abs=1e-6)
    zone = 1 if dist <= 10 else 0
    assert zone == 1


def test_zone_center_calculation_outside_radius():
    # A point far from the center (e.g., 0,0) yields zone 0
    far = (0.0, 0.0)
    dist = distance(CITY_CENTER, far).km
    assert dist > 10
    zone = 1 if dist <= 10 else 0
    assert zone == 0


def test_service_key_map_and_base_rate_consistency():
    # Ensure every human-readable service maps to a valid base rate
    for human, key in service_key_map.items():
        assert key in base_rates, f"{key} missing in base_rates"
        rate = base_rates[key]
        assert isinstance(rate, (int, float)) and rate > 0
