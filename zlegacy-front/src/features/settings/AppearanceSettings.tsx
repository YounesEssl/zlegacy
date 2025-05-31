import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
} from "@heroicons/react/24/outline";
import Button from "../../components/ui/Button";
import type { AppearanceSettings as AppearanceSettingsType } from "./types";
import SettingsSection from "./components/SettingsSection";
import ToggleSwitch from "./components/ToggleSwitch";
import SelectField from "./components/SelectField";
import { useTheme } from "../../contexts/ThemeContext";

const AppearanceSettings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  // État initial simulé - dans une vraie application, ces données viendraient d'une API
  const [settings, setSettings] = useState<AppearanceSettingsType>({
    theme: theme as "dark" | "light" | "system",
    fontSize: "medium",
    animationsEnabled: true,
    reducedMotion: false,
  });

  const [tempSettings, setTempSettings] =
    useState<AppearanceSettingsType>(settings);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (key: keyof AppearanceSettingsType, value: any) => {
    setTempSettings({ ...tempSettings, [key]: value });
  };

  const handleSave = () => {
    // Dans une vraie application, on enverrait cette requête à une API
    setSettings(tempSettings);

    // Si le thème a changé, appliquer le changement
    if (tempSettings.theme !== settings.theme) {
      if (tempSettings.theme === "system") {
        // Logique pour détecter le thème système (simplifié ici)
        const systemPrefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        if (
          (systemPrefersDark && theme === "light") ||
          (!systemPrefersDark && theme === "dark")
        ) {
          toggleTheme();
        }
      } else if (
        (tempSettings.theme === "dark" && theme === "light") ||
        (tempSettings.theme === "light" && theme === "dark")
      ) {
        toggleTheme();
      }
    }

    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempSettings(settings);
    setIsEditing(false);
  };

  const fontSizeOptions = [
    { label: "Small", value: "small" },
    { label: "Medium", value: "medium" },
    { label: "Large", value: "large" },
  ];

  // Créer une prévisualisation du thème
  const ThemePreview = ({
    themeType,
  }: {
    themeType: "dark" | "light" | "system";
  }) => {
    const isSelected = isEditing
      ? tempSettings.theme === themeType
      : settings.theme === themeType;

    let icon;
    let label;

    switch (themeType) {
      case "dark":
        icon = (
          <MoonIcon
            className="w-5 h-5"
            style={{ color: "var(--text-muted)" }}
          />
        );
        label = "Dark";
        break;
      case "light":
        icon = <SunIcon className="w-5 h-5" style={{ color: "#FFA500" }} />;
        label = "Light";
        break;
      case "system":
        icon = (
          <ComputerDesktopIcon
            className="w-5 h-5"
            style={{ color: "var(--text-muted)" }}
          />
        );
        label = "System";
        break;
    }

    const darkColor = "#121212";
    const lightColor = "#eef2f7";

    let previewBg, previewText;

    if (themeType === "dark") {
      previewBg = darkColor;
      previewText = "#FFFFFF";
    } else if (themeType === "light") {
      previewBg = lightColor;
      previewText = "#334155";
    } else {
      // Pour le système, on montre un dégradé
      previewBg = "linear-gradient(to right, #121212 50%, #eef2f7 50%)";
      previewText = "#AAAAAA";
    }

    return (
      <motion.div
        whileHover={{ y: -2 }}
        className={`rounded-xl p-4 cursor-pointer transition-all ${
          isSelected ? "ring-2" : ""
        }`}
        style={{
          backgroundColor: "var(--bg-tertiary)",
          borderColor: "var(--border-color)",
          borderWidth: "1px",
          borderStyle: "solid",
        }}
        onClick={() => !isEditing || handleChange("theme", themeType)}
      >
        <div className="flex flex-col items-center space-y-2">
          <div
            className="w-16 h-16 rounded-lg mb-2 flex items-center justify-center"
            style={{ background: previewBg }}
          >
            <div className="text-xs font-bold" style={{ color: previewText }}>
              Aa
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {icon}
            <span
              className="text-sm font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              {label}
            </span>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-8">
      <SettingsSection
        title="Theme"
        description="Choose your preferred display mode"
      >
        <div className="grid grid-cols-3 gap-4 mb-6">
          <ThemePreview themeType="light" />
          <ThemePreview themeType="dark" />
          <ThemePreview themeType="system" />
        </div>

        <div className="space-y-4 mt-6">
          <SelectField
            label="Font Size"
            id="fontSize"
            value={isEditing ? tempSettings.fontSize : settings.fontSize}
            options={fontSizeOptions}
            onChange={(value) => handleChange("fontSize", value)}
            disabled={!isEditing}
          />

          <div className="flex items-center justify-between mt-2">
            <div>
              <div
                className="font-medium text-sm"
                style={{ color: "var(--text-primary)" }}
              >
                Enable Animations
              </div>
              <div
                className="text-xs"
                style={{ color: "var(--text-secondary)" }}
              >
                Smoother transitions between pages and UI elements
              </div>
            </div>
            <ToggleSwitch
              checked={
                isEditing
                  ? tempSettings.animationsEnabled
                  : settings.animationsEnabled
              }
              onChange={(value) => handleChange("animationsEnabled", value)}
              disabled={!isEditing}
            />
          </div>

          <div className="flex items-center justify-between mt-2">
            <div>
              <div
                className="font-medium text-sm"
                style={{ color: "var(--text-primary)" }}
              >
                Reduced Motion
              </div>
              <div
                className="text-xs"
                style={{ color: "var(--text-secondary)" }}
              >
                Minimize animations for accessibility purposes
              </div>
            </div>
            <ToggleSwitch
              checked={
                isEditing ? tempSettings.reducedMotion : settings.reducedMotion
              }
              onChange={(value) => handleChange("reducedMotion", value)}
              disabled={!isEditing}
            />
          </div>
        </div>

        <div className="flex justify-end mt-6 space-x-3">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit Preferences</Button>
          )}
        </div>
      </SettingsSection>

      <SettingsSection
        title="Display Preview"
        description="See how your theme settings look"
      >
        <div className="space-y-4">
          <div
            className="p-4 rounded-xl"
            style={{
              backgroundColor: "var(--bg-tertiary)",
              border: "1px solid var(--border-color)",
            }}
          >
            <div className="mb-2">
              <div
                className="text-lg font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Sample Will
              </div>
              <div
                className="text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                Preview of how content will appear with current settings
              </div>
            </div>
            <div className="flex items-center space-x-3 mt-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(to bottom right, var(--accent-primary), var(--accent-secondary))",
                  color: "white",
                }}
              >
                A
              </div>
              <div>
                <div
                  className="font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  Alice Smith
                </div>
                <div
                  className="text-xs"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Beneficiary
                </div>
              </div>
              <div
                className="ml-auto px-2 py-1 rounded-md text-xs font-medium"
                style={{
                  backgroundColor: "var(--bg-accent)",
                  color: "var(--accent-primary)",
                }}
              >
                40%
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button size="sm">View Details</Button>
            </div>
          </div>
        </div>
      </SettingsSection>
    </div>
  );
};

export default AppearanceSettings;
