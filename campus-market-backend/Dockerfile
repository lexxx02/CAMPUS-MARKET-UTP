# Etapa de construcción (Build)
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
# Compila el proyecto saltando las pruebas para que sea más rápido
RUN mvn clean package -DskipTests

# Etapa de ejecución (Run)
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
# Copia el archivo compilado desde la etapa anterior
COPY --from=build /app/target/campus-market-1.0.0.jar app.jar
# Expone el puerto que usa Spring Boot
EXPOSE 8080
# Comando para arrancar el servidor
ENTRYPOINT ["java", "-jar", "app.jar"]
