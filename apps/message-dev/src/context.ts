export async function getUserFromToken(token: string) {
  const payload = token.split('.')[1];
  const parsed = JSON.parse(atob(payload));
  return parsed as {
    email: string;
    userId: string;
  };
}
