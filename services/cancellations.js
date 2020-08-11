const mysqlLib = require('../lib/mysql');

class CancellationsService {
  createCancellationOrder({ order }) {
    return new Promise((resolve, reject) => {
      mysqlLib.query(
        `INSERT INTO CANCELLATIONS (ID_USER, ID_SUBJECT,STATE) VALUES (${order.ID_USER},${order.ID_SUBJECT},'C')`,
        (err, res) => {
          if (err) reject(err);
          else resolve(res);
        }
      );
    });
  }
}

module.exports = CancellationsService;
