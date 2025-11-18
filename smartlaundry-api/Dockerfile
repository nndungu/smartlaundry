# ----------- Stage 1: Build with Gradle ----------
FROM gradle:8.8-jdk21-jammy AS build

WORKDIR /app

COPY --chown=gradle:gradle . .

RUN chmod +x gradlew

RUN ./gradlew clean build -x test --no-daemon

# ----------- Stage 2: Run the application ----------
FROM eclipse-temurin:21-jdk-jammy

WORKDIR /app

COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
