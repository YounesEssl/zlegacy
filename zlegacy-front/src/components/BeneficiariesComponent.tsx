import React from "react";
import { motion } from "framer-motion";
import { BeneficiariesList } from "../features/beneficiaries";

const BeneficiariesComponent: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <BeneficiariesList />
    </motion.div>
  );
};

export default BeneficiariesComponent;
