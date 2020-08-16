sudo apt-get update
sudo apt-get install curl git docker.io docker-compose nodejs npm python

# Updating npm to 5.6.0
sudo npm install npm@5.6.0 -g

# Updating nodejs
sudo npm install -g n
n stable
node --version

# Setting up docker configuration
sudo usermod -a -G docker $USER

sudo systemctl start docker
sudo systemctl enable docker

# Installing golang
wget https://dl.google.com/go/go1.13.6.linux-amd64.tar.gz
tar -xzvf go1.13.6.linux-amd64.tar.gz && rm "go1.13.6.linux-amd64.tar.gz"
sudo mv go/ /usr/local

# edit gopath in .bashrc
echo '' >> ~/.bashrc
echo '# GOPATH configuration for hyperledger' >> ~/.bashrc
echo 'export GOPATH=/usr/local/go' >> ~/.bashrc
echo 'export PATH=$PATH:$GOPATH/bin' >> ~/.bashrc

echo "Relogin"
