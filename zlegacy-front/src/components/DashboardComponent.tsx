import React from "react";
import { motion } from "framer-motion";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { EmptyActivities, EmptyBeneficiaries } from "./EmptyStates";
import { ProofOfLifeSection } from "./dashboard";

// Import modular sub-components
import {
  RecentActivities,
  TopBeneficiaries,
  type BeneficiarySummary,
  type RecentActivity,
} from "../features/dashboard";

// Imports pour les icônes utilisées dans les données simulées
import {
  DocumentDuplicateIcon,
  UsersIcon,
  PresentationChartLineIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

/**
 * Composant principal du Dashboard, organisé en sections modulaires
 */
const DashboardComponent: React.FC = () => {
  // Get wallet connection state
  const { connected, publicKey } = useWallet();

  // Simulated data
  const topBeneficiaries: BeneficiarySummary[] = [
    { id: "1", name: "Alice Smith", allocation: 35, wills: 3 },
    { id: "2", name: "Bob Johnson", allocation: 25, wills: 2 },
    { id: "3", name: "Carol Williams", allocation: 15, wills: 1 },
  ];

  const recentActivities: RecentActivity[] = [
    {
      id: "1",
      action: "Will verified",
      details: "Main Will confirmed on blockchain",
      date: "2h ago",
      icon: ShieldCheckIcon,
    },
    {
      id: "2",
      action: "Beneficiary added",
      details: "David Miller added to Secondary Will",
      date: "1d ago",
      icon: UsersIcon,
    },
    {
      id: "3",
      action: "Allocation modified",
      details: "Allocation for Alice Smith increased to 35%",
      date: "2d ago",
      icon: PresentationChartLineIcon,
    },
    {
      id: "4",
      action: "Will created",
      details: "New 'Digital Documentation' will added",
      date: "4d ago",
      icon: DocumentDuplicateIcon,
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="w-full">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Section "Proof of Life" */}
        <ProofOfLifeSection />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Recent Activities - conditional display */}
            {connected && publicKey ? (
              <EmptyActivities />
            ) : (
              <RecentActivities activities={recentActivities} />
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Top Beneficiaries - conditional display */}
            {connected && publicKey ? (
              <EmptyBeneficiaries />
            ) : (
              <TopBeneficiaries beneficiaries={topBeneficiaries} />
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardComponent;
