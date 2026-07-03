import asyncio
import json
import os
import sqlite3
from contextlib import asynccontextmanager
from enum import Enum
from typing import Dict, List, Literal, Optional

import uvicorn
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(title="Mini Inbox API", lifespan=lifespan)

# Configura CORS para o Next.js (Localhost)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "db.sqlite")
SEEDS_PATH = os.path.join(BASE_DIR, "seeds", "tickets.json")
PROJECT_ROOT = os.path.dirname(BASE_DIR)
METRICS_PATH = os.path.join(PROJECT_ROOT, "data", "processed", "metrics.json")


# Schemas do Pydantic (Tipagem)
class TicketStatus(str, Enum):
    ABERTO = "aberto"
    PENDENTE = "pendente"
    FECHADO = "fechado"


class TicketPriority(str, Enum):
    BAIXA = "baixa"
    MEDIA = "media"
    ALTA = "alta"


class TicketUpdate(BaseModel):
    status: Optional[TicketStatus] = None
    priority: Optional[TicketPriority] = None


class MetricsResponse(BaseModel):
    tickets_per_day: Dict[str, int]
    top_categories: Dict[str, int]
    total_tickets: int


class TicketResponse(BaseModel):
    id: int
    customer_name: str
    channel: str
    subject: str
    status: Optional[TicketStatus]
    priority: Optional[TicketPriority]
    created_at: str


def load_seeds():
    with open(SEEDS_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


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
        tickets = load_seeds()
        c.executemany(
            "INSERT INTO tickets (customer_name, channel, subject, status, priority, created_at) VALUES (?, ?, ?, ?, ?, ?)",
            [
                (
                    t["customer_name"],
                    t["channel"],
                    t["subject"],
                    t["status"],
                    t["priority"],
                    t["created_at"],
                )
                for t in tickets
            ],
        )
    conn.commit()
    conn.close()


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()


@app.get("/tickets", response_model=List[TicketResponse])
def get_tickets(db: sqlite3.Connection = Depends(get_db)):
    c = db.cursor()
    c.execute("SELECT * FROM tickets")
    tickets = [dict(row) for row in c.fetchall()]
    return tickets


@app.get("/tickets/{ticket_id}", response_model=TicketResponse)
def get_ticket(ticket_id: int, db: sqlite3.Connection = Depends(get_db)):
    c = db.cursor()
    c.execute("SELECT * FROM tickets WHERE id = ?", (ticket_id,))
    r = c.fetchone()

    if not r:
        raise HTTPException(status_code=404, detail="Ticket not found")

    return dict(r)


@app.patch("/tickets/{ticket_id}", response_model=TicketResponse)
def update_ticket(
    ticket_id: int, ticket: TicketUpdate, db: sqlite3.Connection = Depends(get_db)
):
    c = db.cursor()

    if ticket.status:
        c.execute(
            "UPDATE tickets SET status = ? WHERE id = ?", (ticket.status, ticket_id)
        )
    if ticket.priority:
        c.execute(
            "UPDATE tickets SET priority = ? WHERE id = ?", (ticket.priority, ticket_id)
        )
    if ticket.status is None and ticket.priority is None:
        raise HTTPException(
            status_code=400, detail="Nenhum campo para atualizar foi enviado"
        )

    db.commit()
    c.execute("SELECT * FROM tickets WHERE id = ?", (ticket_id,))
    row = c.fetchone()
    db.close()

    if not row:
        raise HTTPException(status_code=404, detail="Ticket not found")

    return dict(row)


@app.get("/metrics", response_model=MetricsResponse)
async def get_metrics():
    if not os.path.exists(METRICS_PATH):
        raise HTTPException(
            status_code=404, detail="Metrics file not found. Run ETL first."
        )

    def read_metrics():
        with open(METRICS_PATH, "r", encoding="utf-8") as f:
            return json.load(f)

    data = await asyncio.to_thread(read_metrics)
    return data


# Configuração para rodar o servidor localmente com uvicorn de forma direta
if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
