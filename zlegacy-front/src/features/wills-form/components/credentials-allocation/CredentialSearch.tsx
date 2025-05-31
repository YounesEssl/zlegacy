import React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface CredentialSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  placeholder?: string;
}

const CredentialSearch: React.FC<CredentialSearchProps> = ({
  searchQuery,
  setSearchQuery,
  placeholder = "Search credentials..."
}) => {
  return (
    <div className="relative mb-4">
      <MagnifyingGlassIcon
        className="absolute w-4 h-4 left-3 top-1/2 transform -translate-y-1/2"
        style={{ color: "var(--text-muted)" }}
      />
      <input
        type="text"
        className="pl-9 pr-3 py-2 rounded-md w-full text-sm"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          backgroundColor: "var(--bg-tertiary)",
          color: "var(--text-primary)",
          border: "1px solid var(--border-color)",
        }}
      />
    </div>
  );
};

export default CredentialSearch;
