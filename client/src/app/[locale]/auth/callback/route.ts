import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const { locale } = await params;

  // Default to the localized root
  const next = searchParams.get('next') ?? `/${locale}`;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // If popup param is present, close the window
      const isPopup = searchParams.get('popup') === 'true';
      if (isPopup) {
        return new NextResponse(
          `<html>
            <head>
              <script>
                if (window.opener) {
                  window.opener.postMessage('login-success', '${origin}');
                }
                window.close();
              </script>
            </head>
            <body>Login successful. Closing...</body>
          </html>`,
          {
            headers: { 'Content-Type': 'text/html' },
          }
        );
      }

      // Successful login - redirect to the localized home page
      return NextResponse.redirect(`${origin}${next}`);
    }

    console.error('OAuth Callback Error:', error);
  }

  // If something goes wrong, return to login
  return NextResponse.redirect(`${origin}/${locale}/login?error=auth_failed`);
}
