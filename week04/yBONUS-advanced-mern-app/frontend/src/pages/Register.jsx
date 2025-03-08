import {
  Box,
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
import { Link, useNavigate } from "react-router-dom";
import { register } from "../lib/api";

export const Register = () => {
    const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

    const {
        mutate: signUp,
        isPending,
        isError, 
        error
    } = useMutation({
        mutationFn: register,
        onSuccess: () => {
            navigate("/", {
                replace: true
            });
        }
    })

  return (
    <>
      <Flex minH={"100vh"} align={"center"} justify={"center"}>
        <Container mx={"auto"} maxW={"md"} py={12} px={6} textAlign={"center"}>
          <Heading fontSize={"4xl"} mb={8}>
            Create a new account
          </Heading>
          <Box rounded={"lg"} bg={"gray.700"} boxShadow={"lg"} p={8}>
            {
                isError && (
                <Box mb={3} color={"red.400"}>
                    { error?.message || "This email has already been used" }
                </Box>
                )
            }
            <Stack spacing={4}>
              <FormControl id="email">
                <FormLabel>Email Address</FormLabel>
                <Input
                  type="email"
                  autoFocus
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </FormControl>
              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  autoFocus
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <Text fontSize={"xs"} color={"text.muted"} textAlign={"left"} mt={2}>
                    - Must be at least 6 characters
                </Text>
              </FormControl>
              <FormControl id="confirm-password">
                <FormLabel>Confirm Password</FormLabel>
                <Input
                  type="password"
                  autoFocus
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && signUp({ email, password, confirmPassword })}
                />
              </FormControl>
              <Button
                my={2}
                isDisabled={
                  !email || password.length < 6 || password !== confirmPassword
                }
                isLoading={isPending}
                onClick={
                    () => signUp({ email, password, confirmPassword })
                }
              >
                Create account
              </Button>
              <Text align={"center"} fontSize={"sm"} color={"text.muted"}>
                Already have an account?{" "}
                <ChakraLink as={Link} to={"/login"}>
                  Sign in
                </ChakraLink>
              </Text>
            </Stack>
          </Box>
        </Container>
      </Flex>
    </>
  );
};
