const required = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable ${key}`);
  }
  return value;
};

export class Config {
  static readonly apiUrl = required("REACT_APP_API_URL");

  static readonly googleClientId = required("REACT_APP_GOOGLE_CLIENT_ID");
}
