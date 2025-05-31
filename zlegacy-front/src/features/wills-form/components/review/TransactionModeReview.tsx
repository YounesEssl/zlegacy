import React from "react";
import {
  LockClosedIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import { ShieldCheckIcon, ShieldExclamationIcon } from "@heroicons/react/24/solid";
import type { TransactionMode } from "../../types";

interface TransactionModeReviewProps {
  transactionMode: TransactionMode;
}

const TransactionModeReview: React.FC<TransactionModeReviewProps> = ({
  transactionMode,
}) => {
  const isPrivate = transactionMode === "private";

  return (
    <div className="rounded-lg border p-4" style={{ borderColor: "var(--border-color)" }}>
      <div className="flex items-center mb-2">
        {isPrivate ? (
          <LockClosedIcon className="w-5 h-5 mr-2" style={{ color: "var(--accent-success)" }} />
        ) : (
          <GlobeAltIcon className="w-5 h-5 mr-2" style={{ color: "var(--accent-primary)" }} />
        )}
        <h4 className="font-semibold" style={{ color: "var(--text-primary)" }}>
          {isPrivate ? "Private Transaction" : "Public Transaction"}
        </h4>
      </div>

      <div className="flex items-start mt-3 p-3 rounded-md" style={{ backgroundColor: "var(--bg-muted)" }}>
        {isPrivate ? (
          <>
            <ShieldCheckIcon 
              className="w-8 h-8 mr-3 flex-shrink-0" 
              style={{ color: "var(--accent-success)" }} 
            />
            <div>
              <p className="text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>
                Your will is set to be deployed privately
              </p>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                All transaction data will be encrypted and visible only to you and your designated 
                beneficiaries. The blockchain will validate the transaction without revealing 
                its contents to other network participants.
              </p>
              <ul className="mt-2 space-y-1">
                <li className="text-xs flex items-center" style={{ color: "var(--text-muted)" }}>
                  <span className="w-1.5 h-1.5 rounded-full mr-1.5" style={{ backgroundColor: "var(--accent-success)" }}></span>
                  Higher privacy protection
                </li>
                <li className="text-xs flex items-center" style={{ color: "var(--text-muted)" }}>
                  <span className="w-1.5 h-1.5 rounded-full mr-1.5" style={{ backgroundColor: "var(--accent-success)" }}></span>
                  Allocation details are encrypted
                </li>
                <li className="text-xs flex items-center" style={{ color: "var(--text-muted)" }}>
                  <span className="w-1.5 h-1.5 rounded-full mr-1.5" style={{ backgroundColor: "var(--accent-success)" }}></span>
                  Slightly higher transaction fees
                </li>
              </ul>
            </div>
          </>
        ) : (
          <>
            <ShieldExclamationIcon 
              className="w-8 h-8 mr-3 flex-shrink-0" 
              style={{ color: "var(--accent-primary)" }} 
            />
            <div>
              <p className="text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>
                Your will is set to be deployed publicly
              </p>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Transaction details will be recorded on the public blockchain and visible to anyone. 
                This includes beneficiary addresses and asset allocation percentages.
              </p>
              <ul className="mt-2 space-y-1">
                <li className="text-xs flex items-center" style={{ color: "var(--text-muted)" }}>
                  <span className="w-1.5 h-1.5 rounded-full mr-1.5" style={{ backgroundColor: "var(--accent-primary)" }}></span>
                  Lower transaction fees
                </li>
                <li className="text-xs flex items-center" style={{ color: "var(--text-muted)" }}>
                  <span className="w-1.5 h-1.5 rounded-full mr-1.5" style={{ backgroundColor: "var(--accent-primary)" }}></span>
                  Faster confirmation times
                </li>
                <li className="text-xs flex items-center" style={{ color: "var(--text-muted)" }}>
                  <span className="w-1.5 h-1.5 rounded-full mr-1.5" style={{ backgroundColor: "var(--accent-danger)" }}></span>
                  Limited privacy
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TransactionModeReview;
