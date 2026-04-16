// app/+html.tsx — Expo Router web HTML template
// Jogo mobile centrado em 480px max-width, fundo preto no resto

import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="pt-BR" style={{ backgroundColor: '#000', height: '100%' }}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        {/* viewport fixo em 480px — evita escala estranha em PC */}
        <meta name="viewport" content="width=480, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#000000" />

        <ScrollViewStyleReset />

        <style dangerouslySetInnerHTML={{
          __html: `
            *, *::before, *::after { box-sizing: border-box; }

            html {
              background-color: #000;
              height: 100%;
              margin: 0;
              padding: 0;
            }

            body {
              background-color: #000;
              height: 100%;
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: flex-start;
              overflow: hidden;
            }

            /* Contém o app em até 480px, centrado com preto nas laterais */
            #root {
              background-color: #000;
              width: 100%;
              max-width: 480px;
              height: 100%;
              position: relative;
              overflow: hidden;
            }

            /* Remove fundo branco padrão dos ScrollViews no web */
            div[style*="overflow"] {
              background-color: transparent !important;
            }
          `
        }} />
      </head>
      <body style={{ backgroundColor: '#000', height: '100%', margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
