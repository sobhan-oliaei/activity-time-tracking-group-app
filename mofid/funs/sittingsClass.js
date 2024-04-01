import axios from 'axios';
import addresses from './addresses';

/**
* A class containing the user sessions functions of app
*/
export default class sittingsClass {

    /**
    * A function to changes the user's password
    */
    changePassword(cookies, oldPassword, newPassword, newPassword2, setOldPassword, setNewPassword, setNewPassword2, setChangePasswordPageDisplay) {
        let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (regex.test(String(newPassword))) {
            if (newPassword == newPassword2) {
                const addr = new addresses();
                axios
                    .get(addr.serverAddress + ':3001/changePassword?' + new URLSearchParams({ userid: cookies.userid, passwd: cookies.passwd, oldpassword: oldPassword, newpassword: newPassword }).toString())
                    .then(res => {
                        let data = res.data;
                        if (data['msg'] == "true") {
                            setOldPassword("");
                            setNewPassword("");
                            setNewPassword2("");
                            setChangePasswordPageDisplay("none");
                        }
                        else if (data['msg'] == "lie password") {
                            alert("رمز عبور قدیمی خود را اشتباه وارد کرده اید");
                        }
                    });
            }
            else {
                alert("رمز عبور جدید با تکرار آن مشابه نیست");
            }
        }
        else {
            alert("رمز عبور باید شامل حداقل 8 کاراکتر و یک حرف بزرگ و کوچک و علامت خاص باشد");
        }
    }

    /**
    * A function to displays the user's email
    */
    setOldEmailStateSittings(cookies, setOldEmail) {
        const addr = new addresses();
        axios
            .get(addr.serverAddress + ':3001/getEmail?' + new URLSearchParams({ userid: cookies.userid, passwd: cookies.passwd }).toString())
            .then(res => {
                let data = res.data;
                if (data['msg'] == "true") {
                    setOldEmail(data['email']);
                }
            });
    }

    /**
    * A function to changes the user's email
    */
    changeEmail(cookies, email, email2, setEmail, setEmail2, setChangeEmailPageDisplay) {
        if (String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            if (email == email2) {
                const addr = new addresses();
                axios
                    .get(addr.serverAddress + ':3001/changeEmail?' + new URLSearchParams({ userid: cookies.userid, passwd: cookies.passwd, email: email }).toString())
                    .then(res => {
                        let data = res.data;
                        if (data['msg'] == "true") {
                            setEmail("");
                            setEmail2("");
                            setChangeEmailPageDisplay("none");
                        }
                        else if (data['msg'] == "email already exist") {
                            alert("ایمیل وارد شده قبلا ثبت شده است");
                        }
                    });
            }
        }
    }
}