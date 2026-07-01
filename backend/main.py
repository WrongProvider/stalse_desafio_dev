import json
import os
import sqlite3
from typing import Dict, Literal, Optional

import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Mini Inbox API")

# Configura CORS para o Next.js (Localhost)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = "db.sqlite"


# Schemas do Pydantic (Tipagem)
class TicketUpdate(BaseModel):
    status: Optional[Literal["aberto", "pendente", "fechado"]] = None
    priority: Optional[Literal["baixa", "media", "alta"]] = None


class MetricsResponse(BaseModel):
    tickets_per_day: Dict[str, int]
    top_categories: Dict[str, int]
    total_tickets: int


def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("""CREATE TABLE IF NOT EXISTS tickets
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  customer_name TEXT,
                  channel TEXT,
                  subject TEXT,
                  status TEXT,
                  priority TEXT,
                  created_at TEXT)""")

    # Seeds Iniciais
    c.execute("SELECT COUNT(*) FROM tickets")
    if c.fetchone()[0] == 0:
        tickets = [
            (
                "Matheus Gusmão",
                "email",
                "Problema no pagamento",
                "aberto",
                "alta",
                "2026-06-30",
            ),
            (
                "Bruce Wayne",
                "chat",
                "Dúvida sobre entrega",
                "aberto",
                "media",
                "2026-06-29",
            ),
        ]
        c.executemany(
            "INSERT INTO tickets (customer_name, channel, subject, status, priority, created_at) VALUES (?, ?, ?, ?, ?, ?)",
            tickets,
        )
    conn.commit()
    conn.close()


@app.on_event("startup")
def startup():
    init_db()


@app.get("/tickets")
def get_tickets():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute("SELECT * FROM tickets")
    tickets = [dict(row) for row in c.fetchall()]
    conn.close()
    return tickets


@app.get("/tickets/{ticket_id}")
def get_ticket(ticket_id: int):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT * FROM tickets WHERE id = ?", (ticket_id,))
    r = c.fetchone()
    conn.close()

    if not r:
        raise HTTPException(status_code=404, detail="Ticket not found")

    return {
        "id": r[0],
        "customer_name": r[1],
        "channel": r[2],
        "subject": r[3],
        "status": r[4],
        "priority": r[5],
        "created_at": r[6],
    }


@app.patch("/tickets/{ticket_id}")
def update_ticket(ticket_id: int, ticket: TicketUpdate):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    if ticket.status:
        c.execute(
            "UPDATE tickets SET status = ? WHERE id = ?", (ticket.status, ticket_id)
        )
    if ticket.priority:
        c.execute(
            "UPDATE tickets SET priority = ? WHERE id = ?", (ticket.priority, ticket_id)
        )

    conn.commit()

    c.execute("SELECT * FROM tickets WHERE id = ?", (ticket_id,))
    row = c.fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=404, detail="Ticket not found")

    updated_data = {"id": row[0], "status": row[4], "priority": row[5]}

    return {"message": "Ticket updated", "data": updated_data}


@app.get("/metrics", response_model=MetricsResponse)
def get_metrics():
    # Resolve o caminho de forma absoluta independente de onde o uvicorn for rodado
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    metrics_path = os.path.join(base_dir, "data", "processed", "metrics.json")

    if not os.path.exists(metrics_path):
        raise HTTPException(
            status_code=404, detail="Metrics file not found. Run ETL first."
        )

    with open(metrics_path, "r", encoding="utf-8") as f:
        data = json.load(f)
        return data


# Configuração para rodar o servidor localmente com uvicorn de forma direta
if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
