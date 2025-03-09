import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { logout } from '../lib/api';
import { Avatar, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';

const UserMenu = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const {
        mutate: signOut
    } = useMutation({
        mutationFn: logout,
        onSettled: () => {
            queryClient.clear();
            navigate("/login", {
                replace: true
            })
        }
    });

  return (
    <>
        <Menu isLazy placement='right-start'>
            <MenuButton position={"absolute"} left={"1.5rem"} bottom={"1.5rem"}>
                <Avatar src='#' />
            </MenuButton>
            <MenuList>
                <MenuItem key={"profile"} onClick={() => navigate("/")}>Profile</MenuItem>
                <MenuItem key={"settings"} onClick={() => navigate("/settings")}>Settings</MenuItem>
                <MenuItem key={"logout"} onClick={signOut}>Logout</MenuItem>
            </MenuList>
        </Menu>
    </>
  )
}

export default UserMenu