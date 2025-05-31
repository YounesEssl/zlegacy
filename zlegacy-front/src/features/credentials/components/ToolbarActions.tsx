import React from "react";
import { motion } from "framer-motion";
import { UploadCloud } from "lucide-react";
import { ExportDropdown } from "./ExportDropdown";
import type { Credential } from "../hooks/useCredentials";

interface ToolbarActionsProps {
  credentials: Credential[];
  onImport: (data: any[]) => Promise<boolean>;
  connected: boolean;
  showForm: boolean;
}

export const ToolbarActions: React.FC<ToolbarActionsProps> = ({
  credentials,
  onImport,
  connected,
  showForm,
}) => {
  // Ne rien afficher si l'utilisateur n'est pas connecté ou si le formulaire est affiché
  if (!connected || showForm) {
    return null;
  }

  // Gestionnaire pour l'importation de fichiers
  const handleImportClick = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".csv,.json";
    fileInput.onchange = async (e) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        let content = await file.text();
        let data = [];
        try {
          if (file.name.endsWith(".csv")) {
            // Analyse CSV simplifiée
            const lines = content.split("\n");
            if (lines.length > 1) {
              const headers = lines[0]
                .split(",")
                .map((h) => h.trim().toLowerCase());
              data = lines
                .slice(1)
                .filter((line) => line.trim() !== "")
                .map((line) => {
                  const values = line
                    .split(",")
                    .map((v) => v.trim());
                  const entry: Record<string, string> = {};
                  headers.forEach((header, index) => {
                    if (index < values.length) {
                      entry[header] = values[index];
                    }
                  });
                  return entry;
                });
            }
          } else if (file.name.endsWith(".json")) {
            // Analyse JSON
            const parsed = JSON.parse(content);
            data = Array.isArray(parsed) ? parsed : [parsed];
          }

          if (data.length > 0) {
            await onImport(data);
          }
        } catch (error) {
          console.error("Import error:", error);
          alert("Erreur lors de l'importation. Vérifiez le format du fichier.");
        }
      }
    };
    fileInput.click();
  };

  return (
    <motion.div
      className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.3 }}
    >
      <div className="flex w-full sm:w-auto items-center justify-center sm:justify-start">
        {/* Bouton d'importation */}
        <motion.button
          onClick={handleImportClick}
          className="flex items-center gap-2 px-4 py-2.5 rounded-md w-full sm:w-auto"
          style={{
            backgroundColor: "var(--accent-primary)",
            color: "white",
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <UploadCloud size={18} />
          <span>Importer CSV/JSON</span>
        </motion.button>
      </div>

      <div className="flex w-full sm:w-auto items-center justify-center sm:justify-end">
        {/* Menu d'exportation */}
        <ExportDropdown credentials={credentials} />
      </div>
    </motion.div>
  );
};
