import bcrypt from "bcrypt"

// chucaobuon: 
// lilsadfoqs: Utility to hash a string with bcrypt
export const hashValue = async (value: string, saltRounds?: number) => 
    bcrypt.hash(value, saltRounds || 10);

// chucaobuon: 
// lilsadfoqs: Utility using bcrypt to compare a unhashed string to the hashed one; if the same it returns true, otherwise it throws an error, so THIS just catches it then returns false
export const compareValue = async (value: string, hashedValue: string) =>
    bcrypt.compare(value, hashedValue).catch(() => false);