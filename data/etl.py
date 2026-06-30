import json
import os
from fcntl import I_LOOK
from sre_parse import IN_LOC_IGNORE

import pandas as pd


def run_etl():
    print("Iniciando ETL com dados da Olist...")

    # Caminhos (ajuste se os nomes dos seus arquivos estiverem diferentes)
    REVIEWS_PATH = "raw/olist_order_reviews_dataset.csv"
    ITEMS_PATH = "raw/olist_order_items_dataset.csv"
    PRODUCTS_PATH = "raw/olist_products_dataset.csv"
    PROCESSED_DATA_PATH = "processed/metrics.json"

    # 1. Leitura dos CSVs
    try:
        df_reviews = pd.read_csv(REVIEWS_PATH)
        df_items = pd.read_csv(ITEMS_PATH)
        df_products = pd.read_csv(PRODUCTS_PATH)
    except FileNotFoundError as e:
        print(
            f"Erro ao ler arquivos. Certifique-se de que os CSVs da Olist estão na pasta raw/. Detalhe: {e}"
        )
        return

    # 2. Parse de data
    # Convertendo a data de criação do review para datetime
    df_reviews["review_creation_date"] = pd.to_datetime(
        df_reviews["review_creation_date"]
    )

    # 3. Cruzamento de Dados (Joins) para pegar a Categoria
    # Relacionando Review -> Items (pelo order_id) -> Products (pelo product_id)
    df_merged = df_reviews.merge(df_items, on="order_id", how="left")
    df_merged = df_merged.merge(df_products, on="product_id", how="left")

    # 4. Geração das Métricas
    # Métrica A: Quantidade de tickets (reviews) por dia
    # Pegamos apenas a parte da data (sem hora) para agrupar
    tickets_per_day = (
        df_reviews.groupby(df_reviews["review_creation_date"].dt.date).size().to_dict()
    )

    # Métrica B: Top categorias (usando a coluna product_category_name)
    # Pegamos os top 5 assuntos que mais geram tickets/reviews
    top_categories = df_merged["product_category_name"].value_counts().head(5).to_dict()

    # Formatação final para o JSON
    metrics = {
        # Convertendo a data para string para o JSON aceitar
        "tickets_per_day": {str(k): int(v) for k, v in tickets_per_day.items()},
        "top_categories": {str(k): int(v) for k, v in top_categories.items()},
        "total_tickets": len(df_reviews),
    }

    # 5. Salva em processed/metrics.json
    os.makedirs(os.path.dirname(PROCESSED_DATA_PATH), exist_ok=True)
    with open(PROCESSED_DATA_PATH, "w", encoding="utf-8") as f:
        json.dump(metrics, f, indent=4, ensure_ascii=False)

    # observacao manual do dataframe
    # with open("processed/merged.csv", "w", encoding="utf-8") as f:
    #     df_merged.to_csv(f, index=False)

    # verificar linhas quebradas
    # print(df_merged.shape)  # Verifica se o número de linhas/colunas está correto
    # print(df_merged.info())  # Verifica se há dados nulos onde não deveria
    # print(
    #     df_merged.iloc[22], df_merged.iloc[41]
    # )  # Imprime a primeira linha completa para conferir os campos
    print(f"ETL finalizado com sucesso! Métricas geradas em {PROCESSED_DATA_PATH}")


if __name__ == "__main__":
    run_etl()
