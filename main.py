from openai import OpenAI

client = OpenAI(api_key="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")

response = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "system", "content": "Você é um assistente útil."},
        {"role": "user", "content": "Explique como funciona a gravidade."}"
    ],
    temperature=0.7,
)

print(response.choices[0].message.content)
