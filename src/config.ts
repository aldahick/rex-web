const optional = (key: string): string | undefined => process.env[key];

const required = (key: string): string => {
  const value = optional(key);
  if (value === undefined) {
    throw new Error(`Missing environment variable ${key}`);
  }
  return value;
};

export const config = {
  apiUrl: required("REACT_APP_API_URL"),
  baseUrl: required("REACT_APP_BASE_URL"),
  googleClientId: optional("REACT_APP_GOOGLE_CLIENT_ID")
};
