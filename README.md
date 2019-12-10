# Clustering hiérarichique simple

> Calcule selon la complete link method (voir fn `maxDistanceInCluster`).

**!**

La méthode de calcul de la distance est *Manhattan* ou *Euclidienne*.

## Installation et lancement

Node.js version 8 minimum doit être installé.

```bash
git clone https://github.com/alkihis/clustering-hierarchique.git
cd clustering-hierarchique
npm i
tsc
node dist/index.js
```

## Paramètres

Le script de 'test' de la bibliothèque est dans `src/index.ts`.

## Utilisation

Utilisez la fonction `hierarchicalClustering` du module `clustering`.

Son prototype est:
```ts
const results = hierarchicalClustering(
  // Un dataset est un tableau de points. 
  // Un point est un ensemble de coordonnées 
  // (en fct du nombre de dimensions du point).
  // Tous les points doivent avoir le même nombre de dimensions.
  dataset, 

  // Une fonction qui calcule la distance entre deux points.
  // Deux fonctions sont fournies dans le module: euclidian et manhattan.
  fonctionDeCalculDeDistanceEntrePoints,

  // Une fonction qui calcule la distance entre deux clusters (méthode).
  // Trois méthodes sont fournies dans le module: 
  // minDistanceInCluster, maxDistanceInCluster et avgDistanceInCluster. 
  fonctionDeCalculDeDistanceEntreClusters
);
```
Le résultat est un tableau d'étapes: 
Chaque étape est un tableau de clusters, 
un cluster est un tableau de points, 
un point étant lui-même un tableau de coordonnées.

### Méthode

#### Simple link method

Utilisez la fonction `minDistanceInCluster` en paramètre.

#### Complete link method

Utilisez la fonction `maxDistanceInCluster` en paramètre.

#### Average link method

Utilisez la fonction `avgDistanceInCluster` en paramètre.


