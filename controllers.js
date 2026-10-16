// --- Store in Memory
let weeklyContributionPesewas = Math.round(50.0 * 100);
let currentWeek = 1;
let isStarted = false;
const members = []; // Array of { id, name }
const currentWeekPayments = {};
const payoutHistory = [];

members.push(
  { id: "1", name: "Ama" },
  { id: "2", name: "Kofi" },
  { id: "3", name: "Esi" },
);

exports.addMember = (req, res) => {
  try {
    const { id, name } = req.body;
    const cleanedId = String(id || "").trim();
    const cleanedName = String(name || "").trim();

    if (isStarted) {
      return res.status(400).json({
        error: "Cannot add members after the Susu cycle has started.",
      });
    }
    if (!cleanedId || !cleanedName) {
      return res.status(400).json({ error: "ID and Name cannot be empty." });
    }
    if (members.some((m) => m.id.toLowerCase() === cleanedId.toLowerCase())) {
      return res
        .status(400)
        .json({ error: `A member with ID '${id}' already exists.` });
    }

    members.push({ id: cleanedId, name: cleanedName });
    currentWeekPayments[cleanedId] = 0;

    res
      .status(201)
      .json({ message: `Member ${cleanedName} added successfully.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.recordPayment = (req, res) => {
  try {
    const { memberId, amount } = req.body;
    const targetId = String(memberId || "").trim();
    const parsedAmount = parseFloat(amount);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res
        .status(400)
        .json({ error: "Payment amount must be a number greater than zero." });
    }

    const member = members.find(
      (m) => m.id.toLowerCase() === targetId.toLowerCase(),
    );
    if (!member) {
      return res
        .status(400)
        .json({ error: `Member with ID '${memberId}' not found.` });
    }

    isStarted = true; // Lock roster upon first active payment activity

    const amountPesewas = Math.round(parsedAmount * 100);
    const alreadyPaid = currentWeekPayments[member.id];
    const remainingOwed = weeklyContributionPesewas - alreadyPaid;

    if (amountPesewas > remainingOwed) {
      const remainingGhs = (remainingOwed / 100).toFixed(2);
      return res.status(400).json({
        error: `Overpayment rejected. Member owes ${remainingGhs} GHS.`,
      });
    }

    currentWeekPayments[member.id] += amountPesewas;
    res.status(200).json({ message: "Payment recorded successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
