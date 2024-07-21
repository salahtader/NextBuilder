"use client";

// Importation des types nécessaires depuis différentes sources
import { PricesList, TicketDetails } from "@/lib/types";
import { Agency, Contact, Plan, User } from "@prisma/client";
import { createContext, useContext, useEffect, useState } from "react";

// Interface pour les props du ModalProvider
interface ModalProviderProps {
  children: React.ReactNode; // Les enfants de ce composant
}

// Définition du type ModalData pour stocker différentes données possibles pour le modal
export type ModalData = {
  user?: User; // Données utilisateur optionnelles
  agency?: Agency; // Données de l'agence optionnelles
  ticket?: TicketDetails[0]; // Détails du ticket optionnels
  // contact?: Contact
  // plans?: {
  //   defaultPriceId: Plan
  //   plans: PricesList['data']
  // }
};

// Type pour le contexte du modal, incluant les fonctions pour ouvrir et fermer le modal
type ModalContextType = {
  data: ModalData; // Les données à afficher dans le modal
  isOpen: boolean; // Indique si le modal est ouvert
  setOpen: (modal: React.ReactNode, fetchData?: () => Promise<any>) => void; // Fonction pour ouvrir le modal
  setClose: () => void; // Fonction pour fermer le modal
};

// Création du contexte avec des valeurs par défaut
export const ModalContext = createContext<ModalContextType>({
  data: {},
  isOpen: false,
  setOpen: (modal: React.ReactNode, fetchData?: () => Promise<any>) => {},
  setClose: () => {},
});

// Composant ModalProvider qui enveloppe les enfants et fournit le contexte
const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  
  const [isOpen, setIsOpen] = useState(false); // État pour suivre si le modal est ouvert
  const [data, setData] = useState<ModalData>({}); // État pour stocker les données du modal
  const [showingModal, setShowingModal] = useState<React.ReactNode>(null); // État pour stocker le composant modal actuel
  const [isMounted, setIsMounted] = useState(false); // État pour vérifier si le composant est monté

  // Utilisation de useEffect pour définir isMounted à vrai après le montage
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fonction pour ouvrir le modal avec éventuellement des données à récupérer
  const setOpen = async (
    modal: React.ReactNode,
    fetchData?: () => Promise<any>
  ) => {
    if (modal) {
      if (fetchData) {
        // Mise à jour des données du modal avec les données récupérées
        setData({ ...data, ...(await fetchData()) } || {});
      }
      setShowingModal(modal); // Mise à jour du composant modal actuel
      setIsOpen(true); // Ouverture du modal
    }
  };

  // Fonction pour fermer le modal et réinitialiser les données
  const setClose = () => {
    setIsOpen(false);
    setData({});
  };

  // Rendu conditionnel : retour null si le composant n'est pas monté
  if (!isMounted) return null;

  // Rendu du fournisseur de contexte avec les enfants et le modal affiché
  return (
    <ModalContext.Provider value={{ data, setOpen, setClose, isOpen }}>
      {children}
      {showingModal}
    </ModalContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte du modal
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    // Levée d'une erreur si le hook est utilisé en dehors du ModalProvider
    throw new Error("useModal must be used within the modal provider");
  }
  return context;
};

// Exportation par défaut du ModalProvider
export default ModalProvider;
