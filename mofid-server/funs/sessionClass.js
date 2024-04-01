/**
* A class containing functions related to sessions
*/
module.exports = class sessionClass {
  /**
  * A function that starts a session for user
  */
  startSession(userid, passwd, job, res, con) {
    con.query("SELECT password FROM users WHERE username = '" + userid + "'", function (err, result) {
      if (err) throw err;
      if (result[0]) {
        if (result[0]['password']) {
          if (result[0]['password'] == passwd) {
            con.query("SELECT id FROM jobs WHERE owner = '" + userid + "' AND name = '" + job + "'", function (err, result2) {
              if (err) throw err;
              if (result2[0]) {
                con.query("SELECT id FROM sessions WHERE owner = '" + userid + "'", function (err, result3) {
                  if (err) throw err;
                  if (!result3[0]) {
                    let today = new Date();
                    let todayDate = (new Intl.DateTimeFormat('en-US-u-ca-persian', { year: 'numeric' }).format(today)).slice(0, 4) + "-" + (new Intl.DateTimeFormat('en-US-u-ca-persian', { month: '2-digit' }).format(today)) + "-" + (new Intl.DateTimeFormat('en-US-u-ca-persian', { day: '2-digit' }).format(today));
                    let todayTime = String(today.getHours()) + ":" + String(today.getMinutes()) + ":" + String(today.getSeconds());
                    let todayMS = today.getTime();
                    con.query("INSERT INTO sessions (owner, job, date, time, timems) VALUES ('" + userid + "', '" + job + "', '" + todayDate + "', '" + todayTime + "', '" + todayMS + "')", function (err, result4) {
                      if (err) throw err;
                      res.send({ msg: "true" });
                    });
                  }
                  else {
                    res.send({ msg: "session already exist" });
                  }
                });
              }
              else {
                res.send({ msg: "wrong job name" });
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
  * A function that returns an object of data if user has active session
  */
  checkSession(userid, passwd, res, con) {
    con.query("SELECT password FROM users WHERE username = '" + userid + "'", function (err, result) {
      if (err) throw err;
      if (result[0]) {
        if (result[0]['password']) {
          if (result[0]['password'] == passwd) {
            con.query("SELECT job, timems FROM sessions WHERE owner = '" + userid + "'", function (err, result) {
              if (err) throw err;
              if (result[0]) {
                let today = new Date();
                let duration = today.getTime() - Number(result[0]["timems"]);
                let secondsDuration = duration / 1000;
                let minutesDuration = secondsDuration / 60;
                let hoursDuration = Math.floor(minutesDuration / 60);
                minutesDuration = Math.round(minutesDuration - (hoursDuration * 60));
                res.send({ msg: "true", hours: hoursDuration, minutes: minutesDuration, job: result[0]["job"] });
              }
              else {
                res.send({ msg: "false" });
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
  * A function that removes a user's session
  */
  removeSession(userid, passwd, res, con) {
    con.query("SELECT password FROM users WHERE username = '" + userid + "'", function (err, result) {
      if (err) throw err;
      if (result[0]) {
        if (result[0]['password']) {
          if (result[0]['password'] == passwd) {
            con.query("DELETE FROM sessions WHERE owner = '" + userid + "'", function (err, result) {
              if (err) throw err;
              res.send({ msg: "true" });
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
  * A function that saves a user's session
  */
  saveSession(userid, passwd, res, con) {
    con.query("SELECT password, showname, groupid FROM users WHERE username = '" + userid + "'", function (err, result) {
      if (err) throw err;
      if (result[0]) {
        if (result[0]['password']) {
          if (result[0]['password'] == passwd) {
            con.query("SELECT job ,date ,time ,timems FROM sessions WHERE owner = '" + userid + "'", function (err, result2) {
              if (err) throw err;
              if (result2[0]) {
                let today = new Date();
                let durationMs = today.getTime() - Number(result2[0]['timems']);
                if (durationMs >= 300000) {
                  let secondsDuration = durationMs / 1000;
                  let minutesDuration = secondsDuration / 60;
                  let hoursDuration = Math.floor(minutesDuration / 60);
                  minutesDuration = Math.round(minutesDuration - (hoursDuration * 60));
                  let timeHourText = String(hoursDuration);
                  if (hoursDuration < 10) {
                    timeHourText = "0" + timeHourText;
                  }
                  let timeMinuteText = String(minutesDuration);
                  if (minutesDuration < 10) {
                    timeMinuteText = "0" + timeMinuteText;
                  }
                  let duration = timeHourText + ":" + timeMinuteText;
                  con.query("SELECT isgroup FROM jobs WHERE owner = '" + userid + "' AND name = '" + result2[0]['job'] + "'", function (err, result3) {
                    if (err) throw err;
                    if (result3[0]) {
                      if (result3[0]['isgroup'] == "yes" && result[0]['groupid'] != "") {
                        con.query("INSERT INTO activities (owner, showname, groupid, job, date, time, timems, duration, durationms) VALUES ('" + userid + "', '" + result[0]['showname'] + "', '" + result[0]['groupid'] + "', '" + result2[0]['job'] + "', '" + result2[0]['date'] + "', '" + result2[0]['time'] + "', '" + result2[0]['timems'] + "', '" + duration + "', '" + durationMs + "')", function (err, result4) {
                          if (err) throw err;
                          con.query("DELETE FROM sessions WHERE owner = '" + userid + "'", function (err, result5) {
                            if (err) throw err;
                            res.send({ msg: "true" });
                          });
                        });
                      }
                      else {
                        con.query("INSERT INTO activities (owner, showname, groupid, job, date, time, timems, duration, durationms) VALUES ('" + userid + "', '" + result[0]['showname'] + "', '', '" + result2[0]['job'] + "', '" + result2[0]['date'] + "', '" + result2[0]['time'] + "', '" + result2[0]['timems'] + "', '" + duration + "', '" + durationMs + "')", function (err, result4) {
                          if (err) throw err;
                          con.query("DELETE FROM sessions WHERE owner = '" + userid + "'", function (err, result5) {
                            if (err) throw err;
                            res.send({ msg: "true" });
                          });
                        });
                      }
                    }
                    else {
                      res.send({ msg: "job not found" });
                    }
                  });
                }
                else {
                  res.send({ msg: "less than 5 minutes" });
                }
              }
              else {
                res.send({ msg: "session not found" });
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
  * A function that edits a user's session
  */
  editSaveSession(userid, passwd, hour, minute, res, con) {
    con.query("SELECT password, showname, groupid FROM users WHERE username = '" + userid + "'", function (err, result) {
      if (err) throw err;
      if (result[0]) {
        if (result[0]['password']) {
          if (result[0]['password'] == passwd) {
            con.query("SELECT job ,date ,time ,timems FROM sessions WHERE owner = '" + userid + "'", function (err, result2) {
              if (err) throw err;
              if (result2[0]) {
                let today = new Date();
                let durationMs = today.getTime() - Number(result2[0]['timems']);
                let secondsDuration = durationMs / 1000;
                let minutesDuration = secondsDuration / 60;
                let hoursDuration = Math.floor(minutesDuration / 60);
                let editMinutes = (Number(hour) * 60) + Number(minute);
                if (editMinutes <= minutesDuration) {
                  minutesDuration = Math.round(minutesDuration - (hoursDuration * 60));
                  let timeHourText = String(Number(hour));
                  if (Number(hour) < 10) {
                    timeHourText = "0" + timeHourText;
                  }
                  let timeMinuteText = String(Number(minute));
                  if (Number(minute) < 10) {
                    timeMinuteText = "0" + timeMinuteText;
                  }
                  durationMs = editMinutes * 60 * 1000;
                  let duration = timeHourText + ":" + timeMinuteText;
                  if (durationMs >= 300000) {
                    con.query("SELECT isgroup FROM jobs WHERE owner = '" + userid + "' AND name = '" + result2[0]['job'] + "'", function (err, result3) {
                      if (err) throw err;
                      if (result3[0]) {
                        if (result3[0]['isgroup'] == "yes" && result[0]['groupid'] != "") {
                          con.query("INSERT INTO activities (owner, showname, groupid, job, date, time, timems, duration, durationms) VALUES ('" + userid + "', '" + result[0]['showname'] + "', '" + result[0]['groupid'] + "', '" + result2[0]['job'] + "', '" + result2[0]['date'] + "', '" + result2[0]['time'] + "', '" + result2[0]['timems'] + "', '" + duration + "', '" + durationMs + "')", function (err, result4) {
                            if (err) throw err;
                            con.query("DELETE FROM sessions WHERE owner = '" + userid + "'", function (err, result5) {
                              if (err) throw err;
                              res.send({ msg: "true" });
                            });
                          });
                        }
                        else {
                          con.query("INSERT INTO activities (owner, showname, job, date, time, timems, duration, durationms) VALUES ('" + userid + "', '" + result[0]['showname'] + "', '" + result2[0]['job'] + "', '" + result2[0]['date'] + "', '" + result2[0]['time'] + "', '" + result2[0]['timems'] + "', '" + duration + "', '" + durationMs + "')", function (err, result4) {
                            if (err) throw err;
                            con.query("DELETE FROM sessions WHERE owner = '" + userid + "'", function (err, result5) {
                              if (err) throw err;
                              res.send({ msg: "true" });
                            });
                          });
                        }
                      }
                      else {
                        res.send({ msg: "job not found" });
                      }
                    });
                  }
                  else {
                    res.send({ msg: "less than 5 minutes" });
                  }
                }
                else {
                  res.send({ msg: "number is bigger than time" });
                }

              }
              else {
                res.send({ msg: "session not found" });
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
}