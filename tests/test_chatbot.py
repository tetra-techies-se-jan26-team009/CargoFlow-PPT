def test_chat_success(client):
    res = client.post("/chat", json={
        "question": "How do I track my shipment?",
        "top_k": 3
    })

    assert res.status_code == 200

    data = res.json()
    assert "question" in data
    assert "answer" in data
    assert "found_in_kb" in data
    assert isinstance(data["sources"], list)

def test_chat_empty_question(client):
    res = client.post("/chat", json={
        "question": ""
    })

    assert res.status_code == 422
    assert "at least" in res.json()["detail"][0]["msg"].lower()

def test_chat_missing_question(client):
    res = client.post("/chat", json={})

    assert res.status_code == 422

def test_chat_invalid_topk(client):
    res = client.post("/chat", json={
        "question": "Where is my shipment?",
        "top_k": 50
    })

    assert res.status_code == 422

def test_chatbot_health(client):
    res = client.get("/chatbot/health")

    assert res.status_code == 200

    data = res.json()
    assert "status" in data
    assert "chunks_loaded" in data
    assert "llm_model" in data

def test_rebuild_success(client):
    res = client.post("/rebuild")

    assert res.status_code == 200

    data = res.json()
    assert "message" in data
    assert "chunks_loaded" in data

def test_chat_model_unavailable(client, monkeypatch):
    from chatbot import app as chatbot_app

    def mock_query(*args, **kwargs):
        raise RuntimeError("Model loading")

    monkeypatch.setattr(chatbot_app.rag, "query", mock_query)

    res = client.post("/chat", json={
        "question": "Test question"
    })

    assert res.status_code == 503