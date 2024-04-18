FROM golang:1.22.2-alpine AS base
WORKDIR /app

COPY go.mod go.sum .

RUN go mod download && go mod verify

COPY . .

RUN go build -o /usr/local/bin/todo-api

CMD ["todo-api"]
