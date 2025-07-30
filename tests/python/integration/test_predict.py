import numpy as np
import pandas as pd
import pytest
import xgboost as xgb
from model.backend import model


@pytest.fixture
def feature_names():
    # Try sklearn-API feature_names_in_, else Booster.feature_names
    return getattr(model, "feature_names_in_", None) or model.feature_names


def test_model_loaded_and_has_predict():
    # The model object must expose a predict method
    assert hasattr(model, "predict"), "Model missing predict() method"


def test_model_feature_names(feature_names):
    # Feature names must be a non-empty list or array of strings
    assert feature_names is not None
    assert len(feature_names) > 0
    assert all(isinstance(f, str) for f in feature_names)


def test_model_predict_on_zero_vector(feature_names):
    # Build a zero-DataFrame for all expected features
    df = pd.DataFrame([{f: 0 for f in feature_names}])
    arr = df[feature_names].values
    # Provide feature names to the DMatrix so validation passes
    dmatrix = xgb.DMatrix(arr, feature_names=feature_names)
    preds = model.predict(dmatrix)
    # Verify prediction output
    assert isinstance(preds, (list, np.ndarray))
    assert len(preds) == 1
    assert isinstance(float(preds[0]), float)
