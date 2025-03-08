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
  Link as ChakraLink,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { resetPassword } from "../lib/api";
import { Link, useSearchParams } from "react-router-dom";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const verificationCode = searchParams.get("code");
  const exp = searchParams.get("exp");
  const now = Date.now();
  const validLink = verificationCode && exp && exp > now;

  const [password, setPassword] = useState("");

  const {
    mutate: reset,
    isError,
    error,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: resetPassword,
  });

  return (
    <>
      <Flex minH={"100vh"} justify={"center"} align={"center"}>
        <Container maxW={"md"} mx={"auto"} textAlign={"center"} px={6} py={12}>
          {validLink ? (
            <>
              {isSuccess ? (
                <>
                  <Alert status="success" borderRadius={12}>
                    <AlertIcon />
                    Your password reset.{" "}
                    <ChakraLink as={Link} to={"/login"}>
                      Sign in
                    </ChakraLink>{" "}
                    now!
                  </Alert>
                </>
              ) : (
                <>
                  <Heading fontSize={"4xl"}>Enter new password</Heading>
                  <Stack
                    borderRadius={"lg"}
                    bg={"gray.700"}
                    shadow={"lg"}
                    p={6}
                    mt={3}
                  >
                    {isError && (
                      <Text color={"red.600"}>{error?.message || "Error"}</Text>
                    )}
                    <FormControl id="password">
                      <FormLabel>New Password</FormLabel>
                      <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" &&
                          reset({ verificationCode, password })
                        }
                      />
                    </FormControl>
                    <Button
                      isLoading={isPending}
                      mt={3}
                      isDisabled={password.length < 6}
                      onClick={() => reset({ verificationCode, password })}
                    >
                      Reset password
                    </Button>
                  </Stack>
                </>
              )}
            </>
          ) : (
            <>
              <Alert status="error" borderRadius={12}>
                <AlertIcon />
                Invalid link!
              </Alert>
            </>
          )}
        </Container>
      </Flex>
    </>
  );
};

export default ResetPassword;
