'use client'

// System Utils
import Link from 'next/link';

// Installed Utils
import { Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import {useTranslations} from 'next-intl';
import { useSelector, useDispatch } from 'react-redux';

// App Utils
import { RootState, AppDispatch } from '@/lib/redux/store';
import { logout } from '@/lib/redux/features/user/userSlice';

// Create the user's info component
const UserInfo = () => {

    // Get the words by group
    const t = useTranslations('auth');

    // Get the Redux's dispatch
    const dispatch = useDispatch<AppDispatch>();

    // Get the user's info
    const { user } = useSelector((state: RootState) => state.user);

    const handleLogout = () => {
        dispatch(logout());
    };

    return (<>
        <TableContainer>
            <Table variant='striped' colorScheme='teal'>
                <Thead>
                    <Tr>
                        <Th>{t('my_information')}</Th>
                        <Th textAlign='right'>
                            <Link href='#' color='teal.500' onClick={handleLogout}>
                                {t('sign_out')}
                            </Link>    
                        </Th>
                    </Tr>
                </Thead>
                <Tbody>
                    <Tr>
                        <Td>{t('id')}:</Td>
                        <Td>{ user?.id }</Td>
                    </Tr>
                    <Tr>
                        <Td>{t('email')}:</Td>
                        <Td>{ user?.email }</Td>
                    </Tr>
                </Tbody>
            </Table>
        </TableContainer>
    </>);

}

// Export the user's info component
export default UserInfo;