# IA - Módulo de Análise de Sentimentos

## Sumário

- [Objetivo](#objetivo)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Pré-processamento](#pré-processamento)
- [Treinamento do Modelo](#treinamento-do-modelo)
- [API de Predição](#api-de-predição)
- [Exemplo de Uso](#exemplo-de-uso)
- [Funcionalidades Futuras](#funcionalidades-futuras)
- [Requisitos](#requisitos)

---

## Objetivo

Desenvolver um módulo de IA para classificar automaticamente o sentimento de feedbacks textuais em três categorias:

- **Positivo**
- **Negativo**
- **Neutro**

O modelo é integrado a uma API que permite a classificação de arquivos CSV com textos de forma prática.

---

## Estrutura do Projeto

```
ml_model/
├── dataset/
│   ├── Reviews.csv              # Original (não incluído no repositório)
│   └── reduced_reviews.csv      # Dataset balanceado
├── model/
│   ├── modelo_sentimento.pkl    # Modelo treinado
│   └── vectorizer.pkl           # Vetorizador TF-IDF
├── preprocess.py                # Função clear_text()
└── train_model.py               # Pipeline de treino
```

---

## Pré-processamento

O arquivo `preprocess.py` contém a função `clear_text()`, que realiza:

- Transformação para minúsculas
- Remoção de stopwords
- Remoção de URLs, emojis, repetições e erros comuns
- Normalização de palavras com erros ortográficos

A base `Reviews.csv` é transformada via ETL em `reduced_reviews.csv`, balanceando 42.000 exemplos por classe (positivo, negativo e neutro).

---

## Treinamento do Modelo

O arquivo `train_model.py` executa:

- Vetorização via `TfidfVectorizer`
- Treinamento com `LinearSVC(dual=False)`
- Avaliação com `classification_report`

### Resultados

```
Accuracy: ~0.72
F1-score:
 - Positivo: 0.79
 - Negativo: 0.73
 - Neutro:   0.64
```

O modelo e o vetor são persistidos como `.pkl` em `ml_model/model/`.

---

## API de Predição

O módulo de IA é integrado a uma API Flask. A rota ativa é:

```
POST /predict-csv
```

### Parâmetros de entrada

- Arquivo `.csv` com a coluna `Text` contendo os feedbacks.

### Resposta

```json
[
  {
    "Text": "awesome product",
    "Sentiment_Prediction": "positivo"
  },
  ...
]
```

---

## Exemplo de Uso

Via Postman:

1. Selecionar método `POST`
2. Endpoint: `http://localhost:5000/predict-csv`
3. Enviar arquivo `.csv` com campo `Text`
4. Receber JSON com predições

---

## Funcionalidades Futuras

- [ ] Integração com IA generativa para geração de insights e resumos automáticos
- [ ] Criação de respostas automáticas baseadas no sentimento
- [ ] Exportação de relatórios automatizados para usuários

---

## Requisitos

- Python 3.10+
- `scikit-learn`
- `pandas`
- `nltk`
- `flask`
- `joblib`
