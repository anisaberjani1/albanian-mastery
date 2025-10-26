export const runtime = "nodejs";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text, voice = "sq-AL-AnilaNeural" } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const sdk = await import("microsoft-cognitiveservices-speech-sdk");

    const speechKey = process.env.AZURE_SPEECH_KEY!;
    const region = process.env.AZURE_SPEECH_REGION!;

    if (!speechKey || !region) {
      throw new Error("Missing Azure Speech credentials");
    }

    const speechConfig = sdk.SpeechConfig.fromSubscription(speechKey, region);
    speechConfig.speechSynthesisVoiceName = voice;

    const audioStream = sdk.AudioOutputStream.createPullStream();
    const audioConfig = sdk.AudioConfig.fromStreamOutput(audioStream);
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

    const audioBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
      synthesizer.speakTextAsync(
        text,
        (result) => {
          if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
            const uint8Array = new Uint8Array(result.audioData);
            resolve(uint8Array.buffer);
          } else {
            reject(result.errorDetails);
          }
          synthesizer.close();
        },
        (err) => {
          synthesizer.close();
          reject(err);
        }
      );
    });

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: { "Content-Type": "audio/wav" },
    });
  } catch (error) {
    console.error("TTS error:", error);
    return NextResponse.json(
      { error: "TTS generation failed" },
      { status: 500 }
    );
  }
}
