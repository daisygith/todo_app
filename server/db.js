const oracledb = require("oracledb");
const { lowercaseKeys } = require("./utils");
const config = {
  user: "todo",
  password: "todo123",
  connectString: "localhost:1521/FREEPDB1",
};
const options = { outFormat: oracledb.OBJECT };

exports.getTasks = async function () {
  let conn;

  try {
    conn = await oracledb.getConnection(config);

    const result = await conn.execute("select * from task", [], options);

    return result.rows.map((row) => lowercaseKeys(row));
  } catch (err) {
    console.log("Ouch!", err);
  } finally {
    if (conn) {
      // conn assignment worked, need to close
      await conn.close();
    }
  }
};

exports.addTask = async function (task) {
  let conn;

  try {
    conn = await oracledb.getConnection(config);

    await conn.execute(
      `BEGIN ADD_TASK(:description, :status, :finishDate); END;`,
      {
        description: task.description,
        status: task.status,
        finishDate: new Date(task.finishDate),
      },
    );
    const result = await conn.execute(
      `SELECT * FROM (
                SELECT * FROM task ORDER BY id DESC
            ) WHERE ROWNUM = 1`,
      [],
      options,
    );
    return lowercaseKeys(result.rows[0]);
  } catch (err) {
    console.log("Ouch!", err);
  } finally {
    if (conn) {
      // conn assignment worked, need to close
      await conn.close();
    }
  }
};

exports.updateTask = async function (task) {
  let conn;

  try {
    conn = await oracledb.getConnection(config);

    await conn.execute(
      `BEGIN UPDATE_TASK(:id, :description, :status, :finishDate); END;`,
      {
        id: task.id,
        description: task.description,
        status: task.status,
        finishDate: new Date(task.finishDate),
      },
    );
    const result = await conn.execute(
      `SELECT * FROM task WHERE id = :id`,
      [task.id],
      options,
    );
    return lowercaseKeys(result.rows[0]);
  } catch (err) {
    console.log("Ouch!", err);
  } finally {
    if (conn) {
      // conn assignment worked, need to close
      await conn.close();
    }
  }
};

exports.deleteTask = async function (taskId) {
  let conn;

  try {
    conn = await oracledb.getConnection(config);

    await conn.execute(`BEGIN DELETE_TASK(:id); END;`, { id: taskId });
  } catch (err) {
    console.log("Ouch!", err);
  } finally {
    if (conn) {
      // conn assignment worked, need to close
      await conn.close();
    }
  }
};
