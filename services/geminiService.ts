
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, TransactionType, Currency, PaymentMethod, TransactionStatus } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

const transactionSchema = {
    type: Type.OBJECT,
    properties: {
        category: { type: Type.STRING, description: "La categoría del gasto o ingreso. Ej: 'logistica/alimentos', 'patrocinios'." },
        vendor: { type: Type.STRING, description: "El nombre del proveedor o la fuente del ingreso." },
        date: { type: Type.STRING, description: "La fecha de la transacción en formato YYYY-MM-DD." },
        amount: { type: Type.NUMBER, description: "El monto total de la transacción." },
        currency: { type: Type.STRING, enum: Object.values(Currency), description: "La moneda de la transacción (COP, USD, EUR)." },
        tax: { type: Type.NUMBER, description: "El monto del impuesto. Si no hay, es 0." },
        method: { type: Type.STRING, enum: Object.values(PaymentMethod), description: "El método de pago." },
        description: { type: Type.STRING, description: "Una descripción breve y clara de la transacción." },
        type: { type: Type.STRING, enum: Object.values(TransactionType), description: "El tipo de transacción (expense, income, transfer)." },
        invoiceNumber: { type: Type.STRING, description: "El número de la factura, si está presente." },
        ieeeChapter: { type: Type.STRING, description: "Capítulo de IEEE asociado, si aplica (ej. 'CS', 'ComSoc')." },
        eventType: { type: Type.STRING, enum: ['workshop', 'meetup', 'talk', 'conference'], description: "Tipo de evento, si aplica." },
        paymentDueDate: { type: Type.STRING, description: "Fecha de vencimiento del pago en formato YYYY-MM-DD, si aplica." },
        reimbursementTo: { type: Type.STRING, description: "Nombre o ID del miembro a reembolsar, si aplica." },
        fundingSource: { type: Type.STRING, description: "Fuente de los fondos (ej. 'IEEE_SAC', 'Faculty_Sponsorship')." },
        attendeeCount: { type: Type.INTEGER, description: "Número de asistentes al evento, si aplica." },
        relatedTaskIds: { type: Type.ARRAY, items: { type: Type.STRING }, description: "IDs de tareas relacionadas en Notion/otro sistema." },
        recurring: { type: Type.BOOLEAN, description: "Indica si es un gasto/ingreso recurrente." },
        department: { type: Type.STRING, enum: ['Ops', 'Comms', 'Programs', 'Partnerships'], description: "Departamento interno que realiza el gasto." },
    },
    required: ["category", "vendor", "date", "amount", "currency", "tax", "method", "description", "type"],
};


export const processAccountingData = async (
    file: File | null, 
    text: string
): Promise<Partial<Transaction>> => {
    
    if (!API_KEY) {
        throw new Error("API Key for Gemini is not configured.");
    }
    
    const textPart = {
        text: `
          Extrae los datos contables de la siguiente información. La información puede provenir de una imagen, un audio transcrito o un video.
          Texto proporcionado por el usuario: "${text}".
          Sigue estrictamente el esquema JSON proporcionado. Si un campo no está presente, omítelo.
          Determina si es un 'income' (ingreso) o 'expense' (gasto).
        `,
    };

    const parts = [textPart];
    
    if (file) {
        const filePart = await fileToGenerativePart(file);
        parts.unshift(filePart as any);
    }
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: parts },
            config: {
                responseMimeType: "application/json",
                responseSchema: transactionSchema,
            },
        });

        const jsonString = response.text.trim();
        const extractedData = JSON.parse(jsonString);
        
        // Add defaults and derived data
        const transactionData: Partial<Transaction> = {
            ...extractedData,
            source: file ? `${file.type.split('/')[0]}+text` : 'text',
            confidence: 0.85, // Default confidence, can be improved with more logic
            status: TransactionStatus.Pending, // Always start as pending for review
            orgId: 'uneural',
            groupId: 'operaciones', // Default group
            createdBy: 'johan', // Mocked user
            attachments: file ? [file.name] : [],
            approvals: [],
        };

        return transactionData;
    } catch (error) {
        console.error("Error processing with Gemini API:", error);
        throw new Error("Failed to extract accounting data from the provided input.");
    }
};
