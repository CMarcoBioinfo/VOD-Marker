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

L’application Twitch officielle de VOD Marker est configurée dans l’outil ; son Client ID est public. Ne partagez jamais votre token.

1. La redirection OAuth enregistrée pour l’application est `https://cmarcobioinfo.github.io/VOD-Marker/` ; utilisez cette adresse exacte dans les réglages Twitch de l’application.
2. Dans VOD Marker, choisissez **API Twitch**, saisissez le nom de la chaîne et cliquez sur **Se connecter avec Twitch**. Twitch demande votre consentement puis vous renvoie vers l’outil.
3. Le token est validé auprès de Twitch, puis conservé dans le stockage local de ce navigateur. Il n’est pas transmis à un serveur VOD Marker. Le Client Secret n’est jamais demandé ni utilisé.

Twitch impose la validation du token au démarrage et toutes les heures ; VOD Marker suit cette règle et efface localement un token révoqué. Utilisez **Déconnecter** pour supprimer le token du navigateur. Les limites Twitch, le réseau et les restrictions CORS peuvent empêcher l’API ; le mode manuel est le secours recommandé.

## Extension Chrome / Edge : bouton REC sur Twitch

Le dossier `extension/` contient une extension Chromium (Chrome et Edge) qui ajoute un bouton flottant **● REC** sur Twitch et accepte la touche **M** lorsque Twitch est au premier plan. Chaque marqueur conserve le nom d’affichage et le login Twitch de la chaîne capturée, en plus du timecode. Ils apparaissent dans la liste et dans l’export pour identifier le streamer de chaque repère, même si le nom de la chaîne change ensuite.

1. Publiez l’application avec GitHub Pages (ou servez-la en HTTP(S)). Pour ce dépôt, l’adresse par défaut préremplie est `https://cmarcobioinfo.github.io/VOD-Marker/`.
2. Dans Chrome, ouvrez `chrome://extensions` (dans Edge : `edge://extensions`) et activez **Mode développeur**.
3. Choisissez **Charger l’extension non empaquetée**, puis sélectionnez le dossier `extension/` de ce projet.
4. Ouvrez le menu de l’extension et cliquez une seule fois sur **Autoriser et ouvrir l’application**. L’adresse est mémorisée et le navigateur demande l’autorisation pour ce site. Si GitHub Pages n’est pas encore publié, activez Pages dans **Settings → Pages** et réessayez.
5. L’application s’ouvre au premier plan lors de la configuration initiale. Sur Twitch, **● REC** ou la touche **M** enregistre le moment sans quitter le stream : le marqueur est envoyé à l’application dans un onglet d’arrière-plan, réutilisé s’il existe déjà. La chaîne est détectée depuis l’adresse Twitch et les informations du live sont actualisées via Helix. Le marqueur est créé sans second clic ; au premier usage, une connexion OAuth peut être nécessaire dans l’onglet de l’application, puis le marqueur est repris après validation.

Le bouton REC se déplace par glisser-déposer et sa position est mémorisée localement. L’extension n’observe pas le DOM de Twitch en continu : elle ajoute le bouton une fois par chargement, sans boucle ni polling. À chaque marqueur, Helix actualise le timecode, le nom public, la catégorie, le titre et le nombre de spectateurs (aucun service supplémentaire). Le raccourci agit uniquement quand l’onglet Twitch est actif et n’intercepte pas les touches dans les champs de saisie. Après la configuration initiale, l’extension mémorise l’adresse ; elle ouvre l’index si REC est utilisé alors qu’il est fermé. L’index n’est pas lancé automatiquement au démarrage, afin d’éviter de consommer des ressources quand il n’est pas utilisé. Rechargez Twitch après l’installation ou la mise à jour de l’extension. L’autorisation de site est limitée à `cmarcobioinfo.github.io`. Cette extension est actuellement pour Chrome/Edge (Manifest V3), pas Firefox. Elle n’accède pas au token Twitch. Pour arrêter, désactivez l’extension dans la page des extensions du navigateur.


## Modes et fiabilité

1. **API Twitch (fiable)** : utilise `started_at` de Helix ; durée = heure UTC actuelle moins l’heure de début UTC. Une vérification toutes les cinq minutes repère un live relancé et conserve les marqueurs en créant un segment.
2. **Manuel (à vérifier)** : entrez le temps actuel (`01:12:30`) ou l’heure locale de début (`18:02`). **Resynchroniser** permet de corriger l’écart.
3. **Démarrage local (estimation)** : démarre l’horloge au clic, avec décalage initial facultatif.

Toutes les durées sont calculées depuis `Date.now()`, et non depuis un compteur d’intervalle : le temps reste juste après veille ou onglet inactif. La date réelle est présentée à l’heure locale. Le réglage « retrancher » compense le délai de réaction. Une valeur négative est ramenée à zéro.

## Confidentialité et limites

Les sessions, marqueurs, préférences et identifiants Twitch sont sauvegardés dans le `localStorage` du navigateur. Aucun serveur de ce projet ne reçoit de données. Le stockage local n’est pas chiffré : évitez les appareils publics, et effacez les données du navigateur après usage partagé. Une panne ou saturation du stockage est signalée ; la sauvegarde peut alors échouer. L’historique est propre au navigateur et n’est pas synchronisé entre appareils. La PWA utilise un service worker uniquement sur un site HTTP(S), pas en `file://`.

**Ce projet n’est pas affilié à Twitch.**

## English (short)

A dependency-free static Twitch VOD timecode marker. Open `index.html` locally or publish with GitHub Pages. It supports Twitch OAuth sign-in, manual sync, and local-start modes. The public Twitch Client ID is configured in the app; OAuth tokens are stored in browser local storage. This project is not affiliated with Twitch.


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

1. **API Twitch — fiable** : connectez-vous via OAuth puis saisissez le nom de la chaîne. Helix retourne `started_at`; le timecode est calculé à partir de l’horloge système et de cet instant UTC. La connexion est vérifiée au démarrage et toutes les heures ; les infos du live sont actualisées toutes les cinq minutes. Un redémarrage est signalé et démarre un nouveau segment sans supprimer les anciens repères.
2. **Synchronisation manuelle — à vérifier** : renseignez le temps écoulé (par exemple `01:12:30`) ou l’heure locale de début (`18:02`). Le bouton de resynchronisation reste disponible pour corriger le décalage.
3. **Démarrage local — estimation** : le timecode avance depuis le clic sur Démarrer, avec un décalage initial facultatif. À utiliser en dernier recours.

Le réglage « retrancher » enlève quelques secondes du timecode capturé pour compenser le délai de réaction. La date réelle affichée est locale ; les calculs reposent sur des timestamps. Une durée négative est ramenée à zéro.

## Connexion Twitch et sécurité

La procédure de connexion et l’URL de redirection de l’application officielle sont décrites dans [Application Twitch pour le mode API](#application-twitch-pour-le-mode-api-gratuit). Le Client ID intégré au projet est public ; le Client Secret n’est pas utilisé dans cette application statique. Le token OAuth reste dans le stockage local non chiffré du navigateur, est validé auprès de Twitch au démarrage et toutes les heures, et peut être supprimé avec **Déconnecter**. Sur un ordinateur partagé, déconnectez-vous puis effacez les données du site. L’accès API peut échouer si Twitch ou le réseau est indisponible ; le mode manuel reste disponible.

## GitHub Pages, sans ligne de commande

1. Créez un dépôt GitHub, par exemple `marqueur-vod`.
2. Dans le dépôt, utilisez **Add file → Upload files** et ajoutez les fichiers du projet avec leurs dossiers (`css`, `js`, `assets`).
3. Cliquez **Commit changes**.
4. Ouvrez **Settings → Pages**. Dans **Build and deployment**, choisissez **Deploy from a branch**, sélectionnez `main` et `/ (root)`, puis **Save**.
5. Patientez jusqu’à ce que GitHub affiche l’adresse du site dans Pages, puis ouvrez-la. HTTPS permet aussi l’API Clipboard et l’installation PWA dans les navigateurs compatibles.

## Données, limites et sécurité

Les marqueurs, sessions, préférences et token restent dans le `localStorage` du navigateur. Le Client ID Twitch intégré est public. Rien n’est envoyé à un serveur du projet ; la connexion OAuth et le mode API contactent directement Twitch. Une panne de stockage est signalée, mais les changements non sauvegardés peuvent être perdus. L’historique est conservé dans le navigateur courant ; ce n’est pas une synchronisation entre appareils. Le token dans `localStorage` n’est pas chiffré : protégez votre appareil et ne vous connectez pas sur un appareil public. Le service et l’API Twitch sont soumis à leurs propres disponibilités, règles et quotas. Le mode API avec `file://` dépend des restrictions du navigateur. Le téléchargement et la copie sont destinés aux navigateurs modernes.

Ce projet est indépendant et **n’est pas affilié à Twitch**.

## English (short)

A static, dependency-free Twitch VOD timecode marker. Open `index.html` locally or publish the repository with GitHub Pages. Twitch API, manual sync, and local-start modes are available. Credentials and markers stay in your browser’s local storage; only API mode contacts Twitch. Each API user should create their own Twitch application. This project is not affiliated with Twitch.
