sudo docker build -t api.image .
sudo docker run --rm -it -p 127.0.0.1:2999:2999 api.image
