import { singleton } from "tsyringe";

const required = (key: string): string => {
  const value = process.env[`REACT_APP_${key}`] ?? document.body.getAttribute(`env-${key.split("_").join("-").toLowerCase()}`);
  if (typeof value !== "string") {
    throw new Error(`Missing environment variable ${key}`);
  }
  return value;
};

@singleton()
export class ConfigService {
  apiUrl = required("API_URL");

  baseUrl = required("BASE_URL");

  googleClientId = required("GOOGLE_CLIENT_ID");
}
