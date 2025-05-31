import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import type { Beneficiary, NewBeneficiaryFormData } from '../types';
import { generateUniqueId, getRelationColor } from '../utils/beneficiaryUtils';

export const useBeneficiaries = () => {
  // Obtenir les paramètres de l'URL
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  // States pour les bénéficiaires
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [filteredBeneficiaries, setFilteredBeneficiaries] = useState<Beneficiary[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // States pour l'ajout, l'édition et la sélection
  const [isAddingBeneficiary, setIsAddingBeneficiary] = useState(false);
  const [isEditingBeneficiary, setIsEditingBeneficiary] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);
  const [beneficiaryToEdit, setBeneficiaryToEdit] = useState<Beneficiary | null>(null);
  
  // State pour le nouveau bénéficiaire
  const [newBeneficiary, setNewBeneficiary] = useState<NewBeneficiaryFormData>({
    name: '',
    address: '',
    email: '',
    phone: '',
    notes: '',
    relation: 'family', // Relation par défaut
    isAddressValid: false,
  });

  // Vérifier si on doit ouvrir le formulaire d'ajout de bénéficiaire automatiquement
  useEffect(() => {
    const shouldOpenForm = searchParams.get('openAddForm') === 'true';

    if (shouldOpenForm) {
      // Récupérer l'adresse pré-remplie si présente
      const prefilledAddress = searchParams.get('prefilledAddress');

      // Mettre à jour le formulaire avec l'adresse si présente
      if (prefilledAddress) {
        // Décoder l'adresse (au cas où elle contient des caractères spéciaux)
        const decodedAddress = decodeURIComponent(prefilledAddress);

        // Une validation simplifiée - en pratique, une vraie validation d'adresse Aleo est nécessaire
        const isValidAddress = decodedAddress.startsWith('aleo') && decodedAddress.length > 10;

        // Mettre à jour le formulaire
        setNewBeneficiary(prev => ({
          ...prev,
          address: decodedAddress,
          isAddressValid: isValidAddress,
        }));
      }

      // Ouvrir le formulaire
      setIsAddingBeneficiary(true);

      // Nettoyer l'URL immédiatement
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [searchParams]);

  // Charger les données de bénéficiaires (mock ou réelles)
  const loadBeneficiaries = (isConnected: boolean, publicKey?: string) => {
    // Si l'utilisateur est connecté, nous n'affichons pas de données fictives
    if (isConnected && publicKey) {
      setBeneficiaries([]);
      setFilteredBeneficiaries([]);
    } else {
      // Dans une vraie application, ce serait un appel API
      // Pour les utilisateurs non connectés, nous affichons des données de démonstration
      const mockBeneficiaries: Beneficiary[] = [
        {
          id: '1',
          name: 'Alice Smith',
          address: 'aleo1p8ld3xgv76vu475kh3f6up9zpy33myzmehnjjjrrzu7yrszt98yqekg0p9',
          email: 'alice@example.com',
          phone: '+1 555-234-5678',
          notes: 'Family',
          createdAt: '2025-04-15',
          allocation: 30,
          wills: 2,
        },
        {
          id: '2',
          name: 'Bob Johnson',
          address: 'aleo1zklvpj0x4jmwjp0k58rylj5wlzz3lqwy5chhfmxnsjt8etm5qgfq9wn54y',
          email: 'bob@example.com',
          createdAt: '2025-05-01',
          allocation: 40,
          wills: 1,
        },
      ];

      setBeneficiaries(mockBeneficiaries);
      setFilteredBeneficiaries(mockBeneficiaries);
    }
  };

  // Filtrer les bénéficiaires par terme de recherche
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredBeneficiaries(beneficiaries);
    } else {
      const filtered = beneficiaries.filter(
        beneficiary =>
          beneficiary.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          beneficiary.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          beneficiary.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBeneficiaries(filtered);
    }
  }, [searchTerm, beneficiaries]);

  // Gérer le changement dans le champ de recherche
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Gérer les changements dans le formulaire de nouveau bénéficiaire
  const handleNewBeneficiaryChange = (field: string, value: string | number) => {
    setNewBeneficiary(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Gérer le changement d'adresse et la validation
  const handleAddressChange = (address: string, isValid: boolean) => {
    setNewBeneficiary(prev => ({
      ...prev,
      address,
      isAddressValid: isValid,
    }));
  };

  // Fonction pour gérer l'édition d'un bénéficiaire
  const handleEditBeneficiary = (beneficiary: Beneficiary) => {
    setBeneficiaryToEdit(beneficiary);
    setIsEditingBeneficiary(true);
  };

  // Fonction pour sauvegarder les modifications d'un bénéficiaire
  const handleSaveBeneficiary = (updatedBeneficiary: Beneficiary) => {
    // Dans une vraie application, ce serait un appel API
    // Pour l'instant, nous mettons simplement à jour l'état local
    const updatedBeneficiaries = beneficiaries.map(b =>
      b.id === updatedBeneficiary.id ? updatedBeneficiary : b
    );

    setBeneficiaries(updatedBeneficiaries);
    setFilteredBeneficiaries(
      filteredBeneficiaries.map(b =>
        b.id === updatedBeneficiary.id ? updatedBeneficiary : b
      )
    );

    // Si le bénéficiaire mis à jour est le bénéficiaire actuellement sélectionné,
    // nous mettons également à jour l'état sélectionné
    if (selectedBeneficiary && selectedBeneficiary.id === updatedBeneficiary.id) {
      setSelectedBeneficiary(updatedBeneficiary);
    }

    setIsEditingBeneficiary(false);
    setBeneficiaryToEdit(null);
  };

  // Ajouter un nouveau bénéficiaire
  const handleAddBeneficiary = () => {
    // Validation
    if (
      !newBeneficiary.name.trim() ||
      !newBeneficiary.address.trim() ||
      !newBeneficiary.isAddressValid
    ) {
      // Dans une application réelle, vous voudriez afficher un message d'erreur
      console.error('Validation failed');
      return;
    }

    // Création d'un nouveau bénéficiaire
    const beneficiary: Beneficiary = {
      id: generateUniqueId(), // Dans une vraie app, l'ID viendrait du backend
      name: newBeneficiary.name.trim(),
      address: newBeneficiary.address.trim(),
      email: newBeneficiary.email.trim(),
      phone: newBeneficiary.phone.trim(),
      notes: newBeneficiary.notes.trim(),
      relation: newBeneficiary.relation,
      relationColor: getRelationColor(newBeneficiary.relation),
      createdAt: new Date().toISOString().split('T')[0],
      allocation: 0,
      wills: 0,
    };

    // Dans une vraie application, ce serait un appel API
    // Pour l'instant, nous mettons simplement à jour l'état local
    const updatedBeneficiaries = [...beneficiaries, beneficiary];
    setBeneficiaries(updatedBeneficiaries);
    setFilteredBeneficiaries(updatedBeneficiaries);

    // Réinitialiser le formulaire
    setNewBeneficiary({
      name: '',
      address: '',
      email: '',
      phone: '',
      notes: '',
      relation: 'family',
      isAddressValid: false,
    });

    // Fermer le modal
    setIsAddingBeneficiary(false);
  };

  // Supprimer un bénéficiaire
  const handleDeleteBeneficiary = (id: string) => {
    // Dans une vraie application, ce serait un appel API
    // Pour l'instant, nous mettons simplement à jour l'état local
    const updatedBeneficiaries = beneficiaries.filter(b => b.id !== id);
    setBeneficiaries(updatedBeneficiaries);
    setFilteredBeneficiaries(updatedBeneficiaries);

    // Si le bénéficiaire supprimé est le bénéficiaire actuellement sélectionné,
    // nous effaçons également l'état sélectionné
    if (selectedBeneficiary && selectedBeneficiary.id === id) {
      setSelectedBeneficiary(null);
    }
  };

  // Sélectionner un bénéficiaire
  const handleSelectBeneficiary = (beneficiary: Beneficiary) => {
    setSelectedBeneficiary(beneficiary);
  };

  return {
    // États
    beneficiaries,
    filteredBeneficiaries,
    searchTerm,
    isAddingBeneficiary,
    isEditingBeneficiary,
    selectedBeneficiary,
    beneficiaryToEdit,
    newBeneficiary,
    
    // Actions
    loadBeneficiaries,
    handleSearchChange,
    handleNewBeneficiaryChange,
    handleAddressChange,
    handleEditBeneficiary,
    handleSaveBeneficiary,
    handleAddBeneficiary,
    handleDeleteBeneficiary,
    handleSelectBeneficiary,
    setIsAddingBeneficiary,
    setIsEditingBeneficiary,
    setSelectedBeneficiary,
    setBeneficiaryToEdit,
  };
};
