import { connect } from "@/database/mysql.config";
import { NextRequest, NextResponse } from "next/server";
import { registerSchema } from "@/validator/authSchema";
import vine, { errors } from "@vinejs/vine";
import ErrorReporter from "@/validator/ErrorReporter";
import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";

connect();

export async function POST(request: NextRequest) {
    const connection = await mysql.createConnection({
        host: process.env.MYSQL_HOST!,
        user: process.env.MYSQL_USER!,
        password: process.env.MYSQL_PASSWORD!,
        database: process.env.MYSQL_DATABASE!,
    });

    try {
        const body = await request.json();
        const validator = vine.compile(registerSchema);
        validator.errorReporter = () => new ErrorReporter();
        const output = await validator.validate(body);

        // Check if email already exists
        const [rows] = await connection.execute(
            'SELECT * FROM User WHERE email = ?',
            [output.email]
        );

        if ((rows as any[]).length > 0) {
            return NextResponse.json({
                status: 400,
                errors: {
                    email: "Email is already taken. Please use another email.",
                },
            }, { status: 200 });
        } else {
            // Hash the password
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(output.password, salt);

            // Insert the new user into the database
            await connection.execute(
                'INSERT INTO User (wardNumber, email, password) VALUES (?, ?, ?)',
                [output.wardNumber, output.email, hashedPassword]
            );

            return NextResponse.json({ status: 200, message: "User created successfully" }, { status: 200 });
        }
    } catch (error) {
        if (error instanceof errors.E_VALIDATION_ERROR) {
            return NextResponse.json({ status: 400, errors: error.messages }, { status: 200 });
        }
        console.error(error);
        return NextResponse.json({ status: 500, message: "Internal Server Error" }, { status: 500 });
    } finally {
        await connection.end();
    }
}