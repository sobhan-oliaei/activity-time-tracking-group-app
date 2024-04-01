/**
* A class containing the function of returning person activities history
*/
module.exports = class activitiesClass {
  /**
  * A function that returns person activities history
  */
  getPersonHistory(userid, passwd, res, con) {
    con.query("SELECT password FROM users WHERE username = '" + userid + "'", function (err, result) {
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
            con.query("SELECT job, durationms, date FROM activities WHERE owner = '" + userid + "' ORDER BY date DESC, job ASC", function (err, result2) {
              if (err) throw err;
              let history = [];
              let historyIndex = -1;
              let dayHolderDate = "gnagnngoientwtwonggpzkcfomqr";
              let jobHolder = "gnagnngoientwtwonggpzkcfomqr";
              let jobIndex = -1;
              for (let m = 0; m < result2.length; m++) {
                if (dayHolderDate != result2[m]['date']) {
                  dayHolderDate = result2[m]['date'];
                  historyIndex = historyIndex + 1;
                  jobHolder = "gnagnngoientwtwonggpzkcfomqr";
                  history[historyIndex] = [];
                  history[historyIndex][0] = dayHolderDate;
                  history[historyIndex][1] = [];
                  jobIndex = -1
                  if (jobHolder != result2[m]['job']) {
                    jobHolder = result2[m]['job'];
                    jobIndex = jobIndex + 1;
                    history[historyIndex][1][jobIndex] = [];
                    history[historyIndex][1][jobIndex][0] = jobHolder;
                    history[historyIndex][1][jobIndex][1] = Math.round((Number(result2[m]['durationms']) / 1000) / 60);
                  }
                  else {
                    history[historyIndex][1][jobIndex][1] = history[historyIndex][1][jobIndex][1] + Math.round((Number(result2[m]['durationms']) / 1000) / 60);
                  }
                }
                else {
                  if (jobHolder != result2[m]['job']) {
                    jobHolder = result2[m]['job'];
                    jobIndex = jobIndex + 1;
                    history[historyIndex][1][jobIndex] = [];
                    history[historyIndex][1][jobIndex][0] = jobHolder;
                    history[historyIndex][1][jobIndex][1] = Math.round((Number(result2[m]['durationms']) / 1000) / 60);
                  }
                  else {
                    history[historyIndex][1][jobIndex][1] = history[historyIndex][1][jobIndex][1] + Math.round((Number(result2[m]['durationms']) / 1000) / 60);
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
}