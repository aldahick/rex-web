import React from "react";

export interface Settings {
  theme: "light" | "dark";
}

const SETTINGS_KEY = "rex.settings";
const DEFAULT_SETTINGS: Settings = {
  theme: "light",
};

export const SettingsContext = React.createContext<Settings>(DEFAULT_SETTINGS);

let settings: Settings = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "false") || DEFAULT_SETTINGS;

export const setSettings = (newSettings: Settings) => {
  settings = newSettings;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
  console.log("new settings", newSettings);
};

export const SettingsProvider: React.FC = ({ children }) => (
  <SettingsContext.Provider value={settings || DEFAULT_SETTINGS}>
    {children}
  </SettingsContext.Provider>
);
