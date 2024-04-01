const loginRegisterClass = require('./funs/loginRegisterClass');
const jobsClass = require('./funs/jobsClass');
const sessionClass = require('./funs/sessionClass');
const activitiesClass = require('./funs/activitiesClass');
const groupClass = require('./funs/groupClass');
const sittingsClass = require('./funs/sittingsClass');
const express = require('express');
const mysql = require('mysql');
const app = express()
const port = 3001
const cors = require('cors')
const loginCl = new loginRegisterClass();
const jobsCl = new jobsClass();
const sessionCl = new sessionClass();
const activitiesCl = new activitiesClass();
const groupCl = new groupClass();
const sittingsCl = new sittingsClass();
app.use(cors());

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mofid"
});

con.connect(function (err) {
  if (err) throw err;
  app.get('/checkUserAndPassword', (req, res) => {
    loginCl.validateUserAndPassword(req.query.userid, req.query.passwd, res, con);
  })

  app.get('/register', (req, res) => {
    loginCl.register(req.query.username, req.query.password, req.query.name, req.query.email, res, con);
  })

  app.get('/login', (req, res) => {
    loginCl.login(req.query.username, req.query.password, res, con);
  })

  app.get('/getTodayTasks', (req, res) => {
    jobsCl.getTodayTasks(req.query.userid, req.query.passwd, res, con);
  })
  app.get('/removeTodayTask', (req, res) => {
    jobsCl.removeTodayTask(req.query.userid, req.query.passwd, req.query.name, req.query.date, res, con);
  })

  app.get('/getJobs', (req, res) => {
    jobsCl.getJobs(req.query.userid, req.query.passwd, res, con);
  })

  app.get('/forgetPassword', (req, res) => {
    loginCl.sendForgetPassword(req.query.email, res, con);
  })

  app.get('/startSession', (req, res) => {
    sessionCl.startSession(req.query.userid, req.query.passwd, req.query.job, res, con);
  })

  app.get('/checkSession', (req, res) => {
    sessionCl.checkSession(req.query.userid, req.query.passwd, res, con);
  })

  app.get('/removeSession', (req, res) => {
    sessionCl.removeSession(req.query.userid, req.query.passwd, res, con);
  })

  app.get('/saveSession', (req, res) => {
    sessionCl.saveSession(req.query.userid, req.query.passwd, res, con);
  })

  app.get('/editSaveSession', (req, res) => {
    sessionCl.editSaveSession(req.query.userid, req.query.passwd, req.query.hour, req.query.minute, res, con);
  })

  app.get('/getGroupScoreList', (req, res) => {
    groupCl.getGroupScoreList(req.query.userid, req.query.passwd, res, con);
  })

  app.get('/getPersonHistory', (req, res) => {
    activitiesCl.getPersonHistory(req.query.userid, req.query.passwd, res, con);
  })

  app.get('/getJobsList', (req, res) => {
    jobsCl.getJobsList(req.query.userid, req.query.passwd, res, con);
  })

  app.get('/addNewJob', (req, res) => {
    jobsCl.addNewJob(req.query.userid, req.query.passwd, req.query.job, req.query.group, res, con);
  })

  app.get('/deleteJob', (req, res) => {
    jobsCl.deleteJob(req.query.userid, req.query.passwd, req.query.job, res, con);
  })

  app.get('/addNewTask', (req, res) => {
    jobsCl.addNewTask(req.query.userid, req.query.passwd, req.query.task, req.query.date, res, con);
  })

  app.get('/getTasksList', (req, res) => {
    jobsCl.getTasksList(req.query.userid, req.query.passwd, res, con);
  })

  app.get('/deleteTask', (req, res) => {
    jobsCl.deleteTask(req.query.userid, req.query.passwd, req.query.task, req.query.date, res, con);
  })

  app.get('/createGroup', (req, res) => {
    groupCl.createGroup(req.query.userid, req.query.passwd, req.query.name, res, con);
  })

  app.get('/joinGroup', (req, res) => {
    groupCl.joinGroup(req.query.userid, req.query.passwd, req.query.code, res, con);
  })

  app.get('/isInGroup', (req, res) => {
    groupCl.isInGroup(req.query.userid, req.query.passwd, res, con);
  })

  app.get('/getFullGroupScoreList', (req, res) => {
    groupCl.getFullGroupScoreList(req.query.userid, req.query.passwd, res, con);
  })

  app.get('/changePassword', (req, res) => {
    sittingsCl.changePassword(req.query.userid, req.query.passwd, req.query.oldpassword, req.query.newpassword, res, con);
  })

  app.get('/getEmail', (req, res) => {
    sittingsCl.getEmail(req.query.userid, req.query.passwd, res, con);
  })

  app.get('/changeEmail', (req, res) => {
    sittingsCl.changeEmail(req.query.userid, req.query.passwd, req.query.email, res, con);
  })

  app.get('/isGroupAdmin', (req, res) => {
    groupCl.isGroupAdmin(req.query.userid, req.query.passwd, res, con);
  })

  app.get('/changePasswordRecovery', (req, res) => {
    loginCl.changePassword(req.query.passwd, req.query.uniqeid, res, con);
  })

  app.get('/exitGroup', (req, res) => {
    groupCl.exitGroup(req.query.userid, req.query.passwd, res, con);
  })

  app.get('/changeGroupCode', (req, res) => {
    groupCl.changeGroupCode(req.query.userid, req.query.passwd, res, con);
  })

  let twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  let twoDaysAgoDate = (new Intl.DateTimeFormat('en-US-u-ca-persian', { year: 'numeric' }).format(twoDaysAgo)).slice(0, 4) + "-" + (new Intl.DateTimeFormat('en-US-u-ca-persian', { month: '2-digit' }).format(twoDaysAgo)) + "-" + (new Intl.DateTimeFormat('en-US-u-ca-persian', { day: '2-digit' }).format(twoDaysAgo));
  con.query("DELETE FROM passrecovery WHERE date <= '" + twoDaysAgoDate + "'", function (err, result) {
    if (err) throw err;
  });
  setInterval(() => {
    let twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    let twoDaysAgoDate = (new Intl.DateTimeFormat('en-US-u-ca-persian', { year: 'numeric' }).format(twoDaysAgo)).slice(0, 4) + "-" + (new Intl.DateTimeFormat('en-US-u-ca-persian', { month: '2-digit' }).format(twoDaysAgo)) + "-" + (new Intl.DateTimeFormat('en-US-u-ca-persian', { day: '2-digit' }).format(twoDaysAgo));
    con.query("DELETE FROM passrecovery WHERE date <= '" + twoDaysAgoDate + "'", function (err, result) {
      if (err) throw err;
    });
  }, 86400000)

  app.get('/testlop', (req, res) => {

    // con.query("UPDATE users SET groupid = '" + "sfsFhSUN" + "' WHERE username = '" + "pooyak" + "'", function (err, result4) {
    //   if (err) throw err;
    // });

    // let owner = "mamad";
    // let showName = "محمد";
    // let groupid = "sfsFhSUN";
    // let date = new Date();
    // let job = "Test";
    // let time = "06:30";
    // let duration = "01:27";
    // let durationMs = 5220000;
    // let todayDate = (new Intl.DateTimeFormat('en-US-u-ca-persian', {year: 'numeric'}).format(date)).slice(0,4) + "-" + (new Intl.DateTimeFormat('en-US-u-ca-persian', {month: '2-digit'}).format(date)) + "-" + (new Intl.DateTimeFormat('en-US-u-ca-persian', {day: '2-digit'}).format(date));
    // con.query("INSERT INTO activities (owner, showname, groupid, job, date, time, timems, duration, durationms) VALUES ('" + owner + "', '" + showName + "', '" + groupid + "', '" + job + "', '" + todayDate + "', '" + time + "', '" + date.getTime() + "', '" + duration + "', '" + durationMs + "')", function (err, result4) {
    //   if (err) throw err;
    // });
    // res.send("anjam shod");
    // fs.readFile('mofidhistory.txt', 'utf8', (err, data) => {
    //   if (err) {
    //     console.error(err);
    //     return;
    //   }
    //   let dataa = JSON.parse(data)
    //   let owner = "sobhan3000";
    //   let showName = "سبحان";
    //   let groupid = "sfsFhSUN";
    //   for (const a in dataa['2d550f26f89833b06f8c7c58192d5fc5f8e088c5']['mofidPerDay']) {
    //     for (let i = 0; i < dataa['2d550f26f89833b06f8c7c58192d5fc5f8e088c5']['mofidPerDay'][a].length; i++) {
    //       let hour = Math.floor(Number(dataa['2d550f26f89833b06f8c7c58192d5fc5f8e088c5']['mofidPerDay'][a][i]['startHour']));
    //       let minute = Math.floor(Number(dataa['2d550f26f89833b06f8c7c58192d5fc5f8e088c5']['mofidPerDay'][a][i]['startMinute']));
    //       let timeHourText = String(hour);
    //       if(hour < 10) {
    //         timeHourText = "0" + timeHourText;
    //       }
    //       let timeMinuteText = String(minute);
    //       if(minute < 10) {
    //         timeMinuteText = "0" + timeMinuteText;
    //       }
    //       let time = timeHourText + ":" + timeMinuteText;
    //       let hourD = Math.floor(Number(dataa['2d550f26f89833b06f8c7c58192d5fc5f8e088c5']['mofidPerDay'][a][i]['hourDuration']));
    //       let minuteD = Math.floor(Number(dataa['2d550f26f89833b06f8c7c58192d5fc5f8e088c5']['mofidPerDay'][a][i]['minutesDuration']));
    //       let timeHourDText = String(hourD);
    //       if(hourD < 10) {
    //         timeHourDText = "0" + timeHourDText;
    //       }
    //       let timeMinuteDText = String(minuteD);
    //       if(minuteD < 10) {
    //         timeMinuteDText = "0" + timeMinuteDText;
    //       }
    //       let duration = timeHourDText + ":" + timeMinuteDText;
    //       let durationMs = ((hourD * 60) + minuteD) * 60 * 1000;
    //       let dateSplit = a.split("-");
    //       let date = new Date(Number(dateSplit[0]), Number(dateSplit[1]), Number(dateSplit[2]), hour, minute);
    //       let job = dataa['2d550f26f89833b06f8c7c58192d5fc5f8e088c5']['mofidPerDay'][a][i]['task'];
    //       let todayDate = (new Intl.DateTimeFormat('en-US-u-ca-persian', {year: 'numeric'}).format(date)).slice(0,4) + "-" + (new Intl.DateTimeFormat('en-US-u-ca-persian', {month: '2-digit'}).format(date)) + "-" + (new Intl.DateTimeFormat('en-US-u-ca-persian', {day: '2-digit'}).format(date));
    //       con.query("INSERT INTO activities (owner, showname, groupid, job, date, time, timems, duration, durationms) VALUES ('" + owner + "', '" + showName + "', '" + groupid + "', '" + job + "', '" + todayDate + "', '" + time + "', '" + date.getTime() + "', '" + duration + "', '" + durationMs + "')", function (err, result4) {
    //         if (err) throw err;
    //       });
    //     }
    //   }
    //   res.send(dataa['2d550f26f89833b06f8c7c58192d5fc5f8e088c5']['mofidPerDay']);
    // });
  })
});


app.listen(port, () => {
  console.log(`mofid-server listening on port ${port}`)
})