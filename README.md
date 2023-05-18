# HTTP Mock Server / REST & SOAP

## Simple node.js express server for testing purposes


### How to run

```
npm i
node server.js
```

### Usage:

- Create a route in related file (restMock/soapMock):

```
    // rest route example
    app.get("/user", express.json(), (req, res) => {
    getUsers(req, res, ResponseType.RANDOM_ERROR);
    });
```

#### Show Errors:

- You can show errors randomly by giving "ResponsType". Default is "SUCCESS" :

```
    ResponseType = {
    RETURN_ERROR: "RETURN_ERROR",
    RANDOM_ERROR: "RANDOM_ERROR",
    SUCCESS: "SUCCESS",
    };

    getUserById(req, res);
    getUserById(req, res, ResponseType.RANDOM_ERROR);
```
