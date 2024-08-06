// System Utils
import type { Metadata } from 'next';

// Installed Utils
import { getTranslations } from 'next-intl/server';

// App Utils
import AuthSocialSignUp from '../../forms/AuthSocialSignUp';

// Page's Title and Description
export async function generateMetadata(): Promise<Metadata> {
  // Get the words by group
  const t = await getTranslations('auth');  
  return {
    title: t('sign_up'),
    description: t('sign_up_description')
  }
}
 
export default async function SocialRegistrationPage() {

  // Get the words by group
  const t = await getTranslations('auth');  
  return (<>
      <AuthSocialSignUp />
  </>);
}