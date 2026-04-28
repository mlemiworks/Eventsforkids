import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/src/lib/auth';
import { createClient } from '@supabase/supabase-js';

const BUCKET = 'event-images';
// 5 MB is generous for event banner images while keeping storage costs low
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

// Called inside the handler so env vars are only read at request time, not at
// build time. Next.js evaluates module top-level code during the build, which
// throws "supabaseUrl is required" when env vars aren't present in CI/build.
function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }

  // Service role key bypasses Row Level Security — has full storage access.
  // NEXT_PUBLIC_ prefix on the URL is intentional: the URL is public info,
  // but the service role key has no NEXT_PUBLIC_ prefix so Next.js strips it
  // from client bundles automatically.
  return createClient(url, key);
}

export async function POST(request: NextRequest) {
  try {
    // Only logged-in users can upload — same rule as creating events
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Kirjautuminen vaaditaan' }, { status: 401 });
    }

    // request.formData() parses multipart/form-data — this is how file uploads
    // arrive from the browser's fetch() call with a FormData body
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Tiedosto puuttuu' }, { status: 400 });
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'Kuva on liian suuri (max 5 Mt)' },
        { status: 400 },
      );
    }

    // Reject non-image MIME types before touching storage
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Vain kuvatiedostot sallittu' },
        { status: 400 },
      );
    }

    // Use a UUID as the filename so there are no collisions and no way to
    // predict or enumerate other users' filenames. Preserve the extension so
    // Supabase can infer the Content-Type header correctly when serving the file.
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
    const filename = `${crypto.randomUUID()}.${ext}`;

    // ArrayBuffer is what Supabase's upload() expects when running in a Node
    // environment — it cannot consume a Web API File/Blob directly in all runtimes
    const arrayBuffer = await file.arrayBuffer();

    const supabase = getSupabaseClient();

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(filename, arrayBuffer, {
        contentType: file.type,
        // upsert: false → fail rather than overwrite if the UUID somehow collides
        upsert: false,
      });

    if (uploadError) {
      console.error('Supabase Storage upload error:', uploadError.message);
      return NextResponse.json(
        { error: 'Kuvan tallennus epäonnistui' },
        { status: 500 },
      );
    }

    // getPublicUrl never throws — it just constructs the URL from the project URL,
    // bucket name, and filename. The bucket must be set to public in Supabase.
    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET).getPublicUrl(filename);

    return NextResponse.json({ url: publicUrl });
  } catch (e) {
    // Any uncaught exception (missing env vars, malformed form data, network
    // error, etc.) ends up here. Without this catch, Next.js returns a 500
    // with an empty body, which causes JSON.parse errors on the client.
    const message = e instanceof Error ? e.message : 'Odottamaton virhe';
    console.error('upload-image unhandled error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
