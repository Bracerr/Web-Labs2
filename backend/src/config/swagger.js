import swaggerUi from 'swagger-ui-express';
import path from "path";
import YAML from 'yamljs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerDocument = YAML.load(path.join(__dirname, '../../openapi.yaml'));

const swaggerDocs = swaggerDocument;

export { swaggerUi, swaggerDocs };
