from sklearn import neighbors

def knn_classification(embeddings):
    
    # setting known labels for "training"
    # dims=1536,
    known_points = [(note['embedding'], note['group'], note['text']) for note in embeddings if note['group'] != -1]
    X, y = [t[0] for t in known_points], [t[1] for t in known_points]
    
    print('Known Points', [n[2] for n in known_points ])

    unknown_points = [(note['embedding'], note['id'], note['text']) for note in embeddings if note['group'] == -1]
    X_predict, X_predict_id = [t[0] for t in unknown_points], [t[1] for t in unknown_points]

    print('Unknown points', [n[2] for n in unknown_points ])

    n_neighbors = 1

    # Can consider an improvement where the weights are much higher for points the user manually set via dragging
    clf = neighbors.KNeighborsClassifier(n_neighbors, weights='distance')

    clf.fit(X, y)

    predictions = clf.predict(X_predict)
    id_to_pred = {id: int(prediction) for prediction, id in zip(predictions, X_predict_id)}
    
    return id_to_pred