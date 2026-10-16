// --- Store in Memory
let weeklyContributionPesewas = Math.round(50.0 * 100);
let currentWeek = 1;
let isStarted = false;
const members = []; // Array of { id, name }
const currentWeekPayments = {};
const payoutHistory = [];

members.push();

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
