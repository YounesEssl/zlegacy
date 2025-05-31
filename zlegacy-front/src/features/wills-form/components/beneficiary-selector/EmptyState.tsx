import React from "react";
import { UserPlusIcon } from "@heroicons/react/24/outline";
import Button from "../../../../components/ui/Button";

interface EmptyStateProps {
  title: string;
  message: string;
  buttonText: string;
  onButtonClick: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  buttonText,
  onButtonClick,
}) => {
  return (
    <div className="text-center py-6">
      <p
        className="mb-2 text-lg font-medium"
        style={{ color: "var(--text-primary)" }}
      >
        {title}
      </p>
      <p style={{ color: "var(--text-secondary)" }} className="mb-4">
        {message}
      </p>
      <Button
        onClick={onButtonClick}
        leftIcon={<UserPlusIcon className="w-4 h-4" />}
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default EmptyState;
