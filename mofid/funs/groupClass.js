import axios from 'axios';
import addresses from './addresses';
import basicClass from './basicClass';

/**
* A class containing functions related to groups in app
*/
export default class groupClass {
    /**
    * A function to create a new group
    */
    createGroup(cookies, createGroupName, setCreateGroupPageDisplay, setOutGroupDivDisplay, setInGroupDivDisplay, setHistory, setGroupCode, setSubDivDate) {
        if (createGroupName.length > 4 && createGroupName.length < 25) {
            const addr = new addresses();
            axios
                .get(addr.serverAddress + ':3001/createGroup?' + new URLSearchParams({ userid: cookies.userid, passwd: cookies.passwd, name: createGroupName }).toString())
                .then(res => {
                    let data = res.data;
                    if (data['msg'] == "true") {
                        setCreateGroupPageDisplay("none");
                        setOutGroupDivDisplay("none");
                        this.isInGroupGroup(cookies, setOutGroupDivDisplay, setInGroupDivDisplay, setHistory, setGroupCode, setSubDivDate);
                    }
                    else if (data['msg'] == "group name already exist") {
                        alert("نام گروه از قبل ثبت شده است");
                    }
                    else if (data['msg'] == "codestr already exist") {
                        alert("لطفا مجدد تلاش کنید");
                    }
                    else if (data['msg'] == "group created but you didnt joined") {
                        alert("گروه ساخته شد اما برای شما ثبت نشد. لطفا با پشتیبانی تماس بگیرید");
                    }
                });
        }
        else {
            alert("نام گروه باید بین 5 تا 24 حرف باشه");
        }
    }

    /**
    * A function to join a group
    */
    joinGroup(cookies, joinGroupCode, setJoinGroupPageDisplay, setOutGroupDivDisplay, setInGroupDivDisplay, setHistory, setGroupCode, setSubDivDate) {
        if (joinGroupCode.length == 8) {
            const addr = new addresses();
            axios
                .get(addr.serverAddress + ':3001/joinGroup?' + new URLSearchParams({ userid: cookies.userid, passwd: cookies.passwd, code: joinGroupCode }).toString())
                .then(res => {
                    let data = res.data;
                    if (data['msg'] == "true") {
                        setJoinGroupPageDisplay("none");
                        setOutGroupDivDisplay("none");
                        this.isInGroupGroup(cookies, setOutGroupDivDisplay, setInGroupDivDisplay, setHistory, setGroupCode, setSubDivDate);
                    }
                    else if (data['msg'] == "no group found") {
                        alert("گروهی با این کد یافت نشد");
                    }
                });
        }
        else {
            alert("کد گروه باید 8 کاراکتر داشته باشد");
        }
    }

    /**
    * A function that checks a user is in group or not
    */
    isInGroupGroup(cookies, setOutGroupDivDisplay, setInGroupDivDisplay, setHistory, setGroupCode, setSubDivDate) {
        const addr = new addresses();
        axios
            .get(addr.serverAddress + ':3001/isInGroup?' + new URLSearchParams({ userid: cookies.userid, passwd: cookies.passwd }).toString())
            .then(res => {
                let data = res.data;
                if (data['msg'] == "true") {
                    if (data['group'] == "yes") {
                        setInGroupDivDisplay("block");
                        this.setGroupHistoryStateGroup(cookies, setHistory, setSubDivDate);
                        setGroupCode(data['groupCode']);
                    }
                    else {
                        setOutGroupDivDisplay("block");
                    }
                }
                else if (data['msg'] == "no group found") {
                    alert("گروهی که برای شما ثبت شده است دیگر وجود ندارد. لطفا با پشتیبانی تماس بگیرید");
                }
            });
    }

    /**
    * A function to display group scores on the main page of the app
    */
    setGroupScoreListStateHome(cookies, setGroupScoreList) {
        const addr = new addresses();
        axios
            .get(addr.serverAddress + ':3001/getGroupScoreList?' + new URLSearchParams({ userid: cookies.userid, passwd: cookies.passwd }).toString())
            .then(res => {
                let data = res.data;
                if (data['msg'] == "true") {
                    data['day'].sort((a, b) => Number(b[1]) - Number(a[1]));
                    for (let i = 0; i < data['day'].length; i++) {
                        data['day'][i][2] = Math.floor(Number(data['day'][i][1]) / 60);
                        data['day'][i][1] = Number(data['day'][i][1]) - (Number(data['day'][i][2]) * 60);
                    }
                    data['month'].sort((a, b) => Number(b[1]) - Number(a[1]));
                    for (let i = 0; i < data['month'].length; i++) {
                        data['month'][i][2] = Math.floor(Number(data['month'][i][1]) / 60);
                        data['month'][i][1] = Number(data['month'][i][1]) - (Number(data['month'][i][2]) * 60);
                    }
                    data['week'].sort((a, b) => Number(b[1]) - Number(a[1]));
                    for (let i = 0; i < data['week'].length; i++) {
                        data['week'][i][2] = Math.floor(Number(data['week'][i][1]) / 60);
                        data['week'][i][1] = Number(data['week'][i][1]) - (Number(data['week'][i][2]) * 60);
                    }
                    setGroupScoreList({ day: data['day'], month: data['month'], week: data['week'], onlines: data['online'] });
                }
            });
    }

    /**
    * A function to display group scores on the group page of the app
    */
    setGroupHistoryStateGroup(cookies, setHistory, setSubDivDate) {
        const addr = new addresses();
        const basicCl = new basicClass();
        axios
            .get(addr.serverAddress + ':3001/getFullGroupScoreList?' + new URLSearchParams({ userid: cookies.userid, passwd: cookies.passwd }).toString())
            .then(res => {
                let data = res.data;
                if (data['msg'] == "true") {
                    async function myFunction(dailyData) {
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
                                        for (let a = 0; a < dailyData[i][1][m][1].length; a++) {
                                            let isThereCounter2 = 0;
                                            for (let b = 0; b < weeklyData[weeklyCounter][1][j][1].length; b++) {
                                                if (dailyData[i][1][m][1][a][0] == weeklyData[weeklyCounter][1][j][1][b][0]) {
                                                    weeklyData[weeklyCounter][1][j][1][b][1] = weeklyData[weeklyCounter][1][j][1][b][1] + dailyData[i][1][m][1][a][1];
                                                }
                                                else {
                                                    isThereCounter2 = isThereCounter2 + 1;
                                                }
                                            }
                                            if (isThereCounter2 >= weeklyData[weeklyCounter][1][j][1].length) {
                                                weeklyData[weeklyCounter][1][j][1].push([dailyData[i][1][m][1][a][0], dailyData[i][1][m][1][a][1]]);
                                            }
                                        }
                                    }
                                    else {
                                        isThereCounter = isThereCounter + 1;
                                    }
                                }
                                if (isThereCounter >= weeklyData[weeklyCounter][1].length) {
                                    weeklyData[weeklyCounter][1].push([dailyData[i][1][m][0], []]);
                                    for (let a = 0; a < dailyData[i][1][m][1].length; a++) {
                                        let isThereCounter2 = 0;
                                        for (let b = 0; b < weeklyData[weeklyCounter][1][weeklyData[weeklyCounter][1].length - 1][1].length; b++) {
                                            if (dailyData[i][1][m][1][a][0] == weeklyData[weeklyCounter][1][weeklyData[weeklyCounter][1].length - 1][1][b][0]) {
                                                weeklyData[weeklyCounter][1][weeklyData[weeklyCounter][1].length - 1][1][b][1] = weeklyData[weeklyCounter][1][weeklyData[weeklyCounter][1].length - 1][1][b][1] + dailyData[i][1][m][1][a][1];
                                            }
                                            else {
                                                isThereCounter2 = isThereCounter2 + 1;
                                            }
                                        }
                                        if (isThereCounter2 >= weeklyData[weeklyCounter][1][weeklyData[weeklyCounter][1].length - 1][1].length) {
                                            weeklyData[weeklyCounter][1][weeklyData[weeklyCounter][1].length - 1][1].push([dailyData[i][1][m][1][a][0], dailyData[i][1][m][1][a][1]]);
                                        }
                                    }
                                }
                            }
                            dailyData[i][2] = basicCl.dayOfWeakInString(dailyData[i][0], weekTimeLoop);
                        }
                        return weeklyData;
                    }

                    async function myFunction2(dailyData) {
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
                                    if (dailyData[i][1][m]) {
                                        if (dailyData[i][1][m][0] == monthlyData[monthlyCounter][1][j][0]) {
                                            for (let a = 0; a < dailyData[i][1][m][1].length; a++) {
                                                let isThereCounter2 = 0;
                                                for (let b = 0; b < monthlyData[monthlyCounter][1][j][1].length; b++) {
                                                    if (dailyData[i][1][m][1][a][0] == monthlyData[monthlyCounter][1][j][1][b][0]) {
                                                        monthlyData[monthlyCounter][1][j][1][b][1] = monthlyData[monthlyCounter][1][j][1][b][1] + dailyData[i][1][m][1][a][1];
                                                    }
                                                    else {
                                                        isThereCounter2 = isThereCounter2 + 1;
                                                    }
                                                }
                                                if (isThereCounter2 >= monthlyData[monthlyCounter][1][j][1].length) {
                                                    monthlyData[monthlyCounter][1][j][1].push([dailyData[i][1][m][1][a][0], dailyData[i][1][m][1][a][1]]);
                                                }
                                            }
                                        }
                                        else {
                                            isThereCounter = isThereCounter + 1;
                                        }
                                    }
                                }
                                if (isThereCounter >= monthlyData[monthlyCounter][1].length) {
                                    monthlyData[monthlyCounter][1].push([dailyData[i][1][m][0], []]);
                                    for (let a = 0; a < dailyData[i][1][m][1].length; a++) {
                                        let isThereCounter2 = 0;
                                        for (let b = 0; b < monthlyData[monthlyCounter][1][monthlyData[monthlyCounter][1].length - 1][1].length; b++) {
                                            if (dailyData[i][1][m][1][a][0] == monthlyData[monthlyCounter][1][monthlyData[monthlyCounter][1].length - 1][1][b][0]) {
                                                monthlyData[monthlyCounter][1][monthlyData[monthlyCounter][1].length - 1][1][b][1] = monthlyData[monthlyCounter][1][monthlyData[monthlyCounter][1].length - 1][1][b][1] + dailyData[i][1][m][1][a][1];
                                            }
                                            else {
                                                isThereCounter2 = isThereCounter2 + 1;
                                            }
                                        }
                                        if (isThereCounter2 >= monthlyData[monthlyCounter][1][monthlyData[monthlyCounter][1].length - 1][1].length) {
                                            monthlyData[monthlyCounter][1][monthlyData[monthlyCounter][1].length - 1][1].push([dailyData[i][1][m][1][a][0], dailyData[i][1][m][1][a][1]]);
                                        }
                                    }
                                }
                            }
                        }
                        return monthlyData;
                    }

                    async function myFunction3(dailyData, weeklyData, monthlyData) {
                        for (let i = 0; i < dailyData.length; i++) {
                            dailyData[i][1].sort((a, b) => {
                                let sumA = 0;
                                if (a) {
                                    for (let j = 0; j < a[1].length; j++) {
                                        sumA = sumA + a[1][j][1];
                                    }
                                }
                                let sumB = 0;
                                if (b) {
                                    for (let j = 0; j < b[1].length; j++) {
                                        sumB = sumB + b[1][j][1];
                                    }
                                }
                                return sumB - sumA;
                            });
                            for (let k = 0; k < dailyData[i][1].length; k++) {
                                if (dailyData[i][1][k]) {
                                    dailyData[i][1][k][1].sort((a, b) => {
                                        return b[1] - a[1];
                                    });
                                }
                            }
                        }
                        for (let i = 0; i < weeklyData.length; i++) {
                            weeklyData[i][1].sort((a, b) => {
                                let sumA = 0;
                                if (a) {
                                    for (let j = 0; j < a[1].length; j++) {
                                        sumA = sumA + a[1][j][1];
                                    }
                                }
                                let sumB = 0;
                                if (b) {
                                    for (let j = 0; j < b[1].length; j++) {
                                        sumB = sumB + b[1][j][1];
                                    }
                                }
                                return sumB - sumA;
                            });
                            for (let k = 0; k < weeklyData[i][1].length; k++) {
                                if (weeklyData[i][1][k]) {
                                    weeklyData[i][1][k][1].sort((a, b) => {
                                        return b[1] - a[1];
                                    });
                                }
                            }
                        }
                        for (let i = 0; i < monthlyData.length; i++) {
                            monthlyData[i][1].sort((a, b) => {
                                let sumA = 0;
                                if (a) {
                                    for (let j = 0; j < a[1].length; j++) {
                                        sumA = sumA + a[1][j][1];
                                    }
                                }
                                let sumB = 0;
                                if (b) {
                                    for (let j = 0; j < b[1].length; j++) {
                                        sumB = sumB + b[1][j][1];
                                    }
                                }
                                return sumB - sumA;
                            });
                            for (let k = 0; k < monthlyData[i][1].length; k++) {
                                if (monthlyData[i][1][k]) {
                                    monthlyData[i][1][k][1].sort((a, b) => {
                                        return b[1] - a[1];
                                    });
                                }
                            }
                        }
                        return [dailyData, weeklyData, monthlyData];
                    }
                    myFunction(data['history']).then((weeklyData) => {
                        myFunction2(data['history']).then((monthlyData) => {
                            myFunction3(data['history'], weeklyData, monthlyData).then((value) => {
                                let [dailyData, weeklyData, monthlyData] = value;
                                for (let i = 0; i < dailyData.length; i++) {
                                    for (let j = 0; j < dailyData[i][1].length; j++) {
                                        if (dailyData[i][1][j]) {
                                            for (let k = 0; k < dailyData[i][1][j][1].length; k++) {
                                                let hours = Math.floor(Number(dailyData[i][1][j][1][k][1]) / 60);
                                                let minutes = Number(dailyData[i][1][j][1][k][1]) - (hours * 60);
                                                dailyData[i][1][j][1][k][1] = hours;
                                                dailyData[i][1][j][1][k][2] = minutes;
                                            }
                                            // dailyData[i][1][j][1] = dailyData[i][1][j][1].map((item, index)=> {
                                            //     let hours = Math.floor(Number(item[1]) / 60);
                                            //     let minutes = Number(item[1]) - (hours * 60);
                                            //     return [item[0], hours, minutes];
                                            // });
                                        }
                                    }
                                }
                                for (let i = 0; i < weeklyData.length; i++) {
                                    for (let j = 0; j < weeklyData[i][1].length; j++) {
                                        if (weeklyData[i][1][j]) {
                                            weeklyData[i][1][j][1] = weeklyData[i][1][j][1].map((item, index) => {
                                                let hours = Math.floor(Number(item[1]) / 60);
                                                let minutes = Number(item[1]) - (hours * 60);
                                                return [item[0], hours, minutes];
                                            });
                                        }
                                    }
                                }
                                for (let i = 0; i < monthlyData.length; i++) {
                                    for (let j = 0; j < monthlyData[i][1].length; j++) {
                                        if (monthlyData[i][1][j]) {
                                            monthlyData[i][1][j][1] = monthlyData[i][1][j][1].map((item, index) => {
                                                let hours = Math.floor(Number(item[1]) / 60);
                                                let minutes = Number(item[1]) - (hours * 60);
                                                return [item[0], hours, minutes];
                                            });
                                        }
                                    }
                                }
                                dailyData.push(["", []]);
                                weeklyData.push(["", []]);
                                monthlyData.push(["", []]);
                                setSubDivDate({ day: dailyData[0][0], week: weeklyData[0][0], month: monthlyData[0][0] });
                                setHistory({ day: dailyData, month: monthlyData, week: weeklyData });
                            })
                        })
                    });
                }
            });
    }

    /**
    * A function that checks if a user is group admin or not
    */
    isGroupAdminSittings(cookies, setGroupAdminSittingsListDisplay) {
        const addr = new addresses();
        axios
            .get(addr.serverAddress + ':3001/isGroupAdmin?' + new URLSearchParams({ userid: cookies.userid, passwd: cookies.passwd }).toString())
            .then(res => {
                let data = res.data;
                if (data['msg'] == "true") {
                    if (data['admin'] == "yes") {
                        setGroupAdminSittingsListDisplay("block");
                    }
                }
                else if (data['msg'] == "no group found") {
                    alert("گروهی که برای شما ثبت شده است دیگر وجود ندارد. لطفا با پشتیبانی تماس بگیرید");
                }
            });
    }

    /**
    * A function that checks if a user is in group or not for homepage
    */
    isInGroupHome(cookies, setGroupScoreListCurtainDisplay, setGroupScoreList) {
        const addr = new addresses();
        axios
            .get(addr.serverAddress + ':3001/isInGroup?' + new URLSearchParams({ userid: cookies.userid, passwd: cookies.passwd }).toString())
            .then(res => {
                let data = res.data;
                if (data['msg'] == "true") {
                    if (data['group'] == "yes") {
                        this.setGroupScoreListStateHome(cookies, setGroupScoreList);
                    }
                    else {
                        setGroupScoreListCurtainDisplay("block");
                    }
                }
                else if (data['msg'] == "no group found") {
                    alert("گروهی که برای شما ثبت شده است دیگر وجود ندارد. لطفا با پشتیبانی تماس بگیرید");
                }
            });
    }

    /**
    * A function that checks if a user is in group or not for group sittings page
    */
    isInGroupSittings(cookies, setGroupSittingsListDisplay) {
        const addr = new addresses();
        axios
            .get(addr.serverAddress + ':3001/isInGroup?' + new URLSearchParams({ userid: cookies.userid, passwd: cookies.passwd }).toString())
            .then(res => {
                let data = res.data;
                if (data['msg'] == "true") {
                    if (data['group'] == "yes") {
                        setGroupSittingsListDisplay("block");
                    }
                }
                else if (data['msg'] == "no group found") {
                    alert("گروهی که برای شما ثبت شده است دیگر وجود ندارد. لطفا با پشتیبانی تماس بگیرید");
                }
            });
    }

    /**
    * A function that remove the user from group
    */
    exitGroup(cookies, setGroupSittingsListDisplay, setGroupAdminSittingsListDisplay) {
        const addr = new addresses();
        axios
            .get(addr.serverAddress + ':3001/exitGroup?' + new URLSearchParams({ userid: cookies.userid, passwd: cookies.passwd }).toString())
            .then(res => {
                let data = res.data;
                if (data['msg'] == "true") {
                    setGroupSittingsListDisplay("none");
                    setGroupAdminSittingsListDisplay("none");
                }
            });
    }

    /**
    * A function that changes group invitation code
    */
    changeGroupCode(cookies) {
        const addr = new addresses();
        axios
            .get(addr.serverAddress + ':3001/changeGroupCode?' + new URLSearchParams({ userid: cookies.userid, passwd: cookies.passwd }).toString())
            .then(res => {
                let data = res.data;
                if (data['msg'] == "true") {
                    alert("کد دعوت گروه با موفقیت تغییر کرد");
                }
                else if (data['msg'] == "codestr already exist") {
                    alert("لطفا مجددا تلاش کنید");
                }
                else if (data['msg'] == "not admin") {
                    alert("شما مدیر گروه نیستید");
                }
            });
    }
}