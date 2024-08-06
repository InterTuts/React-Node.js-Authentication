// System Utils
import { Metadata } from 'next';

// Installed Utils
import { getTranslations } from 'next-intl/server';
import { Heading } from '@chakra-ui/react';

// App Utils
import AuthChangePassword from '@/app/forms/AuthChangePassword';

// Page's Title and Description
export async function generateMetadata(): Promise<Metadata> {
    // Get the words by group
    const t = await getTranslations('auth');  
    return {
      title: t('new_password'),
      description: t('create_new_password')
    }
}

export default async function ResetPasswordPage ({params}: {params: {slug: string}}) {

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
            <AuthChangePassword code={params.slug} />
        </>
    );

}