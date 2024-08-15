const {
  PollyClient,
  SynthesizeSpeechCommand,
} = require("@aws-sdk/client-polly");
const { LambdaClient, InvokeCommand } = require("@aws-sdk/client-lambda");
const {
  SecretsManagerClient,
  GetSecretValueCommand,
} = require("@aws-sdk/client-secrets-manager");
const {
  TranslateClient,
  ListLanguagesCommand,
  TranslateTextCommand,
} = require("@aws-sdk/client-translate");

const config = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
};

const pollyClient = new PollyClient(config);
const lambdaClient = new LambdaClient(config);
const secretClient = new SecretsManagerClient(config);

const translateClient = new TranslateClient(config);

export const synthesizeSpeech = async (text: String) => {
  try {
    const params = {
      LanguageCode: "en-IN",
      OutputFormat: "mp3",
      SampleRate: "8000",
      Text: text,
      VoiceId: "Aditi",
    };

    const command = new SynthesizeSpeechCommand(params);
    const data = await pollyClient.send(command);
    return data.AudioStream;
  } catch (error) {
    console.error(error);
  }
};

export const getLanguages = async () => {
  try {
    const input = {
      DisplayLanguageCode: "en",
      MaxResults: 100,
    };
    const command = new ListLanguagesCommand(input);

    const response = await translateClient.send(command);
    return response.Languages;
  } catch (err) {
    console.log("Error", err);
  }
};

export const translateContent = async (obj: any) => {
  try {
    const { source, target, text } = obj;
    const input = {
      Text: text,
      SourceLanguageCode: source,
      TargetLanguageCode: target,
    };
    const command = new TranslateTextCommand(input);
    const response = await translateClient.send(command);
    return response;
  } catch (err) {
    console.log("Error", err);
  }
};

export const getAudioFromLambda = async (obj: any) => {
  const { text, language } = obj;

  const params = {
    FunctionName: "text-to-speech",
    InvocationType: "RequestResponse",
    Payload: Buffer.from(
      JSON.stringify({
        text: text,
        language,
      })
    ),
  };

  try {
    const command = new InvokeCommand(params);
    const lambdaResponse = await lambdaClient.send(command);
    const data = JSON.parse(Buffer.from(lambdaResponse.Payload).toString());
    const responseData = JSON.parse(data.body);
    const audioBuffer = Buffer.from(responseData.audio_data, "base64");
    return audioBuffer;
  } catch (err) {
    console.log("Error", err);
  }
};

export const analyzeText = async (obj: any) => {
  const { text, user } = obj;

  const params = {
    FunctionName: "analyze-text",
    InvocationType: "RequestResponse",
    Payload: Buffer.from(
      JSON.stringify({
        text,
        user,
      })
    ),
  };

  try {
    const command = new InvokeCommand(params);
    const lambdaResponse = await lambdaClient.send(command);
    const data = JSON.parse(Buffer.from(lambdaResponse.Payload).toString());
    const responseData = JSON.parse(data.body);
    console.log("lambdaResponse", responseData);
    return responseData.isNegative;
  } catch (err) {
    console.log("Error", err);
  }
};

export const getAwsSecrets = async () => {
  try {
    const secretIds = [
      {
        key: "host",
        value: "/db/host",
      },
    ];
    const secrets: any = {
      user: "root",
      password: "12345678",
      // host: "localhost",
    };

    for (const secretId of secretIds) {
      const command = new GetSecretValueCommand({ SecretId: secretId.value });
      const response = await secretClient.send(command);

      secrets[secretId.key] = response.SecretString;
    }

    return secrets;
  } catch (err) {
    console.log("Error", err);
  }
};
