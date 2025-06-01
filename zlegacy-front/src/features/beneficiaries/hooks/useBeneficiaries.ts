import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import type { Beneficiary, NewBeneficiaryFormData } from '../types';
import { getBeneficiaries as apiGetBeneficiaries, createBeneficiary as apiCreateBeneficiary, updateBeneficiary as apiUpdateBeneficiary, deleteBeneficiary as apiDeleteBeneficiary } from '../../../api/beneficiaryApi';
import { useWalletCustom } from '../../../contexts/wallet/context';

export const useBeneficiaries = () => {
  // Utiliser le contexte du wallet pour obtenir l'adresse et le statut de connexion
  const { publicKey: account, walletConnected: isConnected } = useWalletCustom();
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

  // État pour les opérations asynchrones
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les données de bénéficiaires depuis l'API
  const loadBeneficiaries = async () => {
    // Réinitialiser les états d'erreur
    setError(null);
    
    if (!isConnected || !account) {
      // Si l'utilisateur n'est pas connecté, nous affichons des données de démonstration
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
      return;
    }
    
    // Sinon, nous récupérons les bénéficiaires réels depuis l'API
    try {
      setIsLoading(true);
      const data = await apiGetBeneficiaries(account);
      setBeneficiaries(data);
      setFilteredBeneficiaries(data);
    } catch (err) {
      console.error('Erreur lors du chargement des bénéficiaires:', err);
      setError('Impossible de charger les bénéficiaires. Veuillez réessayer.');
      // En cas d'erreur, nous initialisons avec un tableau vide
      setBeneficiaries([]);
      setFilteredBeneficiaries([]);
    } finally {
      setIsLoading(false);
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
  const handleSaveBeneficiary = async (updatedBeneficiary: Beneficiary) => {
    // Vérifier que l'utilisateur est connecté
    if (!isConnected || !account) {
      console.error('User not connected');
      setError('Vous devez être connecté pour mettre à jour un bénéficiaire');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Appel à l'API pour mettre à jour le bénéficiaire
      const savedBeneficiary = await apiUpdateBeneficiary(account, updatedBeneficiary.id, updatedBeneficiary);
      
      // Mettre à jour la liste des bénéficiaires
      const updatedBeneficiaries = beneficiaries.map(b =>
        b.id === savedBeneficiary.id ? savedBeneficiary : b
      );

      setBeneficiaries(updatedBeneficiaries);
      setFilteredBeneficiaries(
        filteredBeneficiaries.map(b =>
          b.id === savedBeneficiary.id ? savedBeneficiary : b
        )
      );

      // Si le bénéficiaire mis à jour est le bénéficiaire actuellement sélectionné,
      // nous mettons également à jour l'état sélectionné
      if (selectedBeneficiary && selectedBeneficiary.id === savedBeneficiary.id) {
        setSelectedBeneficiary(savedBeneficiary);
      }

      setIsEditingBeneficiary(false);
      setBeneficiaryToEdit(null);
      
    } catch (err) {
      console.error('Erreur lors de la mise à jour du bénéficiaire:', err);
      setError('Impossible de mettre à jour le bénéficiaire. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  // Ajouter un nouveau bénéficiaire
  const handleAddBeneficiary = async () => {
    // Validation
    if (
      !newBeneficiary.name.trim() ||
      !newBeneficiary.address.trim() ||
      !newBeneficiary.isAddressValid
    ) {
      console.error('Validation failed');
      return;
    }

    // Vérifier que l'utilisateur est connecté
    if (!isConnected || !account) {
      console.error('User not connected');
      setError('Vous devez être connecté pour ajouter un bénéficiaire');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Appel à l'API pour créer le bénéficiaire
      const createdBeneficiary = await apiCreateBeneficiary(account, {
        name: newBeneficiary.name.trim(),
        address: newBeneficiary.address.trim(),
        email: newBeneficiary.email.trim(),
        phone: newBeneficiary.phone.trim(),
        notes: newBeneficiary.notes.trim(),
        isAddressValid: true, // Nous avons déjà validé l'adresse
      });

      // Mettre à jour la liste des bénéficiaires
      const updatedBeneficiaries = [...beneficiaries, createdBeneficiary];
      setBeneficiaries(updatedBeneficiaries);
      setFilteredBeneficiaries(updatedBeneficiaries);

      // Réinitialiser le formulaire
      setNewBeneficiary({
        name: '',
        address: '',
        email: '',
        phone: '',
        notes: '',
        isAddressValid: false,
      });

      // Fermer le modal
      setIsAddingBeneficiary(false);
      
    } catch (err) {
      console.error('Erreur lors de l\'ajout du bénéficiaire:', err);
      setError('Impossible d\'ajouter le bénéficiaire. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  // Supprimer un bénéficiaire
  const handleDeleteBeneficiary = async (id: string) => {
    // Vérifier que l'utilisateur est connecté
    if (!isConnected || !account) {
      console.error('User not connected');
      setError('Vous devez être connecté pour supprimer un bénéficiaire');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Appel à l'API pour supprimer le bénéficiaire
      await apiDeleteBeneficiary(account, id);
      
      // Mettre à jour la liste des bénéficiaires
      const updatedBeneficiaries = beneficiaries.filter(b => b.id !== id);
      setBeneficiaries(updatedBeneficiaries);
      setFilteredBeneficiaries(updatedBeneficiaries);

      // Si le bénéficiaire supprimé est le bénéficiaire actuellement sélectionné,
      // nous effaçons également l'état sélectionné
      if (selectedBeneficiary && selectedBeneficiary.id === id) {
        setSelectedBeneficiary(null);
      }
      
    } catch (err) {
      console.error('Erreur lors de la suppression du bénéficiaire:', err);
      setError('Impossible de supprimer le bénéficiaire. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  // Sélectionner un bénéficiaire
  const handleSelectBeneficiary = (beneficiary: Beneficiary) => {
    setSelectedBeneficiary(beneficiary);
  };

  // Charger les bénéficiaires au changement d'état de connexion du wallet
  useEffect(() => {
    if (isConnected && account) {
      loadBeneficiaries();
    }
  }, [isConnected, account]);

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
    isLoading,
    error,
    
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
