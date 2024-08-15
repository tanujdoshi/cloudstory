import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";

const client = new PollyClient({ region: "us-east-1" });

export const handler = async (event) => {
  const params = {
    Text: event.text,
    LanguageCode: event.language,
    OutputFormat: "mp3",
    VoiceId: "Joanna",
  };

  console.log(params);

  try {
    const command = new SynthesizeSpeechCommand(params);
    const data = await client.send(command);
    const audioData = data.AudioStream;

    const audioBase64 = audioData.toString("base64");
    console.log("audioBase64", data.AudioStream);

    const response = {
      statusCode: 200,
      headers: {
        "content-type": "audio/mpeg",
      },
      body: data.AudioStream,
      isBase64Encoded: true,
    };

    return response;
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error generating speech" }),
    };
  }
};
