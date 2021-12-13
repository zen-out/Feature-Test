const fs = require('fs')
const _ = require("lodash")
const json = require("./db.json")

const axios = require("axios")

function getFile(string) {
    let lastIndex = string.lastIndexOf("/")
    let file = string.slice(lastIndex + 1, string.length)
    return file;
}
// receives object 
function entity(arr) {
    let newArr = []
    for (let i = 0; i < arr.length; i++) {
        // console.log("each entity", arr[i])
        let file = getFile(arr[i]['name'])
        let time = arr[i]["text"]
        if (arr[i]["total_seconds"] > 60) {
            let obj = {
                file: file,
                time: time
            }
            newArr.push(obj)
        }


    }
    return newArr;
}

function getDependencies(dependencies) {
    let arr = []
    for (let j = 0; j < dependencies.length; j++) {
        let obj = {
            file: dependencies[j]["name"],
            time: dependencies[j]["text"]
        }
        arr.push(obj)

    }
    return arr;
}

function getDay(one) {
    let day = {
        date: "",
        dependencies: [],
        files: []
    }
    // sample[0] { date: "",grand_total: {}, projects: []}
    let projectWrap = one.projects
    if (one.grand_total.total_seconds > 600) {
        // console.log(Object.keys(one))
        day.date = one.date
        if (one.dependencies.length > 1) {
            let d = getDependencies(one.dependencies)
            day.dependencies.push(d)
        }
        if (one.projects.length > 0) {
            for (let i = 0; i < one.projects.length; i++) {

                if (one.projects[i].entities.length > 1) {
                    let e = entity(one.projects[i].entities)
                    if (e.length > 0) {
                        day.files.push(e)
                    }

                }

                // let project = eachProject(one.projects[i])
                // arr.push(project)
            }

        }
    }
    let flat = _.flattenDeep(day.files)
    // console.log(day.dependencies)
    let flatD = _.flattenDeep(day.dependencies)
    // console.log(flatD)
    day.dependencies = flatD;
    // console.log(day.files)
    // console.log(flat)

    day.files = flat;
    return day;
}
async function saveFile() {

    // create a new handle
    const newHandle = await window.showSaveFilePicker();

    // create a FileSystemWritableFileStream to write to
    const writableStream = await newHandle.createWritable();

    // write our file
    await writableStream.write(imgBlob);

    // close the file and write the contents to disk.
    await writableStream.close();
}
axios.get("http://localhost:3000/days").then((array) => {
    let sample = _.sampleSize(array.data, 1)
    let days = []
    for (let j = 0; j < array.data.length; j++) {
        // console.log(array.data[j])
        if (array.data[j].date && array.data[j].grand_total.total_seconds > 600) {
            let day = getDay(array.data[j])
            days.push(day)
        }
    }
    console.log(days)
    let stringed = JSON.stringify(days)
    fs.writeFile(__dirname + "/db.json", stringed, err => {
        if (err) {
            console.error(err)
            return
        }
        //file written successfully
    })



})