// System Utils
import React from 'react';
import nookies from 'nookies';
// Installed Utils
import { Center, Box } from '@chakra-ui/react';

export default function AuthLayout({children}: {children: React.ReactNode}) {
  
    return (
        <Center mt='100px'>
        <Box p='5' w='400px' maxW='80%' borderRadius='6px' bg='#FFFFFF'>
          {children}
        </Box>
      </Center>
    );

}