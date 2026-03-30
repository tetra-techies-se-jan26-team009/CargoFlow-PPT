import requests
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("HF_API_KEY")

def generate_ai_response(prompt: str) -> str:
    try:
        response = requests.post(
            "https://router.huggingface.co/hf-inference/models/HuggingFaceH4/zephyr-7b-beta",
            headers={
                "Authorization": f"Bearer {API_KEY}"
            },
            json={
                "inputs": prompt
            }
        )

        if response.status_code != 200:
            print("HF Status Error:", response.status_code, response.text)
            return "AI service temporarily unavailable."

        try:
            data = response.json()
        except Exception:
            print("Non-JSON Response:", response.text)
            return "AI service temporarily unavailable."

        if isinstance(data, list):
            return data[0].get("generated_text", "No response")

        if "error" in data:
            print("HF API Error:", data["error"])
            return "AI service temporarily unavailable."

        return "No response"

    except Exception as e:
        print("HF Error:", e)
        return "AI service temporarily unavailable."


# import google.generativeai as genai
# import os
# from dotenv import load_dotenv

# load_dotenv()

# genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# model = genai.GenerativeModel("models/gemini-1.5-flash-latest")


# def generate_ai_response(prompt: str) -> str:
#     try:
#         response = model.generate_content(prompt)
#         return response.text
#     except Exception as e:
#         print("Gemini Error:", e)
#         return "AI service is temporarily unavailable."