'use client';
// 'use client' is required because this component uses useState, useRef, and
// browser APIs (URL.createObjectURL, fetch). Next.js server components cannot
// use any of these.
import { useState, useRef } from 'react';

export function ImageUploader({
  onUpload,
  currentUrl,
}: {
  // Called with the permanent Supabase Storage URL once the upload finishes
  onUpload: (url: string) => void;
  // The URL already stored in the form (if editing an event that has an image)
  currentUrl?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  // Local blob URL shown immediately while the real upload is in progress.
  // This makes the UI feel instant — the user sees their image right away
  // rather than waiting for the network round-trip to finish.
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  // We control the hidden <input type="file"> via a ref so we can trigger it
  // from a styled button click instead of showing the browser's default file input.
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show the selected image immediately as a local preview
    const blobUrl = URL.createObjectURL(file);
    setLocalPreview(blobUrl);
    setUploading(true);
    setError('');

    try {
      // Send the file as multipart/form-data — don't set Content-Type manually,
      // the browser adds the correct boundary string automatically when body is FormData
      const form = new FormData();
      form.append('file', file);

      const res = await fetch('/api/upload-image', {
        method: 'POST',
        body: form,
      });

      if (!res.ok) {
        // The API route always returns { error: string } on failure
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? 'Kuvan lataus epäonnistui');
      }

      const { url } = (await res.json()) as { url: string };

      // Tell the parent form about the real permanent URL
      onUpload(url);

      // Clean up the blob URL — it's no longer needed now that we have the real URL.
      // Revoking prevents memory leaks in long-running sessions.
      URL.revokeObjectURL(blobUrl);
      setLocalPreview(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kuvan lataus epäonnistui');
      URL.revokeObjectURL(blobUrl);
      setLocalPreview(null);
    } finally {
      setUploading(false);
      // Reset the input so the user can re-select the same file if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // While uploading we show the local blob URL; after success we show the real URL
  const displayUrl = localPreview ?? currentUrl;

  return (
    <div className="flex flex-col gap-3" data-testid="image-uploader">
      {/* Clickable upload area — styled to look like a card, same as illustration cards */}
      <button
        type="button"
        data-testid="image-upload-button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        // border-2 matches the ring thickness of the selected illustration cards
        className={`
          relative w-full rounded-lg border-2 overflow-hidden transition
          ${displayUrl ? 'border-primary' : 'border-dashed border-border'}
          hover:border-primary/70 disabled:opacity-60
        `}
      >
        {displayUrl ? (
          // Image preview — aspect-4/3 matches the illustration thumbnails
          <img
            src={displayUrl}
            alt="Tapahtuman kuva"
            data-testid="image-upload-preview"
            className="aspect-4/3 w-full object-cover"
          />
        ) : (
          // Empty state — invite the user to pick a file
          <div className="aspect-4/3 w-full flex flex-col items-center justify-center gap-2 bg-surface text-ink-soft">
            <span className="text-4xl leading-none select-none">↑</span>
            <span className="text-sm font-semibold">Valitse kuva</span>
            <span className="text-xs">JPG, PNG, WebP — max 5 Mt</span>
          </div>
        )}

        {/* Uploading overlay — sits on top of the local preview so the user
            can see what they picked while waiting for the server */}
        {uploading && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-sm font-semibold text-ink">Ladataan...</span>
          </div>
        )}
      </button>

      {/* "Change image" link — only visible once an image is selected and idle */}
      {displayUrl && !uploading && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="text-xs text-ink-soft underline text-left self-start"
          data-testid="image-change-button"
        >
          Vaihda kuva
        </button>
      )}

      {error && (
        <p className="text-sm text-red-600" data-testid="image-upload-error">
          {error}
        </p>
      )}

      {/* Hidden native file input — triggered programmatically from the button above */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        data-testid="image-file-input"
        onChange={handleFileChange}
      />
    </div>
  );
}
