## Register
To register a new user, collect registered user data & tokens

**URL**: `localhost:3000/user/register`

**Method**: `POST`

**Authentication**: Not required

## Request body
**Required fields:** `email`, `first_name`, `last_name`, `password`

**Optional fields:**

**Data**:
```bash
{
    "email": "t@gmail.com",
    "first_name": "Sattvikur",
    "last_name": "Dwivedi",
    "password": "123"
}
```

## Success response
**Code**: `200 OK`

**Content**:
```bash
{
    "user": {
        "_id": "606efbba17e43a04cce0286d",
        "first_name": "Sattvikur",
        "role": "blogger"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR...TL54pO2vJkQ21J6kzQ",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR...SlZ1R_Kd3lxph4N8IFbg"
}
```

## Error response
**Condition**: If any of the required params is absent or the `email` is already registered.

**Code**: `409 Conflict`

**Content**:
```bash
{
    "error": {
        "status": 409,
        "message": "t@gmail.com already exists"
    }
}
```