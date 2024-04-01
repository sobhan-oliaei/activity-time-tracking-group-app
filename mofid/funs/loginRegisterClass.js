import axios from 'axios';
import addresses from './addresses';

/**
* A class containing the login and register functions of app
*/
export default class loginRegisterClass {
  /**
  * A function that checks if the user is logged in or not
  */
  isLogged(cookies, router) {
    if (cookies.userid && cookies.passwd) {
      const addr = new addresses();
      axios
        .get(addr.serverAddress + ':3001/checkUserAndPassword?' + new URLSearchParams({ userid: cookies.userid, passwd: cookies.passwd }).toString())
        .then(res => {
          let data = res.data;
          if (data['msg'] == "true") {
            router.push('/home');
          }
        }).catch(err => {
          if (err.message == "Network Error") {
            alert("اتصال به سرور برقرار نشد.\nلطفا اتصال اینترنت خود را بررسی کنید");
          }
        });
    }
  }

  /**
  * A function that registers the user
  */
  register(username, password, password2, name, email, email2, setRegisterDivDisplay, setLoginDivDisplay, setUsernameField, setPasswordField, setNameField, setPassword2Field, setEmailField, setEmail2Field) {
    let validationScore = 0;
    let validationArray = [0, 0, 0, 0, 0];
    if (String(username).match(/^[A-Za-z0-9]*$/)) {
      if (String(username).length > 3 && String(username).length < 20) {
        validationScore = validationScore + 1;
        validationArray[0] = 1;
      }
    }
    let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (regex.test(String(password))) {
      validationScore = validationScore + 1;
      validationArray[1] = 1;
    }
    if (String(password) == String(password2)) {
      validationScore = validationScore + 1;
      validationArray[2] = 1;
    }
    if (String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
      validationScore = validationScore + 1;
      validationArray[3] = 1;
    }
    if (String(email) == String(email2)) {
      validationScore = validationScore + 1;
      validationArray[4] = 1;
    }
    if (validationScore == 5) {
      const addr = new addresses();
      axios
        .get(addr.serverAddress + ':3001/register?' + new URLSearchParams({ username: String(username), password: String(password), name: String(name), email: String(email) }).toString())
        .then(res => {
          let data = res.data;
          if (data['msg'] == "true") {
            setRegisterDivDisplay("none");
            setLoginDivDisplay("block");
            setUsernameField('');
            setPasswordField('');
            setNameField('');
            setPassword2Field('');
            setEmailField('');
            setEmail2Field('');
            alert("ثبت نام با موفقیت انجام شد لطفا وارد شوید");
          }
          else if (data['msg'] == "username already exist") {
            alert("نام کاربری یا ایمیل یا نام نمایشی قبلا ثبت شده است");
          }
        });
    }
    else {
      let validationMsg = "";
      if (validationArray[0] == 0) {
        validationMsg = validationMsg + "*نام کاربری باید فقط متشکل از اعداد و حروف باشد" + "\n\n";
      }
      if (validationArray[1] == 0) {
        validationMsg = validationMsg + "*رمز عبور باید شامل حداقل 8 کاراکتر و یک حرف بزرگ و کوچک و علامت خاص باشد" + "\n\n";
      }
      if (validationArray[2] == 0) {
        validationMsg = validationMsg + "*رمز عبور باید با تکرار آن مشابه باشد" + "\n\n";
      }
      if (validationArray[3] == 0) {
        validationMsg = validationMsg + "*ایمیل را به طور صحیح وارد کنید" + "\n\n";
      }
      if (validationArray[4] == 0) {
        validationMsg = validationMsg + "*ایمیل باید با تکرار آن مشابه باشد" + "\n\n";
      }
      alert(validationMsg);
    }
  }

  /**
  * A function that logins the user
  */
  login(username, password, router, setCookie) {
    if (String(username).match(/^[A-Za-z0-9]*$/)) {
      let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (regex.test(String(password))) {
        const addr = new addresses();
        axios
          .get(addr.serverAddress + ':3001/login?' + new URLSearchParams({ username: String(username), password: String(password) }).toString())
          .then(res => {
            let data = res.data;
            if (data['msg'] == "true") {
              setCookie("userid", data['userid'], { maxAge: 1209600 });
              setCookie("passwd", data['passwd'], { maxAge: 1209600 });
              router.push('/home');
            }
            else if (data['msg'] == "wrong username") {
              alert("نام کاربری اشتباه است");
            }
            else if (data['msg'] == "wrong password") {
              alert("رمز عبور اشتباه است");
            }
          });
      }
    }
  }

  /**
  * A function that recovers user's password account
  */
  forgetPassword(email, setEmailField, setLoginDivDisplay, setForgetPasswordDivDisplay) {
    if (String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
      const addr = new addresses();
      axios
        .get(addr.serverAddress + ':3001/forgetPassword?' + new URLSearchParams({ email: String(email) }).toString())
        .then(res => {
          let data = res.data;
          if (data['msg'] == "true") {
            setEmailField("");
            setForgetPasswordDivDisplay("none");
            setLoginDivDisplay("block");
            alert("ایمیل بازیابی رمز عبور با موفقیت برای شما ارسال شد (اسپم را چک کنید)");
          }
          else if (data['msg'] == "sended before") {
            setEmailField("");
            alert("در 48 ساعت گذشته یک لینک بازیابی برای شما ارسال شده است");
          }
          else if (data['msg'] == "wrong email") {
            setEmailField("");
            alert("این ایمیل ثبت نشده است");
          }
        });
    }
    else { alert("ایمیل اشتباه وارد شده است") }
  }

  /**
  * A function that changes user's password account
  */
  changePassword(router, passwordField, password2Field) {
    let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (regex.test(String(passwordField))) {
      if (passwordField == password2Field) {
        const addr = new addresses();
        axios
          .get(addr.serverAddress + ':3001/changePasswordRecovery?' + new URLSearchParams({ passwd: passwordField, uniqeid: router.query.uniqeid }).toString())
          .then(res => {
            let data = res.data;
            if (data['msg'] == "true") {
              alert("رمز عبور با موفقیت تغییر یافت");
              router.push('/');
            }
            else if (data['msg'] == "wrong uniqeid") {
              alert("لینک شما فاقد اعتبار است");
              router.push('/');
            }
          });
      }
      else {
        alert("رمز عبور با تکرار آن مشابه نیست");
      }
    }
    else {
      alert("رمز عبور باید شامل حداقل 8 کاراکتر و یک حرف بزرگ و کوچک و علامت خاص باشد")
    }
  }
}