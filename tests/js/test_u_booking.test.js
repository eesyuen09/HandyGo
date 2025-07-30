jest.mock("../../constants/postcodes", () => ({
  postcodes: [{ postal_code: 12345 }, { postal_code: 67890 }],
}));
import { postcodes } from "../../constants/postcodes";
import React from "react";
import { render } from "@testing-library/react-native";
import { Alert } from "react-native";
import * as Yup from "yup";
import UserBooking, {
  calculateEndTime,
  bucketItemCount,
  bucketAreaSize,
  handleBookingSubmit,
} from "../../screen/user_booking";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "../../firebaseConfig";
import { getPriceEstimate } from "../../src/api/pricing";

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn(),
}));
jest.spyOn(Alert, "alert").mockImplementation(() => {});
jest.mock("expo-constants", () => ({
  manifest: { scheme: "app" },
}));
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
  useRoute: () => ({ params: {} }),
}));

jest.mock("formik", () => {
  const React = require("react");
  return {
    Formik: ({ children, initialValues, onSubmit }) =>
      children({
        values: initialValues,
        errors: {},
        touched: {},
        handleChange: jest.fn(),
        handleBlur: jest.fn(),
        handleSubmit: onSubmit,
        setFieldValue: jest.fn(),
      }),
    FieldArray: (props) => {
      const fn = props.render || props.children;
      return fn({ push: jest.fn(), remove: jest.fn() });
    },
  };
});

jest.mock("yup", () => jest.requireActual("yup"));

jest.mock("react-native-dropdown-picker", () => {
  const React = require("react");
  return (props) => React.createElement("DropDownPicker", props);
});

jest.mock("@react-native-community/datetimepicker", () => {
  const React = require("react");
  return (props) => {
    React.useEffect(() => {
      props.onChange({ type: "set" }, new Date());
    }, []);
    return null;
  };
});

jest.mock("firebase/firestore", () => ({
  addDoc: jest.fn(),
  collection: jest.fn(),
  setDoc: jest.fn(),
}));

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn((auth, callback) => {
    return () => {};
  }),
}));

jest.mock("../../firebaseConfig", () => ({
  auth: {},
  db: {},
}));

describe("Helper functions", () => {
  test("calculateEndTime adds hours correctly and wraps past midnight", () => {
    expect(calculateEndTime("09:15", 2)).toBe("11:15");
    expect(calculateEndTime("23:30", 2)).toBe("01:30");
  });

  test("bucketItemCount buckets small counts to 1,2,3", () => {
    expect(bucketItemCount(0)).toBe(1);
    expect(bucketItemCount(1)).toBe(1);
    expect(bucketItemCount(2)).toBe(2);
    expect(bucketItemCount(3)).toBe(2);
    expect(bucketItemCount(4)).toBe(3);
    expect(bucketItemCount(99)).toBe(3);
  });

  test("bucketAreaSize buckets m² into 1/2/3 tiers", () => {
    expect(bucketAreaSize(5)).toBe(1);
    expect(bucketAreaSize(20)).toBe(1);
    expect(bucketAreaSize(30)).toBe(2);
    expect(bucketAreaSize(50)).toBe(2);
    expect(bucketAreaSize(75)).toBe(3);
  });
});

describe("getPriceEstimate", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it("resolves with predicted_price when response.ok", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ predicted_price: 42.5 }),
    });

    const payload = { service_type: "Test", duration_hours: 1 };
    const price = await getPriceEstimate(payload);

    expect(global.fetch).toHaveBeenCalledWith(
      "https://handygo-ae37.onrender.com/predict",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
    );
    expect(price).toBe(42.5);
  });

  it("throws on non-ok response", async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: () => ({}),
    });
    await expect(getPriceEstimate({})).rejects.toThrow("HTTP 500");
  });

  it("throws on network failure", async () => {
    global.fetch.mockRejectedValue(new Error("Network failure"));
    await expect(getPriceEstimate({})).rejects.toThrow("Network failure");
  });
});

describe("handleBookingSubmit", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("logs and fires a confirmation alert", () => {
    console.log = jest.fn();
    const dummy = { foo: "bar" };
    handleBookingSubmit(dummy);

    expect(console.log).toHaveBeenCalledWith("Booking submitted:", dummy);
    expect(Alert.alert).toHaveBeenCalledWith(
      "Booking Submitted",
      "Your booking has been successfully submitted!"
    );
  });
});

describe("<UserBooking /> auth setup", () => {
  it("calls getAuth(app) and subscribes via onAuthStateChanged", () => {
    render(
      <UserBooking
        route={{
          params: {
            serviceType: "Cleaning",
            subcategory: "Deep Clean",
            description: "Desc",
            price: 100,
            questions: [],
          },
        }}
        navigation={{ navigate: jest.fn() }}
      />
    );
    expect(getAuth).toHaveBeenCalledWith(app);
    expect(onAuthStateChanged).toHaveBeenCalled();
  });
});

// --- 5. Form validation schema ---
describe("Booking form validation schema", () => {
  // Recreate the schema from your Formik setup (with no dynamic questions)
  const schema = Yup.object({
    type: Yup.string().required("Type is required"),
    urgency: Yup.string().required("Urgency is required"),
    duration: Yup.number().required("duration is required"),
    availability: Yup.array().of(
      Yup.object().shape({
        date: Yup.string().required("Date is required"),
        time: Yup.string().required("Time is required"),
      })
    ),
    postcode: Yup.string()
      .matches(/^\d{5,}$/, "Postcode must be at least 5 digits")
      .test("valid-postcode", "Invalid Singapore postcode", (val) =>
        postcodes.some((p) => p.postal_code.toString() === val?.trim())
      )
      .required("Postcode is required"),
    address: Yup.string().required("Address is required"),
    // dynamicSchema empty for this test
  });

  it("rejects when all required fields are blank", async () => {
    const bad = {
      type: "",
      urgency: "",
      duration: null,
      availability: [{ date: "", time: "" }],
      postcode: "",
      address: "",
    };
    await expect(schema.validate(bad)).rejects.toThrow();
  });

  it("catches each individual field error", async () => {
    await expect(schema.validateAt("type", { type: "" })).rejects.toThrow(
      "Type is required"
    );
    await expect(schema.validateAt("urgency", { urgency: "" })).rejects.toThrow(
      "Urgency is required"
    );
    await expect(
      schema.validateAt("duration", { duration: null })
    ).rejects.toThrow("duration is required");
    await expect(
      schema.validateAt("availability[0].date", {
        availability: [{ date: "", time: "12:00" }],
      })
    ).rejects.toThrow("Date is required");
    await expect(
      schema.validateAt("availability[0].time", {
        availability: [{ date: "2025-07-23", time: "" }],
      })
    ).rejects.toThrow("Time is required");
    await expect(
      schema.validateAt("postcode", { postcode: "1234" })
    ).rejects.toThrow("Postcode must be at least 5 digits");
    // assume postcodes[0].postal_code = 123456
    await expect(
      schema.validateAt("postcode", { postcode: "999999" })
    ).rejects.toThrow("Invalid Singapore postcode");
    await expect(
      schema.validateAt("postcode", {
        postcode: String(postcodes[0].postal_code),
      })
    ).resolves.toBeDefined();
    await expect(schema.validateAt("address", { address: "" })).rejects.toThrow(
      "Address is required"
    );
  });
});
