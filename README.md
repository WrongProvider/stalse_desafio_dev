# Mini Inbox
Sistema simples de gestão de tickets de suporte: backend em FastAPI + SQLite,
frontend em Next.js e um pipeline de métricas com pandas sobre o dataset
[Olist Brazilian E-Commerce](https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce).

## Stack

- **Backend:** Python, FastAPI, SQLite
- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS
- **Dados:** pandas, dataset Olist (Kaggle)

## Como rodar

Pré-requisitos: [uv](https://docs.astral.sh/uv/) e [Node.js](https://nodejs.org/) 18+.

### Opção 1 — script único

```bash
git clone https://github.com/WrongProvider/stalse_desafio_dev.git
cd stalse_desafio_dev
chmod +x run.sh
./run.sh
```

Isso roda o ETL (se ainda não tiver sido gerado), sobe o backend em
`http://localhost:8000` e o frontend em `http://localhost:3000`.

### Opção 2 — manual

**1. Gerar as métricas (ETL):**
```bash
cd data
uv run python etl.py
```

**2. Subir o backend:**
```bash
cd backend
uv run uvicorn main:app --reload
```
API disponível em `http://localhost:8000`.

**3. Subir o frontend:**
```bash
cd frontend
npm install
npm run dev
```
App disponível em `http://localhost:3000`.

## prints
<img width="1910" height="984" alt="image" src="https://github.com/user-attachments/assets/5458a8b2-43de-41de-982e-8e5378111dfb" /> <img width="1910" height="984" alt="image" src="https://github.com/user-attachments/assets/84c3bd48-1cc5-4798-8920-a4b45527e297" />

## Endpoints

| Método | Rota             | Descrição                                  |
|--------|------------------|---------------------------------------------|
| GET    | `/tickets`       | Lista todos os tickets                      |
| GET    | `/tickets/{id}`  | Detalhe de um ticket                        |
| PATCH  | `/tickets/{id}`  | Atualiza `status` e/ou `priority`           |
| GET    | `/metrics`       | Métricas geradas pelo pipeline ETL          |

Exemplo de `PATCH`:
```bash
curl -X PATCH http://localhost:8000/tickets/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "fechado"}'
```
```
├── backend/          # API FastAPI + SQLite
│   ├── main.py
│   └── seeds/tickets.json   # 20 tickets iniciais
├── data/              # Pipeline de dados
│   ├── etl.py
│   ├── raw/           # CSVs originais do Kaggle
│   └── processed/     # metrics.json gerado pelo ETL
├── frontend/          # Next.js App Router
│   └── app/
│       ├── tickets/   # componentes relacionados a tickets
│       ├── dashboard/ # componentes relacionados ao dashboard
│       ├── hooks/     # hooks reutilizáveis
│       └── lib/       # utilitários e tipos reutilizáveis da API
└── run.sh             # sobe backend + frontend juntos
```

## Sobre os dados

O pipeline em `data/etl.py` lê os CSVs do dataset Olist
(`olist_order_reviews_dataset.csv`, `olist_order_items_dataset.csv`,
`olist_products_dataset.csv`), faz o parse das datas e calcula:

- quantidade de chamados por dia
- top categorias de produto
- total de registros processados

O resultado é salvo em `data/processed/metrics.json`, e o backend só
faz a leitura desse arquivo em `/metrics` — o processamento pesado
acontece uma única vez, fora do ciclo de request.

Os tickets exibidos em `/tickets` são dados fictícios (seeds), simulando
uma inbox de suporte; as métricas do dashboard vêm do dataset real do Kaggle.

## Decisões técnicas

- **SQLite** como storage dos tickets: simples, sem setup de servidor,
  adequado ao escopo do desafio.
- **FastAPI** como backend: framework moderno, rápido e fácil de usar.
- Decidi manter as pesquisas no frontend para manter a simplicidade do projeto.
