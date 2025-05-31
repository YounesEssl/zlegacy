import React, { useState } from "react";
import { motion } from "framer-motion";
import { DocumentTextIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

interface NoteReviewProps {
  note?: string;
}

const NoteReview: React.FC<NoteReviewProps> = ({ note }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Si pas de note, ne pas afficher la section
  if (!note || note.trim() === "") {
    return null;
  }

  return (
    <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--border-color)" }}>
      <div 
        className="flex justify-between items-center p-3 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <DocumentTextIcon 
            className="w-5 h-5 mr-2" 
            style={{ color: "var(--accent-primary)" }} 
          />
          <h4 className="font-semibold" style={{ color: "var(--text-primary)" }}>
            Personal Message
          </h4>
        </div>
        <div>
          {expanded ? (
            <ChevronUpIcon className="w-5 h-5" style={{ color: "var(--text-muted)" }} />
          ) : (
            <ChevronDownIcon className="w-5 h-5" style={{ color: "var(--text-muted)" }} />
          )}
        </div>
      </div>

      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: expanded ? "auto" : 0,
          opacity: expanded ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        style={{ overflow: "hidden" }}
      >
        <div className="p-4 border-t" style={{ borderColor: "var(--border-color)" }}>
          <div 
            className="p-3 rounded-md whitespace-pre-wrap" 
            style={{ 
              backgroundColor: "var(--bg-muted)",
              color: "var(--text-primary)"
            }}
          >
            {note}
          </div>
          <div 
            className="mt-2 text-xs italic" 
            style={{ color: "var(--text-muted)" }}
          >
            This message will be visible to your beneficiaries after the will is executed.
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NoteReview;
