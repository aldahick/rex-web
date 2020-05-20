import React, { useEffect } from "react";

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
};

export const SettingsProvider: React.FC = ({ children }) => {
  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    console.log("stored", settings);
  }, [settings]);

  return (
    <SettingsContext.Provider value={settings || DEFAULT_SETTINGS}>
      {children}
    </SettingsContext.Provider>
  );
};
