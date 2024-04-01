const randomstring = require("randomstring");

/**
* A class containing functions related to groups
*/
module.exports = class groupClass {
  /**
  * A function to create a new group
  */
  createGroup(userid, passwd, name, res, con) {
    if (name) {
      con.query("SELECT password FROM users WHERE username = '" + userid + "'", function (err, result) {
        if (err) throw err;
        if (result[0]) {
          if (result[0]['password']) {
            if (result[0]['password'] == passwd) {
              con.query("SELECT name FROM mofidteams WHERE name = '" + name + "'", function (err, result2) {
                if (err) throw err;
                if (!result2[0]) {
                  let randStr = randomstring.generate(8);
                  con.query("SELECT codestr FROM mofidteams WHERE codestr = '" + randStr + "'", function (err, result3) {
                    if (err) throw err;
                    if (!result3[0]) {
                      con.query("INSERT INTO mofidteams (name, codestr, owner) VALUES ('" + name + "', '" + randStr + "', '" + userid + "')", function (err, result4) {
                        if (err) throw err;
                        con.query("UPDATE users SET groupid = '" + randStr + "' WHERE username = '" + userid + "'", function (err, result) {
                          if (err) throw err;
                          if (result.affectedRows >= 1) {
                            res.send({ msg: "true" });
                          }
                          else {
                            res.send({ msg: "group created but you didnt joined" });
                          }
                        });
                      });
                    }
                    else {
                      res.send({ msg: "codestr already exist" });
                    }
                  });
                }
                else {
                  res.send({ msg: "group name already exist" });
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
  * A function to join user to a group
  */
  joinGroup(userid, passwd, code, res, con) {
    if (code) {
      con.query("SELECT password FROM users WHERE username = '" + userid + "'", function (err, result) {
        if (err) throw err;
        if (result[0]) {
          if (result[0]['password']) {
            if (result[0]['password'] == passwd) {
              con.query("SELECT codestr FROM mofidteams WHERE codestr = '" + code + "'", function (err, result2) {
                if (err) throw err;
                if (result2[0]) {
                  con.query("UPDATE users SET groupid = '" + code + "' WHERE username = '" + userid + "'", function (err, result) {
                    if (err) throw err;
                    if (result.affectedRows >= 1) {
                      res.send({ msg: "true" });
                    }
                    else {
                      res.send({ msg: "something went wrong" });
                    }
                  });
                }
                else {
                  res.send({ msg: "no group found" });
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
  * A function that returns if user is in a group or not
  */
  isInGroup(userid, passwd, res, con) {
    con.query("SELECT password, groupid FROM users WHERE username = '" + userid + "'", function (err, result) {
      if (err) throw err;
      if (result[0]) {
        if (result[0]['password']) {
          if (result[0]['password'] == passwd) {
            if (result[0]['groupid'] && result[0]['groupid'] != "") {
              con.query("SELECT codestr FROM mofidteams WHERE codestr = '" + result[0]['groupid'] + "'", function (err, result2) {
                if (err) throw err;
                if (result2[0]) {
                  res.send({ msg: "true", group: "yes", groupCode: result[0]['groupid'] });
                }
                else {
                  res.send({ msg: "no group found" });
                }
              });
            }
            else {
              res.send({ msg: "true", group: "no" });
            }
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
  * A function that returns activities group score list for home page
  */
  getGroupScoreList(userid, passwd, res, con) {
    con.query("SELECT password, groupid FROM users WHERE username = '" + userid + "'", function (err, result) {
      if (err) throw err;
      if (result[0]) {
        if (result[0]['password']) {
          if (result[0]['password'] == passwd) {
            let today = new Date();
            let todayDate = (new Intl.DateTimeFormat('en-US-u-ca-persian', { year: 'numeric' }).format(today)).slice(0, 4) + "-" + (new Intl.DateTimeFormat('en-US-u-ca-persian', { month: '2-digit' }).format(today)) + "-" + (new Intl.DateTimeFormat('en-US-u-ca-persian', { day: '2-digit' }).format(today));
            con.query("SELECT showname, durationms FROM activities WHERE groupid = '" + result[0]['groupid'] + "' AND date = '" + todayDate + "' ORDER BY showname", function (err, result2) {
              if (err) throw err;
              let dayActivities = [];
              let shownameHolder = "gnagnngoientwtwonggpzkcfomqr";
              let shownameIndex = -1;
              for (let i = 0; i < result2.length; i++) {
                if (shownameHolder != result2[i]['showname']) {
                  shownameHolder = result2[i]['showname'];
                  shownameIndex = shownameIndex + 1;
                  dayActivities[shownameIndex] = [];
                  dayActivities[shownameIndex][0] = shownameHolder;
                  dayActivities[shownameIndex][1] = Math.round((Number(result2[i]['durationms']) / 1000) / 60);
                }
                else {
                  dayActivities[shownameIndex][1] = dayActivities[shownameIndex][1] + Math.round((Number(result2[i]['durationms']) / 1000) / 60);
                }
              }
              let firstMonthDate = (new Intl.DateTimeFormat('en-US-u-ca-persian', { year: 'numeric' }).format(today)).slice(0, 4) + "-" + (new Intl.DateTimeFormat('en-US-u-ca-persian', { month: '2-digit' }).format(today)) + "-01";
              let lastMonthDate = (new Intl.DateTimeFormat('en-US-u-ca-persian', { year: 'numeric' }).format(today)).slice(0, 4) + "-" + (new Intl.DateTimeFormat('en-US-u-ca-persian', { month: '2-digit' }).format(today)) + "-31";
              con.query("SELECT showname, durationms FROM activities WHERE groupid = '" + result[0]['groupid'] + "' AND date >= '" + firstMonthDate + "' AND date <='" + lastMonthDate + "' ORDER BY showname", function (err, result3) {
                if (err) throw err;
                let monthActivities = [];
                let shownameHolder = "gnagnngoientwtwonggpzkcfomqr";
                let shownameIndex = -1;
                for (let i = 0; i < result3.length; i++) {
                  if (shownameHolder != result3[i]['showname']) {
                    shownameHolder = result3[i]['showname'];
                    shownameIndex = shownameIndex + 1;
                    monthActivities[shownameIndex] = [];
                    monthActivities[shownameIndex][0] = shownameHolder;
                    monthActivities[shownameIndex][1] = Math.round((Number(result3[i]['durationms']) / 1000) / 60);
                  }
                  else {
                    monthActivities[shownameIndex][1] = monthActivities[shownameIndex][1] + Math.round((Number(result3[i]['durationms']) / 1000) / 60);
                  }
                }
                let dayOfWeek = today.getDay() + 1;
                if (dayOfWeek == 7) {
                  dayOfWeek = 0;
                }
                let first = (today.getDate() - (dayOfWeek));
                let last = first + 6; // last day is the first day + 6
                let firstDayOfWeek = new Date(today.setDate(first));
                let lastDayOfWeek = new Date(today.setDate(last));
                firstDayOfWeek = (new Intl.DateTimeFormat('en-US-u-ca-persian', { year: 'numeric' }).format(firstDayOfWeek)).slice(0, 4) + "-" + (new Intl.DateTimeFormat('en-US-u-ca-persian', { month: '2-digit' }).format(firstDayOfWeek)) + "-" + (new Intl.DateTimeFormat('en-US-u-ca-persian', { day: '2-digit' }).format(firstDayOfWeek));
                lastDayOfWeek = (new Intl.DateTimeFormat('en-US-u-ca-persian', { year: 'numeric' }).format(lastDayOfWeek)).slice(0, 4) + "-" + (new Intl.DateTimeFormat('en-US-u-ca-persian', { month: '2-digit' }).format(lastDayOfWeek)) + "-" + (new Intl.DateTimeFormat('en-US-u-ca-persian', { day: '2-digit' }).format(lastDayOfWeek));
                con.query("SELECT showname, durationms FROM activities WHERE groupid = '" + result[0]['groupid'] + "' AND date >= '" + firstDayOfWeek + "' AND date <='" + lastDayOfWeek + "' ORDER BY showname", function (err, result4) {
                  if (err) throw err;
                  let weekActivities = [];
                  let shownameHolder = "gnagnngoientwtwonggpzkcfomqr";
                  let shownameIndex = -1;
                  for (let i = 0; i < result4.length; i++) {
                    if (shownameHolder != result4[i]['showname']) {
                      shownameHolder = result4[i]['showname'];
                      shownameIndex = shownameIndex + 1;
                      weekActivities[shownameIndex] = [];
                      weekActivities[shownameIndex][0] = shownameHolder;
                      weekActivities[shownameIndex][1] = Math.round((Number(result4[i]['durationms']) / 1000) / 60);
                    }
                    else {
                      weekActivities[shownameIndex][1] = weekActivities[shownameIndex][1] + Math.round((Number(result4[i]['durationms']) / 1000) / 60);
                    }
                  }
                  con.query("SELECT username, showname FROM users WHERE groupid = '" + result[0]['groupid'] + "'", function (err, result5) {
                    if (err) throw err;
                    let usersOfGroup = [];
                    let usersOfGroupSql = "";
                    for (let i = 0; i < result5.length; i++) {
                      usersOfGroup[i] = [];
                      usersOfGroup[i][0] = result5[i]['username'];
                      usersOfGroup[i][1] = result5[i]['showname'];
                      if (i == 0) {
                        usersOfGroupSql = "owner = '" + result5[i]['username'] + "'";
                      }
                      else {
                        usersOfGroupSql = usersOfGroupSql + " OR owner = '" + result5[i]['username'] + "'";
                      }
                    }
                    con.query("SELECT owner FROM sessions WHERE " + usersOfGroupSql, function (err, result6) {
                      if (err) throw err;
                      let onlineUsers = [];
                      for (let i = 0; i < result6.length; i++) {
                        for (let j = 0; j < usersOfGroup.length; j++) {
                          if (result6[i]['owner'] == usersOfGroup[j][0]) {
                            onlineUsers.push(usersOfGroup[j][1]);
                          }
                        }
                      }
                      res.send({ msg: "true", day: dayActivities, month: monthActivities, week: weekActivities, online: onlineUsers });
                    });
                  });
                });
              });
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
  * A function that returns activities group score list for group page
  */
  getFullGroupScoreList(userid, passwd, res, con) {
    con.query("SELECT password, groupid FROM users WHERE username = '" + userid + "'", function (err, result) {
      if (err) throw err;
      if (result[0]) {
        if (result[0]['password']) {
          if (result[0]['password'] == passwd) {
            let today = new Date();
            let threeMonthAgo = Number(new Intl.DateTimeFormat('en-US-u-ca-persian', { month: 'numeric' }).format(today));
            threeMonthAgo = threeMonthAgo - 3;
            if (threeMonthAgo <= 0) {
              threeMonthAgo = 12 + threeMonthAgo;
            }
            if (threeMonthAgo < 10) {
              threeMonthAgo = "0" + String(threeMonthAgo);
            }
            else {
              threeMonthAgo = String(threeMonthAgo);
            }
            let todayDate = (new Intl.DateTimeFormat('en-US-u-ca-persian', { year: 'numeric' }).format(today)).slice(0, 4) + "-" + threeMonthAgo + "-" + "01";
            con.query("SELECT job, durationms, date, showname FROM activities WHERE groupid = '" + result[0]['groupid'] + "' ORDER BY date DESC,showname ASC,job ASC", function (err, result2) {
              if (err) throw err;
              let history = [];
              let historyIndex = -1;
              let dayHolderDate = "gnagnngoientwtwonggpzkcfomqr";
              let ownerHolder = "gnagnngoientwtwonggpzkcfomqr";
              let ownerIndex = -1;
              let jobHolder = "gnagnngoientwtwonggpzkcfomqr";
              let jobIndex = -1;
              for (let m = 0; m < result2.length; m++) {
                if (dayHolderDate != result2[m]['date']) {
                  dayHolderDate = result2[m]['date'];
                  historyIndex = historyIndex + 1;
                  history[historyIndex] = [];
                  history[historyIndex][0] = dayHolderDate;
                  history[historyIndex][1] = [];
                  ownerHolder = "gnagnngoientwtwonggpzkcfomqr";
                  ownerIndex = -1;
                  jobHolder = "gnagnngoientwtwonggpzkcfomqr";
                  jobIndex = -1;
                  if (ownerHolder != result2[m]['showname']) {
                    ownerHolder = result2[m]['showname'];
                    ownerIndex = ownerIndex + 1;
                    history[historyIndex][1][ownerIndex] = [];
                    history[historyIndex][1][ownerIndex][0] = ownerHolder;
                    history[historyIndex][1][ownerIndex][1] = [];
                    jobHolder = "gnagnngoientwtwonggpzkcfomqr";
                    jobIndex = -1;
                    if (jobHolder != result2[m]['job']) {
                      jobHolder = result2[m]['job'];
                      jobIndex = jobIndex + 1;
                      history[historyIndex][1][ownerIndex][1][jobIndex] = [];
                      history[historyIndex][1][ownerIndex][1][jobIndex][0] = jobHolder;
                      history[historyIndex][1][ownerIndex][1][jobIndex][1] = Math.round((Number(result2[m]['durationms']) / 1000) / 60);
                    }
                    else {
                      history[historyIndex][1][ownerIndex][1][jobIndex][1] = history[historyIndex][1][ownerIndex][1][jobIndex][1] + Math.round((Number(result2[m]['durationms']) / 1000) / 60);
                    }
                  }
                  else {
                    if (jobHolder != result2[m]['job']) {
                      jobHolder = result2[m]['job'];
                      jobIndex = jobIndex + 1;
                      history[historyIndex][1][ownerIndex][1][jobIndex] = [];
                      history[historyIndex][1][ownerIndex][1][jobIndex][0] = jobHolder;
                      history[historyIndex][1][ownerIndex][1][jobIndex][1] = Math.round((Number(result2[m]['durationms']) / 1000) / 60);
                    }
                    else {
                      history[historyIndex][1][ownerIndex][1][jobIndex][1] = history[historyIndex][1][ownerIndex][1][jobIndex][1] + Math.round((Number(result2[m]['durationms']) / 1000) / 60);
                    }
                  }
                }
                else {
                  if (ownerHolder != result2[m]['showname']) {
                    ownerHolder = result2[m]['showname'];
                    ownerIndex = ownerIndex + 1;
                    history[historyIndex][1][ownerIndex] = [];
                    history[historyIndex][1][ownerIndex][0] = ownerHolder;
                    history[historyIndex][1][ownerIndex][1] = [];
                    jobHolder = "gnagnngoientwtwonggpzkcfomqr";
                    jobIndex = -1;
                    if (jobHolder != result2[m]['job']) {
                      jobHolder = result2[m]['job'];
                      jobIndex = jobIndex + 1;
                      history[historyIndex][1][ownerIndex][1][jobIndex] = [];
                      history[historyIndex][1][ownerIndex][1][jobIndex][0] = jobHolder;
                      history[historyIndex][1][ownerIndex][1][jobIndex][1] = Math.round((Number(result2[m]['durationms']) / 1000) / 60);
                    }
                    else {
                      history[historyIndex][1][ownerIndex][1][jobIndex][1] = history[historyIndex][1][ownerIndex][1][jobIndex][1] + Math.round((Number(result2[m]['durationms']) / 1000) / 60);
                    }
                  }
                  else {
                    if (jobHolder != result2[m]['job']) {
                      jobHolder = result2[m]['job'];
                      jobIndex = jobIndex + 1;
                      history[historyIndex][1][ownerIndex][1][jobIndex] = [];
                      history[historyIndex][1][ownerIndex][1][jobIndex][0] = jobHolder;
                      history[historyIndex][1][ownerIndex][1][jobIndex][1] = Math.round((Number(result2[m]['durationms']) / 1000) / 60);
                    }
                    else {
                      history[historyIndex][1][ownerIndex][1][jobIndex][1] = history[historyIndex][1][ownerIndex][1][jobIndex][1] + Math.round((Number(result2[m]['durationms']) / 1000) / 60);
                    }
                  }
                }
              }
              let firstDayOfWeekForSend = new Date();
              let dayOfWeek = today.getDay() + 1;
              if (dayOfWeek == 7) {
                dayOfWeek = 0;
              }
              firstDayOfWeekForSend.setDate(today.getDate() - dayOfWeek);
              let firstDayOfWeekForSendDate = (new Intl.DateTimeFormat('en-US-u-ca-persian', { year: 'numeric' }).format(firstDayOfWeekForSend)).slice(0, 4) + "-" + (new Intl.DateTimeFormat('en-US-u-ca-persian', { month: '2-digit' }).format(firstDayOfWeekForSend)) + "-" + (new Intl.DateTimeFormat('en-US-u-ca-persian', { day: '2-digit' }).format(firstDayOfWeekForSend));
              res.send({ msg: "true", history: history, firstDayOfWeek: firstDayOfWeekForSendDate });
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
  * A function that returns if user is admin of group or not
  */
  isGroupAdmin(userid, passwd, res, con) {
    con.query("SELECT password, groupid FROM users WHERE username = '" + userid + "'", function (err, result) {
      if (err) throw err;
      if (result[0]) {
        if (result[0]['password']) {
          if (result[0]['password'] == passwd) {
            if (result[0]['groupid'] && result[0]['groupid'] != "") {
              con.query("SELECT owner FROM mofidteams WHERE codestr = '" + result[0]['groupid'] + "'", function (err, result2) {
                if (err) throw err;
                if (result2[0]) {
                  if (result2[0]['owner'] == userid) {
                    res.send({ msg: "true", admin: "yes" });
                  }
                }
                else {
                  res.send({ msg: "no group found" });
                }
              });
            }
            else {
              res.send({ msg: "user have no group" });
            }
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
  * A function that removes user from group
  */
  exitGroup(userid, passwd, res, con) {
    con.query("SELECT password, groupid FROM users WHERE username = '" + userid + "'", function (err, result) {
      if (err) throw err;
      if (result[0]) {
        if (result[0]['password']) {
          if (result[0]['password'] == passwd) {
            con.query("UPDATE users SET groupid = '' WHERE username = '" + userid + "'", function (err, result) {
              if (err) throw err;
              if (result.affectedRows >= 1) {
                res.send({ msg: "true" });
              }
              else {
                res.send({ msg: "something went wrong" });
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
  * A function that change group code invitation
  */
  changeGroupCode(userid, passwd, res, con) {
    con.query("SELECT password, groupid FROM users WHERE username = '" + userid + "'", function (err, result) {
      if (err) throw err;
      if (result[0]) {
        if (result[0]['password']) {
          if (result[0]['password'] == passwd) {
            let randStr = randomstring.generate(8);
            con.query("SELECT codestr FROM mofidteams WHERE codestr = '" + randStr + "'", function (err, result2) {
              if (err) throw err;
              if (!result2[0]) {
                con.query("SELECT owner FROM mofidteams WHERE codestr = '" + result[0]['groupid'] + "'", function (err, result3) {
                  if (err) throw err;
                  if (result3[0]) {
                    if (result3[0]["owner"] == userid) {
                      con.query("UPDATE users SET groupid = '" + randStr + "' WHERE groupid = '" + result[0]['groupid'] + "'", function (err, result4) {
                        if (err) throw err;
                        if (result4.affectedRows >= 1) {
                          con.query("UPDATE mofidteams SET codestr = '" + randStr + "' WHERE codestr = '" + result[0]['groupid'] + "'", function (err, result5) {
                            if (err) throw err;
                            if (result5.affectedRows >= 1) {
                              res.send({ msg: "true" });
                            }
                            else {
                              res.send({ msg: "something went wrong" });
                            }
                          });
                        }
                        else {
                          res.send({ msg: "something went wrong" });
                        }
                      });
                    }
                    else {
                      res.send({ msg: "not admin" });
                    }
                  }
                  else {
                    res.send({ msg: "group does not exist" });
                  }
                });
              }
              else {
                res.send({ msg: "codestr already exist" });
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