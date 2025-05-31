import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import type { SettingsSection } from "./types";
import SettingsSidebar from "./SettingsSidebar.js";
import AccountSettings from "./AccountSettings.js";
import AppearanceSettings from "./AppearanceSettings.js";
import NotificationSettings from "./NotificationSettings.js";
import PrivacySettings from "./PrivacySettings.js";
import SecuritySettings from "./SecuritySettings.js";

const SettingsLayout: React.FC = () => {
  const [activeSection, setActiveSection] =
    useState<SettingsSection>("account");

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  // Rendu du contenu en fonction de la section active
  const renderContent = () => {
    switch (activeSection) {
      case "account":
        return <AccountSettings />;
      case "appearance":
        return <AppearanceSettings />;
      case "notifications":
        return <NotificationSettings />;
      case "privacy":
        return <PrivacySettings />;
      case "security":
        return <SecuritySettings />;
      default:
        return <AccountSettings />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-6xl mx-auto py-6"
    >
      <div className="flex items-center mb-8">
        <Cog6ToothIcon
          className="w-6 h-6 mr-3"
          style={{ color: "var(--accent-primary)" }}
        />
        <h1
          className="text-2xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          Settings
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar pour la navigation entre sections - avec height constante */}
        <div className="w-full lg:w-72 md:max-w-md mx-auto lg:max-w-none lg:mx-0 mb-6 lg:mb-0 h-auto">
          <div className="lg:sticky lg:top-4">
            <SettingsSidebar
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />
          </div>
        </div>

        {/* Contenu principal des paramètres */}
        <div className="flex-1 min-w-0">
          {" "}
          {/* min-w-0 pour éviter les débordements */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="nexa-card p-6 rounded-xl relative w-full min-h-[400px]"
              style={{
                backgroundColor: "var(--bg-tertiary)",
                border: "1px solid var(--border-color)",
              }}
            >
              <div className="w-full">
                {" "}
                {/* Containeur supplémentaire pour maintenir la largeur */}
                {renderContent()}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsLayout;
