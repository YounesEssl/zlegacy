import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  UserGroupIcon,
  GlobeAltIcon,
  UserIcon,
  LockClosedIcon,
  CurrencyDollarIcon
} from "@heroicons/react/24/outline";
import { HashtagIcon } from "@heroicons/react/24/solid";
import type { Credential } from "../../types";
import { AllocationValueDisplay } from "./AllocationValueDisplay";
import { useWill } from "../../WillContext";

interface BeneficiariesReviewProps {
  getBeneficiaryCredentials: (beneficiaryId: string) => Credential[];
}

const BeneficiariesReview: React.FC<BeneficiariesReviewProps> = ({
  getBeneficiaryCredentials,
}) => {
  // Récupérer les données directement du contexte pour garantir des valeurs à jour
  const { beneficiaryAllocations, assetAllocations } = useWill();
  const [expandedBeneficiaryId, setExpandedBeneficiaryId] = useState<string | null>(null);

  // Animation variants for the accordion
  const contentVariants = {
    collapsed: { height: 0, opacity: 0, overflow: "hidden" },
    expanded: { height: "auto", opacity: 1, transition: { duration: 0.3 } },
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center mb-3">
        <UserGroupIcon className="w-5 h-5 mr-2" style={{ color: "var(--accent-primary)" }} />
        <h4 className="font-semibold" style={{ color: "var(--text-primary)" }}>
          Beneficiary Allocations
        </h4>
      </div>

      {beneficiaryAllocations.length === 0 ? (
        <div 
          className="p-4 rounded-lg text-center"
          style={{ backgroundColor: "var(--bg-muted)", color: "var(--text-muted)" }}
        >
          No beneficiaries have been added yet.
        </div>
      ) : (
        <div className="space-y-3">
          {beneficiaryAllocations.map((item) => {
            const beneficiaryCredentials = getBeneficiaryCredentials(item.beneficiary.id);
            const isExpanded = expandedBeneficiaryId === item.beneficiary.id;
            const relationColor = item.beneficiary.relationColor || "rgba(75, 131, 219, 0.1)";
            
            // Déterminer le nombre d'actifs alloués à ce bénéficiaire
            const allocatedAssets = assetAllocations.filter(
              allocation => allocation.beneficiaryId === item.beneficiary.id && allocation.amount > 0
            );
            
            // Log pour debug
            console.log(`Beneficiary ${item.beneficiary.name} has ${allocatedAssets.length} allocated assets:`, allocatedAssets);

            return (
              <div
                key={item.beneficiary.id}
                className="rounded-lg overflow-hidden border shadow-sm transition-all duration-200 hover:shadow-md"
                style={{ borderColor: "var(--border-color)" }}
              >
                <div
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 sm:p-4 cursor-pointer bg-gradient-to-r"
                  style={{
                    background: `linear-gradient(to right, ${relationColor}10, ${relationColor}05)`,
                    borderLeft: `4px solid ${relationColor}`
                  }}
                  onClick={() => setExpandedBeneficiaryId(isExpanded ? null : item.beneficiary.id)}
                >
                  <div className="flex items-center w-full sm:w-auto">
                    <div
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mr-3 flex-shrink-0 shadow-sm"
                      style={{ 
                        backgroundColor: relationColor,
                        boxShadow: `0 0 0 4px ${relationColor}30`
                      }}
                    >
                      {item.beneficiary.name ? (
                        <span
                          className="text-base sm:text-lg font-bold"
                          style={{ color: "white" }}
                        >
                          {item.beneficiary.name.charAt(0).toUpperCase()}
                        </span>
                      ) : (
                        <HashtagIcon 
                          className="w-5 h-5 sm:w-6 sm:h-6" 
                          style={{ color: "white" }}
                        />
                      )}
                    </div>

                    <div className="flex-grow min-w-0">
                      <div className="font-semibold text-sm sm:text-base truncate" style={{ color: "var(--text-primary)" }}>
                        {item.beneficiary.name || "Unnamed Beneficiary"}
                      </div>
                      <div
                        className="text-xs font-mono truncate max-w-[300px] opacity-80"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {item.beneficiary.address.substring(0, 16)}...
                        {item.beneficiary.address.substring(item.beneficiary.address.length - 8)}
                      </div>
                      {item.beneficiary.relation && (
                        <span
                          className="px-2 py-0.5 text-xs font-medium rounded-full mt-1.5 inline-block"
                          style={{
                            backgroundColor: `${relationColor}20`,
                            color: relationColor,
                            border: `1px solid ${relationColor}40`
                          }}
                        >
                          {item.beneficiary.relation.charAt(0).toUpperCase() + 
                           item.beneficiary.relation.slice(1)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto mt-2 sm:mt-0">
                    <div className="flex items-center mr-3">
                      <CurrencyDollarIcon 
                        className="w-4 h-4 mr-1 flex-shrink-0" 
                        style={{ color: relationColor }}
                      />
                      <div className="flex items-center font-medium text-sm">
                        <AllocationValueDisplay 
                          allocation={item.allocation}
                          beneficiaryId={item.beneficiary.id}
                        />
                      </div>
                    </div>

                    <div 
                      className="flex items-center py-1 px-2 rounded mr-3"
                      style={{ 
                        backgroundColor: `${relationColor}10`,
                      }}
                    >
                      <LockClosedIcon 
                        className="w-3.5 h-3.5 mr-1 flex-shrink-0" 
                        style={{ color: relationColor }}
                      />
                      <span 
                        className="text-xs sm:text-sm font-medium"
                        style={{ color: relationColor }}
                      >
                        {beneficiaryCredentials.length}
                      </span>
                    </div>

                    <div>
                      {isExpanded ? (
                        <ChevronUpIcon 
                          className="w-5 h-5 transition-all duration-300" 
                          style={{ color: "var(--text-muted)" }}
                        />
                      ) : (
                        <ChevronDownIcon 
                          className="w-5 h-5 transition-all duration-300" 
                          style={{ color: "var(--text-muted)" }}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial="collapsed"
                      animate="expanded"
                      exit="collapsed"
                      variants={contentVariants}
                    >
                      <div className="px-4 pb-4 pt-2 border-t" style={{ borderColor: `${relationColor}30` }}>
                        {/* Asset Allocations Section */}
                        <div className="mb-6">
                          <div className="flex items-center mb-3">
                            <div
                              className="w-7 h-7 rounded-full flex items-center justify-center mr-2 shadow-sm"
                              style={{ background: `linear-gradient(135deg, ${relationColor}, ${relationColor}cc)` }}
                            >
                              <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 6.5V5C6 3.34315 7.34315 2 9 2H15C16.6569 2 18 3.34315 18 5V6.5M6 6.5H18M6 6.5V19C6 20.6569 7.34315 22 9 22H15C16.6569 22 18 20.6569 18 19V6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                <path d="M9.5 11H14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                <path d="M9.5 16H14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                              </svg>
                            </div>
                            <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                              Assets
                            </div>
                          </div>
                          
                          <div className="px-3 sm:px-4 py-3 rounded-md" style={{ backgroundColor: "var(--bg-tertiary)" }}>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-1 sm:gap-0">
                              <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                                Allocation Details
                              </div>
                              <div 
                                className="px-2 py-0.5 rounded text-xs font-medium"
                                style={{ 
                                  backgroundColor: `${relationColor}15`,
                                  color: relationColor
                                }}
                              >
                                {allocatedAssets.length} allocated
                              </div>
                            </div>
                            <AllocationValueDisplay 
                              allocation={item.allocation}
                              beneficiaryId={item.beneficiary.id}
                              showDetailedBreakdown={true}
                            />
                          </div>
                        </div>
                        
                        {/* Credentials Section */}
                        <div>
                          <div className="flex items-center mb-3">
                            <div
                              className="w-7 h-7 rounded-full flex items-center justify-center mr-2 shadow-sm"
                              style={{ background: `linear-gradient(135deg, ${relationColor}, ${relationColor}cc)` }}
                            >
                              <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 10V8C8 5.79086 9.79086 4 12 4C14.2091 4 16 5.79086 16 8V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                <circle cx="12" cy="15" r="2" fill="currentColor"/>
                              </svg>
                            </div>
                            <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                              Credentials
                            </div>
                          </div>
                          
                          <div className="px-3 sm:px-4 py-3 rounded-md" style={{ backgroundColor: "var(--bg-tertiary)" }}>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-1 sm:gap-0">
                              <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                                Allocated Credentials
                              </div>
                              <div 
                                className="px-2 py-0.5 rounded text-xs font-medium"
                                style={{ 
                                  backgroundColor: `${relationColor}15`,
                                  color: relationColor
                                }}
                              >
                                {beneficiaryCredentials.length} allocated
                              </div>
                            </div>
                            
                            {beneficiaryCredentials.length > 0 ? (
                              <div className="space-y-2">
                                {beneficiaryCredentials.map((credential) => (
                                  <div
                                    key={credential.id}
                                    className="flex items-center p-2 rounded-lg border shadow-sm mt-2 overflow-hidden"
                                    style={{ 
                                      borderColor: "var(--border-color)",
                                      backgroundColor: "var(--bg-card)"
                                    }}
                                  >
                                    <div
                                      className="w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0"
                                      style={{ 
                                        background: `linear-gradient(135deg, ${relationColor}20, ${relationColor}30)`,
                                        color: relationColor 
                                      }}
                                    >
                                      {credential.website ? (
                                        <GlobeAltIcon className="w-5 h-5" />
                                      ) : (
                                        <UserIcon className="w-5 h-5" />
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0 max-w-[60%] sm:max-w-[unset]">
                                      <div
                                        className="font-medium text-sm truncate"
                                        style={{ color: "var(--text-primary)" }}
                                      >
                                        {credential.title}
                                      </div>
                                      <div
                                        className="text-xs truncate"
                                        style={{ color: "var(--text-secondary)" }}
                                      >
                                        {credential.website || credential.username}
                                      </div>
                                    </div>
                                    <div 
                                      className="flex items-center justify-center ml-2 px-1.5 sm:px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0"
                                      style={{ 
                                        backgroundColor: `${relationColor}10`, 
                                        color: relationColor,
                                        border: `1px solid ${relationColor}30`
                                      }}
                                    >
                                      <LockClosedIcon className="w-3 h-3 mr-1 flex-shrink-0" />
                                      <span className="hidden xs:inline">Password</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div 
                                className="flex flex-col items-center justify-center py-8 text-sm border border-dashed rounded-xl" 
                                style={{ color: "var(--text-muted)", borderColor: "var(--border-color)" }}
                              >
                                <svg className="w-10 h-10 mb-2 opacity-40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M8 10V8C8 5.79086 9.79086 4 12 4C14.2091 4 16 5.79086 16 8V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                  <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                  <circle cx="12" cy="15" r="2" fill="currentColor"/>
                                </svg>
                                <div>No credentials assigned to this beneficiary</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BeneficiariesReview;
