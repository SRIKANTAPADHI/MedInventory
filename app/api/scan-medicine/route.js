import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const formData = await request.formData();

    const image = formData.get("image");

    if (!image) {
      return Response.json(
        { error: "Image is required" },
        { status: 400 }
      );
    }

    const bytes = await image.arrayBuffer();

    const base64Image = Buffer.from(bytes).toString("base64");

    const mimeType = image.type || "image/jpeg";

    const response = await openai.responses.create({
      model: "gpt-5.6-luna",

      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `
Analyze this medicine package.

Extract only information that is actually visible
or strongly supported by the image.

Return ONLY valid JSON in this format:

{
  "name": "",
  "genericName": "",
  "category": "",
  "manufacturer": "",
  "batchNumber": "",
  "purchasePrice": "",
  "sellingPrice": "",
  "quantity": "",
  "minimumStock": "10",
  "expiryDate": ""
}

Rules:
- Do not invent information.
- If a field cannot be read, return "".
- expiryDate must be YYYY-MM-DD if clearly visible.
- Prices should contain numbers only.
- quantity should contain a number only if visible.
- category should be a simple category such as Pain Relief,
  Antibiotic, Vitamin, Antacid, or Other.
`,
            },
            {
              type: "input_image",
              image_url: `data:${mimeType};base64,${base64Image}`,
            },
          ],
        },
      ],
    });

    const result = response.output_text;

    const cleaned = result
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const medicine = JSON.parse(cleaned);

    return Response.json({
      success: true,
      medicine,
    });
  } catch (error) {
    console.error("Medicine scan error:", error);

    return Response.json(
      {
        error: "Failed to analyze medicine image",
      },
      { status: 500 }
    );
  }
}