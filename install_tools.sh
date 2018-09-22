sudo apt update
sudo apt -y upgrade
sudo apt -y dist-upgrade

sudo apt install build-essential
sudo apt -y install nodejs
yarn add -D react axios lodash moment react-datepicker
yarn add -D @material-ui/core @material-ui/icons 

sudo npm install -g serve
serve -s build

sudo apt -y install mariadb-server
sudo mysql_secure_installation
sudo mysql -u root -p
use mysql;
update user set plugin='mysql_native_password' where User = 'root';
flush privileges;

create user 'newuser'@'localhost' identified by 'password';
grant all privileges on db_asc.* to 'newuser'@'localhost';
flush privileges;


insert into TB_USR_CTL (username, startDate, endDate, adminInd, createdBy, modifiedBy) values ('admin', '01-01-2018', '12-31-2099', 'y', 'admin', 'admin');

sudo apt -y autoremove