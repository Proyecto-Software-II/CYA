const mysqlLib = require('../lib/mysql');

class OpeningsService {
  createOpeningOrder({ order }) {
    return new Promise((resolve, reject) => {
      mysqlLib.query(
        `INSERT INTO OPENINGS (ID_USER, ID_SUBJECT,STATE,FILE_NAME) VALUES (${order.ID_USER},${order.ID_SUBJECT},'C','${order.FILE_NAME}')`,
        (err, res) => {
          if (err) reject(err);
          else resolve(res);
        }
      );
    });
  }
  getOpenings() {
    return new Promise((resolve, reject) => {
      mysqlLib.query(
        `SELECT OPENINGS.ID,USERNAME,EMAIL,NAME,CAREER,STATE,FILE_NAME,TIMESTAMP FROM OPENINGS INNER JOIN USERS ON ID_USER = USERS.ID INNER JOIN SUBJECTS ON ID_SUBJECT = SUBJECTS.ID`,
        (err, res) => {
          if (err) reject(err);
          else resolve(res);
        }
      );
    });
  }
  getOpening({ id }) {
    return new Promise((resolve, reject) => {
      mysqlLib.query(
        `SELECT OPENINGS.ID,USERNAME,EMAIL,NAME,CAREER,STATE,FILE_NAME,TIMESTAMP FROM OPENINGS INNER JOIN USERS ON ID_USER = USERS.ID INNER JOIN SUBJECTS ON ID_SUBJECT = SUBJECTS.ID WHERE OPENINGS.ID = ${id}`,
        (err, res) => {
          if (err) reject(err);
          else resolve(res);
        }
      );
    });
  }
  updateOpening({ id, state }) {
    return new Promise((resolve, reject) => {
      mysqlLib.query(
        `UPDATE OPENINGS SET STATE='${state}' WHERE ID=${id}`,
        (err, res) => {
          if (err) reject(err);
          else resolve(res);
        }
      );
    });
  }
}

module.exports = OpeningsService;
