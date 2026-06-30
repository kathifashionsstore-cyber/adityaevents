# Adithya Event Management System

Premium, production-ready full-stack event management and catering application built for **Adithya Event Management** in Vijayawada, Krishna District, Andhra Pradesh, India.

---

## Technical Architecture

*   **Core Framework**: React.js with extended CRACO (Tailwind CSS configuration support)
*   **Styling Engine**: Tailwind CSS & custom design system CSS (Royal theme variables, Glassmorphism, animations)
*   **Database & Operations**: Firebase Suite (Authentication, Firestore document rules, Cloud Storage rules, Analytics, and asia-south1 Cloud Functions)
*   **Payment Gateway Integration**: Razorpay Web Checkout SDK
*   **Tooling & Reports**: `jspdf` & `jspdf-autotable` invoice billing generators

---

## Installation & Setup

1.  **Clone / Prepare Directory**:
    Navigate to the project root:
    ```bash
    cd adithya-event-management
    ```

2.  **Install Node Modules**:
    Install dependencies using:
    ```bash
    npm install
    ```

3.  **Environment Credentials**:
    Ensure the `.env` file is initialized at the root containing Firebase values:
    ```env
    REACT_APP_FIREBASE_API_KEY=AIzaSy...
    REACT_APP_FIREBASE_AUTH_DOMAIN=adithyaevents-a6140.firebaseapp.com
    REACT_APP_FIREBASE_PROJECT_ID=adithyaevents-a6140
    REACT_APP_FIREBASE_STORAGE_BUCKET=adithyaevents-a6140.firebasestorage.app
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID=202241262091
    REACT_APP_FIREBASE_APP_ID=1:202241262091:web:a418b19a7e4ae1e6acfd0e
    REACT_APP_FIREBASE_MEASUREMENT_ID=G-9Z6C91736V
    REACT_APP_RAZORPAY_KEY_ID=rzp_test_adithya17676
    ```

4.  **Local Testing**:
    Start the local development server:
    ```bash
    npm start
    ```

5.  **Build production package**:
    Verify clean compilation by compiling assets:
    ```bash
    npm run build
    ```

6.  **Deploying Firebase Rules & Triggers**:
    Install Firebase CLI globally and execute deploy calls:
    ```bash
    npm run deploy
    ```
