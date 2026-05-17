# ===== BUILD STAGE =====
FROM eclipse-temurin:21-jdk AS build

WORKDIR /app

# Copy Maven wrapper first (better caching)
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

RUN chmod +x mvnw

# Download dependencies first (cached layer)
RUN ./mvnw dependency:go-offline

# Now copy source code
COPY src ./src

# Build the application
RUN ./mvnw clean package -DskipTests


# ===== RUNTIME STAGE =====
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy only the jar from build stage
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]