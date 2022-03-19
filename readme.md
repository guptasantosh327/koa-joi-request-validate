# Koa-Joi-Request-Validate

## `A small module to provide Joi validation middleware within a Koa server`
This package support Joi verison from 16.1.8 and above

Need package support lower version of Joi below 16.1.8 use [koa-joi-validate](https://www.npmjs.com/package/koa-joi-validate)


Calling the module allows you to easily generate [Koa](https://github.com/koajs/koa) middleware to validate incoming requests using [Joi](https://github.com/hapijs/joi).


### Install

```bash
npm install koa-joi-request-validate
```

### Import

```javascript
const validate = require('koa-joi-request-validate')
```

or

```javascript
import validate from 'koa-joi-request-validate'
```

### Usage

To use the module, call `validate` with an object containing two parameters `schema` and `options`.

`schema` can be any possible Joi valid schema.
`options` parameter is optional and it can have all possible valid joi options.

The following basic example will verify that any request to the server contains a properly formatted request headers, params, query and body.


```javascript
const Koa = require('koa')
const joi = require('joi')
const validate = require('koa-joi-request-validate')

const app = new Koa()

app.use(validate({
  headers: {
    schema: Joi.object({
        "userId": joi.string().alphanum().length(32)
    }),
    // Only for headers by default allowUnknown: true
    // options object can take any valid options availble in Joi.
    options: { allowUnknown: true } 
    
  },
  query: {
    schema: Joi.object({
        page: joi.string().required(),
        limit: joi.string().required()
    }) 
  },
  params: {
    schema: Joi.object({
        id: joi.string().required(),
    }) 
  }
  body: {
    schema: Joi.object({
        fname: joi.string().required(),
        lname: joi.string().required(),
        age: Joi.number().required()
    }) 
  }
}))

app.use(async ctx => {
  ctx.body = 'Hello World';
});


app.listen(5000)
```


Note
Valid keywords are `headers, params, query, body`.

Here is another basic example, mounting a validator on a specific route using [koa-router](https://github.com/alexmingoia/koa-router).

```javascript
const router = new Router()

const loginValidator = validate({
  body: {
    schema: Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    })
  }
})

router.post('/login', loginValidator, async ctx => {
  const { username, password } = ctx.body
  const response = await login(username, password)
  ctx.body = response
})
```

For more examples of the (very powerful) validation capabilities of Joi, view the official documentation - https://joi.dev/api/?v=17.6.0

If the validation fails, an HTTP 400 response will be returned to the client, along with a short human-readable error message explaining why the request was rejected.
For Example

```javascript
"username" is required
```