export function checkApiKey(headers: Headers): boolean {
  const secret = headers.get('x-api-secret');
  return secret === process.env.API_SECRET_KEY;
}
