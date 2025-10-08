/**
 * DonationForm.tsx
 * -----------------
 * A simple React component for collecting donation details.
 * 
 * This component allows a user to enter their name and a donation amount,
 * then displays an alert summarizing the entered details upon form submission.
 */

import React, { useState } from "react";

/**
 * Functional React component that renders a donation form.
 * 
 * @returns {JSX.Element} The rendered donation form UI.
 */
export default function DonationForm() {
  /** Donor's name input value */
  const [name, setName] = useState("");

  /** Donation amount input value */
  const [amount, setAmount] = useState("");

  /**
   * Handles form submission.
   * Prevents page reload and displays a confirmation alert
   * showing the donor name and amount donated.
   * 
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Donor: ${name}, Amount: $${amount}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Donor Name:</label>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <label>Amount:</label>
      <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <button type="submit">Donate</button>
    </form>
  );
}
