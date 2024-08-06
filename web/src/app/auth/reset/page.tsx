// System Utils
import { Metadata } from 'next';

// Installed Utils
import { getTranslations } from 'next-intl/server';
import { Heading } from '@chakra-ui/react';

// App Utils
import AuthResetPassword from '@/app/forms/AuthResetPassword';

// Page's Title and Description
export async function generateMetadata(): Promise<Metadata> {
    // Get the words by group
    const t = await getTranslations('auth');  
    return {
      title: t('reset_password'),
      description: t('reset_password_description')
    }
}

export default async function ResetPasswordPage () {

    // Get the words by group
    const t = await getTranslations('auth');  

    return (
        <>
            <Heading
                as='h1'
                mb={12}
                textAlign='center'
                fontFamily='var(--chakra-fonts-heading)'
                fontSize={20}
                fontWeight={600}
                color='#000'
            >
                { t('reset_password') }
            </Heading>
            <AuthResetPassword />
        </>
    );

}