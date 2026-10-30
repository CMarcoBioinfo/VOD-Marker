# Marqueur VOD Twitch

Petit outil web autonome pour noter les moments forts d’un stream avec le **temps écoulé de sa VOD**, afin de transmettre les repères à votre monteuse. Interface française/anglaise, thème sombre, marqueurs modifiables, notes, historique et export texte.

## Aperçu

La page rassemble les réglages de synchronisation, une grande horloge avec bouton de marquage, la liste des repères et les options d’export. La mise en page s’adapte à une petite fenêtre et aux mobiles.

## Démarrer

Téléchargez ou décompressez le projet et double-cliquez sur `index.html`. Aucun serveur, installation ou compilation n’est nécessaire. Les modes manuel et local fonctionnent hors ligne. Le navigateur peut limiter l’API Twitch depuis `file://` ; dans ce cas, essayez GitHub Pages ou un mode manuel.

## Publier sur GitHub Pages (sans ligne de commande)

1. Créez un dépôt GitHub, par exemple `marqueur-vod`.
2. Dans le dépôt, sélectionnez **Add file → Upload files** et déposez tous les fichiers et dossiers (`css`, `js`, `assets`).
3. Validez avec **Commit changes**.
4. Ouvrez **Settings → Pages**, choisissez **Deploy from a branch**, branche `main`, dossier `/ (root)`, puis **Save**.
5. Ouvrez l’adresse indiquée dans Pages après publication. HTTPS facilite l’API de copie et l’installation PWA.

## Application Twitch pour le mode API (gratuit)

Chaque personne doit créer sa propre application ; ne partagez jamais votre token.

1. Connectez-vous gratuitement sur [dev.twitch.tv/console/apps](https://dev.twitch.tv/console/apps).
2. Cliquez sur **Register Your Application**, donnez un nom et une URL de redirection valide demandée par Twitch (par exemple `http://localhost`).
3. Choisissez **Application Integration**, puis validez.
4. Dans **Manage**, copiez le **Client ID**.
5. Pour obtenir un token utilisateur sans publier de secret : dans **OAuth Redirect URLs**, enregistrez l’adresse exacte de la page qui ouvrira l’outil (sur GitHub Pages, l’URL HTTPS de votre page, sans chemin supplémentaire si possible). Suivez ensuite le parcours **OAuth Authorization Code / User Token** présenté par Twitch, avec le Client ID de cette application et l’URL enregistrée comme redirection. Pour l’autorisation implicite, Twitch redirige vers cette URL ; le token apparaît après `access_token=` dans la partie située après `#` de l’adresse. Ne copiez que la valeur du token, jamais l’URL complète. Cette application utilise le token pour appeler Helix directement ; n’utilisez jamais le Client Secret dans le navigateur. Les écrans de Twitch évoluent : consultez la documentation OAuth officielle de Twitch si le parcours de la console a changé.
6. Collez le Client ID, le token et le nom de la chaîne dans l’outil, puis choisissez **Vérifier / connecter**. Le token est masqué et ne quitte pas le stockage local du navigateur ; l’appel Helix direct est la seule requête envoyée par le programme. Un token utilisateur expire : remplacez-le par un nouveau token obtenu dans le parcours OAuth.

Un token expiré doit être renouvelé dans le parcours OAuth puis remplacé ici. Les limites Twitch, le réseau et les restrictions CORS peuvent empêcher l’API ; le mode manuel est le secours recommandé.

## Extension Chrome / Edge : bouton REC sur Twitch

Le dossier `extension/` contient une extension Chromium (Chrome et Edge) qui ajoute un bouton flottant **● REC** sur Twitch et accepte la touche **M** lorsque Twitch est au premier plan. Le marqueur est créé et sauvegardé par l’index déjà ouvert, avec son mode de timecode, son décalage configuré et son réglage « Retrancher ».

1. Publiez l’application avec GitHub Pages (ou servez-la en HTTP(S)). Pour ce dépôt, l’adresse par défaut préremplie est `https://cmarcobioinfo.github.io/VOD-Marker/`.
2. Dans Chrome, ouvrez `chrome://extensions` (dans Edge : `edge://extensions`) et activez **Mode développeur**.
3. Choisissez **Charger l’extension non empaquetée**, puis sélectionnez le dossier `extension/` de ce projet.
4. Ouvrez le menu de l’extension et cliquez une seule fois sur **Autoriser et ouvrir l’application**. L’adresse est mémorisée et le navigateur demande l’autorisation pour ce site. Si GitHub Pages n’est pas encore publié, activez Pages dans **Settings → Pages** et réessayez.
5. L’application s’ouvre dans un onglet en arrière-plan au prochain démarrage du navigateur. Si elle n’est pas ouverte et que vous cliquez sur **● REC**, l’extension l’ouvre ; cliquez encore sur REC pour envoyer le premier marqueur. Sur Twitch, le raccourci **M** est également disponible.

Le raccourci agit uniquement quand l’onglet Twitch est actif et n’intercepte pas les touches dans les champs de saisie. Après la configuration initiale, l’extension mémorise l’adresse et rouvre l’index dans un onglet en arrière-plan au démarrage du navigateur ; elle ouvre aussi l’index si REC est utilisé alors qu’il est fermé. Rechargez Twitch après l’installation ou la mise à jour de l’extension. Si l’index est ouvert via `file://`, utilisez plutôt une adresse HTTP(S). Cette extension est actuellement pour Chrome/Edge (Manifest V3), pas Firefox. Elle n’accède pas au token Twitch. Pour arrêter, désactivez l’extension dans la page des extensions du navigateur.


## Modes et fiabilité

1. **API Twitch (fiable)** : utilise `started_at` de Helix ; durée = heure UTC actuelle moins l’heure de début UTC. Une vérification toutes les cinq minutes repère un live relancé et conserve les marqueurs en créant un segment.
2. **Manuel (à vérifier)** : entrez le temps actuel (`01:12:30`) ou l’heure locale de début (`18:02`). **Resynchroniser** permet de corriger l’écart.
3. **Démarrage local (estimation)** : démarre l’horloge au clic, avec décalage initial facultatif.

Toutes les durées sont calculées depuis `Date.now()`, et non depuis un compteur d’intervalle : le temps reste juste après veille ou onglet inactif. La date réelle est présentée à l’heure locale. Le réglage « retrancher » compense le délai de réaction. Une valeur négative est ramenée à zéro.

## Confidentialité et limites

Les sessions, marqueurs, préférences et identifiants Twitch sont sauvegardés dans le `localStorage` du navigateur. Aucun serveur de ce projet ne reçoit de données. Le stockage local n’est pas chiffré : évitez les appareils publics, et effacez les données du navigateur après usage partagé. Une panne ou saturation du stockage est signalée ; la sauvegarde peut alors échouer. L’historique est propre au navigateur et n’est pas synchronisé entre appareils. La PWA utilise un service worker uniquement sur un site HTTP(S), pas en `file://`.

**Ce projet n’est pas affilié à Twitch.**

## English (short)

A dependency-free static Twitch VOD timecode marker. Open `index.html` locally or publish with GitHub Pages. It supports Twitch API, manual sync, and local-start modes. Credentials and markers stay in browser storage; only API mode contacts Twitch. Each user should create their own Twitch application. This project is not affiliated with Twitch.


## Utilisation

- Le raccourci par défaut est **M** ; cliquez dans le champ de raccourci et tapez une autre touche pour le changer. Les raccourcis ne s’activent pas pendant la saisie dans un champ.
- Cliquez sur **Marquer ce moment** ou utilisez la touche choisie. Une note courte et une correction de timecode sont accessibles avec **Modifier** sur le marqueur.
- Vous pouvez annuler la dernière suppression, vider la session (une copie est archivée), copier ou télécharger la liste. L’en-tête et la date/heure/notes sont configurables.
- La reprise automatique utilise le stockage du navigateur. Pour une nouvelle session, utilisez « Vider la session ».

# Marqueur VOD Twitch

Petit outil web autonome pour noter les moments forts d’un stream avec le **temps écoulé de sa VOD**, afin de transmettre les repères à votre monteuse. Interface française/anglaise, thème sombre, marqueurs modifiables, notes, historique et export texte.

## Aperçu de l’interface

L’écran comprend les paramètres de synchronisation, une grande horloge de timecode et un bouton de marquage, la liste des repères, puis les réglages d’export et l’historique. Le thème sombre est adapté à une fenêtre posée à côté du stream ; la mise en page s’adapte aux mobiles.

## Lancer en local

Téléchargez ou décompressez le projet, puis double-cliquez sur `index.html`. Aucun serveur, installation ou compilation n’est nécessaire. Les modes manuel et local fonctionnent hors ligne. L’accès API à Twitch peut être restreint par le navigateur lorsque la page est ouverte en `file://`; dans ce cas, utilisez un hébergement GitHub Pages ou un mode manuel.

## Modes de calcul et fiabilité

1. **API Twitch — fiable** : saisissez la chaîne et les identifiants API personnels. Helix retourne `started_at`; le timecode est calculé à partir de l’horloge système et de cet instant UTC. Vérification périodique toutes les cinq minutes ; un redémarrage du live est signalé et démarre un nouveau segment sans supprimer les anciens repères.
2. **Synchronisation manuelle — à vérifier** : renseignez le temps écoulé (par exemple `01:12:30`) ou l’heure locale de début (`18:02`). Le bouton de resynchronisation reste disponible pour corriger le décalage.
3. **Démarrage local — estimation** : le timecode avance depuis le clic sur Démarrer, avec un décalage initial facultatif. À utiliser en dernier recours.

Le réglage « retrancher » enlève quelques secondes du timecode capturé pour compenser le délai de réaction. La date réelle affichée est locale ; les calculs reposent sur des timestamps. Une durée négative est ramenée à zéro.

## Créer ses identifiants Twitch (gratuit)

Chaque personne qui utilise l’API doit créer sa propre application Twitch ; ne partagez pas votre token et ne le publiez jamais.

1. Connectez-vous gratuitement sur [dev.twitch.tv/console/apps](https://dev.twitch.tv/console/apps).
2. Cliquez sur **Register Your Application** (enregistrer une application).
3. Donnez-lui un nom, ajoutez une URL de redirection OAuth valide requise par le formulaire Twitch (par exemple `http://localhost`), choisissez **Application Integration** et validez.
4. Ouvrez **Manage** pour copier le **Client ID**.
5. Générez un token d’accès utilisateur via l’outil OAuth officiel Twitch ou un client OAuth fiable, avec le Client ID de votre application. Le jeton doit autoriser l’accès en lecture aux informations de live (`streams:read`). Twitch peut faire évoluer ses écrans et mécanismes OAuth : suivez les indications actuelles de la console et ne saisissez le secret que dans votre copie locale de l’outil.
6. Dans le marqueur, saisissez Client ID, token et nom de chaîne, puis cliquez **Vérifier / connecter**. Le token reste masqué et enregistré uniquement dans le stockage local du navigateur.

Les identifiants ne sont jamais présents dans les fichiers du projet. Sur un ordinateur partagé, effacez les données du site/navigateur après usage. Les appels Helix peuvent échouer en cas de token expiré, limites Twitch, réseau ou restrictions CORS ; le message affiché indique le secours adapté. Un token utilisateur est sensible : privilégiez un token de courte durée et renouvelez-le lorsqu’il expire.

## GitHub Pages, sans ligne de commande

1. Créez un dépôt GitHub, par exemple `marqueur-vod`.
2. Dans le dépôt, utilisez **Add file → Upload files** et ajoutez les fichiers du projet avec leurs dossiers (`css`, `js`, `assets`).
3. Cliquez **Commit changes**.
4. Ouvrez **Settings → Pages**. Dans **Build and deployment**, choisissez **Deploy from a branch**, sélectionnez `main` et `/ (root)`, puis **Save**.
5. Patientez jusqu’à ce que GitHub affiche l’adresse du site dans Pages, puis ouvrez-la. HTTPS permet aussi l’API Clipboard et l’installation PWA dans les navigateurs compatibles.

## Données, limites et sécurité

Les marqueurs, sessions, préférences, Client ID et token restent dans le `localStorage` du navigateur. Rien n’est envoyé à un serveur du projet ; seul le mode API contacte directement `api.twitch.tv`. Une panne de stockage est signalée, mais les changements non sauvegardés peuvent être perdus. L’historique est conservé dans le navigateur courant ; ce n’est pas une synchronisation entre appareils. Les identifiants `localStorage` ne sont pas chiffrés : protégez votre appareil et ne saisissez pas de token sur un appareil public. Le service et l’API Twitch sont soumis à leurs propres disponibilités, règles et quotas. Le mode API avec `file://` dépend des restrictions du navigateur. Le téléchargement et la copie sont destinés aux navigateurs modernes.

Ce projet est indépendant et **n’est pas affilié à Twitch**.

## English (short)

A static, dependency-free Twitch VOD timecode marker. Open `index.html` locally or publish the repository with GitHub Pages. Twitch API, manual sync, and local-start modes are available. Credentials and markers stay in your browser’s local storage; only API mode contacts Twitch. Each API user should create their own Twitch application. This project is not affiliated with Twitch.
