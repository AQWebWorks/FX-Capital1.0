import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  EN: {
    translation: {
      "Select Language": "Select Language",
      "Authentication": "Authentication",
      "Personal Information": "Personal Information",
      "Default Fiat Currency": "Default Fiat Currency",
      "About Us": "About Us",
      "Exit": "Exit",
      "Verified": "Verified",
      "Unverified": "Unverified",
      "Are you sure you want to logout?": "Are you sure you want to logout?",
      "Cancel": "Cancel",
      "Logout": "Logout",
      "Dashboard": "Dashboard",
      "Markets": "Markets",
      "Trading": "Trading",
      "Finance": "Finance",
      "Assets": "Assets",
      "Settings": "Settings",
      "Guest User": "Guest User",
      "Balance": "Balance"
      // Add all other text keys used in your app
    },
  },
  ES: {
    translation: {
      "Select Language": "Seleccionar idioma",
      "Authentication": "Autenticación",
      "Personal Information": "Información personal",
      "Default Fiat Currency": "Moneda predeterminada",
      "About Us": "Sobre nosotros",
      "Exit": "Salir",
      "Verified": "Verificado",
      "Unverified": "No verificado",
      "Are you sure you want to logout?": "¿Estás seguro de que quieres cerrar sesión?",
      "Cancel": "Cancelar",
      "Logout": "Cerrar sesión",
      "Dashboard": "Tablero",
      "Markets": "Mercados",
      "Trading": "Comercio",
      "Finance": "Finanzas",
      "Assets": "Activos",
      "Settings": "Configuraciones",
      "Guest User": "Usuario invitado",
      "Balance": "Saldo"
      // Add other keys for Spanish
    },
  },
  FR: {
    translation: {
      "Select Language": "Choisir la langue",
      "Authentication": "Authentification",
      "Personal Information": "Informations personnelles",
      "Default Fiat Currency": "Devise par défaut",
      "About Us": "À propos de nous",
      "Exit": "Quitter",
      "Verified": "Vérifié",
      "Unverified": "Non vérifié",
      "Are you sure you want to logout?": "Êtes-vous sûr de vouloir vous déconnecter ?",
      "Cancel": "Annuler",
      "Logout": "Déconnexion",
      "Dashboard": "Tableau de bord",
      "Markets": "Marchés",
      "Trading": "Trading",
      "Finance": "Finance",
      "Assets": "Actifs",
      "Settings": "Paramètres",
      "Guest User": "Utilisateur invité",
      "Balance": "Solde"
      // Add other keys for French
    },
  },
  // Add more languages here...
};

i18n.use(initReactI18next).init({
  resources,
  lng: "EN",
  fallbackLng: "EN",
  interpolation: { escapeValue: false },
});

export default i18n;
