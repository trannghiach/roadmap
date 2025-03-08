
// chucaobuon: 
// lilsadfoqs: Take the environmet value of the key || the default value, unless throw an error
const getEnv = (key: string, defaultValue?: string): string => {
    const value = process.env[key] || defaultValue;

    if(value === undefined) {
        throw new Error(`The environment variable of ${key} is missing!`);
    }

    return value;
}

export const NODE_ENV = getEnv('NODE_ENV', "development");
export const MONGO_URI = getEnv('MONGO_URI');
export const PORT = getEnv("PORT", "1205");
export const WEB_URL = getEnv("WEB_URL");
export const JWT_SECRET = getEnv("JWT_SECRET");
export const JWT_REFRESH_SECRET = getEnv("JWT_REFRESH_SECRET");
export const EMAIL_SENDER = getEnv("EMAIL_SENDER");
export const RESEND_API_KEY = getEnv("RESEND_API_KEY");
