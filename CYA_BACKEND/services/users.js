const mysqlLib = require('../lib/mysql');

class UsersService {
  getUser(username) {
    return new Promise((resolve, reject) => {
      mysqlLib.query(
        `SELECT * FROM USERS WHERE USERNAME = '${username}'`,
        (err, res) => {
          if (err) reject(err);
          else resolve(res[0]);
        }
      );
    });
  }
  getSubjects(id) {
    return new Promise((resolve, reject) => {
      mysqlLib.query(
        `SELECT SUBJECTS.NAME, SUBJECTS_HISTORY.ID_SUBJECT FROM USERS INNER JOIN SUBJECTS_HISTORY ON USERS.ID = SUBJECTS_HISTORY.ID_USER INNER JOIN SUBJECTS ON SUBJECTS.ID = SUBJECTS_HISTORY.ID_SUBJECT WHERE USERS.ID = ${id}`,
        (err, res) => {
          if (err) reject(err);
          else resolve(res);
        }
      );
    });
  }
  getAllSubjects() {
    return new Promise((resolve, reject) => {
      mysqlLib.query(`SELECT * FROM SUBJECTS`, (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    });
  }
}

module.exports = UsersService;
