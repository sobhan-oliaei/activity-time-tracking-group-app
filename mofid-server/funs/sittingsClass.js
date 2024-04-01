const CryptoJS = require("crypto-js");

/**
* A class containing functions related to sittings
*/
module.exports = class sittingsClass {
  /**
  * A function that change user's password
  */
  changePassword(userid, passwd, oldpassword, newpassword, res, con) {
    con.query("SELECT password FROM users WHERE username = '" + userid + "'", function (err, result) {
      if (err) throw err;
      if (result[0]) {
        if (result[0]['password']) {
          if (result[0]['password'] == passwd) {
            if (result[0]['password'] == CryptoJS.HmacSHA1(oldpassword, "sobhani3sgood").toString()) {
              let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
              if (regex.test(String(newpassword))) {
                con.query("UPDATE users SET password = '" + CryptoJS.HmacSHA1(newpassword, "sobhani3sgood").toString() + "' WHERE username = '" + userid + "'", function (err, result2) {
                  if (err) throw err;
                  if (result2.affectedRows >= 1) {
                    res.send({ msg: "true" });
                  }
                  else {
                    res.send({ msg: "something went wrong" });
                  }
                });
              }
              else {
                res.send({ msg: "wrong password" });
              }
            }
            else {
              res.send({ msg: "lie password" });
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
  * A function that change user's email
  */
  changeEmail(userid, passwd, email, res, con) {
    con.query("SELECT password FROM users WHERE username = '" + userid + "'", function (err, result) {
      if (err) throw err;
      if (result[0]) {
        if (result[0]['password']) {
          if (result[0]['password'] == passwd) {
            if (String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
              con.query("SELECT id FROM users WHERE email = '" + email + "'", function (err, result2) {
                if (err) throw err;
                if (!result2[0]) {
                  con.query("UPDATE users SET email = '" + email + "' WHERE username = '" + userid + "'", function (err, result3) {
                    if (err) throw err;
                    if (result3.affectedRows >= 1) {
                      res.send({ msg: "true" });
                    }
                    else {
                      res.send({ msg: "something went wrong" });
                    }
                  });
                }
                else {
                  res.send({ msg: "email already exist" });
                }
              });
            }
            else {
              res.send({ msg: "wrong email" });
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
  * A function returns user's email
  */
  getEmail(userid, passwd, res, con) {
    con.query("SELECT password, email FROM users WHERE username = '" + userid + "'", function (err, result) {
      if (err) throw err;
      if (result[0]) {
        if (result[0]['password']) {
          if (result[0]['password'] == passwd) {
            res.send({ msg: "true", email: result[0]['email'] });
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