/**
 * App.tsx
 * --------
 * Main React component for the Shelter Donations full-stack web application.
 * 
 * Features:
 *  - Displays donation input form and a list of all recorded donations.
 *  - Allows users to add, edit, or delete donations.
 *  - Supports anonymous donations.
 *  - Shows categorized totals (money, food, clothing, supplies).
 *  - Includes a demo Admin Mode toggle for restricted CRUD visibility.
 * 
 * Notes:
 *  - The component communicates with a FastAPI backend via REST API.
 *  - All donation data is persisted in the backend (SQLite database).
 */

import React, { useState, useEffect } from "react";
import "./App.css";
import { getDonations, addDonation, deleteDonation, Donation } from "./api";

/**
 * Root component for the Shelter Donations frontend.
 * 
 * @returns {JSX.Element} A complete single-page donation management interface.
 */
function App() {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("money");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [anonymous, setAnonymous] = useState(false);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  /** Fetch all donations from backend on first render */
  useEffect(() => {
    fetchDonations();
  }, []);

  /**
   * Fetches donation list from the backend and updates state.
   */
  const fetchDonations = async () => {
    try {
      const data = await getDonations();
      setDonations(data.reverse()); // show latest first
    } catch (error) {
      console.error("Error fetching donations:", error);
    }
  };

  /**
   * Handles donation form submission — adds or updates a donation record.
   * 
   * @param {React.FormEvent} e - Form submit event.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const donorName = anonymous ? "Anonymous Spirit 👻" : name;

    try {
      if (editId) {
        // Update existing donation
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
        // Create new donation
        await addDonation({
          donor_name: donorName,
          donation_type: type,
          amount: Number(amount),
        });
      }

      // Reset form fields and refresh list
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

  /**
   * Loads donation data into form for editing.
   * 
   * @param {Donation} donation - Donation object to be edited.
   */
  const handleEdit = (donation: Donation) => {
    setEditId(donation.id!);
    setName(donation.donor_name.includes("Anonymous") ? "" : donation.donor_name);
    setAmount(donation.amount.toString());
    setType(donation.donation_type);
    setDate(donation.date);
    setAnonymous(donation.donor_name.includes("Anonymous"));
  };

  /**
   * Deletes a donation from backend after user confirmation.
   * 
   * @param {number} id - Donation record ID.
   */
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this donation?")) return;
    try {
      await deleteDonation(id);
      fetchDonations();
    } catch {
      alert("Failed to delete donation.");
    }
  };

  /**
   * Computes total donations grouped by type (money, food, etc.).
   */
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

  /** Helper for pluralizing units (meal → meals, box → boxes) */
  const pluralize = (count: number, singular: string, plural: string) =>
    count === 1 ? singular : plural;

  // ---------------------------------------------------------------------------
  // UI Rendering
  // ---------------------------------------------------------------------------
  return (
    <div className="container">
      <h1>
        <span className="emoji">🕸️</span> Shelter Donations <span className="emoji">🦇</span>
      </h1>
      <p className="spooky-banner">Spreading kindness this Halloween 🎃🧡</p>

      {/* 💰 Totals Summary */}
      <div className="totals-container">
        <p className="total-banner">💰 Money raised: ${moneyTotal.toLocaleString()}</p>
        <p className="total-banner">🍖 Meals donated: {foodTotal}</p>
        <p className="total-banner">👕 Clothing items: {clothingTotal}</p>
        <p className="total-banner">🎁 Supply boxes: {suppliesTotal}</p>
      </div>

      {/* 🎩 Admin Mode Toggle */}
      <button
        className={`admin-toggle ${isAdmin ? "enabled" : ""}`}
        onClick={() => setIsAdmin(!isAdmin)}
      >
        {isAdmin ? "🔒 Admin Mode: ON" : "🔓 Admin Mode: OFF"}
      </button>

      {/* 📝 Donation Form */}
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

      {/* 🕯️ Donation List */}
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
