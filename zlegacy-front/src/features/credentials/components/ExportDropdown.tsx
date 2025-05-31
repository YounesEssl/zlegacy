import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Credential } from "../hooks/useCredentials";

interface ExportDropdownProps {
  credentials: Credential[];
}

export const ExportDropdown: React.FC<ExportDropdownProps> = ({ credentials }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Gestionnaire pour fermer le menu lorsque l'utilisateur clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  // Fonction pour exporter au format JSON
  const handleJsonExport = () => {
    try {
      // Préparation des données à exporter (sans id et lastUpdated)
      const dataToExport = credentials.map(({ id, lastUpdated, ...rest }) => rest);
      
      // Conversion en JSON et création du Blob
      const jsonData = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      
      // Création d'un URL pour le téléchargement
      const url = URL.createObjectURL(blob);
      
      // Création d'un élément <a> pour le téléchargement
      const link = document.createElement('a');
      link.href = url;
      link.download = `credentials-export-${new Date().toISOString().slice(0, 10)}.json`;
      
      // Simulation d'un clic pour déclencher le téléchargement
      document.body.appendChild(link);
      link.click();
      
      // Nettoyage
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export error:", error);
      alert("Error exporting credentials. Please try again.");
    }
  };

  // Fonction pour exporter au format CSV
  const handleCsvExport = () => {
    try {
      // Préparation des données à exporter (sans id et lastUpdated)
      const dataToExport = credentials.map(({ id, lastUpdated, ...rest }) => rest);
      
      // Récupérer toutes les clés possibles
      const allKeys = new Set<string>();
      dataToExport.forEach(cred => {
        Object.keys(cred).forEach(key => allKeys.add(key));
      });
      
      const headers = Array.from(allKeys);
      
      // Créer les lignes CSV
      const csvRows = [];
      
      // Ajouter l'en-tête
      csvRows.push(headers.join(','));
      
      // Ajouter les données
      dataToExport.forEach(cred => {
        const values = headers.map(header => {
          const val = cred[header as keyof typeof cred];
          return val ? `"${val.toString().replace(/"/g, '""')}"` : '';
        });
        csvRows.push(values.join(','));
      });
      
      // Créer le contenu CSV
      const csvContent = csvRows.join('\n');
      
      // Création du Blob
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      
      // Création d'un URL pour le téléchargement
      const url = URL.createObjectURL(blob);
      
      // Création d'un élément <a> pour le téléchargement
      const link = document.createElement('a');
      link.href = url;
      link.download = `credentials-export-${new Date().toISOString().slice(0, 10)}.csv`;
      
      // Simulation d'un clic pour déclencher le téléchargement
      document.body.appendChild(link);
      link.click();
      
      // Nettoyage
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("CSV Export error:", error);
      alert("Error exporting credentials to CSV. Please try again.");
    }
  };

  // Ne rien afficher s'il n'y a pas de credentials à exporter
  if (credentials.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full sm:w-auto" ref={dropdownRef}>
      <motion.button
        className="flex items-center gap-2 px-4 py-2.5 rounded-md w-full sm:w-auto justify-center sm:justify-start"
        style={{
          backgroundColor: "var(--bg-tertiary)",
          border: "1px solid var(--border-color)",
          color: "var(--text-primary)",
        }}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ color: "var(--accent-primary)" }}
        >
          <path
            d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7 10L12 15L17 10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 15V3"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>Export</span>
      </motion.button>
      
      {/* Menu déroulant pour les formats d'export */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-10"
            style={{
              backgroundColor: "var(--bg-tertiary)",
              border: "1px solid var(--border-color)",
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <button
              className="block w-full text-left px-4 py-2 text-sm hover:bg-opacity-10 hover:bg-white"
              style={{ color: "var(--text-primary)" }}
              onClick={() => {
                handleJsonExport();
                setIsOpen(false);
              }}
            >
              Export as JSON
            </button>
            
            <button
              className="block w-full text-left px-4 py-2 text-sm hover:bg-opacity-10 hover:bg-white"
              style={{ color: "var(--text-primary)" }}
              onClick={() => {
                handleCsvExport();
                setIsOpen(false);
              }}
            >
              Export as CSV
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
