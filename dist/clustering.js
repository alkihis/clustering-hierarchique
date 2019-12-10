"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const python_zip_1 = __importDefault(require("python-zip"));
/**
 * Calcule la distance de Manhattan séparant les points `item1` et `item2`.
 */
function manhattan(item1, item2) {
    if (item1.length !== item2.length) {
        throw new Error("Items must have the same dimension");
    }
    // Calcule la distance entre chaque dimension
    // puis somme les distances pour obtenir
    // la distance totale => distance de manhattan
    return [...python_zip_1.default(item1, item2)]
        .map(([a, b]) => a > b ? a - b : b - a)
        .reduce((acc, v) => acc + v, 0);
}
exports.manhattan = manhattan;
/**
 * Calcule la distance euclidienne séparant les points `item1` et `item2`.
 */
function euclidian(item1, item2) {
    if (item1.length !== item2.length) {
        throw new Error("Items must have the same dimension");
    }
    // Calcule la distance^2 entre chaque dimension
    // puis somme les distances pour obtenir la distance totale 
    // et applique sqrt => distance euclidienne
    return Math.sqrt([...python_zip_1.default(item1, item2)]
        .map(([a, b]) => Math.pow(b - a, 2))
        .reduce((acc, v) => acc + v, 0));
}
exports.euclidian = euclidian;
/**
 * Recherche la plus petite distance entre les deux clusters
 */
function minDistanceInCluster(cluster1, cluster2, distance_fn = euclidian) {
    let distance = Infinity;
    for (const item1 of cluster1) {
        for (const item2 of cluster2) {
            const d = distance_fn(item1, item2);
            if (d < distance) {
                distance = d;
            }
        }
    }
    return distance;
}
exports.minDistanceInCluster = minDistanceInCluster;
/**
 * Recherche la plus grande distance entre les deux clusters
 */
function maxDistanceInCluster(cluster1, cluster2, distance_fn = euclidian) {
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
exports.maxDistanceInCluster = maxDistanceInCluster;
/**
 * Calcule la distance moyenne entre les deux clusters
 */
function avgDistanceInCluster(cluster1, cluster2, distance_fn = euclidian) {
    let sum = 0;
    let i = 0;
    for (const item1 of cluster1) {
        for (const item2 of cluster2) {
            sum += distance_fn(item1, item2);
            i++;
        }
    }
    return sum / i;
}
exports.avgDistanceInCluster = avgDistanceInCluster;
/**
 * Réalise un clustering hiérarchique
 *
 * @param items
 * Points de départs (chaque point doit être un tableau de nombres (coordonnées)).
 * Chaque point doit avoir le même nombre de dimensions.
 *
 * @param distance_of_items_fn
 * Méthode utilisée pour calculer la distance entre deux points: Manhattan ou euclidienne
 * (voir objets manhattan et euclidian exportés)
 *
 * Défaut: `euclidian`
 *
 * @param distances_of_clusters_fn
 * Fonction utilisée pour trouver quelle distance à utiliser pour comparer deux clusters entre eux
 * (par exemple, single link method).
 *
 * Les fonctions disponibles sont:
 * - single link method: `minDistanceInCluster`
 * - complete link method: `maxDistanceInCluster`
 * - moyennes: `avgDistanceInCluster`
 *
 * Défaut: `maxDistanceInCluster` (complete link method)
 */
function hierarchicalClustering(items, distance_of_items_fn = euclidian, distances_of_clusters_fn = maxDistanceInCluster) {
    // À la première itération, chaque item est dans son propre cluster
    let current_clusters = items.map(i => [i]);
    const steps = [current_clusters];
    while (current_clusters.length > 1) {
        // On va comparer tous les clusters entre eux
        // On trouve la plus petite distance, et on fusionne les clusters
        let min_distance = [Infinity, 0, 0];
        const indexes_ok = new Set();
        for (let i = 0; i < current_clusters.length; i++) {
            indexes_ok.add(i);
            for (let j = 0; j < current_clusters.length; j++) {
                // On a déjà traité toutes les distances de cet index
                // Ou alors j === i (i est déjà inséré)
                if (indexes_ok.has(j)) {
                    continue;
                }
                const dist = distances_of_clusters_fn(current_clusters[i], current_clusters[j], distance_of_items_fn);
                if (dist < min_distance[0]) {
                    min_distance = [dist, i, j];
                }
            }
        }
        const [, index1, index2] = min_distance;
        // Copie des clusters actuels sans les deux fusionnés
        const new_clusters = current_clusters.filter((_, index) => index !== index1 && index !== index2);
        // Fusion des deux clusters concernés
        new_clusters.push([...current_clusters[index1], ...current_clusters[index2]]);
        // L'ajoute dans les étapes et sert de base pour la prochaine itération
        steps.push(new_clusters);
        current_clusters = new_clusters;
    }
    return steps;
}
exports.hierarchicalClustering = hierarchicalClustering;
