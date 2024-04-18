FROM golang:1.22.2-alpine AS build

WORKDIR /app
COPY go.mod go.sum .

RUN go mod download && go mod verify

COPY . .

RUN go build -o /go/bin/todo-api

FROM gcr.io/distroless/static-debian12
COPY --from=build /go/bin/todo-api /
CMD ["/todo-api"]
