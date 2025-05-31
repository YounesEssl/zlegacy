import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GlobeAltIcon, MagnifyingGlassIcon, AdjustmentsHorizontalIcon, HeartIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import type { Beneficiary } from "../../types";
import EmptyState from "./EmptyState";
import "./NGOList.css";

interface NGOListProps {
  ngos: Beneficiary[];
  selectedBeneficiaryIds: Set<string>;
  onSelect: (ngo: Beneficiary) => void;
  formatAddress: (address: string) => string;
}

const NGOList: React.FC<NGOListProps> = ({
  ngos,
  selectedBeneficiaryIds,
  onSelect,
  formatAddress,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredNGOs, setFilteredNGOs] = useState<Beneficiary[]>(ngos);
  
  // Get unique categories from NGOs
  const categories = Array.from(
    new Set(ngos.map((ngo) => ngo.category || "Other"))
  );

  // Filter NGOs based on search term and category
  useEffect(() => {
    let filtered = ngos;
    
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (ngo) =>
          ngo.name?.toLowerCase().includes(lowerSearchTerm) ||
          ngo.description?.toLowerCase().includes(lowerSearchTerm) ||
          ngo.category?.toLowerCase().includes(lowerSearchTerm)
      );
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(
        (ngo) => (ngo.category || "Other") === selectedCategory
      );
    }
    
    setFilteredNGOs(filtered);
  }, [ngos, searchTerm, selectedCategory]);

  return (
    <motion.div
      key="select-ngo"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-5"
    >
      {ngos.length > 0 ? (
        <>
          {/* Search and Filter Bar */}
          <div className="flex flex-col space-y-4 mb-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search organizations by name or cause..."
                className="pl-10 pr-4 py-2 w-full rounded-lg focus:ring-2 focus:outline-none transition-all"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  borderColor: "var(--border-color)",
                }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-3 overflow-x-auto py-1 px-1 no-scrollbar">
              <div className="flex items-center text-xs">
                <AdjustmentsHorizontalIcon className="h-4 w-4 mr-1" style={{ color: "var(--text-secondary)" }} />
                <span style={{ color: "var(--text-secondary)" }}>Filter:</span>
              </div>
              
              <button
                className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all ${selectedCategory === null ? "ring-2" : "opacity-80"}`}
                style={{
                  backgroundColor: selectedCategory === null ? "var(--accent-primary-light)" : "var(--bg-tertiary)",
                  color: selectedCategory === null ? "var(--accent-primary)" : "var(--text-secondary)",
                  borderColor: "var(--border-color)",
                }}
                onClick={() => setSelectedCategory(null)}
              >
                All Categories
              </button>
              
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all ${selectedCategory === category ? "ring-2" : "opacity-80"}`}
                  style={{
                    backgroundColor: selectedCategory === category ? "var(--accent-primary-light)" : "var(--bg-tertiary)",
                    color: selectedCategory === category ? "var(--accent-primary)" : "var(--text-secondary)",
                    borderColor: "var(--border-color)",
                  }}
                  onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Results Info */}
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {filteredNGOs.length} {filteredNGOs.length === 1 ? "organization" : "organizations"} found
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Select an organization to add as beneficiary
            </p>
          </div>

          {/* NGO Cards */}
          {filteredNGOs.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 max-h-[360px] overflow-y-auto pr-1 pb-2">
              {filteredNGOs.map((ngo) => (
                <div
                  key={ngo.id}
                  className={`group relative rounded-lg transition-all duration-200 overflow-hidden border ${selectedBeneficiaryIds.has(ngo.id) ? "ring-2" : "hover:shadow-md"}`}
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    borderColor: selectedBeneficiaryIds.has(ngo.id) ? ngo.relationColor || "#0EA5E9" : "var(--border-color)",
                  }}
                  onClick={() => onSelect(ngo)}
                >
                  {selectedBeneficiaryIds.has(ngo.id) && (
                    <div 
                      className="absolute top-2 right-2 z-10 rounded-full p-1"
                      style={{ backgroundColor: ngo.relationColor || "#0EA5E9" }}
                    >
                      <CheckCircleIcon className="h-5 w-5 text-white" />
                    </div>
                  )}
                  
                  <div className="flex flex-col h-full">
                    {/* Header with color */}
                    <div 
                      className="h-12 relative"
                      style={{ backgroundColor: `${ngo.relationColor || "#0EA5E9"}80` }}
                    >
                      <div className="absolute -bottom-6 left-4">
                        <div
                          className="w-12 h-12 rounded-full border-2 flex items-center justify-center bg-white"
                          style={{ borderColor: "var(--bg-secondary)" }}
                        >
                          <GlobeAltIcon className="w-6 h-6" style={{ color: ngo.relationColor || "#0EA5E9" }} />
                        </div>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-5 pt-8">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-base">{ngo.name}</h3>
                          <span
                            className="inline-flex items-center text-xs px-2 py-0.5 rounded-full mt-1"
                            style={{
                              backgroundColor: `${ngo.relationColor || "#0EA5E9"}20`,
                              color: ngo.relationColor || "#0EA5E9",
                            }}
                          >
                            <HeartIcon className="w-3 h-3 mr-1" />
                            {ngo.category || "NGO"}
                          </span>
                        </div>
                      </div>
                      
                      <p
                        className="text-xs font-mono mb-2"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {formatAddress(ngo.address)}
                      </p>
                      
                      <p
                        className="text-sm line-clamp-2 mb-4"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {ngo.description}
                      </p>
                      
                      {ngo.website && (
                        <a
                          href={`https://${ngo.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs inline-flex items-center hover:underline"
                          style={{ color: "var(--accent-primary)" }}
                        >
                          {ngo.website}
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 ml-1">
                            <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center rounded-lg border" style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)" }}>
              <p className="font-medium mb-1">No results found</p>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          title="No NGOs available"
          message="There are currently no NGOs available for selection."
          buttonText="Refresh"
          onButtonClick={() => {}}
        />
      )}
    </motion.div>
  );
};

export default NGOList;
