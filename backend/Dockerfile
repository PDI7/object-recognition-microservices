
#FROM python:3.8-slim-buster
FROM python:3.9.7

WORKDIR /docker-python

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY . .

CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0"]