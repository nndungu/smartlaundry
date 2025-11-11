
FROM docker.io/library/gradle:8.8-jdk21-jammy AS build
WORKDIR /app
COPY --chown=gradle:gradle . .
RUN gradle clean build --no-daemon -x test


FROM docker.io/library/eclipse-temurin:21-jdk-jammy
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
