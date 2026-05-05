from flask import Blueprint, request, jsonify
from sentence_transformers import SentenceTransformer
import chromadb
from chromadb.config import Settings

search_bp = Blueprint("search", __name__)

model = SentenceTransformer("all-MiniLM-L6-v2")
client = chromadb.Client(Settings())
collection = client.get_or_create_collection(name="penalties")


def seed_data():
    docs = [
        "RBI fined bank for KYC violation",
        "SEBI penalized company for insider trading",
        "IRDAI penalty for claim settlement delay",
        "Bank fined for AML non-compliance",
        "Penalty for delayed regulatory filings"
    ]

    embeddings = model.encode(docs).tolist()

    collection.add(
        documents=docs,
        embeddings=embeddings,
        ids=[str(i) for i in range(len(docs))]
    )


if collection.count() == 0:
    seed_data()


@search_bp.route("/search", methods=["GET", "POST"])
def search():
    if request.method == "GET":
        query = request.args.get("query")
    else:
        data = request.get_json()
        query = data.get("query")

    if not query:
        return jsonify({"error": "query is required"}), 400

    query_embedding = model.encode([query]).tolist()

    results = collection.query(
        query_embeddings=query_embedding,
        n_results=3
    )

    return jsonify({
        "results": results["documents"]
    })