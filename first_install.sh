# [INSTALANDO DEPENDENCIAS]
sudo apt update
sudo apt install npm nodejs-legacy
sudo npm cache clean -f
sudo npm install -g n
sudo n stable


sudo npm install

# [INSTALANDO ARQUIVO DE SERVICOS]
cd exchanges
sudo node install-service.js
