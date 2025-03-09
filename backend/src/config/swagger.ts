import swaggerUi from 'swagger-ui-express';
import path from 'path';
import YAML from 'yamljs';
import { fileURLToPath } from 'url';

const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = path.dirname(__filename);

const swaggerDocument: object = YAML.load(
  path.join(__dirname, '../../openapi.yaml'),
);

const swaggerDocs: object = swaggerDocument;

export { swaggerUi, swaggerDocs };
