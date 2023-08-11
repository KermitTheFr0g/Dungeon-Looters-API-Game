# Dungeon Looters
Welcome to the Cosmic Array, Dungeon Looters is an API based game designed to teach new programmers how to interact with an API. Or for experienced developers to build a soultion or automate!

## Getting started
In order to get started you need to register an account. The API token returned from this needs to be used in all future requests to authenticate the user. To pass the API token in the request it is added into the query. `{url}?token=cosmicarray_api-token`

### `POST /user/account/signup`
Signing up for an account in order to begin exploring the Cosmic Array...

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

### `GET /starter/hunter/hunters`
This request returns all of the starter hunters which can be chosen.

Response Body 
```JSON
{
    "startHunters": [
        {
            "name": "White Knight",
            "description": "Character description",
            "image": "imgur.com/12sdfj",
            "health": 10,
            "attack": 10,
            "defense": 10,
            "speed": 10,
            "overallLevel": 10
        },
        
        {
            "name": "White Knight",
            "description": "Character description",
            "image": "imgur.com/12sdfj",
            "health": 10,
            "attack": 10,
            "defense": 10,
            "speed": 10,
            "overallLevel": 10
        }
    ]
}
```

You can choose which ever starter hunter you would like to hire for your adventure through the cosmic array.

### `POST /starter/hunter/select`
This endpoint is how you select your first hunter to hire.

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

Once selecting your starter hunter, you can send them out for their first adventure. Call this endpoint to find the available starter dungeons.

### `GET /starter/dungeon/dungeons`
This endpoint returns back all of the available dungeons for a starter adenture.

Response Body
```JSON
{
    "starterDungeons": [
        {
            "name": "Goblin Hole",
            "description": "The local Goblin's Hole",
            "image": "imgur.com/40asdfsakj",
            "level": 10
        }
    ]
}
```

After receiving the list of starter dungeons you can then select the dungeon and hunter to go on your first adventure.

### `POST /starter/dungeon/select`
Using dungeons returned from the previous endpoint, this takes a dungeon name and hunter name which then begins the hunter's adventure.

Request Body
```JSON
{
    "dungeonName": "Goblin Hole",
    "hunterName": "White Knight"
}
```

Response Body

`SUCCESS`
```JSON
{
    "adventureStarted": true,
    "dungeonSelected": "Goblin Hole",
    "hunterSelected": "White Knight",
    "returningAt": 2023-08-11 07:08:11,
    "tip": "You have begun a started Dungeon!"
}
```

*Write potential error messages for this endpoint*

This now means your first adventure has started! Remember once you have used this `/starter` endpoint for getting your first hunter and dungeon you must move on from them and use the endpoint allowing you to explore the entire of the Cosmic Array! 

You can now move on to not use the `/starter` endpoints. Once your adventure has begun you can use use the endpoint below to check all of your active adventures. Finding out when they're to finish and additional information.

Let's look at how you can manage your current adventures.

### `GET /adventure/dungeon/active`
Use this endpoint to return back all of your active adventures. Returning back both adventures which are still in progress and completed. These completed dungeons can then be taken to the next endpoint to debrief from the adventure.

Response Body
```JSON
{
    "activeDungeonAdventures": [
        {

        }
    ] 
}
```

### `POST /adventure/dungeon/debrief`
This endpoint is how you debrief a completed adventure. This rewards the user with the gold, experience and the items from the dungeon loot pool. The user's hunter sent out on the adventure is rewarded with experience making it more powerful. 

Request Body
```JSON
{
    "adventureID": 123456
}
```

Response Body

`SUCCESS`
```JSON
{
    "message": "Dungeon Adventured Debriefed",
    "rewards": {
        "xp": 100,
        "gold": 56,
        "loot": [
            {
                "id": 1230,
                "name": "Silver Sword",
                "dropChance": 80
            },
            {
                "id": 3231,
                "name": "Wooden Wand",
                "dropChance": 65
            }
        ]
    }
}
```
