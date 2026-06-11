import axios from 'axios';

/**
 * OCR a base64 image into raw text. Default provider is Google Cloud Vision
 * (TEXT_DETECTION). Swap to AWS Textract by implementing `textractOcr` and
 * routing on an env flag.
 */
export async function ocrImage(imageBase64: string): Promise<string> {
  const key = process.env.GOOGLE_VISION_KEY;
  if (!key) throw new Error('GOOGLE_VISION_KEY is not configured');

  const { data } = await axios.post(
    `https://vision.googleapis.com/v1/images:annotate?key=${key}`,
    {
      requests: [
        {
          image: { content: imageBase64 },
          features: [{ type: 'TEXT_DETECTION', maxResults: 1 }],
        },
      ],
    },
    { timeout: 20000 },
  );

  const text: string | undefined =
    data?.responses?.[0]?.fullTextAnnotation?.text ??
    data?.responses?.[0]?.textAnnotations?.[0]?.description;

  if (!text) throw new Error('No text detected on the card');
  return text;
}
