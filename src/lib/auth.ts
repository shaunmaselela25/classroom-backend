import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/index.js";
import * as schema from '../db/schema/auth.js';

const authSecret = process.env.BETTER_AUTH_SECRET;
const frontendUrl = process.env.FRONTEND_URL;

if (!authSecret) {
    throw new Error('BETTER_AUTH_SECRET is not defined');
}

if (!frontendUrl) {
    throw new Error('FRONTEND_URL is not defined');
}

export const auth = betterAuth({
    secret: authSecret,
    trustedOrigins: [frontendUrl],
    database: drizzleAdapter(db, {
        provider: "pg",
        schema,
    }),
    emailAndPassword: {
        enabled: true,
    },
    user: {
        additionalFields: {
            role: {
                type: 'string', required: true, defaultValue: 'student', input: true,
            },
            imageCldPubId: {
                type: 'string', required: false, input: true,
            },
        }
    }
});
