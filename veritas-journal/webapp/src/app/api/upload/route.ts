import { NextRequest, NextResponse } from 'next/server';
import { PinataSDK } from 'pinata';

const PINATA_JWT = process.env.PINATA_JWT || '';
const PINATA_GATEWAY = process.env.PINATA_GATEWAY || '';

export async function POST(request: NextRequest) {
  if (!PINATA_JWT) {
    return NextResponse.json(
      { error: 'Pinata JWT not configured on the server.' },
      { status: 500 },
    );
  }

  try {
    const body = await request.json();
    const { title, content } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required.' },
        { status: 400 },
      );
    }

    const pinata = new PinataSDK({
      pinataJwt: PINATA_JWT,
      pinataGateway: PINATA_GATEWAY || undefined,
    });

    // Verify auth before uploading
    try {
      await pinata.testAuthentication();
    } catch (authErr) {
      console.error('Pinata auth test failed:', authErr);
      return NextResponse.json(
        { error: `Authentication failed: ${authErr instanceof Error ? authErr.message : String(authErr)}` },
        { status: 401 },
      );
    }

    const uploadResult = await pinata.upload.public.json({
      name: title,
      description: 'Veritas Journal Article',
      content,
      properties: {
        type: 'article',
        timestamp: new Date().toISOString(),
      },
    }).name(`${title}.json`);

    const tokenURI = PINATA_GATEWAY
      ? `https://${PINATA_GATEWAY}/ipfs/${uploadResult.cid}`
      : `ipfs://${uploadResult.cid}`;

    return NextResponse.json({ cid: uploadResult.cid, tokenURI });
  } catch (err: unknown) {
    console.error('Pinata upload failed:', err);
    const message = err instanceof Error ? err.message : 'Unknown upload error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
