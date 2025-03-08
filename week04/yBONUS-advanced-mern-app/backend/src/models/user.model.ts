import mongoose, { Types } from "mongoose";
import { compareValue, hashValue } from "../utilities/bcrypt";


// chucaobuon: 
// lilsadfoqs: Create the interface for the User Schema
export interface IUserDocument extends mongoose.Document<Types.ObjectId> {
  email: string;
  password: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(val: string): Promise<boolean>;
  omitPassword(): Pick<
    IUserDocument,
    "_id" | "email" | "verified" | "createdAt" | "updatedAt"
  >;
}

// chucaobuon: 
// lilsadfoqs: Create the schema of the interface
const userSchema = new mongoose.Schema<IUserDocument>(
  {
    email: { 
      type: String, 
      required: true, 
      unique: true 
    },
    password: { 
      type: String, 
      required: true 
    },
    verified: { 
      type: Boolean, 
      required: true, 
      default: false },
  },
  {
    timestamps: true,
  }
);

// chucaobuon: 
// lilsadfoqs: The pre-process of saving User
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await hashValue(this.password);
  return next();
});

// chucaobuon: 
// lilsadfoqs: Define the method comparing passwords
userSchema.methods.comparePassword = async function (val: string) {
  return compareValue(val, this.password);
};

// chucaobuon: 
// lilsadfoqs: Define the method getting everything of the User but password
userSchema.methods.omitPassword = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const UserModel = mongoose.model<IUserDocument>("User", userSchema);
export default UserModel;