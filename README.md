# Rotating Savings Group (Susu) Management API

A lightweight, modular, and functional Express.js API designed to manage a single rotating savings group (Susu/Chama). This project uses pure JavaScript functional programming patterns and closures for state containment, ensuring data isolation without using classes.

To prevent binary floating-point rounding errors (`0.1 + 0.2 !== 0.3`), all monetary operations are processed internally as integer **Pesewas** (cents) and formatted back to decimals before being sent to the client.

---

## Architectural Assumptions & Rules

1. **Roster Locking:** Members can only be added before the first payment is recorded. Once the cycle starts, the roster is locked to protect the rotation sequence.
2. **Strict Current Week Tracking:** Payments are only accepted toward the current week's target balance. Advance payments for future weeks are rejected.
3. **Sequential Closure:** The group cannot advance to the next week until all outstanding debts for the current week are fully settled.
4. **Pre-seeded Data:** The application automatically initializes with the 3 members from the assignment example (**Ama**, **Kofi**, and **Esi**) with a fixed weekly contribution of **50.00 GHS**.

---

## Getting Started

### 1. Prerequisites

Ensure you have [Node.js](https://nodejs.org) installed on your machine.

### 2. Dependency Installation

Navigate to your project root folder (`Chamaa`) in your terminal and run:

```bash
# Initialize project configuration
npm init -y

# Install production dependencies
npm install express

# Install development auto-reloader (Optional)
npm install --save-dev nodemon
```

### 3. Run the Server

Add the following scripts to your `package.json` file:

```json
"scripts": {
  "start": "node app.js",
  "dev": "nodemon app.js"
}
```

Now, launch the API:

```bash
npm run dev
```

The server will start running at `http://localhost:3000`.

---

## API Endpoints Reference

### 1. View Report Status

- **URL:** `/api/susu/report`
- **Method:** `GET`
- **Description:** Retrieves the current week, payment statuses, and payout history.

### 2. Record a Member Payment

- **URL:** `/api/susu/payments`
- **Method:** `POST`
- **Headers:** `Content-Type: application/json`
- **Body Parameters:**
  - `memberId` (String) - Unique identifier of the member.
  - `amount` (Number) - The amount paid in GHS (e.g., `50` or `30.50`).

### 1. Register a New Member (Before Week 1 Starts Only)

- **URL:** `/api/susu/member`
- **Method:** `POST`
- **Headers:** `Content-Type: application/json`
- **Body Parameters:**
  - `id` (String) - Unique ID for the member.
  - `name` (String) - Name of the individual.
