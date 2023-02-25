# bpcl-backend
 
## API Documentation

### POST
#### /user/login/ (accepts form-data)

* ##### Request Body 

|Field    |Data Type |
|---------|----------|
|userName |String    |
|password |String    |

* ##### Response

|Field|Data Type|
|---------|--------------------|
|status   |['SUCCESS','FAILED']|
|userId   |String              |
|token    |String              |

##### Description
* accepts user name and password
* verify user name and password
* if user exists and password verified
    * returns status, userid and token
* token is valid for 3 hours (see bpcl-backend/api/User.js - line no. 43)

### GET
#### /user/:userId/
* Require token 
* returns user data
