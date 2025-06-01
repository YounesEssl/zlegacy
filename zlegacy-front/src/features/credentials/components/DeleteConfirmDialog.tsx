import React from "react";
import { motion } from "framer-motion";
import { Trash2, KeyRound } from "lucide-react";
import type { Credential } from "../hooks/useCredentials";

interface DeleteConfirmDialogProps {
  credential: Credential | undefined;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

export const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  credential,
  onConfirm,
  onCancel,
}) => {
  if (!credential) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        transition={{ type: "spring", damping: 25 }}
        className="rounded-xl p-4 sm:p-6 max-w-[95vw] sm:max-w-md w-full shadow-2xl m-4"
        style={{
          backgroundColor: "var(--bg-primary)",
          border: "1px solid var(--border-color)",
        }}
        onClick={(e) => e.stopPropagation()} // Empêche la fermeture lors du clic sur la modal
      >
        <div className="flex flex-col sm:flex-row items-center mb-5 gap-3">
          <div
            className="p-3 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "rgba(239, 68, 68, 0.15)" }}
          >
            <Trash2 size={22} style={{ color: "#ef4444" }} />
          </div>
          <div className="text-center sm:text-left">
            <h3
              className="text-xl font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Delete Credential
            </h3>
            <p
              className="text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              This action cannot be undone
            </p>
          </div>
        </div>

        <div
          className="p-4 mb-6 rounded-lg"
          style={{
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
          }}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 mr-3">
              <KeyRound
                size={18}
                style={{ color: "var(--text-secondary)" }}
              />
            </div>
            <div>
              <p
                className="font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                {credential.name || "This credential"}
              </p>
              <p
                className="text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                {credential.username || ""}
              </p>
            </div>
          </div>
        </div>

        <p
          className="mb-6 text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          Are you sure you want to permanently delete this credential?
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end sm:space-x-3 mt-6">
          <motion.button
            onClick={onCancel}
            className="w-full sm:w-auto px-5 py-2.5 rounded-md order-2 sm:order-1"
            style={{
              backgroundColor: "var(--bg-tertiary)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-color)",
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Cancel
          </motion.button>
          <motion.button
            onClick={onConfirm}
            className="w-full sm:w-auto px-5 py-2.5 rounded-md flex items-center justify-center order-1 sm:order-2"
            style={{ backgroundColor: "#ef4444", color: "white" }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Trash2 size={16} className="mr-2" />
            Delete Permanently
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};
