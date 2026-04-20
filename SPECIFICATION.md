
# GB Borrowers - Application Specification

## 1. Project Overview
**GB Borrowers** is a web-based lending application designed to facilitate instant loans against personal assets (Electronics and Vehicles). The application streamlines the borrowing process by using AI to provide instant asset valuation and eligibility checks, allowing users to configure their loan terms before connecting with lenders.

## 2. Tech Stack
*   **Frontend Framework:** React 19
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **Icons:** Lucide React
*   **AI/Backend Service:** Google Gemini API (`gemini-2.5-flash`) via Client-side SDK
*   **Database:** Supabase (PostgreSQL)
*   **Font:** Inter (Google Fonts)

## 3. User Flow & Navigation
The application operates as a Single Page Application (SPA) with a linear wizard flow managed by a state machine (`AppStep`).

1.  **Landing Page:** Introduction, Value Props, Entry Point.
2.  **Login/Sign Up:**
    *   **Sign Up:** Name, City, Email, Mobile. Generates a City-based Custom ID (e.g., V101).
    *   **Login:** Name OR Custom ID + Mobile.
3.  **Asset Selection:** Categorizing the collateral.
4.  **Asset Details:** Collecting specific data points.
5.  **AI Valuation:** Loading state while processing.
6.  **Loan Calculator:** Customizing loan terms based on valuation limits.
7.  **Success:** Confirmation and reset.

## 4. Functional Requirements

### 4.1. Landing Page
*   **Header:** Sticky header with Logo (GB Borrowers), Navigation Links (About, How it Works, Services), and a conditional Login button.
*   **Hero Section:** High-impact visual with "Get Started" CTA.
*   **About/Features Section:** Three key value propositions:
    *   Secure Storage
    *   Fast Processing
    *   High LTV (Loan-to-Value) Ratio.

### 4.2. User Identification
*   **Sign Up Fields:**
    *   Name (Text)
    *   City (Select: Anantapur, Vizag, Bangalore)
    *   Email (Text)
    *   Mobile (Text, 10 digits)
*   **ID Generation Logic:**
    *   Format: `{CityInitial}{Sequence}` (e.g., V101, A102, B103).
    *   Sequence is global and increments for every new user.
*   **Login Fields:**
    *   Identifier: Name OR Custom ID (case-insensitive).
    *   Mobile: Must match the registered record.

### 4.3. Asset Selection
*   **UI Layout:** Two large interactive cards (Electronics, Vehicles).
*   **Interaction:**
    *   **Desktop:** Hovering over a card reveals sub-category options.
    *   **Mobile:** Cards display options immediately or on tap.
*   **Categories:**
    *   **Electronics:** Mobile Phones, Laptops.
    *   **Vehicles:** Two Wheeler (Bike), Four Wheeler (Car).

### 4.4. Asset Details & Valuation
*   **Dynamic Form:** Fields change based on selection.
    *   *Electronics:* Brand, Model, Condition (New/Like New/Good/Fair).
    *   *Vehicles:* Make/Brand, Model, Year, Mileage/Engine CC.
*   **AI Integration:**
    *   **Model:** `gemini-2.5-flash`
    *   **Input:** Structured asset data.
    *   **Output:** JSON Object containing `estimatedValue` (INR), `maxLoanAmount`, `message`, and `isEligible` boolean.

### 4.5. Loan Calculator
*   **Pre-requisite:** User must be marked `isEligible: true` by the AI.
*   **Inputs:**
    *   **Amount:** Slider range (Min: ₹1,000, Max: `valuation.maxLoanAmount`).
    *   **Duration:** Numeric input + Unit dropdown (Weeks, Months, Years).
*   **Financial Logic:**
    *   **Interest Rate:** Flat 12% per annum.
    *   **Platform Fee:** 2% of loan amount (Minimum ₹500).
    *   **Total Repayment:** Loan Amount + Interest + Platform Fee.
*   **Display:** Real-time updates of costs as inputs change.

### 4.6. Success/Submission
*   **Action:** Displays confirmation modal.
*   **Data Handling:** Submits application to Supabase `loan_applications` table.
*   **Reset:** Option to return to Dashboard.

## 5. Database Schema (Supabase)

### Table: `borrowers`
| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | uuid | Primary Key |
| `name` | text | Borrower Name |
| `mobile` | text | Unique, 10 digits |
| `city` | text | Selected City |
| `email` | text | Borrower Email |
| `custom_id` | text | Generated ID (e.g., V101) |

### Table: `loan_applications`
| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | uuid | Primary Key |
| `borrower_id` | uuid | FK to borrowers |
| `borrower_name` | text | Redundant for easy access |
| `category` | text | Asset Category |
| `sub_category` | text | Asset Sub-Category |
| `total_repayment` | numeric | Final calculated amount |
| `status` | text | Default 'submitted' |
| `specs` | jsonb | Full asset details |

## 6. UI/Design System
*   **Primary Color:** Violet (`bg-violet-600`, `text-violet-900`) & Orange Accents.
*   **Backgrounds:** Light Gray (`bg-gray-50`) for content, White for cards.
*   **Typography:** 'Inter', clean sans-serif. 'Playfair Display' for headings.
*   **Components:** Rounded corners (`rounded-2xl`), deep shadows (`shadow-xl`) for depth, blur effects (`backdrop-blur`) on overlays.
