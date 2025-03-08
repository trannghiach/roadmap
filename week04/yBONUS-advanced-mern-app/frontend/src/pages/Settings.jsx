import React from 'react'
import useSessions from '../hooks/useSessions'
import { Container, Flex, Heading, Spinner, Text, VStack } from '@chakra-ui/react';
import SessionCard from '../components/SessionCard';

const Settings = () => {
    const { sessions, isPending, isSuccess, isError } = useSessions();
  return (
    <>
        <Flex minH={"100vh"} justify={"center"} textAlign={"center"}>
            <Container mt={16}>
                <Heading mb={6}>
                    My Sessions
                </Heading>
                {
                    isPending && <Spinner />
                }
                {
                    isError && <Text color={"red.400"}>Failed to get sessions!</Text>
                }
                {
                    isSuccess && (
                        <>
                            <VStack spacing={3} align={"flex-start"}>
                                { sessions.map(session => (
                                    <>
                                        <SessionCard key={session._id} session={session} />
                                    </>
                                ))}
                            </VStack>
                        </>
                    )
                }
            </Container>
        </Flex>
    </>
  )
}

export default Settings