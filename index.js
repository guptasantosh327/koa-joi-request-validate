
function validateObject(object = {}, schema, options) {
    // Skip validation if no schema is provided
    if (schema) {
        // Validate the object against the provided schema
        const { error, value } = schema.validate(object, options);
        if (error) {
            // Throw error with custom message if validation failed
            throw new Error(`${error.message}`);
        }
    }
}


/**
* @author Santosh Gupta
* @returns A validation middleware function.
*/


function validate(validationObj) {
    // Return a Koa middleware function
    return (ctx, next) => {
        try {
            if (validationObj.headers && validationObj.headers.schema) {
                const tempDefaultOptions = validationObj.headers.options ? validationObj.headers.options  : { allowUnknown: true};
               console.log(tempDefaultOptions)
                const defaultOptions = tempDefaultOptions.allowUnknown == undefined ? tempDefaultOptions.allowUnknown = true : tempDefaultOptions;
                validateObject(ctx.headers, validationObj.headers.schema, defaultOptions);
            }
            if (validationObj.params && validationObj.params.schema) {
                validateObject(ctx.params, validationObj.params.schema, validationObj.params.options);
            }
            if (validationObj.query && validationObj.query.schema) {
                validateObject(ctx.query, validationObj.query.schema, validationObj.query.options);
            }
            if (validationObj.body && validationObj.body.schema) {
                validateObject(ctx.request.body, validationObj.body.schema, validationObj.body.options);
            }
            return next();
        } catch (err) {
            // If any of the objects fails validation, send an HTTP 400 response.
            ctx.throw(400, err.message);
        }
    }
}

module.exports = validate;