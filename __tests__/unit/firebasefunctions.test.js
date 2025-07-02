// __tests__/unit/firebaseHelpers.unit.test.js

// Mock out Firebase SDK modules
jest.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: jest.fn(),
  sendEmailVerification: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
}));
jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  setDoc: jest.fn(),
  addDoc: jest.fn(),
  collection: jest.fn(),
  getDoc: jest.fn(),
}));
jest.mock("../../firebaseConfig", () => ({
  auth: {},
  db: {},
}));

import {
  signupWithEmail,
  sendVerificationEmail,
  createSignupUserDoc,
} from "../../screen/signup";

import {
  loginWithEmail,
  ensureEmailVerified,
  fetchUserDoc,
  createUserDoc,
} from "../../screen/login";

import { submitBooking } from "../../screen/user_booking";

describe("Firebase helper functions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Signup helpers", () => {
    it("signupWithEmail() calls createUserWithEmailAndPassword(auth, email, pass)", async () => {
      const {
        createUserWithEmailAndPassword,
        signInWithEmailAndPassword,
      } = require("firebase/auth");
      createUserWithEmailAndPassword.mockResolvedValue({ user: { uid: "x" } });

      const result = await signupWithEmail("a@b.com", "pw123");
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        expect.any(Object),
        "a@b.com",
        "pw123"
      );
      expect(result).toEqual({ user: { uid: "x" } });
    });

    it("sendVerificationEmail() calls sendEmailVerification(user)", async () => {
      const { sendEmailVerification } = require("firebase/auth");
      const fakeUser = { uid: "u1" };
      sendEmailVerification.mockResolvedValue("ok");

      const res = await sendVerificationEmail(fakeUser);
      expect(sendEmailVerification).toHaveBeenCalledWith(fakeUser);
      expect(res).toBe("ok");
    });

    it("createSignupUserDoc() calls setDoc() with correct payload", async () => {
      const { doc, setDoc, getDoc } = require("firebase/firestore");
      const mockRef = {};
      doc.mockReturnValue(mockRef);
      setDoc.mockResolvedValue();

      await createSignupUserDoc({
        uid: "u2",
        fullName: "Alice",
        email: "a@b.com",
        dob: "2000-01-01",
        role: "user",
      });

      expect(doc).toHaveBeenCalledWith(expect.any(Object), "users", "u2");
      expect(setDoc).toHaveBeenCalledWith(
        mockRef,
        expect.objectContaining({
          uid: "u2",
          fullName: "Alice",
          email: "a@b.com",
          dob: "2000-01-01",
          role: "user",
          createdAt: expect.any(String),
        })
      );
    });
  });

  describe("Login screen Firebase helpers", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("loginWithEmail calls signInWithEmailAndPassword with correct args", async () => {
      const { signInWithEmailAndPassword } = require("firebase/auth");
      const fakeCred = { user: { uid: "u1" } };
      signInWithEmailAndPassword.mockResolvedValue(fakeCred);

      const result = await loginWithEmail("a@b.com", "pw123");
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.any(Object),
        "a@b.com",
        "pw123"
      );
      expect(result).toBe(fakeCred);
    });

    it("ensureEmailVerified resolves when emailVerified=true and rejects otherwise", async () => {
      const userTrue = {
        reload: jest.fn().mockResolvedValue(),
        emailVerified: true,
      };
      await expect(ensureEmailVerified(userTrue)).resolves.toBeUndefined();
      expect(userTrue.reload).toHaveBeenCalled();

      const userFalse = {
        reload: jest.fn().mockResolvedValue(),
        emailVerified: false,
      };
      await expect(ensureEmailVerified(userFalse)).rejects.toMatchObject({
        message: "Email Not Verified",
        code: "auth/email-not-verified",
      });
    });

    it("fetchUserDoc calls doc/getDoc and returns the snapshot", async () => {
      const { doc, getDoc } = require("firebase/firestore");
      const fakeSnap = { exists: () => true, data: () => ({ foo: "bar" }) };
      getDoc.mockResolvedValue(fakeSnap);

      const snap = await fetchUserDoc("uid123");
      expect(doc).toHaveBeenCalledWith(expect.any(Object), "users", "uid123");
      expect(getDoc).toHaveBeenCalled();
      expect(snap).toBe(fakeSnap);
    });

    it("createUserDoc calls setDoc with correct payload", async () => {
      const { doc, setDoc } = require("firebase/firestore");
      const ref = {};
      doc.mockReturnValue(ref);

      const fakeUser = {
        uid: "u2",
        email: "u2@mail.com",
        displayName: "U Two",
      };
      await createUserDoc(fakeUser, "business");

      expect(doc).toHaveBeenCalledWith(expect.any(Object), "users", "u2");
      expect(setDoc).toHaveBeenCalledWith(
        ref,
        expect.objectContaining({
          uid: "u2",
          email: "u2@mail.com",
          fullName: "U Two",
          role: "business",
          createdAt: expect.any(String),
        })
      );
    });
  });

  describe("Booking helpers", () => {
    it("submitBooking() writes then merges its own ID", async () => {
      const { addDoc, collection, setDoc } = require("firebase/firestore");
      const fakeRef = { id: "b123" };
      collection.mockReturnValue("colRef");
      addDoc.mockResolvedValue(fakeRef);
      setDoc.mockResolvedValue();

      const values = { foo: "bar" };
      const ref = await submitBooking(values, "u9");

      expect(collection).toHaveBeenCalledWith(expect.any(Object), "booking");
      expect(addDoc).toHaveBeenCalledWith(
        "colRef",
        expect.objectContaining({
          foo: "bar",
          userId: "u9",
          createdAt: expect.any(Date),
        })
      );
      expect(setDoc).toHaveBeenCalledWith(
        fakeRef,
        { orderID: "b123" },
        { merge: true }
      );
      expect(ref).toBe(fakeRef);
    });
  });
});
