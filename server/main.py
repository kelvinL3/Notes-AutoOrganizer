import json
import os
from flask import Flask, send_from_directory, request
from server.embeddings import get_open_ai_embeddings
from server.embeddings import get_nlp_cloud_embeddings
from server.clustering import dbscan_clustering
from server.helpers import freeze

app = Flask(__name__, static_folder='../build')


@app.route('/sendNotes', methods=['POST'])
def send_data():
    data = json.loads(request.get_data())
    notes = data['notes']

    embeddings = get_open_ai_embeddings(freeze(notes))
    clusterings = dbscan_clustering(embeddings)
    
    # drop the unnecessary embedding info
    # convert numpy's int64 to int for serializability
    ret = [
        {
            **cluster,
            'embedding': 'drop',
            'label': int(cluster['label'])
        }
        for cluster in clusterings
    ]
    
    return ret


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
