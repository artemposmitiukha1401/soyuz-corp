FROM python:3.13-slim

WORKDIR /app

COPY pyproject.toml ./
COPY app ./app
COPY migrations ./migrations
COPY wsgi.py ./

RUN python -m pip install --no-cache-dir .

CMD ["sh", "-c", "gunicorn --bind 0.0.0.0:${PORT:-8080} wsgi:app"]
