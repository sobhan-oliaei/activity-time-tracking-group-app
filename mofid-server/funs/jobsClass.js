/**
* A class containing functions related to jobs
*/
module.exports = class jobsClass {
  /**
  * A function that return today tasks of user
  */
  getTodayTasks(userid, passwd, res, con) {
    con.query("SELECT password FROM users WHERE username = '" + userid + "'", function (err, result) {
      if (err) throw err;
      if (result[0]) {
        if (result[0]['password']) {
          if (result[0]['password'] == passwd) {
            let today = new Date();
            today = (new Intl.DateTimeFormat('en-US-u-ca-persian', { year: 'numeric' }).format(today)).slice(0, 4) + "-" + (new Intl.DateTimeFormat('en-US-u-ca-persian', { month: '2-digit' }).format(today)) + "-" + (new Intl.DateTimeFormat('en-US-u-ca-persian', { day: '2-digit' }).format(today));
            con.query("SELECT job, date FROM tasks WHERE owner = '" + userid + "' AND date = '" + today + "'", function (err, result) {
              if (err) throw err;
              if (result[0]) {
                let todayJobsList = [];
                for (let i = 0; i < result.length; i++) {
                  todayJobsList[i] = [];
                  todayJobsList[i][0] = result[i]['job'];
                  todayJobsList[i][1] = result[i]['date'];
                }
                res.send({ msg: "true", todayjobs: todayJobsList });
              }
              else {
                res.send({ msg: "no result" });
              }
            });
          }
          else {
            res.send({ msg: "wrong cached password" });
          }
        }
        else {
          res.send({ msg: "wrong cached username" });
        }
      }
      else {
        res.send({ msg: "wrong cached username" });
      }
    });
  }

  /**
  * A function that return works of user
  */
  getJobs(userid, passwd, res, con) {
    con.query("SELECT password FROM users WHERE username = '" + userid + "'", function (err, result) {
      if (err) throw err;
      if (result[0]) {
        if (result[0]['password']) {
          if (result[0]['password'] == passwd) {
            con.query("SELECT name FROM jobs WHERE owner = '" + userid + "'", function (err, result) {
              if (err) throw err;
              if (result[0]) {
                let jobsList = [];
                for (let i = 0; i < result.length; i++) {
                  jobsList[i] = result[i]['name'];
                }
                res.send({ msg: "true", jobs: jobsList });
              }
              else {
                res.send({ msg: "no result" });
              }
            });
          }
          else {
            res.send({ msg: "wrong cached password" });
          }
        }
        else {
          res.send({ msg: "wrong cached username" });
        }
      }
      else {
        res.send({ msg: "wrong cached username" });
      }
    });
  }

  /**
  * A function that remove a task of user
  */
  removeTodayTask(userid, passwd, name, date, res, con) {
    con.query("SELECT password FROM users WHERE username = '" + userid + "'", function (err, result) {
      if (err) throw err;
      if (result[0]) {
        if (result[0]['password']) {
          if (result[0]['password'] == passwd) {
            con.query("DELETE FROM tasks WHERE owner = '" + userid + "' AND job = '" + name + "' AND date = '" + date + "'", function (err, result) {
              if (err) throw err;
              if (result.affectedRows >= 1) {
                res.send({ msg: "true" });
              }
              else {
                res.send({ msg: "no task found" });
              }
            });
          }
          else {
            res.send({ msg: "wrong cached password" });
          }
        }
        else {
          res.send({ msg: "wrong cached username" });
        }
      }
      else {
        res.send({ msg: "wrong cached username" });
      }
    });
  }

  /**
  * A function that return user's works list for activities page
  */
  getJobsList(userid, passwd, res, con) {
    con.query("SELECT password FROM users WHERE username = '" + userid + "'", function (err, result) {
      if (err) throw err;
      if (result[0]) {
        if (result[0]['password']) {
          if (result[0]['password'] == passwd) {
            con.query("SELECT name, isgroup FROM jobs WHERE owner = '" + userid + "'", function (err, result) {
              if (err) throw err;
              if (result[0]) {
                let jobsList = [];
                for (let i = 0; i < result.length; i++) {
                  jobsList[i] = [];
                  jobsList[i][0] = result[i]['name'];
                  jobsList[i][1] = result[i]['isgroup'];
                }
                res.send({ msg: "true", jobs: jobsList });
              }
              else {
                res.send({ msg: "no result" });
              }
            });
          }
          else {
            res.send({ msg: "wrong cached password" });
          }
        }
        else {
          res.send({ msg: "wrong cached username" });
        }
      }
      else {
        res.send({ msg: "wrong cached username" });
      }
    });
  }

  /**
  * A function that add a new job for user
  */
  addNewJob(userid, passwd, job, group, res, con) {
    if (job && group) {
      con.query("SELECT password FROM users WHERE username = '" + userid + "'", function (err, result) {
        if (err) throw err;
        if (result[0]) {
          if (result[0]['password']) {
            if (result[0]['password'] == passwd) {
              con.query("SELECT name FROM jobs WHERE name = '" + job + "'", function (err, result2) {
                if (err) throw err;
                if (!result2[0]) {
                  con.query("INSERT INTO jobs (owner, name, isgroup) VALUES ('" + userid + "', '" + job + "', '" + group + "')", function (err, result3) {
                    if (err) throw err;
                    res.send({ msg: "true" });
                  });
                }
                else {
                  res.send({ msg: "job name repeated" });
                }
              });
            }
            else {
              res.send({ msg: "wrong cached password" });
            }
          }
          else {
            res.send({ msg: "wrong cached username" });
          }
        }
        else {
          res.send({ msg: "wrong cached username" });
        }
      });
    }
    else {
      res.send({ msg: "empty data" });
    }
  }

  /**
  * A function that delete a job from user
  */
  deleteJob(userid, passwd, job, res, con) {
    if (job) {
      con.query("SELECT password FROM users WHERE username = '" + userid + "'", function (err, result) {
        if (err) throw err;
        if (result[0]) {
          if (result[0]['password']) {
            if (result[0]['password'] == passwd) {
              con.query("DELETE FROM jobs WHERE owner = '" + userid + "' AND name = '" + job + "'", function (err, result) {
                if (err) throw err;
                if (result.affectedRows >= 1) {
                  res.send({ msg: "true" });
                }
                else {
                  res.send({ msg: "no job found" });
                }
              });
            }
            else {
              res.send({ msg: "wrong cached password" });
            }
          }
          else {
            res.send({ msg: "wrong cached username" });
          }
        }
        else {
          res.send({ msg: "wrong cached username" });
        }
      });
    }
    else {
      res.send({ msg: "empty data" });
    }
  }

  /**
  * A function that add a new task for user
  */
  addNewTask(userid, passwd, task, date, res, con) {
    if (task && date) {
      con.query("SELECT password FROM users WHERE username = '" + userid + "'", function (err, result) {
        if (err) throw err;
        if (result[0]) {
          if (result[0]['password']) {
            if (result[0]['password'] == passwd) {
              con.query("SELECT job FROM tasks WHERE job = '" + task + "' AND date = '" + date + "'", function (err, result2) {
                if (err) throw err;
                if (!result2[0]) {
                  con.query("INSERT INTO tasks (owner, job, date) VALUES ('" + userid + "', '" + task + "', '" + date + "')", function (err, result3) {
                    if (err) throw err;
                    res.send({ msg: "true" });
                  });
                }
                else {
                  res.send({ msg: "task name repeated" });
                }
              });
            }
            else {
              res.send({ msg: "wrong cached password" });
            }
          }
          else {
            res.send({ msg: "wrong cached username" });
          }
        }
        else {
          res.send({ msg: "wrong cached username" });
        }
      });
    }
    else {
      res.send({ msg: "empty data" });
    }
  }

  /**
  * A function that returns tasks list of user for activities page
  */
  getTasksList(userid, passwd, res, con) {
    con.query("SELECT password FROM users WHERE username = '" + userid + "'", function (err, result) {
      if (err) throw err;
      if (result[0]) {
        if (result[0]['password']) {
          if (result[0]['password'] == passwd) {
            con.query("SELECT job, date FROM tasks WHERE owner = '" + userid + "'", function (err, result) {
              if (err) throw err;
              if (result[0]) {
                let tasksList = [];
                for (let i = 0; i < result.length; i++) {
                  tasksList[i] = [];
                  tasksList[i][0] = result[i]['job'];
                  tasksList[i][1] = result[i]['date'];
                }
                res.send({ msg: "true", tasks: tasksList });
              }
              else {
                res.send({ msg: "no result" });
              }
            });
          }
          else {
            res.send({ msg: "wrong cached password" });
          }
        }
        else {
          res.send({ msg: "wrong cached username" });
        }
      }
      else {
        res.send({ msg: "wrong cached username" });
      }
    });
  }

  /**
  * A function that delete a task from user
  */
  deleteTask(userid, passwd, task, date, res, con) {
    if (task && date) {
      con.query("SELECT password FROM users WHERE username = '" + userid + "'", function (err, result) {
        if (err) throw err;
        if (result[0]) {
          if (result[0]['password']) {
            if (result[0]['password'] == passwd) {
              con.query("DELETE FROM tasks WHERE owner = '" + userid + "' AND job = '" + task + "' AND date = '" + date + "'", function (err, result) {
                if (err) throw err;
                if (result.affectedRows >= 1) {
                  res.send({ msg: "true" });
                }
                else {
                  res.send({ msg: "no task found" });
                }
              });
            }
            else {
              res.send({ msg: "wrong cached password" });
            }
          }
          else {
            res.send({ msg: "wrong cached username" });
          }
        }
        else {
          res.send({ msg: "wrong cached username" });
        }
      });
    }
    else {
      res.send({ msg: "empty data" });
    }
  }
}