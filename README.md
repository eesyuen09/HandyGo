# HandyGo — NUS Orbital 2025 (Artemis Level)

### A Dual-Interface Home Services Platform with Service Matching & AI-Powered Pricing

---
## 🎬 Project Demo Video

🎥 **Watch our full walkthrough demo here:**  
👉 [HandyGo — Project Demo](https://drive.google.com/file/d/194yh-NreoSWhsyaDiseNhLr-zilSyqFd/view?usp=drive_link)

> The demo showcases both **Client** and **Worker** interfaces, including real-time booking flow, service matching logic, and AI-powered dynamic pricing.
---

## 🧩 Short Description

**HandyGo** is a full-stack mobile platform that connects **clients** with **service providers** for home and repair tasks such as cleaning, plumbing, and electrical work.  
It streamlines booking, improves transparency, and empowers workers to manage their schedules and earnings efficiently — all within one integrated app.

---

## 👥 Target User Profile

| User Type | Description | Needs Addressed |
|------------|--------------|----------------|
| **Clients** | Homeowners, tenants, or students seeking on-demand services | Reliable service discovery, transparent pricing, secure bookings |
| **Service Providers (Workers)** | Independent professionals or small business owners | Efficient job matching, task tracking, earnings analytics |

---

## 💡 Value Proposition

| Challenge | HandyGo’s Solution |
|------------|------------------|
| Fragmented and unreliable service listings | Unified booking platform with verified service providers |
| Unclear and inconsistent pricing | Real-time AI-powered price estimation |
| Scheduling conflicts | Smart task and booking management system |
| Limited visibility for workers | Earnings analytics, review system, and worker profile dashboard |

> HandyGo bridges the gap between **clients seeking convenience** and **workers seeking opportunity**, creating a transparent and efficient service ecosystem.

---

## 📚 Table of Contents
1. [How to Run the Project](#%EF%B8%8F-how-to-run-the-project)
2. [Features](#-features)
   - [Client Interface](#-client-interface)
   - [Business/Worker Interface](#-businessworker-interface)
3. [Technology Used](#-technology-used)
4. [Screenshots](#-screenshots)
5. [Example Use Case](#-example-use-case)

---

## ⚙️ How to Run the Project

### Option 1: Android Emulator
1. Install [Android Studio](https://developer.android.com/studio).
2. **Download the APK** from the provided link:  
   👉 [Download HandyGo APK](https://drive.google.com/file/d/1EasRKC1fAjzn_qIKyS9JYOngRd6OB2vT/view)  
3. Open **Device Manager → Create Virtual Device → Select Pixel 6 / Android 13**.  
4. Start the emulator and drag the `handygo.apk` file into it.  
5. The app installs automatically.  

### Option 2: Android Phone
1. **Enable Unknown App Installs**  
   - Settings → Apps → Special App Access → Install Unknown Apps.  
2. **Download the APK** from the provided link:  
   👉 [Download HandyGo APK](https://drive.google.com/file/d/1EasRKC1fAjzn_qIKyS9JYOngRd6OB2vT/view) 
3. Open the `.apk` file and install HandyGo.  

---

## 🚀 Features

### 👤 Client Interface
| Category | Description |
|-----------|--------------|
| **Account Management** | Secure Firebase authentication with email verification and password reset. |
| **Service Browsing** | Explore categorized services with subcategories and recommended listings. |
| **Booking System** | Dynamic form validation using Formik + Yup, real-time slot checking, and instant confirmation. |
| **Price Estimation** | AI-powered price predictions based on duration, urgency, and demand factors. |
| **Booking History** | Track all current, completed, and past services. |
| **Reviews & Ratings** | Leave ratings (1-5⭐) and comments; reviews update worker reputation metrics. |

---

### 🧰 Business/Worker Interface
| Category | Description |
|-----------|--------------|
| **Worker Registration** | Submit NRIC, address, and service categories securely. |
| **Task Management** | View, accept, or reject bookings in real time. |
| **Schedule Control** | Prevent double-booking via time-slot collision detection. |
| **Earnings Dashboard** | Track daily and monthly income with visual analytics (charts). |
| **Performance Insights** | AI-generated summaries using OpenAI API for self-improvement. |

---

### 🔗 Service Matching
- Matches clients to available workers based on **subcategory** and **time slot availability**.  
- Uses Firestore query filters to ensure **real-time consistency** and prevent overlap.  

### 🤖 AI-Powered Dynamic Pricing
- Uses **XGBoost** regression to predict fair market rates for each service request.  
- Input features include duration, urgency, worker rating, and historical data.  
- Deployed via **Flask REST API**, providing instant price feedback to the client.  

---

## 🧱 Technology Used

| Layer | Technology |
|--------|-------------|
| **Frontend** | React Native (Expo), Formik, Yup |
| **Backend** | Firebase Firestore, Authentication, Cloud Functions |
| **Machine Learning** | Python (XGBoost, Pandas, NumPy, Flask) |
| **DevOps** | GitHub Actions, Expo EAS |
| **Testing** | Jest (JS), Pytest (Python) |
| **Design & Analytics** | Figma, Firebase Analytics, OpenAI API |

---

## 🖼️ Screenshots

## 🖼️ Screenshots

> Representative app screenshots showcasing both Client and Worker interfaces.

| Client Home | Worker Dashboard |
|--------------|------------------|
| <img src="https://github.com/user-attachments/assets/502d7fd4-0bc7-49cf-ac5d-8572d106df24" alt="Client Home" width="250" height="550"> | <img src="https://github.com/user-attachments/assets/6adb98dc-b0ef-4e70-9aff-bef59a8d19a7" alt="Worker Dashboard" width="205" height="502"> |

| Booking Flow | Earnings Analytics | Schedule Tracking |
|---------------|--------------------|-------------------|
| <img src="https://github.com/user-attachments/assets/c0d91a40-a09d-439e-8cba-3e7c3ebfb180" alt="Booking Flow" width="208" height="461"> | <img src="https://github.com/user-attachments/assets/ae0b0c74-c3c7-4476-95db-9d788172b2e3" alt="Earnings Analytics" width="578" height="355"> | <img src="https://github.com/user-attachments/assets/9029a1ce-0c6d-4502-ab91-964794f7e63d" alt="Schedule Tracking" width="163" height="353"> |

---

## 🧠 Example Use Case

### Scenario: Urgent Air-Conditioner Repair  
1. A client opens HandyGo and selects **“Air-Conditioner Service”**.  
2. The system checks for available workers in that subcategory and displays their profiles.  
3. The client books a time slot — the ML pricing engine instantly provides an estimated rate.  
4. The selected worker receives a booking notification and confirms the task.  
5. After completion, the client rates the service, and the worker’s earnings dashboard updates automatically.  

---

## 🧾 License
© 2025 HandyGo Team — Tan Ee Syuen & Lim Kai Qing  
Developed as part of **NUS Orbital 2025 (Artemis Level)**.  

---

> *Built with precision, empathy, and innovation — HandyGo simplifies everyday services for everyone.*
