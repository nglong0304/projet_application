- install nodejs  
- 'npm init' -> fill out the informations
- install express  -> 'npm install express --save'
- install all package in the section "dependencies" in file "package.json" -> 'sudo npm install md5 path ejs mariadb body-parser express-session --save'

- install mariadb in your computer;

* Setup for database: 
- In file database.js, you need change user and password to match your mariadb.
- run mariadb and add database.sql to your databases, command: 
   + 'mysql -u "#your_user_name_of_mysql" -p'    --> enter your password of mariadb.
   + 'create database database_application;'
   + 'use database_application;'
   + 'source "path to file database.sql in your computer";'   // example : source ##/projet_application/routes/database/database.sql;

- To run : 
'node app.js'

- In browser : localhost:3000

 

