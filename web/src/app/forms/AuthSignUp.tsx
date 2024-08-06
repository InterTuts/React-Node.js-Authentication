'use client'

// System Utils
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Installed Utils
import {useTranslations} from 'next-intl';
import { Button, Center, FormControl, FormErrorMessage, FormLabel, Input, Text, Stack, Container } from '@chakra-ui/react';
import { Field, Formik, FormikHelpers, FormikProps } from 'formik';
import * as Yup from 'yup';
import { ErrorOutline, NotificationsOutlined } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';

// App Utils
import { UserBasic } from '@/app/models/User';
import { register, resetState } from '@/lib/redux/features/auth/authSlice';
import { RootState, AppDispatch } from '@/lib/redux/store';

const AuthSignUp = () => {
    // Get the router instance
    const router = useRouter();

    // Get the words by group
    const t = useTranslations('auth');

    // Create the validation schema
    const validationSchema = Yup.object().shape({
        email: Yup.string().email(t('the_email_is_not_valid')).required(t('the_email_is_required')),
        password: Yup.string().min(8, t('the_password_is_short')).max(50, t('the_password_is_long')).required(t('the_password_is_required'))
    });

    // Get the Redux's dispatch
    const dispatch = useDispatch<AppDispatch>();

    // Get the success and error messages
    const { successMessage, errorMessage, isLoading } = useSelector((state: RootState) => state.auth.registration);

    // Monitor success message change
    useEffect(() => {
      if ( successMessage ) {
        setTimeout(() => {
          dispatch(resetState());
          router.push('/auth/signin');
        }, 2000);
      }
    }, [successMessage, router, dispatch]);

    return (
        <Formik<UserBasic>
        initialValues={{ email: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={(values: UserBasic, actions: FormikHelpers<UserBasic>) => {
          actions.setSubmitting(false);
          dispatch(register(values));
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
                    <Input {...field} type="email" id="email" placeholder={ t('enter_your_email') } autoComplete="new-email" />
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
                  className={`authSubmitBtn ${isLoading && 'authSubmitActiveBtn'}`}
                >
                  { t('create_account') }
                </Button>
                <Container p={0} className='auth-main-form-alerts'>
                  {(successMessage !== '')?(
                    <Text className='auth-main-form-alert-success top-to-bottom-animation'>
                      <NotificationsOutlined className='auth-main-form-alert-success-icon' />
                      { successMessage }
                    </Text>                    
                  ):''}
                  {(errorMessage !== '')?(
                    <Text className='auth-main-form-alert-error top-to-bottom-animation'>
                      <NotificationsOutlined className='auth-main-form-alert-error-icon' />
                      { errorMessage }
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
        );

};

export default AuthSignUp;