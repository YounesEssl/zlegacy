import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Button from '../../../components/ui/Button';

interface NoteStepProps {
  note: string;
  setNote: (note: string) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
}

/**
 * Composant pour l'étape d'ajout d'un message personnel au testament
 */
const NoteStep: React.FC<NoteStepProps> = ({
  note,
  setNote,
  goToNextStep,
  goToPreviousStep
}) => {
  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  };

  // État local pour gérer le contenu du message  
  const [localNote, setLocalNote] = React.useState(note);

  // Mettre à jour l'état global lorsque l'utilisateur soumet le message
  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalNote(e.target.value);
    setNote(e.target.value);
  };

  return (
    <motion.div
      key="note-step"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-6"
    >
      <h2
        className="text-2xl font-bold"
        style={{ color: "var(--text-primary)" }}
      >
        Add Personal Message
      </h2>
      <p style={{ color: "var(--text-secondary)" }}>
        Add a personal message that will be delivered to your
        beneficiaries along with the will.
      </p>

      <div className="space-y-2">
        <label
          className="block text-sm font-medium"
          style={{ color: "var(--text-secondary)" }}
        >
          Your Message (Optional)
        </label>
        <textarea
          value={localNote}
          onChange={handleNoteChange}
          rows={6}
          className="w-full p-3 rounded-lg"
          style={{
            backgroundColor: "var(--bg-secondary)",
            color: "var(--text-primary)",
            border: "1px solid var(--border-color)",
          }}
          placeholder="Write a personal message to your beneficiaries..."
        />
        <p
          className="text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          This message will be visible to all your beneficiaries when they
          access the will.
        </p>
      </div>

      <div className="pt-4 flex justify-between">
        <Button variant="outline" onClick={goToPreviousStep}>
          Back
        </Button>

        <Button
          onClick={goToNextStep}
          rightIcon={<ArrowRightIcon className="w-4 h-4" />}
        >
          Review
        </Button>
      </div>
    </motion.div>
  );
};

export default NoteStep;
