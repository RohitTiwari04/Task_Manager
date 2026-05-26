# Stage 1: Build the application using JDK 23
FROM eclipse-temurin:23-jdk-alpine AS build
WORKDIR /app

# Copy all project files
COPY . .

# Grant execution permissions on gradlew and compile the jar file
RUN chmod +x gradlew
RUN ./gradlew build -x test --no-daemon

# Stage 2: Create the runtime environment using lightweight JRE 23
FROM eclipse-temurin:23-jre-alpine
WORKDIR /app

# Copy the compiled jar from the build stage
COPY --from=build /app/build/libs/*.jar app.jar

# Expose the application port
EXPOSE 8081

# Launch the Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]
