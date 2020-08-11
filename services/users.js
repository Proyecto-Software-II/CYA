const mysqlLib = require('../lib/mysql');

class UsersService {
  constructor() {
    this.database = 'USERS';
  }
  getUser(username) {
    return new Promise((resolve, reject) => {
      mysqlLib.query(
        `Select * from ${this.database} where username = '${username}'`,
        (err, res) => {
          if (err) reject(err);
          else resolve(res[0]);
        }
      );
    });
  }
}

module.exports = UsersService;
