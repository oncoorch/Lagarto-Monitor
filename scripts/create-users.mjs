import bcrypt from "bcryptjs";

const entries = process.argv.slice(2);
if (!entries.length) {
  console.error("Usage: npm run create-users -- <username>:<name>:<password>[:role] [...]");
  console.error("Example: npm run create-users -- angel:Angel:'secret':admin jairo:Jairo:'secret':editor");
  process.exit(1);
}

const users = entries.map((entry) => {
  const [username, name, password, role = "viewer"] = entry.split(":");
  if (!username || !name || !password) {
    console.error(`Invalid user entry: ${entry}`);
    process.exit(1);
  }

  return {
    username,
    name,
    role,
    passwordHash: bcrypt.hashSync(password, 10),
  };
});

console.log(Buffer.from(JSON.stringify(users)).toString("base64"));
