const mysqlLib = require('../lib/mysql');

class CancellationsService {
  createCancellationOrder({ order }) {
    return new Promise((resolve, reject) => {
      mysqlLib.query(
        `INSERT INTO CANCELLATIONS (ID_USER, ID_SUBJECT,STATE,FILE_NAME) VALUES (${order.ID_USER},${order.ID_SUBJECT},'C','${order.FILE_NAME}')`,
        (err, res) => {
          if (err) reject(err);
          else resolve(res);
        }
      );
    });
  }
  getCancellations() {
    return new Promise((resolve, reject) => {
      mysqlLib.query(
        `SELECT CANCELLATIONS.ID,USERNAME,EMAIL,NAME,CAREER,STATE,FILE_NAME,TIMESTAMP FROM CANCELLATIONS INNER JOIN USERS ON ID_USER = USERS.ID INNER JOIN SUBJECTS ON ID_SUBJECT = SUBJECTS.ID`,
        (err, res) => {
          if (err) reject(err);
          else resolve(res);
        }
      );
    });
  }
  getCancellation({ id }) {
    return new Promise((resolve, reject) => {
      mysqlLib.query(
        `SELECT CANCELLATIONS.ID,USERNAME,EMAIL,NAME,CAREER,STATE,FILE_NAME,TIMESTAMP FROM CANCELLATIONS INNER JOIN USERS ON ID_USER = USERS.ID INNER JOIN SUBJECTS ON ID_SUBJECT = SUBJECTS.ID WHERE CANCELLATIONS.ID = ${id}`,
        (err, res) => {
          if (err) reject(err);
          else resolve(res);
        }
      );
    });
  }
  updateCancellation({ id, state }) {
    return new Promise((resolve, reject) => {
      mysqlLib.query(
        `UPDATE CANCELLATIONS SET STATE='${state}' WHERE ID=${id}`,
        (err, res) => {
          if (err) reject(err);
          else resolve(res);
        }
      );
    });
  }
}

module.exports = CancellationsService;
