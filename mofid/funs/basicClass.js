import axios from 'axios';
import addresses from './addresses';

/**
* A class containing the basic functions app
*/
export default class basicClass {
  /**
  * A function that checks the user's login status
  */
  isLogged(cookies, router) {
    if (cookies.userid && cookies.passwd) {
      const addr = new addresses();
      axios
        .get(addr.serverAddress + ':3001/checkUserAndPassword?' + new URLSearchParams({ userid: cookies.userid, passwd: cookies.passwd }).toString())
        .then(res => {
          let data = res.data;
          if (data['msg'] != "true") {
            router.push('/');
          }
        }).catch(err => {
          if (err.message == "Network Error") {
            alert("اتصال به سرور برقرار نشد.\nلطفا اتصال اینترنت خود را بررسی کنید");
            router.push('/');
          }
        })
    }
    else {
      router.push('/');
    }
  }

  /**
  * A function to increment and decrement a Hijri date
  */
  changePersianDate(date, year, month, day, format) {
    let dateArray = date.split("-");
    if (format == "add") {
      dateArray[2] = Number(dateArray[2]) + day;
      let isDayBig = true;
      while (isDayBig) {
        if (dateArray[2] > 30 && Number(dateArray[1]) >= 7 && Number(dateArray[1]) < 12) {
          dateArray[2] = dateArray[2] - 30;
          dateArray[1] = Number(dateArray[1]) + 1;
        }
        else if (dateArray[2] > 31 && Number(dateArray[1]) <= 6) {
          dateArray[2] = dateArray[2] - 31;
          dateArray[1] = Number(dateArray[1]) + 1;
        }
        else if (dateArray[2] > 29 && Number(dateArray[1]) == 12) {
          dateArray[2] = dateArray[2] - 29;
          dateArray[1] = 1;
          dateArray[0] = Number(dateArray[0]) + 1;
        }
        else {
          isDayBig = false;
        }
      }
      dateArray[1] = Number(dateArray[1]) + month;
      while (dateArray[1] > 12) {
        dateArray[1] = dateArray[1] - 12;
        dateArray[0] = Number(dateArray[0]) + 1;
      }
      dateArray[0] = Number(dateArray[0]) + year;
    }
    else if (format == "reduce") {
      dateArray[2] = Number(dateArray[2]) - day;
      let isDayBig = true;
      while (isDayBig) {
        if (dateArray[2] <= 0 && Number(dateArray[1]) >= 8) {
          dateArray[2] = dateArray[2] + 30;
          dateArray[1] = Number(dateArray[1]) - 1;
        }
        else if (dateArray[2] <= 0 && Number(dateArray[1]) <= 7 && Number(dateArray[1]) > 1) {
          dateArray[2] = dateArray[2] + 31;
          dateArray[1] = Number(dateArray[1]) - 1;
        }
        else if (dateArray[2] <= 0 && Number(dateArray[1]) == 1) {
          dateArray[2] = dateArray[2] + 29;
          dateArray[1] = 12;
          dateArray[0] = Number(dateArray[0]) - 1;
        }
        else {
          isDayBig = false;
        }
      }
      dateArray[1] = Number(dateArray[1]) - month;
      while (dateArray[1] <= 0) {
        dateArray[1] = dateArray[1] + 12;
        dateArray[0] = Number(dateArray[0]) - 1;
      }
      dateArray[0] = Number(dateArray[0]) - year;
    }
    if (dateArray[2] < 10) {
      dateArray[2] = "0" + String(dateArray[2]);
    }
    else {
      dateArray[2] = String(dateArray[2]);
    }
    if (dateArray[1] < 10) {
      dateArray[1] = "0" + String(dateArray[1]);
    }
    else {
      dateArray[1] = String(dateArray[1]);
    }
    dateArray[0] = String(dateArray[0]);
    return dateArray[0] + "-" + dateArray[1] + "-" + dateArray[2];
  }

  /**
  * A function returns the day of weak in hijri
  */
  dayOfWeakInString(date, firstDayOfWeek) {
    let datee = date;
    let counter = 0;
    while (datee > firstDayOfWeek) {
      datee = this.changePersianDate(datee, 0, 0, 1, "reduce");
      counter = counter + 1;
    }
    switch (counter) {
      case 0:
        return "شنبه";
        break;
      case 1:
        return "یک شنبه";
        break;
      case 2:
        return "دوشنبه";
        break;
      case 3:
        return "سه شنبه";
        break;
      case 4:
        return "چهار شنبه";
        break;
      case 5:
        return "پنج شنبه";
        break;
      case 6:
        return "جمعه";
        break;
      default:
        return "نمیدانم";
        break;
    }
  }
}