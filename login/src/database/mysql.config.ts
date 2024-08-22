import mysql from 'mysql2/promise';

export async function connect() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.MYSQL_HOST!,
            user: process.env.MYSQL_USER!,
            password: process.env.MYSQL_PASSWORD!,
            database: process.env.MYSQL_DATABASE!,
            ssl: {
                rejectUnauthorized: true, // Enable TLS/SSL connection
            },
        });

        console.log("Database connected successfully!");
        return connection;
    } catch (err) {
        console.error("Error!", err);
        throw err;
    }
}
