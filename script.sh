docker build -t tiviai .
docker stop tiviai
docker rm tiviai
docker run -d --env-file .env -p 3000:3000 --name tiviai tiviai