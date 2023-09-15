# Weather-Reports
The Node.js API that stores users’ emails and location, and automatically sends hourly weather reports every 3 hours.

# Project downlod & Run
1.Download the Code.
2.Open code Using vscode.
3.Open the terminal on Vscode.
4.Go Into the root directory usin terminal.
5.Install the modules.
```bash
npm install
 # or
npm i
```

# Add Evironment Variables
1.Open the ```bash # nodemon.json ``` file.
2.Add credential in this KEY.
```bash
    {
        "env": {
            "MONGO_USER": "", //MongoDB Usename
            "MONGO_PASSWORD": "", // MongoDB Password
            "MONGO_DB": "weather_reports", 
            "API_KEY":"", // Weather API Key

            "EMAIL_USERNAME": "", //Auther Email.
            "EMAIL_PASSWORD": "" //  email password for app
            }
    }
```
3.Use the terminal in the root directory. 
4.Run this comand to run the app.
```bash
 npm start
```

# Use the Postman check the routs
1. Create user Under the post methode.
   URL - [http://localhost:3000/users](http://localhost:3000/users)
  * Select the Data structure as the Json.
  * Sample insert quary.
    ```bash
    {
        "query": "mutation($email: String!, $location: String!, $date: String!) { createUser(userInput: { email: $email, location: $location, date: $date }) { _id } }",
        "variables": {
        "email": "example@gmail.com",
        "location": "New York",
        "date": "2023-09-15T09:54:38.045Z"
        }
    }
  ```


2. Update user location Under the post methode.
   URL - [http://localhost:3000/users](http://localhost:3000/users)
  * Select the Data structure as the Json.
  * Go to Header tab.
  * Insert into the Key as ```bash Authorization ```
  * Insert Weather API key into Value ```bash "Bearer xxxxxxxxxxxxxxxxxxxxxxx"```
  * Sample update quary.

    ```bash
    {
          "query": "mutation($id: ID!, $location: String!) { updateUser(userUpdateInput: { _id: $id, location: $location }) { _id email location date } }",
          "variables": {
          "id": "65047a1de29f6c82c1767207",
          "location": "Colombo"
          }
     }
    ```

  
