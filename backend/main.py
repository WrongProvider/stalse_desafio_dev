import json
import os
import sqlite3

import requests
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Mini Inbox API")

# Configura CORS para o Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = "db.sqlite"
N8N_WEBHOOK_URL = (
    "http://localhost:5678/webhook/tickets"  # Ajuste para a URL real do seu n8n
)


# Schema para o PATCH
class TicketUpdate(BaseModel):
    status: str = None
    priority: str = None


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

    # Seeds (básico bem feito)
    c.execute("SELECT COUNT(*) FROM tickets")
    if c.fetchone()[0] == 0:
        tickets = [
            ("Matheus Gusmão", "email", "Login issue", "open", "high", "2026-06-30"),
            ("Bruce Wayne", "chat", "Billing error", "open", "normal", "2026-06-29"),
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

    # Verifica ticket atualizado
    c.execute("SELECT * FROM tickets WHERE id = ?", (ticket_id,))
    row = c.fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=404, detail="Ticket not found")

    updated_data = {"id": row[0], "status": row[4], "priority": row[5]}

    # Dispara n8n
    if updated_data["status"] == "closed" or updated_data["priority"] == "high":
        try:
            requests.post(N8N_WEBHOOK_URL, json=updated_data, timeout=2)
        except Exception as e:
            print(f"Failed to trigger webhook: {e}")

    return {"message": "Ticket updated", "data": updated_data}


@app.get("/metrics")
def get_metrics():
    metrics_path = "../data/processed/metrics.json"
    if not os.path.exists(metrics_path):
        raise HTTPException(
            status_code=404, detail="Metrics file not found. Run ETL first."
        )

    with open(metrics_path, "r") as f:
        return json.load(f)
