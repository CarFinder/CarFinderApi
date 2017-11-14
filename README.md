[![Build Status](https://travis-ci.org/CarFinder/CarFinderApi.svg?branch=dev)](https://travis-ci.org/CarFinder/CarFinderApi)

[![Coverage Status](https://coveralls.io/repos/github/CarFinder/CarFinderApi/badge.svg?branch=dev)](https://coveralls.io/github/CarFinder/CarFinderApi?branch=dev)

# CarFinder API
___
## Purpose
This document provides a guildlines for CarFinder API.
___
## API Reference

### Defenition
*Note: Every request should contain `api/` prefix in URL.*

| Route | HTTP Medthod | URL Params | Success Response| Error Response | Description |
|-------|--------------|------------|-------------------|---------------| ------------|
|**USERS**|
| user/register/| POST | n/a | `CREATED: 201` | `CONFLICT: 409` | Creates a new user |
| user/confirm/| POST | n/a | `OK: 200` | `UNAUTHORIZED: 401` | Confirms a new user creation |
| user/signin/| POST | n/a | `OK: 200` | `UNAUTHORIZED: 401` | Authorizes an user|
| user/forgot/| POST | n/a | `OK: 200` | `UNAUTHORIZED: 401` | Sends a confirmation email to an user to restore password |
| user/restore/| POST | n/a | `OK: 200` | `UNAUTHORIZED: 401` | Restores user password |
| user/update-user-data/| POST | n/a | `OK: 200` | `UNAUTHORIZED: 401` | Updates user personal information |
| user/update-user-settings/| POST | n/a | `OK: 200` | `UNAUTHORIZED: 401` | Updates user settings |
| user/update-user-image/| POST | n/a | `OK: 200` | `UNAUTHORIZED: 401` | Updates user avatar |
|**FILTERS**|
| filter/marks/| GET | n/a | `OK: 200` | `INTERNAL SERVER ERROR: 500` | Returns an array of all car marks |
| filter/bodyTypes/| GET | n/a | `OK: 200` | `INTERNAL SERVER ERROR: 500` | Returns an array of all car body types |
| filter/bodyTypes/| GET | n/a | `OK: 200` | `INTERNAL SERVER ERROR: 500` | Returns an array of all car body types |
| filter/models/| POST | n/a | `OK: 200` | `INTERNAL SERVER ERROR: 500` | Returns an array of all models for a specified mark |
| filter/saved/| GET | n/a | `OK: 200` | `BAD REQUEST: 400` | Returns an array of all saved filters for a current user |
| filter/saved/| POST | n/a | `OK: 200` | `BAD REQUEST: 400` | Creates new saved filter for a current user |
| filter/saved/| DELETE | `all` | `OK: 200` | `BAD REQUEST: 400` | Deletes all saved filters for a current user |
| filter/saved/| DELETE | `:id` | `OK: 200` | `BAD REQUEST: 400` | Deletes a specified saved filter for a current user |
|**ADS**|
| posts/| POST | n/a | `OK: 200` | `INTERNAL SERVER ERROR: 500` | Returns a list of car ads for specified filter parameters |
| posts/saved| GET | n/a | `OK: 200` | `INTERNAL SERVER ERROR: 500` | Returns a list of new car ads for all saved filter parameters for a current user |
___
### Detailed Information

#### Users
+ **Sign up**
  * *URL*: `/api/user/register/`
  * *Method*: `POST`
  * *URL Params*: None
  * *Data Params*: 
    ```javascript
    {
        name: String;
        email: String;
        password: String;
    }
    ```
  *  *Success Response*:
  *  *Code*: `200`
  *  *Content*: None
  *  *Error Response:*
  *  *Code:* `409`
  *  *Content*: `Error Message`

+ **Confirm Email**
  * *URL*: `/api/user/confirm/`
  * *Method*: `POST`
  * *URL Params*: None
  * *Data Params*: 
    ```javascript
    {
        token: String;
    }
    ```
  *  *Success Response*:
  *  *Code*: `200`
  *  *Content*: `{ token }`
  *  *Error Response*:
  *  *Code*: `401`
  *  *Content*: `Error Message`
    
+ **Sign in**
  * *URL*: `/api/user/signin/`
  * *Method*: `POST`
  * *URL Params*: None
  * *Data Params*: 
    ```javascript
    {
        email: String;
        password: String;
    }
    ```
  *  *Success Response*:
  *  *Code*: `200`
  *  *Content*: None
  *  *Error Response*:
  *  *Code*: `401`
  *  *Content*: `Error Message`

+ **Forgot Password**
  * *URL*: `/api/user/forgot/`
  * *Method*: `POST`
  * *URL Params*: None
  * *Data Params*: 
    ```javascript
    {
        email: String;
    }
    ```
    *Success Response*:
    *Code*: `200`
    *Content*: None
    *Error Response*:
    *Code*: `401`
    *Content*: `Error Message`
    
+ **Restore Password**
  * *URL*: `/api/user/restore/`
  * *Method*: `POST`
  * *URL Params*: None
  * *Data Params*: 
    ```javascript
    {
        password: String;
        token: String;
    }
    ```
  *  *Success Response*:
  *  *Code*: `200`
  *  *Content*: None
  *  *Error Response*:
  *  *Code*: `401`
  *  *Content*: `Error Message`

+ **Update User Data**
  * *URL*: `/api/user/update-user-data/`
  * *Method*: `POST`
  * *Header*s: `authorization: Bearer ${token}`
  * *URL Params*: None
  * *Data Params*: 
    ```javascript
    {
        name: String;
        email: String;
    }
    ```
  *  *Success Response*:
  *  *Code*: `200`
  *  *Content*: `{ token }`
  *  *Error Response*:
  *  *Code*: `401`
  *  *Content*: `Error Message`
    
+ **Update User Settings**
  * *URL*: `/api/user/update-user-settings/`
  * *Method*: `POST`
  * *Header*s: `authorization: Bearer ${token}`
  * *URL Params*: None
  * *Data Params*: 
    ```javascript
    {
        interfaceLanguage: String;
        subscription: Boolean;
    }
    ```
  *  *Success Response*:
  *  *Code*: `200`
  *  *Content*: `{ token }`
  *  *Error Response*:
  *  *Code*: `401`
  *  *Content*: `Error Message`
+ **Update User Image**
  * *URL*: `/api/user/update-user-image/`
  * *Method*: `POST`
  * *Header*s: `authorization: Bearer ${token}`
  * *URL Params*: None
  * *Data Params*: 
    ```javascript
    {
        image: String;
        type: String;
    }
    ```
  *  *Success Response*:
  *  *Code*: `200`
  *  *Content*: `{ token }`
  *  *Error Response*:
  *  *Code*: `401`
  *  *Content*: `Error Message`

___
#### Filters
+ **Get Car Marks**
  * *URL*: `/api/filter/marks/`
  * *Method*: `GET`
  * *Header*s: `authorization: Bearer ${token}`
  * *URL Params*: None
  * *Data Params*: None
  *  *Success Response*:
  *  *Code*: `200`
  *  *Content*: 
    ```javascript
    {
        [
            {
                _id: String;
                name: String;
            },
            ...
        ]
    }
    ```
  *  *Error Response*:
  *  *Code*: `500`
  *  *Content*: `Error Message`
+ **Get Car Body Types**
  * *URL*: `/api/filter/bodyTypes/`
  * *Method*: `GET`
  * *Header*s: `authorization: Bearer ${token}`
  * *URL Params*: None
  * *Data Params*: None
  *  *Success Response*:
  *  *Code*: `200`
  *  *Content*: 
    ```javascript
    {
        [
            {
                _id: String;
                name: String;
            },
            ...
        ]
    }
    ```
  *  *Error Response*:
  *  *Code*: `500`
  *  *Content*: `Error Message`
+ **Get Car Models**
  * *URL*: `/api/filter/models/`
  * *Method*: `POST`
  * *Header*s: `authorization: Bearer ${token}`
  * *URL Params*: None
  * *Data Params*: 
    ```javascript
    {
        markId: String;
    }
    ```
  *  *Success Response*:
  *  *Code*: `200`
  *  *Content*: 
    ```javascript
    {
        [
            {
                _id: String;
                name: String;
            },
            ...
        ]
    }
    ```
  *  *Error Response*:
  *  *Code*: `500`
  *  *Content*: `Error Message`

+ **Get Saved Filters**
  * *URL*: `/api/filter/saved/`
  * *Method*: `GET`
  * *Header*s: `authorization: Bearer ${token}`
  * *URL Params*: None
  * *Data Params*: None
  *  *Success Response*:
  *  *Code*: `200`
  *  *Content*: 
    ```javascript
    {
        [
            {
                _id: String;
                name: String;
                url: String;
                userId: String;
                markId: String;
                bodyTypeId: [String, ...];
                modelId: [String, ...];
                priceFrom: Number;
                priceTo: Number;
                yearFrom: Number;
                yearTo: Number;
                kmsFrom: Number;
                kmsTo: Number;
            },
            ...
        ]
    }
    ```
  *  *Error Response*:
  *  *Code*: `400`
  *  *Content*: `Error Message`
+ **Create New Saved Filter**
  * *URL*: `/api/filter/saved/`
  * *Method*: `POST`
  * *Header*s: `authorization: Bearer ${token}`
  * *URL Params*: None
  * *Data Params*: 
    ```javascript
    {
        name: String;
        url: String;
        markId: String;
        bodyTypeId: [String, ...];
        modelId: [String, ...];
        priceFrom: Number;
        priceTo: Number;
        yearFrom: Number;
        yearTo: Number;
        kmsFrom: Number;
        kmsTo: Number;
    }
    ```
  *  *Success Response*:
  *  *Code*: `200`
  *  *Content*: None
  *  *Error Response*:
  *  *Code*: `401`
  *  *Content*: `Error Message`

+ **Delete All Saved Filters**
  * *URL*: `/api/filter/saved/all`
  * *Method*: `DELETE`
  * *Header*s: `authorization: Bearer ${token}`
  * *URL Params*: `all`
  * *Data Params*: None
  *  *Success Response*:
  *  *Code*: `200`
  *  *Content*: None
  *  *Error Response*:
  *  *Code*: `401`
  *  *Content*: `Error Message`

+ **Delete Saved Filter By Id**
  * *URL*: `/api/filter/saved/:id`
  * *Method*: `DELETE`
  * *Header*s: `authorization: Bearer ${token}`
  * *URL Params*: `:id`
  * *Data Params*: None
  *  *Success Response*:
  *  *Code*: `200`
  *  *Content*: None
  *  *Error Response*:
  *  *Code*: `401`
  *  *Content*: `Error Message`

___
#### Ads
+ **Get Car Ads**
  * *URL*: `/api/posts/`
  * *Method*: `POST`
  * *Header*s: `authorization: Bearer ${token}`
  * *URL Params*: None
  * *Data Params*:
    ```javascript
    {
        filter: {
            markId: String;
            bodyTypeId: [String, ...];
            modelId: [String, ...];
            priceFrom: Number;
            priceTo: Number;
            yearFrom: Number;
            yearTo: Number;
            kmsFrom: Number;
            kmsTo: Number;
        },
        limit: Number;
        skip: Number;
        sort: {
            year: -1 || 1;
            price: -1 || 1;
            kms: -1 || 1;
        }
    }
    ```
  *  *Success Response*:
  *  *Code*: `200`
  *  *Content*: 
    ```javascript
    {
        [
            {
                _id: String;
                mark: String;
                model: String;
                bodyType: String;
                description: String;
                images: [String, ...];
                price: Number;
                kms: Number;
                year: Number;
                sourceName: String;
                sourceUrl: String;
            },
            ...
        ]
    }
    ```
  *  *Error Response*:
  *  *Code*: `500`
  *  *Content*: `Error Message`
    
+ **Get Car Ads For Saved Filters**
  * *URL*: `/api/posts/saved`
  * *Method*: `GET`
  * *Header*s: `authorization: Bearer ${token}`
  * *URL Params*: None
  * *Data Params*: None
  *  *Success Response*:
  *  *Code*: `200`
  *  *Content*: 
    ```javascript
    {
        filterId: String;
        filterName: String;
        filterUrl: String;
        ads: [
                {
                    _id: String;
                    mark: String;
                    model: String;
                    bodyType: String;
                    description: String;
                    images: [String, ...];
                    price: Number;
                    kms: Number;
                    year: Number;
                    sourceName: String;
                    sourceUrl: String;
                },
                ...
        ]
    }
    ```
  *  *Error Response*:
  *  *Code*: `500`
  *  *Content*: `Error Message`
___
## Technologies

* TypeScript
* Koa / Node.js
* MongoDB
* Mocha, Chai

___
## Authors
* [Ilya Bobr](https://github.com/BobriK502 "Ilya Bobr")
* [Anton Stankovski](https://github.com/StankAnt "Anton Stankovski")
* [Anatoly Belobrovik](https://github.com/AnatolyBelobrovik "Anatoly Belobrovik")
* [Elizaveta Buraya](https://github.com/ElizavetaBuraya "Elizaveta Buraya")
