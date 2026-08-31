import bcrypt from "bcryptjs";

const [, , username, name, password, role = "admin"] = process.argv;
if (!username || !name || !password) {
  console.error("Usage: npm run create-users -- <username> <name> <password> [role]");
  process.exit(1);
}

const users = [{
  username,
  name,
  role,
  passwordHash: bcrypt.hashSync(password, 10),
}];

console.log(Buffer.from(JSON.stringify(users)).toString("base64"));
