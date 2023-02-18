# build the frontend into build, so we can serve it from flask

npm run build

# run the backend

source venv/bin/activate
python main

export OPENAI_API_KEY=''
export NLP_CLOUD_KEY=''