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

### 2. Record a Member Payment

- **URL:** `/api/susu/payments`
- **Method:** `POST`
- **Headers:** `Content-Type: application/json`
- **Body Parameters:**
  - `memberId` (String) - Unique identifier of the member.
  - `amount` (Number) - The amount paid in GHS (e.g., `50` or `30.50`).

### 3. Close Current Week

- **URL:** `/api/susu/weeks/close`
- **Method:** `POST`
- **Description:** Audits the current week. If debts remain, it drops a `400` error listing outstanding balances. If clear, it disburses the pot to the next rotation member and advances the calendar week.

### 4. View Report Status

- **URL:** `/api/susu/report`
- **Method:** `GET`
- **Description:** Retrieves the current week, payment statuses, and payout history.

# End-to-End Walkthrough (Executing the Assignment Example)

You can copy and paste these commands into your terminal (Git Bash, macOS Terminal, or Linux Shell) to test the exact assignment workflow:

### Step 1: Check baseline initialization

```bash
curl http://localhost:3000/api/susu/report
```

### Step 2: Record Week 1 Payments

Ama and Kofi pay 50.00 GHS in full. Esi makes a partial payment of 30.00 GHS.

```bash
 POST -H "Content-Type: application/json" -d '{"memberId": "1", "amount": 50}' http://localhost:3000/api/susu/payments
POST -H "Content-Type: application/json" -d '{"memberId": "2", "amount": 50}' http://localhost:3000/api/susu/payments
 POST -H "Content-Type: application/json" -d '{"memberId": "3", "amount": 30}' http://localhost:3000/api/susu/payments
```

### Step 3: Attempt to close Week 1 (Expected Failure)

This will fail and explicitly output that Esi owes 20.00 GHS.

```bash
POST http://localhost:3000/api/susu/weeks/close
```

### Step 4: Esi pays her remaining 20.00 GHS balance

```bash
 POST -H "Content-Type: application/json" -d '{"memberId": "3", "amount": 20}' http://localhost:3000/api/susu/payments
```

### Step 5: Close Week 1 (Expected Success)

This will successfully distribute the 150.00 GHS pot to **Ama** (the first member who joined) and transition the environment to Week 2.

```bash
 POST http://localhost:3000/api/susu/weeks/close
```

### Step 6: Review Payout Logs and Final Status

Verify that Week 2 is active and that Ama's payout is logged in the history array.

```bash
 http://localhost:3000/api/susu/report
```
