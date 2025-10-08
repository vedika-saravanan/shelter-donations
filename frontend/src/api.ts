export interface Donation {
  id?: number;
  donor_name: string;
  donation_type: string;
  amount: number;
  date: string;
}

// Base API URL
const BASE_URL = "http://127.0.0.1:8000";

/**
 * Fetch all donations
 */
export async function getDonations(): Promise<Donation[]> {
  const response = await fetch(`${BASE_URL}/donations/`);
  if (!response.ok) {
    throw new Error("Failed to fetch donations");
  }
  return response.json();
}

/**
 * Add a new donation
 */
export async function addDonation(donation: {
  donor_name: string;
  amount: number;
  donation_type: string;
}): Promise<Donation> {
  // Generate today's date (YYYY-MM-DD)
  const today = new Date().toISOString().split("T")[0];

  const response = await fetch(`${BASE_URL}/donations/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...donation,
      date: today, // include required date field
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to save donation");
  }

  return response.json();
}

/**
 * Delete a donation by ID
 */
export async function deleteDonation(id: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/donations/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete donation");
  }
}
