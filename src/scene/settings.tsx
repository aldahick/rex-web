import React, { useContext } from "react";
import { MenuItem, Select } from "@material-ui/core";
import { setSettings, Settings, SettingsContext } from "../component/Settings";
import { Grids } from "../component/util/Grids";

export const SettingsScene: React.FC = () => {
  const settings = useContext(SettingsContext);

  const onSettingsChange = <Key extends keyof Settings>(key: Key, value: Settings[Key]) => {
    setSettings({
      ...settings,
      [key]: value,
    });
  };

  return (
    <Grids justify="center">
      <Select label="Theme" value={settings.theme} onChange={evt => onSettingsChange("theme", evt.target.value as any)}>
        <MenuItem value="light">Light</MenuItem>
        <MenuItem value="dark">Dark</MenuItem>
      </Select>
    </Grids>
  );
};
