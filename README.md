# Donnchad

This project contains the backend for our social management app (https://github.com/aavsss/FindComplement).

# Description:

- There are three major services:
  ### 1. Authentication Service:
        - Authentication Service provides authentication service for our applications' users.
        - Authentication Service is built using TypeScript, Express, MongoDB, and TDD approach.
        - A custom npm package called "commons" is used to store housekeeping modules that could be reused in other NodeJS micro-services in the future.
  ### 2. Events Service:
        - Event Service handles all the event related functionality of our backend.
        - This service is built using Python, Flask, and SQLLite.
  ### 3. Chats Service:
        - Chat Service handles all the chat related features that our application provides.
        - This service leverages Go, and SQL.
- RabbitMQ will be used as a message broker between inter-service communications in the backend.
- NGINX will be used as a laod balancer and reverse proxy solution for our application backend infrastructure.
- The microservices will be run in containerized environment by leveraging Docker and Kubernetes products.

# Purpose of this project:

- Learn about the current micro-service oriented architectute and distributed systems
- Learn Docker and kubernetes.

# Tools Used:

1. Languages used:
   - TypeScript, JavaScript, Go, and Python.
2. Frameworks used:
   - Flask, and Express
3. Tools used:
   - RabbitMQ, PostgreSQL, MongoDB, NGINX, Docker, and Kubernetes
