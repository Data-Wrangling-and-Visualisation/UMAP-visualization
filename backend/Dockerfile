# Use the official Python image as the base image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt .

# Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the server file into the container
COPY server.py .

# Expose the desired port
EXPOSE 8123

# Command to run the server using uvicorn
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8123"]