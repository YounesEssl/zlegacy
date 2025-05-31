import React from "react";
import { motion } from "framer-motion";
import type { WillSummary } from "./types";
import Button from "../../components/ui/Button";
import { DocumentDuplicateIcon as DocumentDuplicateSolid } from "@heroicons/react/24/solid";

interface WillsListProps {
  wills: WillSummary[];
}

const WillsList: React.FC<WillsListProps> = ({ wills }) => {
  return (
    <div className="nexa-card overflow-hidden">
      <div
        className="flex justify-between items-center p-5 border-b"
        style={{ borderColor: "var(--border-color)" }}
      >
        <div className="flex items-center">
          <DocumentDuplicateSolid
            className="w-5 h-5 mr-3"
            style={{ color: "var(--accent-primary)" }}
          />
          <h2
            className="text-lg font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Wills
          </h2>
        </div>
        <Button variant="outline" size="sm">
          View all
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead style={{ backgroundColor: "var(--bg-tertiary)" }}>
            <tr>
              <th
                scope="col"
                className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider"
                style={{ color: "var(--text-secondary)" }}
              >
                Name
              </th>
              <th
                scope="col"
                className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider"
                style={{ color: "var(--text-secondary)" }}
              >
                Status
              </th>
              <th
                scope="col"
                className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider"
                style={{ color: "var(--text-secondary)" }}
              >
                Beneficiaries
              </th>
              <th
                scope="col"
                className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider"
                style={{ color: "var(--text-secondary)" }}
              >
                Allocation
              </th>
              <th
                scope="col"
                className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider"
                style={{ color: "var(--text-secondary)" }}
              >
                Date
              </th>
              <th
                scope="col"
                className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider"
                style={{ color: "var(--text-secondary)" }}
              ></th>
            </tr>
          </thead>
          <tbody
            className="divide-y"
            style={{ borderColor: "var(--border-color)" }}
          >
            {wills.map((will) => (
              <motion.tr
                key={will.id}
                initial={{
                  backgroundColor: "var(--bg-tertiary)",
                  opacity: 0.6,
                }}
                whileHover={{
                  backgroundColor: "var(--bg-tertiary)",
                  opacity: 0.8,
                }}
                className="text-sm cursor-pointer"
              >
                <td className="px-5 py-4">
                  <div
                    className="font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {will.title}
                  </div>
                  {will.blockheight && (
                    <span
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Block #{will.blockheight}
                    </span>
                  )}
                </td>
                <td className="px-5 py-4">
                  <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium">
                    <div
                      className="flex items-center"
                      style={{
                        color:
                          will.status === "active"
                            ? "var(--accent-tertiary)"
                            : will.status === "pending"
                            ? "var(--accent-error)"
                            : will.status === "locked"
                            ? "var(--accent-primary)"
                            : "var(--text-muted)",
                      }}
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full mr-1.5"
                        style={{
                          backgroundColor:
                            will.status === "active"
                              ? "var(--accent-tertiary)"
                              : will.status === "pending"
                              ? "var(--accent-error)"
                              : will.status === "archived"
                              ? "var(--text-muted)"
                              : "var(--accent-primary)",
                        }}
                      ></div>
                      {will.status.charAt(0).toUpperCase() +
                        will.status.slice(1)}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-center">
                  <span style={{ color: "var(--text-primary)" }}>
                    {will.beneficiaries}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div
                    className="w-full rounded-full h-2.5"
                    style={{ backgroundColor: "var(--bg-tertiary)" }}
                  >
                    <div
                      className="h-2.5 rounded-full"
                      style={{
                        width: `${will.allocation}%`,
                        backgroundColor: "var(--accent-primary)",
                      }}
                    ></div>
                  </div>
                  <div
                    className="text-xs mt-1 text-right"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {will.allocation}%
                  </div>
                </td>
                <td
                  className="px-5 py-4"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {will.date}
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    className="text-sm font-medium"
                    style={{ color: "var(--accent-primary)" }}
                  >
                    View
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WillsList;
