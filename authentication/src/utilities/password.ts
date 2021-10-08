import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

// changes scrypt implementation from callback implementation to promise implementation
const scryptAsync = promisify(scrypt);

export class Password {
  // hashes the password
  static async toHash(password: string) {
    //   A cryptographic salt is made up of random bits added to each password instance before its hashing.
    // Salts create unique passwords even in the instance of two users choosing the same passwords.
    // Salts help us mitigate rainbow table attacks by forcing attackers to re-compute them using the salts.
    const salt = randomBytes(8).toString("hex");
    const buffer = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buffer.toString("hex")}.${salt}`;
  }

  //compares storedPassword and suppliedPassword
  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split(".");
    const buffer = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;
    // compares two hashed password
    return buffer.toString("hex") === hashedPassword;
  }
}
