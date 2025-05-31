import React from "react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Button from "../../../../components/ui/Button";

interface NavigationButtonsProps {
  onContinue: () => void;
  onPrevious?: () => void;
  isContinueDisabled: boolean;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onContinue,
  onPrevious,
  isContinueDisabled,
}) => {
  return (
    <div className="pt-6 flex justify-between">
      {onPrevious && (
        <Button onClick={onPrevious} variant="outline" size="lg">
          Back
        </Button>
      )}
      <Button
        onClick={(e) => {
          // Appel explicite de la fonction onContinue et prévention du comportement par défaut
          e.preventDefault();
          onContinue();
        }}
        disabled={isContinueDisabled}
        rightIcon={<ArrowRightIcon className="w-4 h-4" />}
        variant="primary"
        size="lg"
      >
        Continue to Allocation
      </Button>
    </div>
  );
};

export default NavigationButtons;
