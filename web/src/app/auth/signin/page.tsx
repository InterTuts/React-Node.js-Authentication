// System Utils
import type { Metadata } from 'next';

// Installed Utils
import { getTranslations } from 'next-intl/server';
import { Button, Divider, Heading, Text, Image, Link } from '@chakra-ui/react';

// App Utils
import AuthSignIn from '../../forms/AuthSignIn';

// Page's Title and Description
export async function generateMetadata(): Promise<Metadata> {
  // Get the words by group
  const t = await getTranslations('auth');  
  return {
    title: t('sign_in'),
    description: t('sign_in_description')
  }
}
 
export default async function SignInPage() {

  // Redirect to social login on button click
  const redirectUrl = process.env.NEXT_PUBLIC_API_URL + 'api/auth/social-connect';

  // Get the words by group
  const t = await getTranslations('auth');  
  return (<>
    <Heading
        as='h1'
        mb={12}
        textAlign='center'
        fontFamily='var(--chakra-fonts-heading)'
        fontSize={20}
        fontWeight={600}
        color='#000'
      >
        { t('sign_in_to_my_app') }
      </Heading>
      <Link
        href={redirectUrl}
        _hover={{ 
          transform: "translateY(-2px)",
          boxShadow: "sm"
        }}
        className='googleBtn'
      >
        <Image src="/google.png" alt="Icon" boxSize="20px" />
        { t('continue_with_google') }
      </Link>
      <Divider color='#DDD'></Divider>
      <Text
        m='auto'
        w={14}
        textAlign='center'
        fontFamily='var(--chakra-fonts-body)'
        fontSize={14}
        fontWeight={400}
        bg='#FFF'
        color='#000'
        transform='translateY(-12px)'
      >
        { t('or') }
      </Text>
      <AuthSignIn />
  </>);
}