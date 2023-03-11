# Api Documentation

## Post

### /admin/login (accepts JSON)

* #### Request Body
|Filed   |Datatype|
|--------|--------|
|userName|String  |
|password|String  |

* #### Respnse
|Field|Data Type|
|---------|--------------------|
|status   |['SUCCESS','FAILED']|
|token    |JWT token           |

#### Description
* exclusively for admin login
* admin details are stored in a seperate collectoion

### /admin/createuser (accepts JSON)

* #### Request Body
|Filed        |Datatype                   |        | 
|-------------|---------------------------|--------|
|userName     |String                     |        |
|userType     |[nurse,doctor,cghmr,normal]|        |
|gender       |[male,femail,other]        |        |
|department   | [canteen,school]          |        |
|address      | Object{}                  |        |
|             |houseName                  | String |
|             |district                   | String |
|             |city                       | String |
|             |state                      | String |
|             |pin                        | Number |
|email        | string                    |        |
|serviceStatus| [serving,retired]         |        |

* #### Respnse
|Field|Data Type|
|---------|--------------------|
|status   |['SUCCESS','FAILED']|
|password |String              |

#### Description
* exclusively for admin to create new user
* returns the password of the newely created user