import React, { useState, useEffect } from "react";
import "./App.css";
import { getDonations, addDonation, deleteDonation, Donation } from "./api";

function App() {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("money");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [anonymous, setAnonymous] = useState(false);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const data = await getDonations();
      setDonations(data.reverse());
    } catch (error) {
      console.error("Error fetching donations:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const donorName = anonymous ? "Anonymous Spirit 👻" : name;

    try {
      if (editId) {
        await fetch(`http://127.0.0.1:8000/donations/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            donor_name: donorName,
            donation_type: type,
            amount: Number(amount),
            date,
          }),
        });
        setEditId(null);
      } else {
        await addDonation({
          donor_name: donorName,
          donation_type: type,
          amount: Number(amount),
        });
      }
      setName("");
      setAmount("");
      setType("money");
      setAnonymous(false);
      setDate(new Date().toISOString().split("T")[0]);
      fetchDonations();
    } catch {
      alert("Something went wrong saving your donation.");
    }
  };

  const handleEdit = (donation: Donation) => {
    setEditId(donation.id!);
    setName(donation.donor_name.includes("Anonymous") ? "" : donation.donor_name);
    setAmount(donation.amount.toString());
    setType(donation.donation_type);
    setDate(donation.date);
    setAnonymous(donation.donor_name.includes("Anonymous"));
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this donation?")) return;
    try {
      await deleteDonation(id);
      fetchDonations();
    } catch {
      alert("Failed to delete donation.");
    }
  };

  // ✅ Compute totals by category
  const totals = donations.reduce(
    (acc, d) => {
      const type = d.donation_type.toLowerCase();
      acc[type] = (acc[type] || 0) + d.amount;
      return acc;
    },
    {} as Record<string, number>
  );

  const moneyTotal = totals["money"] || 0;
  const foodTotal = totals["food"] || 0;
  const clothingTotal = totals["clothing"] || 0;
  const suppliesTotal = totals["supplies"] || 0;

  // Helper for pluralization
  const pluralize = (count: number, singular: string, plural: string) =>
    count === 1 ? singular : plural;

  return (
    <div className="container">
      <h1>
        <span className="emoji">🕸️</span> Shelter Donations <span className="emoji">🦇</span>
      </h1>
      <p className="spooky-banner">Spreading kindness this Halloween 🎃🧡</p>

      {/* ✅ Totals Section */}
      <div className="totals-container">
        <p className="total-banner">💰 Money raised: ${moneyTotal.toLocaleString()}</p>
        <p className="total-banner">🍖 Meals donated: {foodTotal}</p>
        <p className="total-banner">👕 Clothing items: {clothingTotal}</p>
        <p className="total-banner">🎁 Supply boxes: {suppliesTotal}</p>
      </div>

      {/* 🎩 Admin Toggle */}
      <button
        className={`admin-toggle ${isAdmin ? "enabled" : ""}`}
        onClick={() => setIsAdmin(!isAdmin)}
      >
        {isAdmin ? "🔒 Admin Mode: ON" : "🔓 Admin Mode: OFF"}
      </button>

      <form onSubmit={handleSubmit}>
        <label>Donor Name:</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={anonymous}
          placeholder={anonymous ? "Anonymous Spirit 👻" : ""}
          required={!anonymous}
        />

        <label>Donation Type:</label>
        <select value={type} onChange={(e) => setType(e.target.value)} required>
          <option value="money">💰 Money</option>
          <option value="food">🍖 Food</option>
          <option value="clothing">👕 Clothing</option>
          <option value="supplies">🎁 Supplies</option>
        </select>

        <label>Amount/Quantity:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <label>Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <div className="checkbox-group">
          <input
            type="checkbox"
            checked={anonymous}
            onChange={() => setAnonymous(!anonymous)}
          />
          <label>Make my donation anonymous 🕯️</label>
        </div>

        <button type="submit">{editId ? "Update Donation" : "Donate"}</button>
      </form>

      <h2>🕯️ Recent Donations</h2>
      <div className="donations-list">
        {donations.length > 0 ? (
          donations.map((donation) => (
            <div
              key={donation.id}
              className={`donation-item ${
                donation.donor_name.includes("Anonymous") ? "anonymous" : ""
              }`}
            >
              💸 {donation.donor_name}{" "}
              {donation.donation_type.toLowerCase() === "money" ? (
                <>
                  donated <strong>${donation.amount}</strong> on {donation.date}
                </>
              ) : donation.donation_type.toLowerCase() === "food" ? (
                <>
                  donated{" "}
                  <strong>
                    {donation.amount} {pluralize(donation.amount, "meal", "meals")} of food 🍖
                  </strong>{" "}
                  on {donation.date}
                </>
              ) : donation.donation_type.toLowerCase() === "clothing" ? (
                <>
                  donated{" "}
                  <strong>
                    {donation.amount}{" "}
                    {pluralize(donation.amount, "piece", "pieces")} of clothing 👕
                  </strong>{" "}
                  on {donation.date}
                </>
              ) : (
                <>
                  donated{" "}
                  <strong>
                    {donation.amount}{" "}
                    {pluralize(donation.amount, "box", "boxes")} of supplies 🎁
                  </strong>{" "}
                  on {donation.date}
                </>
              )}
              {isAdmin && (
                <div className="actions">
                  <button onClick={() => handleEdit(donation)}>✏️ Edit</button>
                  <button onClick={() => handleDelete(donation.id!)}>🗑️ Delete</button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No donations yet. The spirits await...</p>
        )}
      </div>
    </div>
  );
}

export default App;
