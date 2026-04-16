// app/+html.tsx — Expo Router web HTML template
// Define o fundo preto no body/html para nunca mostrar branco

import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="pt-BR" style={{ backgroundColor: '#000', height: '100%' }}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

        {/*
          Reseta o scroll view para que não adicione fundo branco.
          Também força html/body a ficarem pretos em toda extensão da página.
        */}
        <ScrollViewStyleReset />

        <style dangerouslySetInnerHTML={{
          __html: `
            html, body, #root {
              background-color: #000 !important;
              height: 100%;
              margin: 0;
              padding: 0;
              overflow: hidden;
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
