import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { arbitrumSepolia } from 'viem/chains';
import { VERITAS_ARTICLE_ABI, VERITAS_ARTICLE_ADDRESS } from '@/constants/VeritasArticle';

const client = createPublicClient({
  chain: arbitrumSepolia,
  transport: http(),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tokenIdStr = searchParams.get('tokenId');

  if (tokenIdStr === null) {
    return NextResponse.json({ error: 'tokenId is required' }, { status: 400 });
  }

  try {
    const tokenId = BigInt(tokenIdStr);

    const tokenURI = await client.readContract({
      address: VERITAS_ARTICLE_ADDRESS as `0x${string}`,
      abi: VERITAS_ARTICLE_ABI,
      functionName: 'tokenURI',
      args: [tokenId],
    });

    return NextResponse.json({ tokenId: Number(tokenId), tokenURI });
  } catch (err) {
    console.error('Failed to read tokenURI:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to read contract' },
      { status: 500 },
    );
  }
}
