const validate = (schema) => {
  return (req, res, next) => {
    const dataToValidate = {
      ...(schema.describe().keys.query && { query: req.query }),
      ...(schema.describe().keys.params && { params: req.params }),
      ...(schema.describe().keys.body && { body: req.body })
    };
    const { error } = schema.validate(dataToValidate, { abortEarly: false });
    if (error) {
      return res.status(400).json({ errors: error.details });
    }
    next();
  };
};
module.exports = validate