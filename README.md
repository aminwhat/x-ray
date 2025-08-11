# X-Ray Project

A Sample Microservice Project using RabbitMQ & Mongodb

## Parts

The `/apps` directory contains two main project:

- consumer:

  - consumes that incomming messages from the rabbitmq, process them and store them in a mongodb database
  - get data from the database back to the producer as it requested the `deviceId`
- producer:

  - An RestApi service that includes two endpoints: process data & get data (Swagger Url: `localhost:3000/api`)
  - process data emit the given data after validation into the rabbitmq for the consumer to process
  - get data filters the data from the consumer using the rabbitmq send system and get the data from the consumer based on the given deviceId

## Setup & Instructions

Just run:

```sh
docker compose up -d
```

after downloading necessary images and build the project open the web browser and navigate to the `localhost:3000/api`

in the swagger the two EndPoints are available with their needed requests info and type of responses
