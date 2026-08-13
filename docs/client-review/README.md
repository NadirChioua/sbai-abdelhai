# Relecture des textes — livrable client

| Fichier | Usage |
| --- | --- |
| `sbai-site-copy-review.pdf` | Version imprimable, pour annotation à la main |
| `sbai-site-copy-review.docx` | Version Word, suivi des modifications déjà activé |

Les deux fichiers ont le même contenu et la même structure : une section par
page du site, les textes dans l'ordre où ils se lisent à l'écran, et une colonne
« Modifications » laissée vide.

## Régénérer

```bash
npm run copy-review
```

Le script lit `messages/fr.json` et le modèle `scripts/copy-model.mjs`, écrit le
HTML source dans `scripts/output/copy-review.html`, puis produit le PDF
(Chromium) et le DOCX. Après toute modification de la copie française, relancer
la commande suffit à remettre le livrable à jour.
