# AxoNoël

Page d'accueil statique (PWA) qui liste les petits jeux de Noël Axopen. Aucun build, aucun serveur : un double-clic sur `index.html` suffit.

## Ajouter un jeu

1. Déposer la miniature dans `images/` (idéalement 640×400, WebP ou JPG).
2. Ajouter une entrée dans le tableau `window.GAMES` de `games.js` :

```json
{
  "title": "Nom du jeu",
  "description": "Une phrase d'accroche.",
  "image": "images/mon-jeu.webp",
  "url": "https://lien-vers-le-jeu/",
  "tag": "Nouveau"
}
```

`tag` est optionnel. Une image manquante est remplacée par `images/placeholder.svg`.

Pas besoin de toucher au service worker : `games.js` et les pages sont servis « réseau d'abord », les images en « stale-while-revalidate ».
Si tu modifies `index.html`, `style.css` ou `app.js`, incrémente `CACHE` dans `sw.js` (`axonoel-v2`, …) pour forcer la mise à jour chez ceux qui ont installé l'app.

## Tester en local

Ouvrir `index.html` directement dans le navigateur. Seule la partie PWA (installation, hors-ligne) demande un hébergement HTTPS : en `file://` le service worker est simplement ignoré.

## Déployer

Pousser le dossier tel quel sur GitHub Pages / GitLab Pages. Tous les chemins sont relatifs, la page fonctionne aussi sous un sous-chemin (`/axonoel/`). HTTPS est requis pour l'installation PWA (fourni par Pages).

## Charte

Couleurs, police Inter (sous-ensemble latin en woff2) et logos issus du kit de communication Axopen 2024. Animations (neige, guirlande, étoiles) désactivées automatiquement si l'OS demande de réduire les animations.
