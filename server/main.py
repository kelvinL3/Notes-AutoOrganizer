import json
import os
from flask import Flask, send_from_directory, request
from embeddings import get_embeddings
from embeddings import get_nlp_cloud_embeddings
from clustering import dbscan_clustering
from helpers import freeze

app = Flask(__name__, static_folder='../build')


@app.route('/sendNotes', methods=['POST'])
def send_data():
    data = json.loads(request.get_data())
    notes = data['notes']

    embeddings = get_nlp_cloud_embeddings(freeze(notes))
    clusterings = dbscan_clustering(embeddings)
    # drop the unnecessary embedding info, convert int64 to int
    # for serializability
    return [
        {
            **cluster,
            'embedding': 'drop',
            'label': int(cluster['label'])
        }
        for cluster in clusterings
    ]


# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


if __name__ == '__main__':
    app.run(use_reloader=True, port=8000, threaded=True)
