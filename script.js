//const deptElement = document.getElementById("dept");
const subCodesElement = document.getElementById("subCode");
const yearElement = document.getElementById("year");
const errElement = document.getElementById("errMessage");
const uploadMessageElement = document.getElementById("uploadMessage");
const regulationElement = document.getElementById("regulation");
const form = document.getElementById('form');

var d = new Date();

const subCodes = {
    "2013": ["MA6151","GE6152","HS6151","GE6151","CY6151","PH6151","MA6251","CS6202","CS6201","HS6251","CY6251","PH6251","GE6351","CS6302","MA6351","CS6304","CS6303","CS6301","CS6551","MA6453","CS6403","CS6402","EC6504","CS6401","MA6566","CS6501","CS6502","CS6503","CS6504","CS6601","IT6601","CS6660","IT6502","CS6599","CS6001","IT6702","IT6004","CS6701","CS6702","CS6103","CS6704","IT6801","CS6007","CS6801","CS6008","CS6010","MG6088","CS6703"],
    "2017": ["HS8151","MA8151","PH8151","CY8151","GE8151","GE8152","HS8251","MA8251","PH8252","BE8255","GE8291","CS8251","MA8351","CS8351","CS8391","CS8392","EC8395","MA8402","CS8491","CS8492","CS8451","CS8493","CS8494","MA8551","CS8591","EC8691","CS8501","CS8592","OCE552","CS8651","CS8691","CS8601","CS8602","CS8603","CS8075","MG8591","CS8792","CS8791","OBM752","IT8075","CS8073","IT8073","CS8080"]
};

function changeRegulation() {
    subCodesElement.innerHTML = '';

    let optionsInsert = '';
    //console.log(optionsInsert);
    let option = document.createElement('option');
    option.text = '--Select one--';
    option.value = "none";
    subCodesElement.append(option);
    //optionsInsert.concat(option);
    //console.log(optionsInsert);

    let subjectCodes = subCodes[regulationElement.value].sort();

    for(let i = 0; i < subjectCodes.length; i++) {
        option = document.createElement('option');
        option.text = subjectCodes[i];
        option.value = subjectCodes[i];
        subCodesElement.append(option);
        optionsInsert.concat(option);
    }
    // console.log(optionsInsert);
    // subCodesElement.innerHTML = optionsInsert;
}

function deptChange(e) {
    subCodesElement.innerHTML = '';
    //let department = deptElement.value;
    
    let option = document.createElement('option');
    option.text = "--Select one--";
    option.value = "none";
    subCodesElement.append(option);

    let subjectCodes = subCodes.sort();

    for(let i = 0; i < subjectCodes.length; i++) {
        let option = document.createElement('option');
        option.text = subjectCodes[i];
        option.value = subjectCodes[i];
        subCodesElement.append(option);
    }
}

const checkInputs = () => {
    if (subCodesElement.value == "none" || yearElement.value == "none") {
        alert("Invalid year or subject code");
        return false;
    }
    return true;
}

const checkTime = () => {
    console.log("Checking the time");
    if (!(d.getHours() >= 13 && d.getHours() <= 14 || d.getHours() >= 18 && d.getHours() <= 22)) {
        errElement.style.display = "block";
        enabled = false;
        return false;
    }
    return true;
}

const checkFileNaming = (filename) => {
    let pdfCheck = filename.split(".");
    if(pdfCheck[1] != "pdf" && pdfCheck[1] != "PDF") {
        alert("Only pdf files are accepted");
        return false;
    }

    let filenaming = filename.split("-");
    console.log(filenaming);
    if (filenaming.length != 2 || filenaming[0].length != 12 || filenaming[1].length != 10) {
        alert("File name is not proper");
        alert("File name should in the format [Reg.No]-[Sub.Code] (all uppercase)");
        return false;
    }

    return true;
}

form.addEventListener('submit', e => {
    e.preventDefault();
    
    console.log(checkInputs());

    if (!checkInputs()) {
        return;
    }   

    if (!confirm("Sure to submit?")) {
        return;
    }

    if (form.filename.value.length != 12) {
        alert("Check your register number");
        return;
    }

    // if (!checkTime()) {
    //     alert("Answer Submission Time exceeded! Contact your Supervisor");
    //     return;
    // }
    const file = form.file.files[0];
    const fr = new FileReader();
    var d = new Date();

    try {
        fr.readAsArrayBuffer(file);
    } catch(err) {
        alert("Please make sure you selected the correct file or contact your supervisor");
        uploadMessageElement.innerHTML = 'UPLOADED SUCCESSFULLY';
        uploadMessageElement.style.display = 'block';
    }

    fr.onload = f => {

        if (!checkFileNaming(file.name)) {
            return;
        }
        
        uploadMessageElement.innerHTML = "Uploading... Please Wait!"
        uploadMessageElement.style.display = 'block';

        let fileName = file.name;

        let url = "https://script.google.com/macros/s/AKfycbz2KHjct6yB25N1f4ZtRdTmlS0Lp-SrPTM0oVjbi9wUdH0wA--kXvpaglC0LwUlIiTWLg/exec";

        const qs = new URLSearchParams({filename: fileName, mimeType: file.type, subCode: form.subCode.value});
        console.log(`${url}?${qs}`);
        fetch(`${url}?${qs}`, {method: "POST", body: JSON.stringify([...new Int8Array(f.target.result)])})
        .then(res => res.json())
        .then(e => {
            console.log(e);
            if (e.commonFolder) {
                alert("It seems like your file went to the wrong folder. Contact the supervisor");
            }
            alert("File uploaded successfully!");
            form.reset();
            uploadMessageElement.innerHTML = 'UPLOADED SUCCESSFULLY';
            uploadMessageElement.style.display = 'block';
        })  // <--- You can retrieve the returned value here.
        .catch(err => {
            console.log(err);
            uploadMessageElement.innerHTML = 'UPLOADING FAILED';
            alert("Something went Wrong! Please Try again!");
            uploadMessageElement.style.display = 'block';
        });
    }
});
