// Installed Utils
import {NextIntlClientProvider} from 'next-intl';
import {getLocale, getMessages} from 'next-intl/server';
import { ChakraProvider } from '@chakra-ui/react';

// App Utils
import '@/app/styles/globals.css';
import '@/app/styles/auth/layout.scss';
import StoreProvider from '@/lib/redux/StoreProvider';

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {

  // Get the language code
  const locale = await getLocale();
 
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
 
  return (
    <html lang={locale}>
      <body>
        <ChakraProvider>
          <NextIntlClientProvider messages={messages}>
            <StoreProvider>
              {children}
            </StoreProvider>
          </NextIntlClientProvider>          
        </ChakraProvider>
      </body>
    </html>
  );
}