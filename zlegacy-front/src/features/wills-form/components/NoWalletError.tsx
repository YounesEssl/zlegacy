import React from 'react';
import Button from '../../../components/ui/Button';

/**
 * Composant d'erreur affiché lorsque l'utilisateur n'a pas d'adresse de portefeuille détectable
 */
const NoWalletError: React.FC = () => {
  return (
    <div
      className="rounded-xl p-6 text-center max-w-lg mx-auto"
      style={{
        background:
          "linear-gradient(145deg, var(--bg-primary), var(--bg-secondary))",
        boxShadow: "var(--shadow-lg)",
      }}
    >
      <div className="mb-4">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
          style={{ backgroundColor: "rgba(230, 69, 69, 0.1)" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            style={{ color: "var(--accent-danger)" }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
      </div>

      <h2
        className="text-2xl font-bold mb-4"
        style={{ color: "var(--text-primary)" }}
      >
        Wallet Address Not Detected
      </h2>
      <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
        A valid wallet address is required to create a will. Please connect
        a wallet using the Leo Wallet extension.
      </p>
      <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
        If you're using Leo Wallet and still seeing this message, please make
        sure your wallet is properly connected to the application.
      </p>
      <Button
        onClick={() => window.location.reload()}
        variant="primary"
        className="px-6"
      >
        Refresh Page
      </Button>
    </div>
  );
};

export default NoWalletError;
