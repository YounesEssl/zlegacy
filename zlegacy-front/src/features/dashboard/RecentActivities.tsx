import React from "react";
import { motion } from "framer-motion";
import type { RecentActivity } from "./types";

interface RecentActivitiesProps {
  activities: RecentActivity[];
}

const RecentActivities: React.FC<RecentActivitiesProps> = ({ activities }) => {
  return (
    <div className="nexa-card p-5">
      <div className="flex justify-between items-center mb-5">
        <motion.h2
          className="text-lg font-bold"
          style={{ color: "var(--text-primary)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Recent Activities
        </motion.h2>
      </div>

      <div className="space-y-5">
        {activities.map((activity) => (
          <motion.div
            key={activity.id}
            className="flex items-start gap-4"
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            whileHover={{ x: 3 }}
          >
            <div
              className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "var(--bg-tertiary)" }}
            >
              {React.createElement(activity.icon, {
                className: "w-4 h-4",
                style: { color: "var(--accent-primary)" },
              })}
            </div>
            
            <div className="flex-grow min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span
                  className="font-medium truncate mr-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  {activity.action}
                </span>
                <span
                  className="text-xs whitespace-nowrap flex-shrink-0"
                  style={{ color: "var(--text-muted)" }}
                >
                  {activity.date}
                </span>
              </div>
              <p 
                className="text-sm" 
                style={{ color: "var(--text-secondary)" }}
              >
                {activity.details}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivities;
