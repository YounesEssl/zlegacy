import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheckIcon,
  KeyIcon,
  FingerPrintIcon,
  DevicePhoneMobileIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import Button from "../../components/ui/Button";
import SettingsSection from "./components/SettingsSection";
import ToggleSwitch from "./components/ToggleSwitch";
import FormField from "./components/FormField";

const SecuritySettings: React.FC = () => {
  // États pour gérer l'affichage des différentes sections
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [setupStage, setSetupStage] = useState<
    "initial" | "qr" | "verify" | "complete"
  >("initial");
  const [verificationCode, setVerificationCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRecoveryKey, setShowRecoveryKey] = useState(false);

  // Afficher un code QR simulé pour l'authentification à deux facteurs
  const renderQRSetup = () => (
    <div className="space-y-4">
      <p style={{ color: "var(--text-secondary)" }}>
        Scan this QR code with your authentication app (Google Authenticator,
        Authy, etc.)
      </p>

      <div className="flex justify-center py-4">
        <div
          className="w-48 h-48 rounded-lg p-3 flex items-center justify-center"
          style={{ backgroundColor: "white" }}
        >
          {/* Simuler un code QR pour la démonstration */}
          <div className="grid grid-cols-6 grid-rows-6 gap-1">
            {Array.from({ length: 36 }).map((_, i) => (
              <div
                key={i}
                className="w-5 h-5"
                style={{
                  backgroundColor:
                    Math.random() > 0.5 ? "black" : "transparent",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-end space-x-3">
        <Button variant="outline" onClick={() => setSetupStage("initial")}>
          Cancel
        </Button>
        <Button onClick={() => setSetupStage("verify")}>Continue</Button>
      </div>
    </div>
  );

  // Vérifier le code d'authentification
  const renderVerify = () => (
    <div className="space-y-4">
      <p style={{ color: "var(--text-secondary)" }}>
        Enter the 6-digit verification code from your authentication app
      </p>

      <FormField
        label="Verification Code"
        id="verificationCode"
        type="text"
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
        placeholder="000000"
        maxLength={6}
        className="text-center font-mono text-lg tracking-widest"
      />

      <div className="pt-4 flex justify-end space-x-3">
        <Button variant="outline" onClick={() => setSetupStage("qr")}>
          Back
        </Button>
        <Button
          onClick={() => {
            // Simuler une vérification réussie
            if (verificationCode.length === 6) {
              setSetupStage("complete");
              setIs2FAEnabled(true);
            }
          }}
          disabled={verificationCode.length !== 6}
        >
          Verify
        </Button>
      </div>
    </div>
  );

  // Afficher la confirmation d'achèvement
  const renderComplete = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center space-x-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "var(--accent-tertiary)" }}
        >
          <ShieldCheckIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-bold" style={{ color: "var(--text-primary)" }}>
            Two-Factor Authentication Enabled
          </h3>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Your account is now more secure
          </p>
        </div>
      </div>

      <div
        className="p-4 rounded-lg mt-2"
        style={{ backgroundColor: "var(--bg-secondary)" }}
      >
        <div className="space-y-2">
          <p
            className="text-sm font-medium"
            style={{ color: "var(--text-primary)" }}
          >
            Recovery Keys
          </p>
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
            Store these securely. You'll need them if you lose access to your
            authentication app.
          </p>

          <div className="pt-2">
            <div
              className="p-3 rounded-lg font-mono text-sm flex items-center justify-between break-all relative"
              style={{
                backgroundColor: "var(--bg-accent)",
                border: "1px dashed var(--border-color)",
              }}
            >
              {showRecoveryKey
                ? "WXYZ-ABCD-1234-5678-EFGH-9012"
                : "••••-••••-••••-••••-••••-••••"}
              <button
                onClick={() => setShowRecoveryKey(!showRecoveryKey)}
                className="absolute right-2"
              >
                {showRecoveryKey ? (
                  <EyeSlashIcon
                    className="w-5 h-5"
                    style={{ color: "var(--text-muted)" }}
                  />
                ) : (
                  <EyeIcon
                    className="w-5 h-5"
                    style={{ color: "var(--text-muted)" }}
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <Button onClick={() => setSetupStage("initial")}>Done</Button>
      </div>
    </motion.div>
  );

  // Rendu initial pour commencer la configuration de l'authentification à deux facteurs
  const render2FASetup = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div
            className="font-medium text-sm"
            style={{ color: "var(--text-primary)" }}
          >
            Two-Factor Authentication
          </div>
          <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
            Add an extra layer of security to your account
          </div>
        </div>
        <ToggleSwitch
          checked={is2FAEnabled}
          onChange={() => {
            if (!is2FAEnabled) {
              setSetupStage("qr");
            } else {
              // Désactiver l'authentification à deux facteurs (dans une app réelle, cela nécessiterait une confirmation)
              setIs2FAEnabled(false);
            }
          }}
        />
      </div>

      {is2FAEnabled && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-2"
        >
          <div
            className="p-3 rounded-lg flex items-center space-x-2"
            style={{ backgroundColor: "var(--bg-secondary)" }}
          >
            <ShieldCheckIcon
              className="w-5 h-5"
              style={{ color: "var(--accent-tertiary)" }}
            />
            <span
              className="text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              2FA is currently active for this account
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      <SettingsSection
        title="Account Security"
        description="Protect your account with additional security measures"
      >
        {setupStage === "initial" && render2FASetup()}
        {setupStage === "qr" && renderQRSetup()}
        {setupStage === "verify" && renderVerify()}
        {setupStage === "complete" && renderComplete()}
      </SettingsSection>

      <SettingsSection title="Password & Authentication">
        <div className="space-y-6">
          <div className="space-y-4">
            <h3
              className="text-sm font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              Change Password
            </h3>
            <FormField
              label="Current Password"
              id="currentPassword"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••••"
              className="pr-10"
              icon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeSlashIcon
                      className="w-5 h-5"
                      style={{ color: "var(--text-muted)" }}
                    />
                  ) : (
                    <EyeIcon
                      className="w-5 h-5"
                      style={{ color: "var(--text-muted)" }}
                    />
                  )}
                </button>
              }
            />
            <FormField
              label="New Password"
              id="newPassword"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••••"
              className="pr-10"
              icon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeSlashIcon
                      className="w-5 h-5"
                      style={{ color: "var(--text-muted)" }}
                    />
                  ) : (
                    <EyeIcon
                      className="w-5 h-5"
                      style={{ color: "var(--text-muted)" }}
                    />
                  )}
                </button>
              }
            />
            <FormField
              label="Confirm New Password"
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••••"
              className="pr-10"
              icon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeSlashIcon
                      className="w-5 h-5"
                      style={{ color: "var(--text-muted)" }}
                    />
                  ) : (
                    <EyeIcon
                      className="w-5 h-5"
                      style={{ color: "var(--text-muted)" }}
                    />
                  )}
                </button>
              }
            />

            <div className="pt-2 flex justify-end">
              <Button>Update Password</Button>
            </div>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection title="Additional Security Options">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-start space-x-3">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: "var(--bg-accent)" }}
              >
                <KeyIcon
                  className="w-5 h-5"
                  style={{ color: "var(--accent-primary)" }}
                />
              </div>
              <div>
                <div
                  className="font-medium text-sm"
                  style={{ color: "var(--text-primary)" }}
                >
                  Auto-lock Wallet
                </div>
                <div
                  className="text-xs"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Automatically lock your wallet after a period of inactivity
                </div>
              </div>
            </div>
            <ToggleSwitch checked={true} onChange={() => {}} />
          </div>

          <div
            className="border-t my-3"
            style={{ borderColor: "var(--border-color)" }}
          ></div>

          <div className="flex items-center justify-between">
            <div className="flex items-start space-x-3">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: "var(--bg-accent)" }}
              >
                <FingerPrintIcon
                  className="w-5 h-5"
                  style={{ color: "var(--accent-primary)" }}
                />
              </div>
              <div>
                <div
                  className="font-medium text-sm"
                  style={{ color: "var(--text-primary)" }}
                >
                  Biometric Authentication
                </div>
                <div
                  className="text-xs"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Use fingerprint or face recognition to unlock your wallet
                </div>
              </div>
            </div>
            <ToggleSwitch checked={false} onChange={() => {}} />
          </div>

          <div
            className="border-t my-3"
            style={{ borderColor: "var(--border-color)" }}
          ></div>

          <div className="flex items-center justify-between">
            <div className="flex items-start space-x-3">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: "var(--bg-accent)" }}
              >
                <DevicePhoneMobileIcon
                  className="w-5 h-5"
                  style={{ color: "var(--accent-primary)" }}
                />
              </div>
              <div>
                <div
                  className="font-medium text-sm"
                  style={{ color: "var(--text-primary)" }}
                >
                  Trusted Devices
                </div>
                <div
                  className="text-xs"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Manage the list of devices that can access your account
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Manage
            </Button>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Security Activity"
        description="Recent security events on your account"
      >
        <div className="space-y-4">
          <div
            className="p-4 rounded-lg"
            style={{ backgroundColor: "var(--bg-secondary)" }}
          >
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div
                  className="w-2 h-2 rounded-full mt-2"
                  style={{ backgroundColor: "var(--accent-tertiary)" }}
                ></div>
                <div>
                  <div
                    className="text-sm font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Password Changed
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Yesterday at 15:42 • Paris, France
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div
                  className="w-2 h-2 rounded-full mt-2"
                  style={{ backgroundColor: "var(--accent-tertiary)" }}
                ></div>
                <div>
                  <div
                    className="text-sm font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    New Login
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    2023-05-19 at 09:15 • MacOS • Chrome Browser
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 flex justify-center">
              <Button variant="outline" size="sm">
                View Full Activity Log
              </Button>
            </div>
          </div>
        </div>
      </SettingsSection>
    </div>
  );
};

export default SecuritySettings;
