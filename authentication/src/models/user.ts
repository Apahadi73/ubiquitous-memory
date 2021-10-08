import mongoose from "mongoose";
import { Password } from "../utilities/password";

// describes the properties required to create a new user in the db
interface UserAttributes {
  email: string;
  password: string;
}

// describes the properties that defines the custom property that User Model will have
interface UserModel extends mongoose.Model<UserDoc> {
  // we will return instance of UserDoc instead of any
  build(attrs: UserAttributes): UserDoc;
}

// describes the properties that describes the properties of the single User document
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  //   if we want to add extra property, we can add those property below
}

// Model uses this schema to create user document in the db
const userSchema = new mongoose.Schema(
  {
    email: {
      // this type is tied to the mongoose,
      // this does not tell anything about type to the Typescript
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    // transforms the return obj from mongoose to json
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        // delets the password property from ret object
        delete ret.password;
        // deletes the version key
        delete ret.__v;
      },
    },
  }
);

// mongoose pre-hooks
userSchema.pre("save", async function (done) {
  // we use function here instead of arrow fuction because
  // we need property "this" of the document not the present context
  if (this.isModified("password")) {
    // console.log("hashing in process");
    // hashes user entered password before saving it to the db
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  // calls done func after finished all the async tasks
  done();
});

// we will use this builder function to create a new user
// instead of calling the new function
userSchema.statics.build = (attrs: UserAttributes) => {
  // ts makes sure we are creating the new user obj correctly
  return new User(attrs);
};

// create model using the schema
const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

// export the model
export { User };
