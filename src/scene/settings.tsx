import React, { useEffect, useState } from "react";
import { MenuItem, Select } from "@material-ui/core";
import * as _ from "lodash";
import { Grids } from "../component/util/Grids";
import { useStores } from "../hook/useStores";
import { Settings } from "../store/SettingsStore";
import { useStatusMessages } from "../util/statusMessages";

export const SettingsScene: React.FC = () => {
  const { settingsStore } = useStores();
  const statusMessages = useStatusMessages();
  const [internalSettings, setInternalSettings] = useState<Settings>(settingsStore.settings);

  const onSettingsChange = <Key extends keyof Settings>(key: Key, value: Settings[Key]) => {
    setInternalSettings({
      ...internalSettings,
      [key]: value,
    });
  };

  useEffect(() => {
    const hasChanges = !_.isEqual(settingsStore.settings, internalSettings);
    settingsStore.setSettings(internalSettings);
    if (hasChanges) {
      statusMessages.setSuccessMessage("Applied new settings. You may have to reload the page.");
    }
  }, [internalSettings, settingsStore, statusMessages]);

  return (
    <Grids justify="center">
      {statusMessages.render()}
      <Select label="Theme" value={internalSettings.theme} onChange={evt => onSettingsChange("theme", evt.target.value as any)}>
        <MenuItem value="light">Light</MenuItem>
        <MenuItem value="dark">Dark</MenuItem>
      </Select>
    </Grids>
  );
};
