
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

// @ts-ignore
import { GoogleGenAI } from "@google/genai";

async function main() {
    console.log("Checking available models...");
    try {
        const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        // @ts-ignore
        const response = await client.models.list();

        let result = [];
        if (Array.isArray(response)) {
            result = response;
        } else if (response.models) {
            result = response.models;
        } else {
            result = [response];
        }

        fs.writeFileSync("models.json", JSON.stringify(result, null, 2));
        console.log("Models written to models.json");

    } catch (error) {
        console.error("Error listing models:", error);
        fs.writeFileSync("models_error.txt", String(error));
    }
}

main();
