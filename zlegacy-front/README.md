# dApp Will Aleo

Application décentralisée (dApp) sur la blockchain Aleo pour création et gestion de testaments on-chain.

## Stack
- React + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Aleo Connect
- Inter/Urbanist

## Démarrage

1. Installe les dépendances :

```bash
npm install
```

2. Lance le serveur de développement :

```bash
npm run dev
```

3. Ouvre [http://localhost:5173](http://localhost:5173) dans ton navigateur.

## Structure

- `src/pages/` : pages principales (accueil, création testament, etc.)
- `src/components/` : composants réutilisables (ConnectButton, Nav, etc.)
- `src/styles/` : fichiers de styles globaux ou utilitaires

Palette : bleu (`#0a74da`, `#005ec2`), noir (`#121212`, `#1e1e1e`)
Typo : Inter (par défaut), Urbanist (optionnelle)

---

Pour toute extension, ajoute tes pages dans `src/pages/` et tes composants dans `src/components/`.
