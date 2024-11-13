FROM python:3.10-slim

WORKDIR /app

COPY . /app

COPY /etc/ssl/certs/harbor-ca.crt /usr/local/share/ca-certificates/harbor-ca.crt

RUN apt-get update && \
    apt-get install -y ca-certificates && \
    update-ca-certificates && \
    pip install --no-cache-dir --upgrade pip setuptools && \
    pip install --no-cache-dir -r requirements.txt

EXPOSE 80

ENV FLASK_APP=app.py
ENV FLASK_ENV=production

CMD ["gunicorn", "--bind", "0.0.0.0:80", "app:app"]
