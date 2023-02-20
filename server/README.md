# Build the frontend

We are serving the frontend from ../build so we can serve it from flask

```
# from the root folder
npm install
npm run build
```

# Run the backend

Get an API token from NLP Cloud or OpenAI. This is needed to compute embeddings.

```
source venv/bin/activate
pip install requirements.txt


export OPENAI_API_KEY=''
export NLP_CLOUD_KEY=''
```

Start the server

```
python main.py
```

Go to the provided link

```
* Running on http://127.0.0.1:8000
```
