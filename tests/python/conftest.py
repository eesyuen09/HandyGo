import pytest
from model.backend import app, postcode_to_latlng, CITY_CENTER, model

import os
import sys

root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if root not in sys.path:
    sys.path.insert(0, root)


@pytest.fixture(scope="session")
def flask_app():
    app.config.update({"TESTING": True})
    return app


@pytest.fixture
def client(flask_app):
    return flask_app.test_client()


@pytest.fixture(scope="session")
def sample_postcodes():
    # returns the dict loaded in your backend
    return postcode_to_latlng


@pytest.fixture(scope="session")
def xgb_model():
    return model  # the loaded XGBRegressor


@pytest.fixture(scope="session")
def center():
    return CITY_CENTER
