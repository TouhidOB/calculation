# syntax=docker/dockerfile:1
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# deps first (cached layer)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# project code
COPY . .

# collect static (whitenoise) + migrate placeholder
RUN python manage.py collectstatic --noinput || true

# non-root
RUN adduser --disabled-password --gecos "" django && chown -R django /app
USER django

EXPOSE 8000

CMD ["gunicorn", "calculation_api.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3", "--timeout", "60"]