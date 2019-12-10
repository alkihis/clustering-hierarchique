import { hierarchicalClustering, euclidian, maxDistanceInCluster } from './clustering';

// Crée un dataset de points à une seule dimension
const dataset = [
  [-1],
  [-0.4],
  [1],
  [2],
  [3.1],
  [5.2],
  [8.45],
  [8.5],
  [9.9],
  [10],
  [12.5],
];

// Calcule le clustering selon la complete link method, distance euclidienne 
const results = hierarchicalClustering(dataset, euclidian, maxDistanceInCluster);

// Affiche les résultats
let i = 0;
for (const step of results) {
  if (i === 0)
    console.log("État initial");
  else
    console.log(`Itération ${i}`);

  let str = "";
  for (const cluster of step) {
    str += ` [${cluster.map(e => e.join("-")).join(", ")}] `;
  }

  console.log(str);

  i++;
}

