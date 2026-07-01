# stalse_desafio_dev
desafio para uma vaga de dev na Stalse. Stack Python + Next.js

# como instalar?
1. Clone o repositório:
   ```
   git clone https://github.com/WrongProvider/stalse_desafio_dev.git
   ```
2. Navegue até o diretório do projeto:
   ```
   cd stalse_desafio_dev
   ```
3. Utilize python uv para criar um ambiente virtual e instalar as dependências:
   ```
   uv venv
   uv install
   ```
4. Execute o servidor de desenvolvimento:
   ```
   cd backend
   uvicorn main:app --reload 
    ou  
   uv run python main.py
```
5. Execute o frontend de desenvolvimento:
   ```
   cd frontend
   npm install
   npm run dev
   ```
6. Acesse o frontend em `http://localhost:3000`.
