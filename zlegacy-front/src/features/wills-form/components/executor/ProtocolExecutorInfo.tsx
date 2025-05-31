import React from 'react';
import { ShieldCheckIcon, LockClosedIcon, ClockIcon } from '@heroicons/react/24/outline';

/**
 * Protocol Executor Info Component
 * 
 * Displays information about the protocol-hosted executor option,
 * which is the default and most secure method for will execution.
 */
const ProtocolExecutorInfo: React.FC = () => {
  // Protocol benefits data
  const protocolBenefits = [
    {
      icon: ShieldCheckIcon,
      title: 'Maximum Security',
      description: 'Leverages Aleo blockchain\'s zero-knowledge proofs for unparalleled privacy and security.'
    },
    {
      icon: ClockIcon,
      title: 'Immediate Execution',
      description: 'Automated activation upon verification of specified conditions without delays.'
    },
    {
      icon: LockClosedIcon,
      title: 'Immutable Rules',
      description: 'Once set, execution rules cannot be tampered with, ensuring your wishes are respected.'
    }
  ];

  return (
    <div className="bg-opacity-50 rounded-xl p-5 animate-fadeIn"
      style={{ backgroundColor: 'var(--bg-tertiary)' }}>
      <h3 className="text-lg font-medium mb-4"
        style={{ color: 'var(--text-primary)' }}>
        Protocol-Hosted Executor
      </h3>
      
      <div className="mb-6 p-4 rounded-lg"
        style={{ 
          background: 'linear-gradient(145deg, var(--accent-gradient-start), var(--accent-gradient-end))',
          color: 'white'
        }}>
        <p className="text-sm font-medium">
          This is the recommended option for most users. The Nexa protocol will automatically execute your will according to the conditions you&apos;ve specified, with no human intervention required.
        </p>
      </div>
      
      <div className="space-y-6">
        {protocolBenefits.map((benefit, index) => (
          <div key={index} className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ 
                backgroundColor: 'var(--accent-primary-translucent)',
                color: 'var(--accent-primary)'
              }}>
              <benefit.icon className="w-6 h-6" />
            </div>
            
            <div>
              <h4 className="font-medium mb-1"
                style={{ color: 'var(--text-primary)' }}>
                {benefit.title}
              </h4>
              <p className="text-sm"
                style={{ color: 'var(--text-secondary)' }}>
                {benefit.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-4 rounded-lg border border-dashed"
        style={{ 
          borderColor: 'var(--border-color)',
          backgroundColor: 'var(--bg-secondary)'
        }}>
        <h4 className="text-sm font-semibold mb-2"
          style={{ color: 'var(--text-primary)' }}>
          How It Works
        </h4>
        <ol className="list-decimal text-sm pl-4 space-y-2"
          style={{ color: 'var(--text-secondary)' }}>
          <li>Your will is stored securely on the Aleo blockchain using zero-knowledge encryption.</li>
          <li>The protocol regularly checks for proof-of-life signals from your account.</li>
          <li>If the signals stop for the designated period, the execution process begins automatically.</li>
          <li>Assets are distributed to beneficiaries according to your specifications without revealing private details.</li>
        </ol>
      </div>
    </div>
  );
};

export default ProtocolExecutorInfo;
