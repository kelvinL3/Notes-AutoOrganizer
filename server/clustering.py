from sklearn.preprocessing import StandardScaler
from sklearn.cluster import DBSCAN, KMeans


def dbscan_clustering(notes):
    # used eps=3.3 for NLP Cloud Embeddings
    # used eps=.6 for OpenAI Embeddings
    dbscan = DBSCAN(eps=.6, min_samples=1)
    dbscan.fit([note['embedding'] for note in notes])
    labels = dbscan.labels_

    result = [
        {
            **note,
            'label': label
        }
        for note, label in zip(notes, labels)
    ]
    return result


# Requires manually setting number of clusters
def kmeans_clustering(notes):
    kmeans = KMeans(
        init="random",
        n_clusters=3,
        n_init=10,
        max_iter=300,
        random_state=42
    )

    kmeans.fit([note['embedding'] for note in notes])
    labels = kmeans.labels_
    result = [
        {
            **note,
            'label': label
        }
        for note, label in zip(notes, labels)
    ]
    return result
