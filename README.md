# 🧢 Casqueta Halawa - Boutique Streetwear

Bienvenue sur la boutique en ligne **Casqueta Halawa**, une plateforme e-commerce moderne, rapide et conçue spécifiquement pour le marché streetwear marocain.

Ce projet a été pensé pour offrir la meilleure **expérience utilisateur (UX)** possible à vos clients, tout en vous garantissant une **gestion simplifiée, autonome et 100% gratuite** (aucun frais d'hébergement ou de base de données).

---

## ✨ Fonctionnalités Principales (Côté Client)

*   **Design "Clean Streetwear"** : Une esthétique premium, épurée et moderne (inspirée des grands équipementiers sportifs) pour mettre en valeur les casquettes.
*   **Parcours d'achat optimisé** : 
    *   Catalogue sous forme de "Mur" de casquettes.
    *   Tiroir panier dynamique (Cart Drawer) qui ne recharge jamais la page.
    *   Bouton "Commander" rapide.
*   **Système de Promotions Intelligent** : 
    *   Le panier calcule automatiquement les offres (ex: "2 achetées = -50 DH" ou "3 achetées = 4ème offerte").
    *   Une jauge de progression s'affiche pour inciter le client à ajouter plus d'articles (ex: *"Plus qu'1 article pour une casquette offerte !"*), augmentant ainsi le panier moyen.
*   **Commande ultra-simplifiée** : Au lieu d'un paiement par carte (frein à l'achat au Maroc), la validation du panier génère un message WhatsApp pré-rempli avec le récapitulatif détaillé de la commande pour un paiement à la livraison.
*   **Hyper-rapide et Responsive** : Le site s'adapte parfaitement aux mobiles, tablettes et ordinateurs. Les images sont compressées automatiquement (format WebP) pour un chargement instantané même en 4G.

---

## 🛠️ Espace d'Administration (Back-Office)

Vous disposez d'un espace privé et sécurisé par mot de passe pour gérer votre boutique en toute autonomie : `votresite.com/admin.html`

*   **Gestion des Produits** : Ajoutez de nouvelles casquettes, modifiez les prix, les descriptions ou supprimez des modèles en un clic.
*   **Upload d'images automatique** : Ajoutez directement les photos depuis votre ordinateur, elles sont envoyées et optimisées automatiquement dans le cloud.
*   **Gestion des Stocks en temps réel** : Un simple clic sur le bouton "Stock" permet de passer une casquette en "ÉPUISÉ". Elle sera immédiatement grisée sur le site public et impossible à commander.
*   **Bannière et Promotions dynamiques** : Modifiez le texte défilant en haut du site et activez/désactivez vos règles de promotion directement depuis votre tableau de bord.

---

## 💻 Stack Technique (Pour les développeurs)

L'architecture a été choisie pour être performante, sans serveur à maintenir (Serverless) et **totalement gratuite** à l'usage :

*   **Front-End** : HTML5, CSS3 (Vanilla, variables CSS), JavaScript ES6. 
*   **Base de données** : Firebase Firestore (Temps réel, gratuit).
*   **Authentification** : Firebase Auth (Email / Mot de passe pour l'admin).
*   **Hébergement & Optimisation des images** : Cloudinary (Livraison ultra-rapide des assets visuels).

---

> *Note: Ce projet est prêt à être déployé sur des plateformes d'hébergement statique gratuites telles que Vercel, Netlify ou Firebase Hosting.*
