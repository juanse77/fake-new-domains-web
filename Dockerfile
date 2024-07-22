FROM python:3.13.0b4-alpine3.20

RUN apk update && apk add --no-cache \
    curl \
    gcc \
    musl-dev \
    libffi-dev \
    openssl-dev \
    make

RUN mkdir -p ~/temp
RUN mkdir -p /app

WORKDIR /app

RUN pip install virtualenv
RUN virtualenv .env

# Usar sh en lugar de bash
RUN /bin/sh -c "source /app/.env/bin/activate"

COPY requirements.txt /app/
RUN pip install -r requirements.txt

COPY static /app/static
COPY scripts /app/scripts
COPY templates /app/templates

COPY app.py /app/

EXPOSE 5000

CMD ["python", "app.py"]