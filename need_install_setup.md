install nodejs  
'npm init' -> fill out the informations
install express   'npm install express --save'
install path, ejs, mariadb, boy-parser : 'sudo npm install path ejs mariadb body-parser --save'

install mariadb in your computer;

* Setup for database: 
- In file database.js, you need change user and password to match your mariadb.
- run mariadb and add database.sql to your databases, command: 
   + 'mysql -u "your_user_name" -p'    --> enter your password of mariadb.
   + 'create database database_application;'
   + 'use database_application;'
   + 'source "path to file database.sql in your computer";'   // example : source abc/projet_application/routes/database/database.sql;
 

