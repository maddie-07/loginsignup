import { connect } from "@/database/mysql.config";
import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/validator/authSchema";
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
        const validator = vine.compile(loginSchema);
        validator.errorReporter = () => new ErrorReporter();
        const output = await validator.validate(body);

        // Check if the email exists in the database
        const [rows] = await connection.execute(
            'SELECT * FROM User WHERE email = ?',
            [output.email]
        );

        if ((rows as any[]).length > 0) {
            const user = (rows as any[])[0];

            // Compare the password
            const checkPassword = bcrypt.compareSync(output.password!, user.password);
            if (checkPassword) {
                return NextResponse.json({
                    status: 200,
                    message: "User logged in successfully!"
                }, { status: 200 });
            }

            return NextResponse.json({
                status: 400,
                errors: {
                    email: "Please check your credentials"
                }
            }, { status: 200 });
        }

        return NextResponse.json({
            status: 400,
            errors: {
                email: "No email found!"
            }
        }, { status: 200 });

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
