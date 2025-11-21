export async function fetchCategory() {
  const response = await fetch("/categories");
  const data = await response.json();

  if (!response.ok) {
    throw new Error("Error fetching categories");
  }
  return data;
}
