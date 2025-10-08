import React, { useState } from "react";

export default function DonationForm() {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

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
