# Cache Frontend Dependencies
FROM node:15.9.0-alpine3.0 as frontend-dep-cache
WORKDIR /usr/sushi-go
COPY src/main/resources/client/package.json ./src/main/resources/client/
RUN ["npm", "install", "--prefix", "src/main/resources/client"]

# Cache Backend Dependencies
FROM maven:3.6.3-jdk-11 as backend-dep-cache
WORKDIR /usr/sushi-go
COPY pom.xml .
RUN ["mvn", "dependency:go-offline"]

# Build Frontend
FROM frontend-dep-cache as frontend-build
RUN ["npm", "run", "build", "--prefix", "src/main/resources/client"]

# Build Backend
FROM backend-dep-cache as backend-build
WORKDIR /usr/sushi-go
COPY --from=frontend-build  /usr/sushi-go/* .
RUN ["mvn", "package"]

# Run!
FROM openjdk:17-ea-10-jdk as run
WORKDIR /usr/sushi-go
COPY --from=backend-build /usr/sushi-go/target/sushi-go-server-1.0-SNAPSHOT.jar server.jar
ENTRYPOINT ["java", "-jar", "server.jar"]