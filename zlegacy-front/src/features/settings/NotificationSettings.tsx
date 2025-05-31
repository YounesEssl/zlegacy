import React, { useState } from "react";
import { motion } from "framer-motion";
import { BellIcon } from "@heroicons/react/24/outline";
import Button from "../../components/ui/Button";
import type { NotificationSettings as NotificationSettingsType } from "./types";
import SettingsSection from "./components/SettingsSection";
import ToggleSwitch from "./components/ToggleSwitch";

const NotificationSettings: React.FC = () => {
  // État initial simulé - dans une vraie application, ces données viendraient d'une API
  const [settings, setSettings] = useState<NotificationSettingsType>({
    email: true,
    push: true,
    will: true,
    security: true,
    blockchain: false,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempSettings, setTempSettings] =
    useState<NotificationSettingsType>(settings);

  const handleChange = (
    key: keyof NotificationSettingsType,
    value: boolean
  ) => {
    setTempSettings({ ...tempSettings, [key]: value });
  };

  const handleSave = () => {
    // Dans une vraie application, on enverrait cette requête à une API
    setSettings(tempSettings);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempSettings(settings);
    setIsEditing(false);
  };

  // Rendu d'une option de notification
  const NotificationOption = ({
    id,
    title,
    description,
    isEnabled,
  }: {
    id: keyof NotificationSettingsType;
    title: string;
    description: string;
    isEnabled: boolean;
  }) => (
    <div className="flex items-center justify-between py-3">
      <div>
        <div
          className="font-medium text-sm"
          style={{ color: "var(--text-primary)" }}
        >
          {title}
        </div>
        <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
          {description}
        </div>
      </div>
      <ToggleSwitch
        checked={isEnabled}
        onChange={(value) => handleChange(id, value)}
        disabled={!isEditing}
      />
    </div>
  );

  return (
    <div className="space-y-8">
      <SettingsSection
        title="Notification Channels"
        description="Choose how you want to receive notifications"
      >
        <div className="space-y-2 py-2">
          <NotificationOption
            id="email"
            title="Email Notifications"
            description="Receive email alerts for important events"
            isEnabled={isEditing ? tempSettings.email : settings.email}
          />
          <div
            className="border-t my-2"
            style={{ borderColor: "var(--border-color)" }}
          ></div>
          <NotificationOption
            id="push"
            title="Push Notifications"
            description="Receive alerts directly in your browser"
            isEnabled={isEditing ? tempSettings.push : settings.push}
          />
        </div>

        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex justify-end space-x-3"
          >
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </motion.div>
        )}
      </SettingsSection>

      <SettingsSection
        title="Notification Categories"
        description="Select which types of notifications you want to receive"
      >
        <div className="space-y-2 py-2">
          <NotificationOption
            id="will"
            title="Will Updates"
            description="Be notified when your wills are updated or activated"
            isEnabled={isEditing ? tempSettings.will : settings.will}
          />
          <div
            className="border-t my-2"
            style={{ borderColor: "var(--border-color)" }}
          ></div>
          <NotificationOption
            id="security"
            title="Security Alerts"
            description="Receive alerts for login attempts and security changes"
            isEnabled={isEditing ? tempSettings.security : settings.security}
          />
          <div
            className="border-t my-2"
            style={{ borderColor: "var(--border-color)" }}
          ></div>
          <NotificationOption
            id="blockchain"
            title="Blockchain Events"
            description="Be notified about network updates and block confirmations"
            isEnabled={
              isEditing ? tempSettings.blockchain : settings.blockchain
            }
          />
        </div>

        {!isEditing && (
          <div className="mt-6 flex justify-end">
            <Button onClick={() => setIsEditing(true)}>Edit Preferences</Button>
          </div>
        )}

        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex justify-end space-x-3"
          >
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </motion.div>
        )}
      </SettingsSection>

      <SettingsSection title="Recent Notifications">
        <div
          className="rounded-lg p-4"
          style={{ backgroundColor: "var(--bg-secondary)" }}
        >
          <div className="text-center py-3 flex flex-col items-center">
            <BellIcon
              className="w-10 h-10 mb-3"
              style={{ color: "var(--text-muted)" }}
            />
            <p
              className="text-sm font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              No notifications in the last 7 days
            </p>
            <p
              className="text-xs mt-1"
              style={{ color: "var(--text-secondary)" }}
            >
              New notifications will appear here
            </p>
          </div>
        </div>
      </SettingsSection>
    </div>
  );
};

export default NotificationSettings;
