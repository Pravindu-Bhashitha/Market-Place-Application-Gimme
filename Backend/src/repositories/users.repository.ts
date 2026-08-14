import { db } from "../config/db";
import { User, NewUserInput } from "../types/user.types";

export const usersRepository = {
    findByEmail: (email: string): User | undefined => {
        const statement = db.prepare("SELECT * FROM users WHERE email = ?");
        return statement.get(email) as User | undefined;
    },

    findById(id: number): User | undefined {
        const statement = db.prepare("SELECT * FROM users WHERE id = ?");
        return statement.get(id) as User | undefined;
    },

    create(userInput: NewUserInput & { passwordHash: string; createdAt: string }): User {
        const statement = db
            .prepare(
                `INSERT INTO users (email, passwordHash, createdAt)
         VALUES (@email, @passwordHash, @createdAt)`
            )

        const result = statement.run({ email: userInput.email, passwordHash: userInput.passwordHash, createdAt: userInput.createdAt });

        return this.findById(result.lastInsertRowid as number)!;;
    }
}