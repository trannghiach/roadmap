import React from 'react'
import useAuth from '../hooks/useAuth'
import { Alert, AlertIcon, Center, Heading, Text } from '@chakra-ui/react';

const Profile = () => {

    const { user } = useAuth();

    const { email, createdAt, verified } = user;
  return (
    <>
        <Center mt={16} flexDir={"column"}>
            <Heading mb={4}>
                My Profile
            </Heading>
            {
                !verified ? (
                    <>
                        <Alert status='warning' w={"fit-content"} borderRadius={12}>
                            <AlertIcon />
                            Please check your email to verify!
                        </Alert>
                    </>
                ): (
                    <>
                        <Text color={"white"} mb={2}>
                            Email:{" "}
                            <Text as={"span"} color={"gray.300"}>
                                {email}
                            </Text>
                        </Text>
                        <Text color="white">
                            Created on{" "}
                            <Text as="span" color="gray.300">
                                {new Date(createdAt).toLocaleDateString()}
                            </Text>
                        </Text>
                    </>
                )
            }
        </Center>
    </>
  )
}

export default Profile