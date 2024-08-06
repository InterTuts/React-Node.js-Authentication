'use client'

// System Utils
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

// Installed Utils
import {useTranslations} from 'next-intl';
import { Button, Center, FormControl, FormErrorMessage, FormLabel, Input, Text, Stack, Container, Heading } from '@chakra-ui/react';
import { Field, Formik, FormikHelpers, FormikProps } from 'formik';
import * as Yup from 'yup';
import { ErrorOutline, NotificationsOutlined } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';

// App Utils
import { UserBasic } from '@/app/models/User';
import { registerSocial, changeSocialCode, resetState } from '@/lib/redux/features/auth/authSlice';
import { RootState, AppDispatch } from '@/lib/redux/store';

const AuthSocialSignUp = () => {

    // Get the router instance
    const router = useRouter();

    // Get the search parameters
    const searchParams = useSearchParams();

    // Get the words by group
    const t = useTranslations('auth');

    // Create the validation schema
    const validationSchema = Yup.object().shape({
        password: Yup.string().min(8, t('the_password_is_short')).max(50, t('the_password_is_long')).required(t('the_password_is_required'))
    });

    // Get the Redux's dispatch
    const dispatch = useDispatch<AppDispatch>();

    // Get the success and error messages for code change
    const { login, errorMessage, isLoading, email } = useSelector((state: RootState) => state.auth.social);

    // Get the success and error messages for registration
    const { registrationSuccessMessage, registrationErrorMessage, registrationIsLoading } = useSelector((state: RootState) => state.auth.socialRegistration);

    // Monitor success message change
    useEffect(() => {
      if ( registrationSuccessMessage ) {
        setTimeout(() => {
          dispatch(resetState());
          router.push('/auth/signin');
        }, 2000);
      }
    }, [registrationSuccessMessage, router, dispatch]);

    // Get social data
    useEffect(() => {
      const code = searchParams.get('code');
      if (code) {
        dispatch(changeSocialCode(code));
      }
    }, [searchParams, dispatch]);

    // Monitor success message change
    useEffect(() => {
      if ( login ) {
        dispatch(resetState());
        router.push('/user/dashboard');
      }
    }, [dispatch, login, router]);

    return (
      <>
      {isLoading?(
        <Text>
          { t('loading') }
        </Text>
      ):(
        <>
        {(errorMessage)?(
          <div className='authForm'>
            <Container p={0} m='inherit !important' className='auth-main-form-alerts'>
              <Text className='auth-main-form-alert-error top-to-bottom-animation'>
                <NotificationsOutlined className='auth-main-form-alert-error-icon' />
                { errorMessage }
              </Text>               
            </Container>
          </div>
        ):(
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
              { t('sign_up_to_my_app') }
            </Heading>
            <Formik<UserBasic>
              initialValues={{ email: '', password: '' }}
              validationSchema={validationSchema}
              onSubmit={(values: UserBasic, actions: FormikHelpers<UserBasic>) => {
                actions.setSubmitting(false);
                dispatch(registerSocial(values));
              }}
            >
              {(formikProps: FormikProps<UserBasic>) => (
              <form noValidate onSubmit={(e) => {
                  e.preventDefault();
                  formikProps.handleSubmit(e);
                }}
                className='authForm'
                >
                  <Stack mt={4} spacing={4}>
                      <Field name="email">
                      {({ field, form }: { field: any; form: any }) => (
                          <FormControl isInvalid={form.errors.email && form.touched.email}>
                          <FormLabel htmlFor="email">{ t('email') }</FormLabel>
                          <Input {...field} type="email" id="email" placeholder={ t('enter_your_email') } value={ email } autoComplete="new-email" disabled />
                            <FormErrorMessage>
                              <ErrorOutline />
                              <span>
                                {form.errors.email}
                              </span>
                            </FormErrorMessage>
                          </FormControl>
                      )}
                      </Field>
                      <Field name="password">
                      {({ field, form }: { field: any; form: any }) => (
                          <FormControl isInvalid={form.errors.password && form.touched.password}>
                          <FormLabel htmlFor="password">{ t('password') }</FormLabel>
                          <Input {...field} type="password" id="password" placeholder={ t('enter_your_password') } autoComplete="new-password" />
                            <FormErrorMessage>
                              <ErrorOutline />
                              <span>
                                {form.errors.password}
                              </span>
                            </FormErrorMessage>
                          </FormControl>
                      )}
                      </Field>
                      <Button
                        mt={4}
                        mb={5}
                        colorScheme="teal"
                        isLoading={formikProps.isSubmitting}
                        type="submit"
                        className={`authSubmitBtn ${registrationIsLoading && 'authSubmitActiveBtn'}`}
                      >
                        { t('create_account') }
                      </Button>
                      <Container p={0} className='auth-main-form-alerts'>
                        {(registrationSuccessMessage !== '')?(
                          <Text className='auth-main-form-alert-success top-to-bottom-animation'>
                            <NotificationsOutlined className='auth-main-form-alert-success-icon' />
                            { registrationSuccessMessage }
                          </Text>                    
                        ):''}
                        {(registrationErrorMessage !== '')?(
                          <Text className='auth-main-form-alert-error top-to-bottom-animation'>
                            <NotificationsOutlined className='auth-main-form-alert-error-icon' />
                            { registrationErrorMessage }
                          </Text>
                        ):''}
                      </Container>
                      <Center>
                        <Text>
                          { t('do_you_have_an_account') }
                          <Link
                            href='/auth/signin'
                            className='ml-2'
                          >
                            { t('sign_in') }
                          </Link>
                        </Text>
                      </Center>
                  </Stack>
              </form>
            )}
            </Formik>    
          </>            
        )}
        </>
      )}
      </>
    );
};

export default AuthSocialSignUp;