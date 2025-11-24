# ----------- Stage 1: Build with Gradle ----------
FROM gradle:8.8-jdk21-jammy AS build

# Set working directory
WORKDIR /app

# Copy ONLY build scripts first (layer caching optimization)
COPY --chown=gradle:gradle gradlew ./
COPY --chown=gradle:gradle gradle ./gradle
COPY --chown=gradle:gradle build.gradle settings.gradle gradle.properties ./

# Ensure Gradle wrapper is executable
RUN chmod +x gradlew

# Download dependencies (optional optimization)
RUN ./gradlew dependencies || true

# Copy the entire project including resources & migrations
COPY --chown=gradle:gradle . .

# Build the application
RUN ./gradlew clean build -x test --no-daemon

# ----------- Stage 2: Run the application ----------
FROM eclipse-temurin:21-jdk-jammy

WORKDIR /app

# Copy the built JAR from the build stage
COPY --from=build /app/build/libs/*.jar app.jar

# Expose app port
EXPOSE 8080

# Run the JAR
ENTRYPOINT ["java", "-jar", "app.jar"]
