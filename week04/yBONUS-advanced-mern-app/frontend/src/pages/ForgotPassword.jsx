import {
  Alert,
  AlertIcon,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  Link as ChakraLink
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { forgotPassword } from "../lib/api";
import { Link } from "react-router-dom";

const ForgotPassword = () => {

  const [email, setEmail] = useState("");

  const {
    mutate: sendMail,
    isPending,
    isError,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: forgotPassword,
  });

  return (
    <>
      <Flex minH={"100vh"} justify={"center"} align={"center"}>
        <Container maxW={"md"} mx={"auto"} py={12} px={6} textAlign={"center"}>
          {isSuccess ? (
            <Alert borderRadius={12} status="success">
              <AlertIcon />
              Email sent. Check your mail now!
            </Alert>
          ) : (
            <>
              <Heading fontSize={"4xl"}>Enter your email</Heading>
              <Stack
                borderRadius={"lg"}
                p={6}
                shadow={"lg"}
                bg={"gray.700"}
                mt={3}
              >
                {
                    isError && <Text color={"red.600"}>
                        { error?.message || "Error" }
                    </Text>
                }
                <FormControl id="email">
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMail(email)}
                  />
                </FormControl>
                <Text color={"text.muted"} fontSize={"xs"} textAlign={"left"}>
                  - The password reset request will send to your email.
                </Text>
                <Button 
                    isLoading={isPending}
                    isDisabled={!email}
                    mt={3}
                    onClick={() => sendMail(email)}
                    >
                        Send Reset Request
                </Button>
                <Text mt={1 } color={"text.muted"} fontSize={"smaller"}>
                    Back to{" "}
                    <ChakraLink as={Link} to={"/login"}>
                        Sign in
                    </ChakraLink>
                </Text>
              </Stack>
            </>
          )}
        </Container>
      </Flex>
    </>
  );
};

export default ForgotPassword;
