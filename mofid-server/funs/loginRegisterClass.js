const CryptoJS = require("crypto-js");
const mailtrap = require("mailtrap");

/**
* A class containing functions related to login and register
*/
module.exports = class loginRegisterClass {
  /**
  * A function that verfy if the username and password is correct or not
  */
  validateUserAndPassword(userid, passwd, res, con) {
    con.query("SELECT password FROM users WHERE username = '" + userid + "'", function (err, result) {
      if (err) throw err;
      if (result[0]) {
        if (result[0]['password']) {
          if (result[0]['password'] == passwd) {
            res.send({ msg: "true" });
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
  * A function that register a user
  */
  register(username, password, name, email, res, con) {
    if (String(username).match(/^[A-Za-z0-9]*$/)) {
      let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (regex.test(String(password))) {
        if (String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
          con.query("SELECT id FROM users WHERE username = '" + username + "' OR email = '" + email + "' OR showname = '" + name + "'", function (err, result) {
            if (err) throw err;
            if (!result[0]) {
              let sql = "INSERT INTO users (username, password, showname, email, groupid) VALUES ('" + username + "', '" + CryptoJS.HmacSHA1(password, "sobhani3sgood").toString() + "', '" + name + "', '" + email + "', '')";
              con.query(sql, function (err, result) {
                if (err) throw err;
                res.send({ msg: "true" });
              });
            }
            else {
              res.send({ msg: "username already exist" });
            }
          });
        }
        else {
          res.send({ msg: "wrong email" });
        }
      }
      else {
        res.send({ msg: "wrong password" });
      }
    }
    else {
      res.send({ msg: "wrong username" });
    }
  }
  /**
  * A function that login the user
  */
  login(username, password, res, con) {
    if (String(username).match(/^[A-Za-z0-9]*$/)) {
      let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (regex.test(String(password))) {
        con.query("SELECT password FROM users WHERE username = '" + username + "'", function (err, result) {
          if (err) throw err;
          if (result[0]) {
            if (result[0]['password']) {
              if (result[0]['password'] == CryptoJS.HmacSHA1(password, "sobhani3sgood").toString()) {
                res.send({ msg: "true", userid: username, passwd: result[0]['password'] });
              }
              else {
                res.send({ msg: "wrong password" });
              }
            }
            else {
              res.send({ msg: "wrong username" });
            }
          }
          else {
            res.send({ msg: "wrong username" });
          }
        });
      }
      else {
        res.send({ msg: "wrong password" });
      }
    }
    else {
      res.send({ msg: "wrong username" });
    }
  }

  /**
  * A function that send a forget password email to user
  */
  sendForgetPassword(email, res, con) {
    if (String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
      con.query("SELECT password FROM users WHERE email = '" + email + "'", function (err, result) {
        if (err) throw err;
        if (result[0]) {
          if (result[0]['password']) {
            con.query("SELECT email FROM passrecovery WHERE email = '" + email + "'", function (err, result2) {
              if (err) throw err;
              if (!result2[0]) {
                let newUniqeId = CryptoJS.HmacSHA1(result[0]['password'].slice(0, 10) + String(Math.random() * (999999 - 9999) + 9999), "sobhani3sgood").toString();
                let callbackLink = 'http://mofidshim.ir/forgetPassword?' + new URLSearchParams({ uniqeid: newUniqeId }).toString();
                const TOKEN = "a2e5e9663b7bf640b2a89b6a5d68ab6c";
                const SENDER_EMAIL = "mailtrap@mofidshim.ir";
                const RECIPIENT_EMAIL = email;

                const client = new mailtrap.MailtrapClient({ token: TOKEN });

                const sender = { name: "mofidshim app", email: SENDER_EMAIL };

                client
                  .send({
                    from: sender,
                    to: [{ email: RECIPIENT_EMAIL }],
                    subject: "password recovery",
                    text: callbackLink,
                  })
                  .then(() => {
                    let today = new Date();
                    let todayDate = (new Intl.DateTimeFormat('en-US-u-ca-persian', { year: 'numeric' }).format(today)).slice(0, 4) + "-" + (new Intl.DateTimeFormat('en-US-u-ca-persian', { month: '2-digit' }).format(today)) + "-" + (new Intl.DateTimeFormat('en-US-u-ca-persian', { day: '2-digit' }).format(today));
                    let sql = "INSERT INTO passrecovery (uniqeid, email, date) VALUES ('" + newUniqeId + "', '" + email + "', '" + todayDate + "')";
                    con.query(sql, function (err, result) {
                      if (err) throw err;
                      res.send({ msg: "true" });
                    });
                  })
                  .catch(console.error);
              }
              else {
                res.send({ msg: "sended before" });
              }
            });
          }
          else {
            res.send({ msg: "wrong email" });
          }
        }
        else {
          res.send({ msg: "wrong email" });
        }
      });
    }
    else {
      res.send({ msg: "wrong email" });
    }
  }
  /**
  * A function that changes user's password
  */
  changePassword(passwd, uniqeid, res, con) {
    con.query("SELECT email FROM passrecovery WHERE uniqeid = '" + uniqeid + "'", function (err, result) {
      if (err) throw err;
      if (result[0]) {
        con.query("UPDATE users SET password = '" + CryptoJS.HmacSHA1(passwd, "sobhani3sgood").toString() + "' WHERE email = '" + result[0]['email'] + "'", function (err, result2) {
          if (err) throw err;
          if (result2.affectedRows >= 1) {
            con.query("DELETE FROM passrecovery WHERE uniqeid = '" + uniqeid + "'", function (err, result2) {
              if (err) throw err;
              if (result2.affectedRows >= 1) {
                res.send({ msg: "true" });
              }
            });
          }
        });
      }
      else {
        res.send({ msg: "wrong uniqeid" });
      }
    });
  }
}