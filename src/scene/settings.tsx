import React, { useContext, useEffect, useState } from "react";
import { MenuItem, Select } from "@material-ui/core";
import * as _ from "lodash";
import { setSettings, Settings, SettingsContext } from "../component/Settings";
import { Grids } from "../component/util/Grids";
import { useStatusMessages } from "../util/statusMessages";

export const SettingsScene: React.FC = () => {
  const statusMessages = useStatusMessages();
  const settings = useContext(SettingsContext);
  const [internalSettings, setInternalSettings] = useState<Settings>(settings);

  const onSettingsChange = <Key extends keyof Settings>(key: Key, value: Settings[Key]) => {
    setInternalSettings({
      ...internalSettings,
      [key]: value,
    });
  };

  useEffect(() => {
    const hasChanges = !_.isEqual(settings, internalSettings);
    setSettings(internalSettings);
    if (hasChanges) {
      statusMessages.setSuccessMessage("Applied new settings. You may have to reload the page.");
    }
  }, [internalSettings]);

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
