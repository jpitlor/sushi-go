# TODO: Cache dependencies!

FROM node:15.9.0 as frontend
WORKDIR /usr/sushi-go
COPY src/main/resources/client/ ./src/main/resources/client/
RUN ["npm", "install", "--prefix", "src/main/resources/client"]
RUN ["npm", "run", "build", "--prefix", "src/main/resources/client"]

FROM maven:3.6.3-jdk-11 as backend
WORKDIR /usr/sushi-go
COPY . ./
COPY --from=frontend  /usr/sushi-go/src/main/resources/public ./src/main/resources/public/
RUN ["mvn", "package"]

# Run!
FROM openjdk:11
WORKDIR /usr/sushi-go
COPY --from=backend /usr/sushi-go/target/sushi-go-server-1.0-SNAPSHOT.jar ./server.jar
ENTRYPOINT ["java", "-jar", "server.jar"]