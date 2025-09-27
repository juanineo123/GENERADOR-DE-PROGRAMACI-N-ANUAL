// Importamos la librería de Google Generative AI
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Obtenemos tu clave API secreta desde el archivo .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Esta es la función principal que se ejecutará
exports.handler = async function(event) {
    // Si el método no es POST, no hacemos nada
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        // 1. Recibimos el prompt (la instrucción) desde el frontend
        const { prompt } = JSON.parse(event.body);

        // 2. Seleccionamos el modelo de IA
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

        // 3. Generamos el contenido
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        // 4. Devolvemos el texto generado por la IA al frontend
        return {
            statusCode: 200,
            body: JSON.stringify({ suggestion: text }),
        };

    } catch (error) {
        console.error("Error en la función de IA:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "No se pudo generar la sugerencia." }),
        };
    }
};