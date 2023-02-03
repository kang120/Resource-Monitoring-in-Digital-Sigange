const bcrypt = require('bcrypt')
const mysql = require('mysql2')

const conn = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: '',
    database: 'digital_signage',
    port: 3307
})

conn.connect(async (err) => {
    if(err){
        throw err;
    }

    const query = 'SELECT * FROM USER WHERE ID=10'

    var user;

    conn.query(query, async (err, result, fields) => {
        if(err){
            throw err;
        }

        user = result[0]

        const input_password = 'password'
        const db_password = result[0]['password']

        const is_match = await bcrypt.compare(input_password, db_password)

        console.log('match: ', is_match)
    })


})

/*
x = 1

async function a(){
    while(x <= 300){
        var id = x;
        var email = Math.random().toString(36).substring(2) + '@gmail.com'
        var password = 'password'
        var encrypted = await bcrypt.hash(password, 10)

        var user_type = 'user'

        if(id <= 10){
            user_type = 'admin'
        }

        conn.connect((err) => {
            if(err){
                throw err;
            }

            const query = `INSERT INTO USER (EMAIL, PASSWORD, USER_TYPE) VALUES ('${email}', '${encrypted}', '${user_type}')`

            conn.query(query, (err, result, fields) => {
                if(err){
                    throw err;
                }

                console.log(result);
            })
        })

        x++;
    }
}

a()
*/
