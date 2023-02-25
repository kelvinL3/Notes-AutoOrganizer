import openai
import os
from typing import List, Dict
import requests
from functools import lru_cache
from server.helpers import unfreeze
import pickledb

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
NLP_CLOUD_KEY = os.getenv('NLP_CLOUD_KEY')


# Freeze and unfreeze notes arg to allow for caching and save the scarce credits
@lru_cache(maxsize=None)
def get_open_ai_embeddings(notes: List[Dict[str, str]]):
    notes = unfreeze(notes)

    print("Fetching Embeddings from OpenAI")

    db = pickledb.load('openai_embeddings_1.db', auto_dump=True, sig=False)
    def get_embedding(text: str):
        if db.exists(text):
            print('Using Cached Embedding for text', text)
            return db.get(text)
        
        print('Fetch Embedding Over Network')
        response = openai.Embedding.create(
            input=text,
            model="text-embedding-ada-002"
        )
        embedding = response['data'][0]['embedding']
        
        print('Set Cached Embedding Value')
        db.set(text, embedding)
        
        return embedding

    return [{**note, 'embedding': get_embedding(note['text'])} for note in notes]


@lru_cache(maxsize=None)
def get_nlp_cloud_embeddings(notes):
    notes = unfreeze(notes)
    data = {
        'sentences': [note['text'] for note in notes]
    }
    print('Requesting from NLP Cloud')
    response = requests.post(
        'https://api.nlpcloud.io/v1/paraphrase-multilingual-mpnet-base-v2/embeddings',
        headers={
            'Authorization': f'Token {NLP_CLOUD_KEY}',
            'Content-Type': 'application/json'
        }, json=data)

    if response.status_code != 200:
        raise Exception(response)

    embeddings = response.json()['embeddings']

    return [{**note, 'embedding': embedding} for note, embedding in zip(notes, embeddings)]
