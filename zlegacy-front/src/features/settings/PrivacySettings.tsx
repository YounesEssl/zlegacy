import React, { useState } from "react";
import { motion } from "framer-motion";
import { LockClosedIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import Button from "../../components/ui/Button";
import type { PrivacySettings as PrivacySettingsType } from "./types";
import SettingsSection from "./components/SettingsSection";
import ToggleSwitch from "./components/ToggleSwitch";
import SelectField from "./components/SelectField";

const PrivacySettings: React.FC = () => {
  // État initial simulé - dans une vraie application, ces données viendraient d'une API
  const [settings, setSettings] = useState<PrivacySettingsType>({
    shareData: false,
    anonymizeTelemetry: true,
    storageLocation: "local",
    dataDeletionPeriod: 365,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempSettings, setTempSettings] =
    useState<PrivacySettingsType>(settings);

  const handleChange = (key: keyof PrivacySettingsType, value: any) => {
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

  const storageOptions = [
    { label: "Local storage only", value: "local" },
    { label: "Cloud storage (encrypted)", value: "cloud" },
  ];

  const retentionOptions = [
    { label: "90 days", value: 90 },
    { label: "180 days", value: 180 },
    { label: "1 year", value: 365 },
    { label: "2 years", value: 730 },
    { label: "Never delete", value: 0 },
  ];

  return (
    <div className="space-y-8">
      <SettingsSection
        title="Data Privacy"
        description="Control how your data is used and stored"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between mt-2">
            <div>
              <div
                className="font-medium text-sm"
                style={{ color: "var(--text-primary)" }}
              >
                Share Usage Data
              </div>
              <div
                className="text-xs"
                style={{ color: "var(--text-secondary)" }}
              >
                Help improve Nexa by sharing anonymous usage statistics
              </div>
            </div>
            <ToggleSwitch
              checked={isEditing ? tempSettings.shareData : settings.shareData}
              onChange={(value) => handleChange("shareData", value)}
              disabled={!isEditing}
            />
          </div>

          <div className="flex items-center justify-between mt-2">
            <div>
              <div
                className="font-medium text-sm"
                style={{ color: "var(--text-primary)" }}
              >
                Anonymize Telemetry
              </div>
              <div
                className="text-xs"
                style={{ color: "var(--text-secondary)" }}
              >
                Remove any personally identifiable information from analytics
                data
              </div>
            </div>
            <ToggleSwitch
              checked={
                isEditing
                  ? tempSettings.anonymizeTelemetry
                  : settings.anonymizeTelemetry
              }
              onChange={(value) => handleChange("anonymizeTelemetry", value)}
              disabled={!isEditing}
            />
          </div>

          <SelectField
            label="Data Storage Location"
            id="storageLocation"
            value={
              isEditing
                ? tempSettings.storageLocation
                : settings.storageLocation
            }
            options={storageOptions}
            onChange={(value) => handleChange("storageLocation", value)}
            disabled={!isEditing}
            description="Choose where your settings and preferences are stored"
          />

          <SelectField
            label="Data Retention Period"
            id="dataDeletionPeriod"
            value={
              isEditing
                ? tempSettings.dataDeletionPeriod
                : settings.dataDeletionPeriod
            }
            options={retentionOptions}
            onChange={(value) => handleChange("dataDeletionPeriod", value)}
            disabled={!isEditing}
            description="Choose how long your activity data is stored before being deleted"
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

        {!isEditing && (
          <div className="mt-6 flex justify-end">
            <Button onClick={() => setIsEditing(true)}>
              Edit Privacy Settings
            </Button>
          </div>
        )}
      </SettingsSection>

      <SettingsSection
        title="Your Data"
        description="Manage your personal data stored by Nexa"
      >
        <div className="space-y-4">
          <div
            className="p-4 rounded-lg flex items-start space-x-3"
            style={{ backgroundColor: "var(--bg-secondary)" }}
          >
            <ShieldCheckIcon
              className="w-6 h-6 mt-1"
              style={{ color: "var(--accent-tertiary)" }}
            />
            <div>
              <div
                className="font-medium text-sm"
                style={{ color: "var(--text-primary)" }}
              >
                Your data is encrypted
              </div>
              <p
                className="text-xs mt-1"
                style={{ color: "var(--text-secondary)" }}
              >
                All your will data and beneficiary information is encrypted
                using industry-standard encryption. Only you can access this
                information with your wallet credentials.
              </p>
            </div>
          </div>

          <div className="space-y-3 mt-4">
            <Button variant="outline" className="w-full justify-between">
              <span>Download my data</span>
              <LockClosedIcon className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              className="w-full justify-between"
              style={{ color: "var(--accent-error)" }}
            >
              <span>Delete all my data</span>
              <LockClosedIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Third-Party Services"
        description="Manage connections with external services"
      >
        <div
          className="p-4 rounded-lg"
          style={{ backgroundColor: "var(--bg-secondary)" }}
        >
          <div className="text-center py-2">
            <p
              className="text-sm font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              No third-party services connected
            </p>
            <p
              className="text-xs mt-1"
              style={{ color: "var(--text-secondary)" }}
            >
              External services will appear here when connected
            </p>
          </div>
        </div>
      </SettingsSection>
    </div>
  );
};

export default PrivacySettings;
