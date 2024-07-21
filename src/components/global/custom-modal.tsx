"use client";

// Importation du hook useModal à partir du contexte du fournisseur de modal
import { useModal } from "@/providers/modal-provider";
import React from "react";

// Importation des composants Dialog et de ses sous-composants
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

// Définition des types pour les props du composant CustomModal
type Props = {
  title: string; // Titre du modal
  subheading: string; // Sous-titre du modal
  children: React.ReactNode; // Contenu du modal
  defaultOpen?: boolean; // Indique si le modal doit être ouvert par défaut
};

// Définition du composant CustomModal
const CustomModal = ({ children, defaultOpen, subheading, title }: Props) => {
  // Utilisation du hook useModal pour accéder à l'état et aux fonctions du modal
  const { isOpen, setClose } = useModal();

  return (
    // Composant Dialog pour le modal
    <Dialog
      open={isOpen || defaultOpen} // Le modal est ouvert si isOpen ou defaultOpen est vrai
      onOpenChange={setClose} // Appelle setClose lors du changement d'état d'ouverture
    >
      {/* Contenu du modal avec des classes CSS pour la mise en page */}
      <DialogContent className="overflow-scroll md:max-h-[700px] md:h-fit h-screen bg-card">
        {/* <DialogTitle>subheading</DialogTitle> Titre du sous-titre */}
        <DialogHeader className="pt-8 text-left">
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>{" "}
          {/* Titre principal */}
          <DialogDescription>{subheading}</DialogDescription>{" "}
          {/* Description / sous-titre */}
          {children} {/* Contenu enfant du modal */}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

// Exportation du composant CustomModal par défaut
export default CustomModal;
