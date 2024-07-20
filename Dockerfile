FROM python:latest

RUN apt-get update && apt-get install -y curl

RUN mkdir -p ~/temp
RUN mkdir -p /app

WORKDIR /app

RUN pip install virtualenv
RUN virtualenv .env

RUN /bin/bash -c "source /app/.env/bin/activate"

COPY requirements.txt /app/
RUN pip install -r requirements.txt

COPY static /app/static
COPY scripts /app/scripts
COPY templates /app/templates

COPY app.py /app/

EXPOSE 5000

CMD ["python", "app.py"]