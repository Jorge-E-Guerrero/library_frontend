"use server";

const moduleName = "Env Config";
console.log("Envs", process.env);

class Env {


    getEnvVariable(key: string): string | null {
        if (process.env[key] === undefined) {
            console.warn(`[${moduleName}] Environment variable "${key}" is not defined.`);
            return null;
        }
        return process.env[key].trim() ?? null; /// Trim to remove any accidental spaces
    }

    /// Environment Variables
    NODE_ENV = this.getEnvVariable('NODE_ENV') ?? 'dev';

    /// Server Configuration
    PORT = this.NODE_ENV === 'dev' ? this.getEnvVariable('PORT') : 3000; /// Docker does not need this, but local development does

    /// API Configuration
    API_URL = this.getEnvVariable('API_URL') ?? 'http://localhost:4000/api/v1/library';


}

const env = new Env();
Object.freeze(env); // Prevent modification

export default env;