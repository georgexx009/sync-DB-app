
# Sync DB App

Service example to sync the database with data from a third party API.

Imaging you have an app which creates data in your database base on a third party API (this doesn’t mean that you replicate the data from the third party in your database, is more like if something changes in the third party app, then you create something in your DB base on that). This means that when the data changes in the third party, probably you will need to delete or create data in your database (model).




## Installation 

Install my-project with npm

```bash 
  yarn install
  yarn dev
```
    
## 

This app uses Next.js with Typescript. Jest to run the unit tests for the service.

I did not add the connection to the database to focus on the sync service. The database is simulated with a global variable, for educational purposes only.



  
## App usage

The app renders the list that simulates the DB data. And on the right gives you a list of the sync result each time the third party data changes.

  
