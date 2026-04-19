import type { AppProps } from 'next/app';
import QueryProvider from '@/components/providers/QueryProvider';
import '@/app/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryProvider>
      <Component {...pageProps} />
    </QueryProvider>
  );
}