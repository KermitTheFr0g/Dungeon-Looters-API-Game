# Dungeon Looters
Welcome to the Cosmic Array, Dungeon Looters is an API based game designed to teach new programmers how to interact with an API. Or for experienced developers to build a soultion or automate!

## Getting started
In order to get started you need to register an account. The API token returned from this needs to be used in all future requests to authenticate the user.

`POST /user/account/signup`

Request Body
```JSON
{
    "username": "your username",
    "name": "your name"
}
```

Reponse Body

`SUCCESS`
```JSON
{
    "success": true,
    "message": "User created successfully, keep your token secret!",
    "api_token": "cosmicarray_api-token"
}
```

`ERROR`
```JSON
{
    "message": "Username is already taken"
}
```

Once you have your own account you can begin the starter process! This envolves hiring your first hunter.

First you need to know which hunters you are allowed to hire.

`GET /starter/hunter/hunters`

Response Body 
```JSON
{
    "startHunters": [
        {
            "name": "White Knight",
            "description": "Character description",
            "image": "imgur.com/12sdfj",
            "health": 100,
            "attack": 100,
            "defense": 100,
            "speed": 100,
            "overallLevel": 100
        },
        
        {
            "name": "White Knight",
            "description": "Character description",
            "image": "imgur.com/12sdfj",
            "health": 100,
            "attack": 100,
            "defense": 100,
            "speed": 100,
            "overallLevel": 100
        }
    ]
}
```

You can choose which ever starter hunter you would like to hire for your adventure through the cosmic array.

`POST /starter/hunter/select-hunter`

Request Body
```JSON
{
    "hunterName": "White Knight"
}
```

Response Body

`SUCCESS`
```JSON
{
    "success": true,
    "message": "Starter hunter selected successfully",
    "hunterName": "White Knight"
}
```

`ERROR`
```JSON
{
    "message": "Invalid starter hunter",
    "tip": "Make sure you are selecting a start hunter / the hunter exists using /starter/hunter/hunters"
}
```

