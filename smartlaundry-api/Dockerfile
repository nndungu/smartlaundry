# ----------- Stage 1: Build with Gradle ----------
FROM gradle:8.8-jdk21-jammy AS build

WORKDIR /app

# Copy Gradle wrapper and config first for caching
COPY --chown=gradle:gradle gradlew .
COPY --chown=gradle:gradle gradle ./gradle
COPY --chown=gradle:gradle build.gradle settings.gradle gradle.properties ./

# Pre-cache dependencies (optional, fails gracefully)
RUN ./gradlew build -x test --no-daemon --stacktrace || true

# Copy the rest of the source code
COPY --chown=gradle:gradle . .

# Build the project
# If you want to run tests, remove '-x test'
ARG RUN_TESTS=false
RUN if [ "$RUN_TESTS" = "true" ] ; then ./gradlew clean build --no-daemon ; else ./gradlew clean build -x test --no-daemon ; fi

# ----------- Stage 2: Run the application ----------
FROM eclipse-temurin:21-jdk-jammy

WORKDIR /app

# Copy the built JAR from the build stage
COPY --from=build /app/build/libs/*.jar app.jar

# Expose default Spring Boot port
EXPOSE 8080

# Run the JAR
ENTRYPOINT ["java", "-jar", "app.jar"]
