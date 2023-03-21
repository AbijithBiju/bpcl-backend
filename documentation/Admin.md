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
|gender       |[male,female,other]        |        |
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

### /admin/addDependent/:id (accepts JSON)

* #### Request Body
|Filed        |Datatype                   | 
|-------------|---------------------------|
|name         |String                     |
|age          |Number                     |
|relation     |[wife,husband,child,parent,sibling]|
|isSMA        |Boolean|

* #### Respnse
|Field|Data Type|
|---------|--------------------|
|status   |['SUCCESS','FAILED']|

#### Description
* to add a dependent to a user
* userId is passed as request parameter