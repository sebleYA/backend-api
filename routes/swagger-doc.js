const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

const router = express.Router({ mergeParams: true });

//app.use('/api.', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

router.use('/', swaggerUi.serve);
router.route('/').get(swaggerUi.setup(swaggerDocument));

module.exports = router;
