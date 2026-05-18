# Stage 1: Build the application using Maven and Java 21
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copy pom.xml and source code
COPY pom.xml .
COPY src ./src

# Build the application package and skip running tests to speed up deployment
RUN mvn clean package -DskipTests

# Stage 2: Create a lightweight runtime image using Java 21 JRE
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy the built jar file from the builder stage
COPY --from=build /app/target/movie-platform-api-2.0.0.jar app.jar

# Expose port 7000 (which Spring Boot runs on)
EXPOSE 7000

# Start the application
ENTRYPOINT ["java", "-jar", "app.jar"]
