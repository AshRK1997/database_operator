# Database Operator - currently allows download of db to csv file

This project which is currently running on https://database-operator.herokuapp.com/ allows an user to export database data into csv file based on Connection String and Query. The Connection String and Query is sent to a backend which downloads the data from the database and sends it back to the frontend. No data as far as I know regarding connection string and query is being either stored in Frontend or Backend. The Backend github project link - https://github.com/AshRK1997/database-operator-backend


The current functionality is to just download the file from database through query and connection URL, later on planning to create upload as well.

If you want fork this or clone this, please feel free to. Procedure is simple.

1. Clone both the projects (this project and the backend project-https://github.com/AshRK1997/database-operator-backend)

2. Run npm install in both the projects

3. Run npm start in both  projects, change the env of this frontend project to the backend's Local address


