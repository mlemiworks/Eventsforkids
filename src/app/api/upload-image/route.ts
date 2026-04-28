import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/src/lib/auth';
import { createClient } from '@supabase/supabase-js';

// Build the Supabase admin client once at module load time.
// createClient here uses the service role key, which has full storage access
// and bypasses Row Level Security — it must never reach the browser.
// NEXT_PUBLIC_ prefix on the URL is intentional: the URL is public info,
// but the service role key env var has no NEXT_PUBLIC_ prefix so Next.js
// strips it from client bundles automatically.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const BUCKET = 'event-images';
// 5 MB is generous for event banner images while keeping storage costs low
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
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
}
