import axios from 'axios';
import addresses from './addresses';
import basicClass from './basicClass';

/**
* A class containing the function of displaying user activities
*/
export default class activitiesClass {
    /**
    * A function of displaying user activities
    */
    setPersonHistoryStateActivities(cookies, setHistory, setSubDivDate) {
        const addr = new addresses();
        const basicCl = new basicClass();
        axios
            .get(addr.serverAddress + ':3001/getPersonHistory?' + new URLSearchParams({ userid: cookies.userid, passwd: cookies.passwd }).toString())
            .then(res => {
                let data = res.data;
                if (data['msg'] == "true") {
                    let dailyData = data['history'];
                    let weeklyData = [];
                    let weeklyCounter = 0;
                    let weekTimeLoop = "";
                    let isFirstWeek = true;
                    for (let i = 0; i < dailyData.length; i++) {
                        if (isFirstWeek) {
                            let isWeek = true;
                            let m = 0;
                            while (isWeek) {
                                if (dailyData[i][0] >= basicCl.changePersianDate(data['firstDayOfWeek'], 0, 0, 7 * m, "reduce")) {
                                    weekTimeLoop = basicCl.changePersianDate(data['firstDayOfWeek'], 0, 0, 7 * m, "reduce");
                                    isWeek = false;
                                }
                                m = m + 1;
                            }
                            weeklyData[weeklyCounter] = [];
                            weeklyData[weeklyCounter][0] = weekTimeLoop;
                            weeklyData[weeklyCounter][1] = [];
                            weeklyData[weeklyCounter][2] = basicCl.changePersianDate(weekTimeLoop, 0, 0, 7 * m, "add");
                            isFirstWeek = false;
                        }
                        if (dailyData[i][0] < weekTimeLoop) {
                            weeklyCounter = weeklyCounter + 1;
                            let isWeek = true;
                            let m = 0;
                            while (isWeek) {
                                if (dailyData[i][0] >= basicCl.changePersianDate(data['firstDayOfWeek'], 0, 0, 7 * m, "reduce")) {
                                    weekTimeLoop = basicCl.changePersianDate(data['firstDayOfWeek'], 0, 0, 7 * m, "reduce");
                                    isWeek = false;
                                }
                                m = m + 1;
                            }
                            weeklyData[weeklyCounter] = [];
                            weeklyData[weeklyCounter][0] = weekTimeLoop;
                            weeklyData[weeklyCounter][1] = [];
                            weeklyData[weeklyCounter][2] = basicCl.changePersianDate(weekTimeLoop, 0, 0, 7 * m, "add");
                        }
                        for (let m = 0; m < dailyData[i][1].length; m++) {
                            let isThereCounter = 0;
                            for (let j = 0; j < weeklyData[weeklyCounter][1].length; j++) {
                                if (dailyData[i][1][m][0] == weeklyData[weeklyCounter][1][j][0]) {
                                    weeklyData[weeklyCounter][1][j][1] = weeklyData[weeklyCounter][1][j][1] + dailyData[i][1][m][1];
                                }
                                else {
                                    isThereCounter = isThereCounter + 1;
                                }
                            }
                            if (isThereCounter >= weeklyData[weeklyCounter][1].length) {
                                weeklyData[weeklyCounter][1].push([dailyData[i][1][m][0], dailyData[i][1][m][1]]);
                            }
                        }
                        dailyData[i][2] = basicCl.dayOfWeakInString(dailyData[i][0], weekTimeLoop);
                    }
                    let monthlyData = [];
                    let monthlyCounter = 0;
                    let monthTimeLoop = "";
                    let isFirstMonth = true;
                    for (let i = 0; i < dailyData.length; i++) {
                        if (isFirstMonth) {
                            monthTimeLoop = dailyData[i][0].slice(0, 8) + "01";
                            monthlyData[monthlyCounter] = [];
                            monthlyData[monthlyCounter][0] = monthTimeLoop;
                            monthlyData[monthlyCounter][1] = [];
                            monthlyData[monthlyCounter][2] = basicCl.changePersianDate(basicCl.changePersianDate(monthTimeLoop, 0, 1, 0, "add"), 0, 0, 1, "reduce");
                            isFirstMonth = false;
                        }
                        if (dailyData[i][0] < monthTimeLoop) {
                            monthlyCounter = monthlyCounter + 1;
                            monthTimeLoop = dailyData[i][0].slice(0, 8) + "01";
                            monthlyData[monthlyCounter] = [];
                            monthlyData[monthlyCounter][0] = monthTimeLoop;
                            monthlyData[monthlyCounter][1] = [];
                            monthlyData[monthlyCounter][2] = basicCl.changePersianDate(basicCl.changePersianDate(monthTimeLoop, 0, 1, 0, "add"), 0, 0, 1, "reduce");
                        }
                        for (let m = 0; m < dailyData[i][1].length; m++) {
                            let isThereCounter = 0;
                            for (let j = 0; j < monthlyData[monthlyCounter][1].length; j++) {
                                if (dailyData[i][1][m][0] == monthlyData[monthlyCounter][1][j][0]) {
                                    monthlyData[monthlyCounter][1][j][1] = monthlyData[monthlyCounter][1][j][1] + dailyData[i][1][m][1];
                                }
                                else {
                                    isThereCounter = isThereCounter + 1;
                                }
                            }
                            if (isThereCounter >= monthlyData[monthlyCounter][1].length) {
                                monthlyData[monthlyCounter][1].push([dailyData[i][1][m][0], dailyData[i][1][m][1]]);
                            }
                        }

                    }
                    for (let i = 0; i < dailyData.length; i++) {
                        dailyData[i][1].sort((a, b) => {
                            return b[1] - a[1];
                        });
                    }
                    for (let i = 0; i < weeklyData.length; i++) {
                        weeklyData[i][1].sort((a, b) => {
                            return b[1] - a[1];
                        });
                    }
                    for (let i = 0; i < monthlyData.length; i++) {
                        monthlyData[i][1].sort((a, b) => {
                            return b[1] - a[1];
                        });
                    }
                    for (let i = 0; i < dailyData.length; i++) {
                        dailyData[i][1] = dailyData[i][1].map((item, index) => {
                            let hours = Math.floor(Number(item[1]) / 60);
                            let minutes = Number(item[1]) - (hours * 60);
                            return [item[0], hours, minutes];
                        });
                    }
                    for (let i = 0; i < weeklyData.length; i++) {
                        weeklyData[i][1] = weeklyData[i][1].map((item, index) => {
                            let hours = Math.floor(Number(item[1]) / 60);
                            let minutes = Number(item[1]) - (hours * 60);
                            return [item[0], hours, minutes];
                        });
                    }
                    for (let i = 0; i < monthlyData.length; i++) {
                        monthlyData[i][1] = monthlyData[i][1].map((item, index) => {
                            let hours = Math.floor(Number(item[1]) / 60);
                            let minutes = Number(item[1]) - (hours * 60);
                            return [item[0], hours, minutes];
                        });
                    }
                    dailyData.push(["", []]);
                    weeklyData.push(["", []]);
                    monthlyData.push(["", []]);
                    setSubDivDate({ day: dailyData[0][0], week: weeklyData[0][0], month: monthlyData[0][0] });
                    setHistory({ day: dailyData, month: monthlyData, week: weeklyData });
                }
            });
    }
}