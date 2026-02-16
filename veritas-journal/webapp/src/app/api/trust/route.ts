import { NextRequest, NextResponse } from 'next/server';
import { verifyMessage } from 'viem';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { tokenId, signer, signature, message } = await request.json();

    if (tokenId === undefined || !signer || !signature || !message) {
      return NextResponse.json(
        { error: 'tokenId, signer, signature, and message are required.' },
        { status: 400 },
      );
    }

    // Verify the signature matches the claimed signer
    const valid = await verifyMessage({
      address: signer as `0x${string}`,
      message,
      signature: signature as `0x${string}`,
    });

    if (!valid) {
      return NextResponse.json({ error: 'Invalid signature.' }, { status: 401 });
    }

    // Upsert trust signal (one per signer per article)
    const { error: dbError } = await supabase
      .from('trust_signals')
      .upsert(
        {
          token_id: Number(tokenId),
          signer_address: signer.toLowerCase(),
          signature,
          message,
          created_at: new Date().toISOString(),
        },
        { onConflict: 'token_id,signer_address' },
      );

    if (dbError) {
      console.error('Supabase insert failed:', dbError);
      return NextResponse.json({ error: 'Failed to store trust signal.' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Trust signal error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tokenId = searchParams.get('tokenId');

    if (!tokenId) {
      // Return counts for all articles
      const { data, error } = await supabase
        .from('trust_signals')
        .select('token_id');

      if (error) {
        return NextResponse.json({ error: 'Failed to fetch trust scores.' }, { status: 500 });
      }

      // Aggregate counts per token_id
      const scores: Record<number, number> = {};
      for (const row of data || []) {
        scores[row.token_id] = (scores[row.token_id] || 0) + 1;
      }

      return NextResponse.json({ scores });
    }

    // Return count for a specific article
    const { count, error } = await supabase
      .from('trust_signals')
      .select('*', { count: 'exact', head: true })
      .eq('token_id', Number(tokenId));

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch trust score.' }, { status: 500 });
    }

    return NextResponse.json({ tokenId: Number(tokenId), trustScore: count || 0 });
  } catch (err) {
    console.error('Trust score error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
