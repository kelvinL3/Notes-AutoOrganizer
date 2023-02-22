# Notes Organizer Proof of Concept

[Loom Demo](https://www.loom.com/share/c44b868b4d554466b98825296a358e30)

![Screenshot 2023-02-22 at 3 13 31 PM](https://user-images.githubusercontent.com/18544886/220784791-6edda380-6ec4-45e4-9e8c-c96c864817cb.png)


This app is a basic notes app with a smart organizer feature that allows you to auto group relevant notes together. It works via an embeddings API to compute the vector representation of a note's text in a latent space. Then groups the notes with DBSCAN, a type of clustering algorithm.

# Quickstart

See [instructions](server/README.md)

# Architecture

This app's frontend is React / Typescript.

## Storage

The notes are not persisted on the server. The notes are saved to localStorage, the browser's Web Storage API.

## Backend

The backend serves the client requests to reorganize notes.

### Embeddings

I used a few embedding providers, [openai](https://platform.openai.com/docs/guides/embeddings/what-are-embeddings?lang=python) and [nlp cloud](https://docs.nlpcloud.com/#embeddings). These providers will return in different latent spaces, so the distances between vectors could be at a different scale, the dimensionality could be greater or fewer, or the general quality of the embeddings might be better or worse. Downstream tasks that depend on the embeddings will require tuning based on these qualities.

### Clustering + Alternatives

Clustering is an ML problem to take a list of points and "cluster" them together based on similarity.

This project uses DBSCAN as the underlying clustering algorithm. I considered using K Means clustering. However, K Means clustering requires inputting the number of clusters, which is unknown to both the client and server. Therefore I took an alternative approach with density clustering, which creates clusters based on how close they are in the latent space.

As mentioned in the [Embeddings](###Embeddings) section, the latent space of the embedding will influence the tuning of the hyperparameters in the clustering algorithm I choose.

The DBSCAN algorithm takes in a parameter known as `eps`, which serves as the boundary for determining if two points belong to the same cluster. This is based on the distance between the two points, and if the distance is less than or equal to the `eps` value, they are considered part of the same cluster. I tuned this to 3.3.

# Final Thoughts

I created this project to test out NLP methods to improve existing types of text-based products.

If you liked this idea, want to provide feedback, or just chat, feel free to reach out to me at [kelvinliu1234@gmail.com](mailto:kelvinliu1234@gmail.com).
