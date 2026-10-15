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

Pas besoin de toucher au service worker : son cache est nommé d'après le tag déployé, donc chaque nouvelle version invalide l'ancienne chez ceux qui ont installé l'app.

## Tester en local

Ouvrir `index.html` directement dans le navigateur. Seule la partie PWA (installation, hors-ligne) demande un hébergement HTTPS : en `file://` le service worker est simplement ignoré.

## Déployer

Le déploiement sur GitHub Pages se fait en poussant un tag `v*` :

```sh
git tag v1.0.0
git push origin v1.0.0
```

Le workflow `.github/workflows/deploy.yml` remplace `dev` par le nom du tag dans le pied de page (`Version v1.0.0`) et dans le nom du cache du service worker, puis publie le dossier sur Pages.

Prérequis (une seule fois) : *Settings → Pages → Build and deployment → Source : **GitHub Actions***.

Tous les chemins sont relatifs, la page fonctionne donc sous le sous-chemin `/axonoel/`.

## Charte

Couleurs, police Inter (sous-ensemble latin en woff2) et logos issus du kit de communication Axopen 2024. Animations (neige, guirlande, étoiles) désactivées automatiquement si l'OS demande de réduire les animations.
