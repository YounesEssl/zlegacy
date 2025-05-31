import React, { useState } from "react";
import { motion } from "framer-motion";
import { UserCircleIcon, PencilIcon } from "@heroicons/react/24/outline";
import Button from "../../components/ui/Button";
import type { UserSettings } from "./types";
import SettingsSection from "./components/SettingsSection";
import FormField from "./components/FormField";
import ToggleSwitch from "./components/ToggleSwitch";
import SelectField from "./components/SelectField";

const AccountSettings: React.FC = () => {
  // État initial simulé - dans une vraie application, ces données viendraient d'une API
  const [settings, setSettings] = useState<UserSettings>({
    email: "user@example.com",
    language: "english",
    notificationsEnabled: true,
    twoFactorEnabled: false,
    autoLogout: 30,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempSettings, setTempSettings] = useState<UserSettings>(settings);

  const handleChange = (key: keyof UserSettings, value: any) => {
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

  const handleLanguageChange = (value: string) => {
    handleChange("language", value);
  };

  const handleNotificationToggle = (value: boolean) => {
    handleChange("notificationsEnabled", value);
  };

  const languageOptions = [
    { label: "English", value: "english" },
    { label: "Français", value: "french" },
  ];

  const autoLogoutOptions = [
    { label: "15 minutes", value: 15 },
    { label: "30 minutes", value: 30 },
    { label: "1 hour", value: 60 },
    { label: "Never", value: 0 },
  ];

  return (
    <div className="space-y-8">
      <SettingsSection title="Account Information">
        <div className="flex flex-col md:flex-row items-start gap-5">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0 mx-auto md:mx-0"
            style={{ backgroundColor: "var(--bg-accent)" }}
          >
            <UserCircleIcon
              className="w-12 h-12"
              style={{ color: "var(--accent-primary)" }}
            />
          </div>
          <div className="flex-1 min-w-0 w-full">
            {" "}
            {/* min-w-0 force la truncation */}
            <div
              className="text-xl font-bold mb-1 text-center md:text-left"
              style={{ color: "var(--text-primary)" }}
            >
              Alex Thompson
            </div>
            <div
              className="text-sm font-mono mb-3 w-full overflow-hidden text-ellipsis whitespace-nowrap text-center md:text-left"
              style={{ color: "var(--text-secondary)" }}
              title="aleo1p8ld3xgv76vu475kh3f6up9zpy33myzmehnjjjrrzu7yrszt98yqekg0p9"
            >
              aleo1p8ld3xgv76vu475kh3f6up9zpy33myzmehnjjjrrzu7yrszt98yqekg0p9
            </div>
            <div className="flex justify-center md:justify-start">
              <Button
                size="sm"
                variant="outline"
                leftIcon={<PencilIcon className="w-4 h-4" />}
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Personal Information"
        description="Manage your account details and preferences"
      >
        <div className="space-y-4">
          <FormField
            label="Email"
            id="email"
            type="email"
            value={isEditing ? tempSettings.email : settings.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange("email", e.target.value)
            }
            disabled={!isEditing}
          />

          <SelectField
            label="Language"
            id="language"
            value={isEditing ? tempSettings.language : settings.language}
            options={languageOptions}
            onChange={(value: string) => handleLanguageChange(value)}
            disabled={!isEditing}
          />

          <SelectField
            label="Auto Logout"
            id="autoLogout"
            value={isEditing ? tempSettings.autoLogout : settings.autoLogout}
            options={autoLogoutOptions}
            onChange={(value: string) => handleChange("autoLogout", value)}
            disabled={!isEditing}
          />

          <div className="flex items-center justify-between mt-2">
            <div>
              <div
                className="font-medium text-sm"
                style={{ color: "var(--text-primary)" }}
              >
                Enable Notifications
              </div>
              <div
                className="text-xs"
                style={{ color: "var(--text-secondary)" }}
              >
                Receive updates on your wills and beneficiaries
              </div>
            </div>
            <ToggleSwitch
              checked={
                isEditing
                  ? tempSettings.notificationsEnabled
                  : settings.notificationsEnabled
              }
              onChange={(value: boolean) => handleNotificationToggle(value)}
              disabled={!isEditing}
            />
          </div>
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
        title="Danger Zone"
        description="Permanent account actions"
        isAlert
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div
                className="font-medium text-sm"
                style={{ color: "var(--text-primary)" }}
              >
                Delete Account
              </div>
              <div
                className="text-xs"
                style={{ color: "var(--text-secondary)" }}
              >
                Permanently delete your account and all associated data
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              style={{ color: "var(--accent-error)" }}
            >
              Delete
            </Button>
          </div>
        </div>
      </SettingsSection>
    </div>
  );
};

export default AccountSettings;
