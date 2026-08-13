# Plan de refonte — Casqueta Halawa (prompts pour Antigravity)

Contexte pour toi : le site actuel (`index-13.html`, `style.css`, `script.js`) a déjà une palette proche du logo et une structure correcte (hero/intro → promo → mur des casquettes → comment commander → contact/footer). Les 2 vrais manques : (1) l'identité visuelle n'exploite pas encore assez le logo (crown, skyline, brush script, texture graffiti), et (2) tout est codé en dur — aucune persistance, donc pas de vrai back-office possible tant qu'il n'y a pas de base de données.

Fais les tâches **dans l'ordre**, une par une. Teste après chacune avant de passer à la suivante.

---

## Tâche 1 — Nouvelle direction artistique (le style actuel ne convient pas)

```
Voici le logo de la marque (crown + monogramme CH sur une casquette, skyline de Casablanca avec la mosquée Hassan II et un tramway, palmiers, éclats de peinture graffiti teal/gold/red, typographie brush script noire pour "Casqueta Halawa", sous-titre "Casablanca Street Fashion").

Le style visuel actuel du site (index-13.html + style.css) ne me convient pas plus que ça — je ne veux pas juste l'ajuster, je veux une vraie proposition de nouveau style, plus originale, en repartant du logo comme seule référence.

Objectif : propose-moi une nouvelle direction artistique complète pour la home, en gardant la même structure de contenu (header sticky avec logo + nav, hero avec intro de la marque, bandeau promo défilant, section #collection "mur des casquettes", section #about, section "comment commander" en 3 étapes, section #contact, footer) mais en revoyant vraiment le style visuel : palette (tu peux réutiliser tout ou partie de --cream/--ink/--teal/--teal-deep/--gold/--red, ou proposer des nuances différentes si ça sert mieux le logo), typographie, mise en page du hero, traitement graphique (texture street/graffiti, formes, bordures, ombres), ambiance générale.

Avant de coder, décris-moi en 3-4 phrases la direction que tu comptes prendre (nom/ambiance du style, ce qui change concrètement par rapport à l'existant) pour que je valide, puis applique-la à index-13.html et style.css.

Contraintes à respecter quoi qu'il arrive :
1. Le style doit rester simple à lire malgré l'originalité — pas de surcharge, pas d'éléments qui nuisent à la lisibilité des prix/CTA.
2. Le site doit rester cohérent visuellement avec le logo (mêmes familles de couleurs/esprit street Casablanca), pas juste "un joli style au hasard".
3. Garde tout le JS de navigation, panier, checkout WhatsApp intact — ne touche pas à script.js dans cette tâche, seulement à index-13.html (structure/markup si besoin) et style.css.
4. Ne casse aucune fonctionnalité existante (drawer panier, modal checkout, scroll reveal, responsive mobile).
```

---

## Tâche 2 — Refonte du cadre photo produit (mur + fiche produit)

```
Objectif : redessiner .slot-frame / .cap-photo (mur des casquettes, classe .slot dans #wallGrid) et .product-visual / .cap-photo (fiche produit) pour un cadre simple mais original, cohérent avec le logo (teal/gold/red, ink, style "patch/écusson").

Contraintes :
- Le cadre doit rester simple (pas de skeuomorphisme lourd), mais avoir une signature visuelle propre à la marque : par exemple un liseré façon patch brodé, un coin coupé, une pastille couleur, ou un effet "polaroid urbain" — choisis UNE direction forte et applique-la de façon cohérente au mur ET à la fiche produit.
- Le fond actuel en dashed-border/diagonale (.slot-frame) doit être remplacé par quelque chose de plus travaillé mais toujours léger en poids (CSS uniquement, pas de nouvelles images).
- Garde le hover actuel (translateY + ombre portée façon logo/ink) sur .slot, tu peux l'affiner.
- Le prix (.price-tag) et le nom (.slot-name) doivent rester lisibles et bien intégrés au nouveau cadre.
- Vérifie le rendu en mobile (grille .wall-grid) et sur la fiche produit (.product-grid) — les deux cadres doivent utiliser le même langage visuel.

Ne touche qu'à style.css (et au markup dans index-13.html/script.js seulement si strictement nécessaire pour le nouveau cadre).
```

---

## Tâche 3 — Base de données produits (préalable technique au back-office)

```
Objectif : remplacer le tableau `products` codé en dur dans script.js par des données stockées dans une base de données, pour permettre plus tard un back-office qui persiste vraiment les changements.

Mets en place Firebase (Firestore pour les données produits + Firebase Storage pour les images, Firebase Hosting si pertinent) car c'est gratuit pour ce volume, sans serveur à maintenir, et simple à connecter à un site statique HTML/JS :
1. Crée une collection Firestore "products" avec les champs : id, name, price, img (URL Storage), desc, sold_out (boolean), created_at.
2. Ajoute une collection "promotions" (ou des champs sur un document "settings") pour stocker les règles de promo actuelles (ex: "2 achetées = -50 DH", "3 achetées = 4ème offerte") de façon éditable, au lieu du texte en dur dans le bandeau promo et dans cartPromo().
3. Migre les 18 produits existants (avec leurs images actuelles dans assets/images/) vers Firestore + Storage via un script de migration ponctuel.
4. Modifie script.js pour charger les produits et les promotions depuis Firestore au chargement de la page (au lieu du tableau en dur), en gardant EXACTEMENT le même rendu visuel et les mêmes fonctions (dotHTML, openProduct, cartPromo, etc.) — seule la source des données change.
5. Affiche un badge "ÉPUISÉ" sur les produits où sold_out=true, à la fois sur le mur (.slot) et sur la fiche produit, et empêche l'ajout au panier dans ce cas (bouton désactivé + message clair).
6. Garde un état de chargement propre (ex: squelette ou spinner discret pendant que les produits arrivent de Firestore) pour éviter un mur vide au premier chargement.

Explique-moi à la fin les identifiants/config Firebase que je dois créer moi-même dans la console Firebase (projet, clé API, etc.) puisque tu ne peux pas créer le compte à ma place.
```

---

## Tâche 4 — Back-office admin (CRUD produits, stock, promotions)

```
Objectif : créer une page d'administration séparée (ex: admin.html + admin.js), non liée dans la nav publique, permettant au gérant de :
1. Voir la liste de tous les produits (nom, prix, statut, aperçu photo).
2. Ajouter un nouveau produit (nom, prix, description, image — upload direct vers Firebase Storage).
3. Modifier un produit existant (tous les champs).
4. Supprimer un produit (avec confirmation).
5. Basculer un produit en "épuisé" / "disponible" en un clic (toggle).
6. Éditer les règles de promotion actuelles (le texte du bandeau défilant + les seuils utilisés par cartPromo côté site public), sans toucher au code.

Contraintes :
- Le style de l'admin doit être simple et fonctionnel (formulaires clairs, tableaux/listes), en réutilisant les variables CSS de style.css (--ink, --teal, --gold, --red) pour rester cohérent avec l'identité de marque, mais sans chercher l'esthétique "vitrine" du site public — priorité à la clarté d'usage pour quelqu'un de non-technique.
- Chaque action (ajout/modif/suppression/toggle épuisé/modif promo) doit écrire directement dans Firestore/Storage et se refléter immédiatement sur le site public au rechargement.
- Prévois des messages de confirmation clairs ("Produit ajouté", "Modifications enregistrées", etc.) et une gestion d'erreur simple si l'upload image échoue.
- N'ajoute pas encore d'authentification dans cette tâche — elle vient dans la tâche suivante. Pour l'instant l'admin est accessible juste via l'URL admin.html.
```

---

## Tâche 5 — Sécuriser l'accès admin

```
Objectif : protéger admin.html pour que seul le gérant puisse y accéder et modifier les données.

Mets en place Firebase Authentication (email/mot de passe) :
1. Crée un compte admin unique (email + mot de passe que je choisirai) via la console Firebase — indique-moi précisément les étapes à faire de mon côté.
2. Ajoute un écran de connexion sur admin.html : sans être connecté, on ne voit ni les données ni les formulaires, juste le formulaire de login.
3. Mets à jour les règles de sécurité Firestore/Storage pour que SEUL un utilisateur authentifié puisse écrire (create/update/delete) dans "products" et "promotions" — la lecture reste publique (nécessaire pour que le site vitrine affiche les produits sans compte).
4. Ajoute un bouton "Se déconnecter" visible une fois connecté.
5. Vérifie que ces règles empêchent bien un utilisateur non connecté de modifier les données même en appelant Firestore directement depuis la console du navigateur.

Donne-moi à la fin un résumé clair de : l'URL de connexion admin, et le fait que je dois garder le mot de passe confidentiel (ce n'est pas un compte partagé publiquement).
```

---

## Tâche 6 — Finitions (responsive, accessibilité, performance)

```
Objectif : passe de finition sur l'ensemble du site public (index-13.html/style.css/script.js), après les tâches précédentes.

Vérifie et corrige si besoin :
1. Rendu mobile complet : header, hero, mur des casquettes, fiche produit, drawer panier, modal checkout — sur des largeurs 360px à 768px.
2. Accessibilité : contraste texte suffisant sur tous les nouveaux éléments visuels ajoutés en tâche 1 et 2, alt text correct sur toutes les images produits (déjà en place, à vérifier), focus visible au clavier sur les nouveaux composants.
3. Performance : compresse/optimise les images produits migrées vers Firebase Storage si elles sont lourdes (viser du WebP si possible), et vérifie qu'il n'y a pas de flash de contenu vide trop long au chargement à cause de l'appel Firestore.
4. Repasse une fois sur le bandeau promo et les textes de promotion pour vérifier qu'ils reflètent bien les données venant de Firestore (tâche 3) et pas un reliquat codé en dur.

Liste-moi à la fin tout ce que tu as changé dans cette tâche.
```

---

**Un conseil avant de commencer** : fais un commit git (ou une copie du dossier) juste avant la Tâche 1, et un autre juste avant la Tâche 3 (c'est celle qui change le plus la mécanique interne du site, en passant de données codées en dur à Firebase).
