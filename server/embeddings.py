import openai
import os
from typing import List, Dict
import requests
from functools import lru_cache
from server.helpers import unfreeze

# API_KEY = os.getenv('OPENAI_API_KEY')
API_KEY = os.getenv('NLP_CLOUD_KEY')


@lru_cache(maxsize=None)
def get_nlp_cloud_embeddings(notes):
    notes = unfreeze(notes)
    # import pdb
    # pdb.set_trace()
    data = {
        'sentences': [note['text'] for note in notes]
    }
    print('Requesting from NLP Cloud')
    response = requests.post(
        'https://api.nlpcloud.io/v1/paraphrase-multilingual-mpnet-base-v2/embeddings',
        headers={
            'Authorization': f'Token {API_KEY}',
            'Content-Type': 'application/json'
        }, json=data)

    if response.status_code != 200:
        raise Exception(response)

    embeddings = response.json()['embeddings']

    return [{**note, 'embedding': embedding} for note, embedding in zip(notes, embeddings)]


def get_embeddings(notes: List[Dict[str, str]]):
    def get_embedding(text: str):
        response = openai.Embedding.create(
            input=text,
            model="text-embedding-ada-002"  # best model
        )
        return response['data'][0]['embedding']

    return [{**note, 'embedding': get_embedding(note['text'])} for note in notes]
