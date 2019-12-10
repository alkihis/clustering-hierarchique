"use strict";
/**
 * Iterate through Iterables together, until one of the iterables is over
 * @param its Numerous iterable objects (n)
 * @yields Tuple of n values
 */
function* zip(...its) {
    // Get all iterators from Iterable objects
    const ites = its.map(e => e[Symbol.iterator]());
    // Get first values
    let values = ites.map(e => e.next());
    // Continue until one of the iterators is over
    while (values.every(e => !e.done)) {
        // Yield current values together
        yield values.map(e => e.value);
        // Get all next values
        values = ites.map(e => e.next());
    }
}
function manhattan(item1, item2) {
    if (item1.length !== item2.length) {
        throw new Error("Items must have the same dimension");
    }
    // Calcule la distance entre chaque dimension
    // puis somme les distances pour obtenir
    // la distance totale => distance de manhattan
    return [...zip(item1, item2)]
        .map(([a, b]) => a > b ? a - b : b - a)
        .reduce((acc, v) => acc + v, 0);
}
// Recherche les éléments les plus distants entre les deux clusters
function maxDistanceInCluster(cluster1, cluster2, distance_fn = manhattan) {
    let distance = -1;
    for (const item1 of cluster1) {
        for (const item2 of cluster2) {
            const d = distance_fn(item1, item2);
            if (d > distance) {
                distance = d;
            }
        }
    }
    return distance;
}
// Où Coords[] a chacun de ses éléments avec la même longueur
// Méthode utilisée: complete link method (el le plus éloigné de chaque cluster)
function clusteringHierarchique(items, distance_fn = manhattan) {
    // À la première itération, chaque item est dans son propre cluster
    let current_clusters = items.map(i => [i]);
    const steps = [current_clusters];
    while (current_clusters.length > 1) {
        // On va comparer tous les clusters entre eux
        // On trouve la plus petite distance, et on fusionne les clusters
        const distances = {};
        for (let i = 0; i < current_clusters.length; i++) {
            if (!(i in distances)) {
                distances[i] = {};
            }
            for (let j = 0; j < current_clusters.length; j++) {
                if (i === j) {
                    continue;
                }
                // On a déjà traité toutes les distances de cet index
                if (j in distances) {
                    continue;
                }
                distances[i][j] = maxDistanceInCluster(current_clusters[i], current_clusters[j], distance_fn);
            }
        }
        let min_distance = Infinity;
        let concerned_clusters_indexes = [1, 1];
        // Trouve la distance minimale entre deux clusters
        for (const index1 of Object.keys(distances)) {
            for (const index2 of Object.keys(distances[index1])) {
                if (min_distance > distances[index1][index2]) {
                    min_distance = distances[index1][index2];
                    concerned_clusters_indexes = [+index1, +index2];
                }
            }
        }
        const index1 = concerned_clusters_indexes[0];
        const index2 = concerned_clusters_indexes[1];
        // Copie des clusters actuels sans les deux fusionnés
        const new_clusters = current_clusters.filter((_, index) => index !== index1 && index !== index2);
        // Fusion des deux clusters concernés
        new_clusters.push([...current_clusters[index1], ...current_clusters[index2]]);
        steps.push(new_clusters);
        current_clusters = new_clusters;
    }
    return steps;
}
const results = clusteringHierarchique([
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
]);
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
