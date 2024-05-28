// const PlannerAgent = require('./PlannerAgent');
// const TesterAgent = require('./TesterAgent');

// // Initialize agents
// const plannerAgent = new PlannerAgent('PlannerAgent');
// const testerAgent = new TesterAgent('TesterAgent');

// // Start the process
// plannerAgent.receiveMessage(`Start a NodeJS Server from path 'C:\Users\ENBD\Documents\Hemang\NodeCRUD\server.js' using 'node server.js' command and after server gets up and running, get cucumber test file from path 'C:\Users\ENBD\Documents\Hemang\NodeCRUD\feature\step_definitions\crud.feature' and run functional tests using cucumber`, testerAgent);

const fs = require('fs-extra');
const { spawn, exec } = require('child_process');
const path = require('path');

let pid;

async function runCode(filePath) {
    return new Promise((resolve, reject) => {
        const runNode = spawn('node', [filePath]);
        // console.log(`---- PID : ${runNode.pid}`);
        pid = runNode.pid;
        runNode.stdout.on('data', (data) => {
            // console.log(`---- PID : ${runNode.pid}`);
            console.log(`stdout: ${data}`);
            const log = data.toString();
            if (log.includes('Server is running on 8080')) {
                console.log('------ Server Started, Moving forward with testing ------');
                resolve();
            }
        });

        runNode.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        runNode.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
            reject();
        });
    });
    // return new Promise((resolve, reject) => {
    // exec(`node ${filePath}`, (error, stdout, stderr) => {
    //     if (error) {
    //         reject(`Error: ${stderr}`);
    //     } else {
    //         resolve(`Output: ${stdout}`);
    //     }
    // });

    // });
}

async function runCucumberTests(filePath) {
    const cucumberCommand = `npx cucumber-js ${filePath}`;

    return new Promise((resolve, reject) => {
        exec(cucumberCommand, { cwd: 'C:/Users/ENBD/Documents/Hemang/NodeCRUD' }, (error, stdout, stderr) => {
            if (error) {
                reject(`Error: ${stderr}`);
            } else {
                resolve(`Cucumber Test Output: ${stdout}`);
            }
        });
    });
}

runCode(path.join('C:/Users/ENBD/Documents/Hemang/NodeCRUD', 'server.js')).then(response => {
    console.log('------ Running Cucumber Test Cases ------');
    runCucumberTests(path.join('C:/Users/ENBD/Documents/Hemang/NodeCRUD/feature', 'crud.feature')).then(testRes => {
        console.log(testRes);
        process.kill(pid)
    })
    console.log(response);
}).catch(error => {
    console.log(error);
})