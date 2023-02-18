import openai
import os
from typing import List, Dict
import requests

# API_KEY = os.getenv('OPENAI_API_KEY')
API_KEY = os.getenv('NLP_CLOUD_KEY')


def get_nlp_cloud_embeddings(notes):
    data = {
        'sentences': [note['text'] for note in notes]
    }
    response = requests.post(
        'https://api.nlpcloud.io/v1/paraphrase-multilingual-mpnet-base-v2/embeddings',
        headers={
            'Authorization': f'Token {API_KEY}',
            'Content-Type': 'application/json'
        }, json=data)

    if response.status_code != 200:
        raise Exception(response)

    return response.json()


def get_embeddings(notes: List[Dict[str, str]]):
    def get_embedding(text: str):
        response = openai.Embedding.create(
            input=text,
            model="text-embedding-ada-002"  # best model
        )
        return response['data'][0]['embedding']

    # with_embeddings = []
    # for note in notes:
    #     resp_obj = note
    #     # resp_obj['note']: note
    #     resp_obj['embedding'] = get_embedding(note['text'])
    #     with_embeddings.append(resp_obj)

    def mapper(note):
        note['embedding'] = get_embedding(note['text'])
    return map(mapper, notes)
