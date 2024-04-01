import axios from 'axios';
import addresses from './addresses';

/**
* A class containing the jobs functions of app
*/
export default class jobsClass {
    /**
    * A function for displaying tasks on the home page
    */
    setTodayTasksStateHome(cookies, setTodayJobs) {
        const addr = new addresses();
        axios
            .get(addr.serverAddress + ':3001/getTodayTasks?' + new URLSearchParams({ userid: cookies.userid, passwd: cookies.passwd }).toString())
            .then(res => {
                let data = res.data;
                if (data['msg'] == "true") {
                    let myArray = [];
                    for (let i = 0; i < data['todayjobs'].length; i++) {
                        myArray[i] = [];
                        myArray[i][0] = data['todayjobs'][i][0];
                        myArray[i][1] = data['todayjobs'][i][1];
                        myArray[i][2] = "none";
                    }
                    setTodayJobs(myArray);
                }
                else if (data['msg'] == "no result") {
                    let myArray = [];
                    myArray[0] = [];
                    myArray[0][0] = "برای امروز فعالیتی ثبت نکردی";
                    myArray[0][1] = "";
                    myArray[0][2] = "none";
                    setTodayJobs(myArray);
                }
            });
    }

    /**
    * A function for editing tasks on the home page
    */
    updateTodayTasksStateHome(index, todayJobs, setTodayJobs, timeOutRef) {
        const nextTodayJobs = todayJobs.map((c, i) => {
            if (i == index && c[0] != "برای امروز فعالیتی ثبت نکردی") {
                return [c[0], c[1], "inline"];
            }
            else {
                return [c[0], c[1], "none"];
            }
        })
        setTodayJobs(nextTodayJobs);
        setTimeout(() => {
            const aw = timeOutRef.current;
            const backTodayJobs = aw.map((c, i) => {
                return [c[0], c[1], "none"];
            })
            setTodayJobs(backTodayJobs);
        }, "3000");
    }

    /**
    * A function for displaying activities on the home page
    */
    setJobsStateHome(cookies, setJobs, setPickJobDisplay) {
        const addr = new addresses();
        axios
            .get(addr.serverAddress + ':3001/getJobs?' + new URLSearchParams({ userid: cookies.userid, passwd: cookies.passwd }).toString())
            .then(res => {
                let data = res.data;
                if (data['msg'] == "true") {
                    let myArray = data['jobs'];
                    setJobs(myArray);
                    setPickJobDisplay("inline");
                }
                else if (data['msg'] == "no result") {
                    let myArray = [];
                    myArray[0] = "هیچ کاری ثبت نکردی";
                    setJobs(myArray);
                    setPickJobDisplay("inline");
                }
            });
    }
    /**
    * A function for deleting today task on the home page
    */
    removeTodayTaskHome(name, date, settTodayTasksStateHome, cookies, setTodayJobs) {
        const addr = new addresses();
        axios
            .get(addr.serverAddress + ':3001/removeTodayTask?' + new URLSearchParams({ userid: cookies.userid, passwd: cookies.passwd, name: name, date: date }).toString())
            .then(res => {
                let data = res.data;
                if (data['msg'] == "true") {
                    settTodayTasksStateHome(cookies, setTodayJobs);
                }
            });
    }

    /**
    * A function for displaying activities on the activity page
    */
    setJobsListStateActivities(cookies, setJobsList) {
        const addr = new addresses();
        axios
            .get(addr.serverAddress + ':3001/getJobsList?' + new URLSearchParams({ userid: cookies.userid, passwd: cookies.passwd }).toString())
            .then(res => {
                let data = res.data;
                if (data['msg'] == "true") {
                    let myArray = data['jobs'];
                    setJobsList(myArray);
                }
                else if (data['msg'] == "no result") {
                    let myArray = [];
                    setJobsList(myArray);
                }
            });
    }

    /**
    * A function to add activity of a user
    */
    addNewJob(cookies, addingJobName, isInGroupOption, setAddingJobName, setIsInGroupOption, setJobsAddTooltipDisplay, setJobsList) {
        if (addingJobName && addingJobName != "") {
            const addr = new addresses();
            axios
                .get(addr.serverAddress + ':3001/addNewJob?' + new URLSearchParams({ userid: cookies.userid, passwd: cookies.passwd, job: addingJobName, group: isInGroupOption }).toString())
                .then(res => {
                    let data = res.data;
                    if (data['msg'] == "true") {
                        setAddingJobName("");
                        setIsInGroupOption("yes");
                        setJobsAddTooltipDisplay("none");
                        this.setJobsListStateActivities(cookies, setJobsList);
                    }
                    else if (data['msg'] == "job name repeated") {
                        alert("نام کار تکراری است");
                    }
                });
        }
        else {
            alert("نام کار وارد نشده است");
        }
    }

    /**
    * A function to delete an active activity of a user
    */
    deleteJob(cookies, job, setJobsList) {
        const addr = new addresses();
        axios
            .get(addr.serverAddress + ':3001/deleteJob?' + new URLSearchParams({ userid: cookies.userid, passwd: cookies.passwd, job: job }).toString())
            .then(res => {
                let data = res.data;
                if (data['msg'] == "true") {
                    this.setJobsListStateActivities(cookies, setJobsList);
                }
            });
    }

    /**
    * A function to display the user tasks in activity page
    */
    setTasksListStateActivities(cookies, setTasksList) {
        const addr = new addresses();
        axios
            .get(addr.serverAddress + ':3001/getTasksList?' + new URLSearchParams({ userid: cookies.userid, passwd: cookies.passwd }).toString())
            .then(res => {
                let data = res.data;
                if (data['msg'] == "true") {
                    let myArray = data['tasks'];
                    setTasksList(myArray);
                }
                else if (data['msg'] == "no result") {
                    let myArray = [];
                    setTasksList(myArray);
                }
            });
    }

    /**
    * A function to add a new task for user
    */
    addNewTask(cookies, selectedTaskDay, addingTaskName, setSelectedTaskDay, setAddingTaskName, setTasksAddTooltipDisplay, setTasksList) {
        if (selectedTaskDay && addingTaskName && addingTaskName.length < 25) {
            let persianDate = (new Intl.DateTimeFormat('en-US-u-ca-persian', { year: 'numeric' }).format(selectedTaskDay)).slice(0, 4) + "-" + (new Intl.DateTimeFormat('en-US-u-ca-persian', { month: '2-digit' }).format(selectedTaskDay)) + "-" + (new Intl.DateTimeFormat('en-US-u-ca-persian', { day: '2-digit' }).format(selectedTaskDay));
            const addr = new addresses();
            axios
                .get(addr.serverAddress + ':3001/addNewTask?' + new URLSearchParams({ userid: cookies.userid, passwd: cookies.passwd, task: addingTaskName, date: persianDate }).toString())
                .then(res => {
                    let data = res.data;
                    if (data['msg'] == "true") {
                        setSelectedTaskDay(new Date);
                        setAddingTaskName("");
                        setTasksAddTooltipDisplay("none");
                        this.setTasksListStateActivities(cookies, setTasksList);
                    }
                    else if (data['msg'] == "task name repeated") {
                        alert("نام کار تکراری است");
                    }
                });
        }
        else {
            alert("اطلاعات فرم صحیح نیست");
        }
    }

    /**
    * A function to delete a user's task
    */
    deleteTask(cookies, task, date, setTasksList) {
        const addr = new addresses();
        axios
            .get(addr.serverAddress + ':3001/deleteTask?' + new URLSearchParams({ userid: cookies.userid, passwd: cookies.passwd, task: task, date: date }).toString())
            .then(res => {
                let data = res.data;
                if (data['msg'] == "true") {
                    this.setTasksListStateActivities(cookies, setTasksList);
                }
                else if (data['msg'] == "no task found") {
                    alert("یادآور برای پاک شدن موجود نیست");
                }
            });
    }
}