export async function fetchUsers() {
  const response = await fetch("/users");
  const users = await response.json();

  if (!response.ok) {
    throw new Error("Error fetching Users");
  }
  return users || [];
}
