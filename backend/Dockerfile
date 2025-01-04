FROM openjdk:17-oracle AS build

# Set the working directory inside the container
WORKDIR /app

# Create a non-root user to run app as (instead of root)
RUN groupadd app && useradd -g app -s /bin/bash -m app

# Copy the jar file into the docker image
COPY target/*.jar app.jar

# Change ownership of the jar file to the app user
RUN chown app:app /app/app.jar

# Switch to non-root user
USER app

# Run the jar file
ENTRYPOINT ["java", "-jar", "/app/app.jar"]