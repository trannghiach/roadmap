import {
  Alert,
  AlertIcon,
  Container,
  Flex,
  Spinner,
  Text,
  VStack,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { verifyEmail } from "../lib/api";
import React from "react";

const VerifyEmail = () => {
  const { code } = useParams();
  const { isPending, isSuccess, isError } = useQuery({
    queryKey: ["emailVerification", code],
    queryFn: () => verifyEmail(code),
  });

  return (
    <>
      <Flex minH={"100vh"} justify={"center"}>
        <Container py={12} px={6} mx={"auto"} maxW={"md"} textAlign={"center"}>
          {isPending ? (
            <Spinner />
          ) : (
            <VStack align={"center"} spacing={6}>
              <Alert
                status={isSuccess ? "success" : "error"}
                w={"fit-content"}
                borderRadius={12}
              >
                <AlertIcon />
                {isSuccess ? "Email verified!" : "Invalid Link!"}
              </Alert>
              {isError && (
                <Text color={"gray.400"}>
                  The link is either invalid or expired!{" "}
                  <ChakraLink as={Link} to={"/register"}>
                    Get a new link
                  </ChakraLink>
                </Text>
              )}
              <ChakraLink as={Link} to={"/"}>
                Back to home
              </ChakraLink>
            </VStack>
          )}
        </Container>
      </Flex>
    </>
  );
};

export default VerifyEmail;
