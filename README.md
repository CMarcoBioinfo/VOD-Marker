# Marqueur VOD Twitch

VOD Marker permet de noter les moments importants d’un live avec leur timecode, puis de copier ou télécharger la liste pour le montage. L’extension Chrome/Edge ajoute un bouton **● REC** directement sur Twitch.

## Utiliser l’extension : guide rapide

> **En bref :** installez l’extension, cliquez une fois sur **Autoriser et ouvrir l’application**, connectez-vous à Twitch, puis utilisez **● REC** sur la page du live. Le raccourci par défaut est **B**.

### 1. Installer l’extension (Chrome ou Edge sur ordinateur)

> **Important :** cette extension est fournie sous forme non empaquetée. Il faut activer le **Mode développeur du navigateur** pour pouvoir la charger. Ce n’est pas un mode à activer dans Twitch ou dans VOD Marker.

1. Téléchargez le projet et décompressez-le dans un dossier que vous ne déplacerez pas. L’extension doit continuer à pouvoir accéder au dossier `extension/`.
2. Ouvrez la page des extensions : `chrome://extensions` dans Chrome ou `edge://extensions` dans Edge.
3. Activez le bouton **Mode développeur** sur cette page.
4. Cliquez sur **Charger l’extension non empaquetée** et choisissez le dossier `extension/` du projet (pas le dossier parent).
5. Si nécessaire, épinglez **Marqueur VOD Twitch — REC** dans le menu des extensions pour retrouver facilement son icône.

### 2. Faire la configuration initiale

1. Cliquez sur l’icône de l’extension dans la barre d’outils du navigateur.
2. Dans la fenêtre qui s’ouvre, cliquez sur **Autoriser et ouvrir l’application**. L’adresse officielle est déjà remplie : gardez-la telle quelle et acceptez l’autorisation d’accès au site si le navigateur la demande.
3. Le site VOD Marker s’ouvre dans un onglet. Dans le mode **API Twitch**, cliquez sur **Se connecter avec Twitch**, puis autorisez la connexion. Il n’est pas nécessaire de créer un compte développeur Twitch ni de saisir une clé.
4. Ouvrez la page du live Twitch et rechargez-la. Le bouton rouge **● REC** doit apparaître.

La configuration de l’extension et la connexion Twitch sont deux autorisations distinctes : l’extension a besoin d’accéder au site VOD Marker, et VOD Marker a besoin de votre autorisation Twitch pour récupérer le timecode du live.

### 3. Marquer un moment pendant le live

- Cliquez sur **● REC**, ou appuyez sur **B** lorsque l’onglet du live Twitch est au premier plan. Le marqueur est envoyé à VOD Marker en arrière-plan : vous pouvez rester sur le stream.
- Le nom de la chaîne est détecté depuis l’adresse Twitch. En mode API, VOD Marker récupère les informations du live et calcule le timecode. Si la connexion Twitch est nécessaire, le site vous demandera de vous connecter et reprendra le marqueur après l’autorisation.
- Pour retrouver les marqueurs, ouvrez l’onglet VOD Marker. Vous pouvez les modifier, ajouter des notes, puis copier ou télécharger la liste.
- Le bouton peut être déplacé par glisser-déposer ; sa position est mémorisée.

### Changer le raccourci

Dans l’onglet VOD Marker, cliquez sur **Changer**, appuyez sur la touche ou combinaison souhaitée, puis cliquez sur **Valider**. Cliquez sur **Annuler** ou appuyez sur **Échap** pour abandonner. Le raccourci affiché à côté de **Changer** est celui à utiliser sur Twitch. Le réglage est enregistré et transmis à l’extension ; gardez l’application ouverte pendant le changement, puis revenez sur l’onglet Twitch. Le raccourci fonctionne quand Twitch est au premier plan, mais pas lorsque vous tapez dans un champ de saisie.

Le raccourci initial est **B**. Évitez **M** si vous ne voulez pas risquer de déclencher aussi le raccourci natif de Twitch pour couper le son. Le bouton **● REC** fonctionne quel que soit le raccourci choisi.

### Si quelque chose ne fonctionne pas

- **Pas de bouton REC :** vérifiez que l’extension est activée, puis rechargez l’onglet Twitch. Après avoir rechargé l’extension dans sa page, rechargez aussi Twitch.
- **Le clic ou le raccourci n’envoie rien :** ouvrez VOD Marker une fois, vérifiez que l’autorisation d’accès au site a été accordée dans la fenêtre de l’extension, puis rechargez Twitch.
- **Le raccourci ne réagit pas :** vérifiez la touche affichée dans VOD Marker, assurez-vous que l’onglet Twitch est actif et que le curseur n’est pas dans un champ de texte. Pour un nouveau raccourci, laissez VOD Marker ouvert pendant sa validation.
- **Le timecode/API ne fonctionne pas :** vérifiez la connexion Internet et l’autorisation Twitch dans VOD Marker. Les modes manuel et démarrage local restent disponibles pour marquer depuis le site, mais l’extension utilise la synchronisation API Twitch.

## Utiliser VOD Marker sans l’extension

Ouvrez le site officiel [VOD Marker](https://cmarcobioinfo.github.io/VOD-Marker/) ou, pour les modes manuel et local, ouvrez `index.html` dans un navigateur. Choisissez un mode de synchronisation :

1. **API Twitch (recommandé)** : connectez-vous, puis indiquez la chaîne si elle n’est pas déjà renseignée. Le timecode est calculé à partir de l’heure de début du live fournie par Twitch.
2. **Manuel** : indiquez le temps écoulé (par exemple `01:12:30`) ou l’heure locale de début (`18:02`) ; vous pourrez resynchroniser au besoin.
3. **Démarrage local** : lancez l’horloge vous-même, avec un décalage initial facultatif. C’est une estimation.

Le raccourci de marquage par défaut est **B**. Le réglage **Retrancher** compense le délai de réaction en retirant les secondes choisies du timecode enregistré.

## Confidentialité et limites

Les marqueurs, préférences et token Twitch sont conservés dans le stockage local de votre navigateur ; ils ne sont pas synchronisés entre appareils. Le token n’est pas chiffré : ne vous connectez pas sur un appareil public et utilisez **Déconnecter** après usage sur un appareil partagé. La connexion et les demandes de données du mode API sont faites directement auprès de Twitch. Le Client ID intégré est public ; aucun Client Secret ne vous est demandé. Ce projet n’est pas affilié à Twitch.

L’extension est prévue pour Chrome et Edge sur ordinateur (Manifest V3), pas pour Firefox. Elle ne lit pas votre token Twitch. Pour la désinstaller, désactivez-la ou supprimez-la depuis la page des extensions du navigateur.

## Notes de publication (mainteneur du projet)

Ces étapes ne concernent pas les personnes qui utilisent le site officiel. Pour publier une copie, déployez les fichiers du projet sur GitHub Pages en HTTPS. L’extension fournie est limitée au site `https://cmarcobioinfo.github.io/VOD-Marker/` et la redirection OAuth Twitch est configurée pour cette même adresse. Une autre adresse de publication nécessite d’adapter et de republier la configuration de l’extension ainsi que l’URL de redirection OAuth Twitch ; changer uniquement l’adresse GitHub Pages ne suffit pas.

## English (short)

VOD Marker records Twitch stream timecodes and exports marker lists. Install the Chrome/Edge extension from the `extension/` folder, click **Authorize and open the app**, sign in to Twitch, then use **● REC** or the configured shortcut (default: **B**) on a Twitch stream. The app and extension store data locally in your browser. Not affiliated with Twitch.
