export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Prompt is required" }),
        { status: 400 }
      );
    }

    console.log("Generating image for prompt:", prompt);

    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            num_inference_steps: 4,
            width: 512,
            height: 512,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("HF API Error:", response.status, errorText);

      if (response.status === 503) {
        return new Response(
          JSON.stringify({
            error: "Model is loading, please try again in 20 seconds",
            loading: true,
          }),
          { status: 503 }
        );
      }

      throw new Error(`HF API failed: ${response.status}`);
    }

    const imageBlob = await response.blob();
    const imageBuffer = await imageBlob.arrayBuffer();
    const base64 = Buffer.from(imageBuffer).toString("base64");
    const mimeType =
      response.headers.get("content-type") || "image/jpeg";

    console.log("Image generated successfully!");

    return new Response(
      JSON.stringify({ image: `data:${mimeType};base64,${base64}` }),
      { headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Image API Error:", error);
    return new Response(
      JSON.stringify({ error: "Image generation failed" }),
      { status: 500 }
    );
  }
}