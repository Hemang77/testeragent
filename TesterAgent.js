const AgentBase = require('./AgentBase');

const callOpenAI = require('./OpenAIUtil');
class TesterAgent extends AgentBase {
    async receiveMessage(message, fromAgent) {
        //  super.receiveMessage(message, fromAgent);
        let val ="`";
        console.log(`${this.name} is processing result: ${message}`);
        const prompt =`Objective: Develop an automated testing agent that:

        1 Accepts a file path for a Node.js server script.
        2 Accepts a file path for Cucumber test cases.
        3 Starts the Node.js server.
        4 Executes the test cases using Cucumber after the server has successfully started.
       
       Requirements:
       
        • The agent must ensure the Node.js server is fully operational before initiating the test cases.
        • The agent should handle any errors during the server startup or testing process and provide meaningful feedback.
       
       Steps:
       
        1 Input Acquisition: The agent should prompt the user to provide the file path for the Node.js server script and the Cucumber test cases.
        2 Server Initialization: Using the provided server script path, the agent should attempt to start the Node.js server. It must verify that the server is running before proceeding.
        3 Test Execution: Once the server is confirmed to be running, the agent should execute the Cucumber tests located at the specified test case file path.
        4 Output Results: After running the tests, the agent should capture and display the results from Cucumber, including any failures or errors.
        5 Cleanup: Optionally, the agent can handle shutdown procedures for the Node.js server if necessary.
       
       Error Handling:
       
        • If the server fails to start, the agent should report the error and not proceed with the tests.
        • If there are errors during testing, these should be clearly reported to the user.
       
       User Interaction:
       
        • The agent should provide clear instructions to the user on how to input the required file paths.
        • Feedback should be given throughout the process, such as confirming successful server startup and test completion.
       
       Example Usage:
       
       
        Please enter the file path for your Node.js server script:
        [path_to_nodejs_server_script]
       
        Please enter the file path for your Cucumber test cases:
        [path_to_cucumber_test_cases]
       
        Attempting to start the Node.js server...
        Server started successfully. Running tests...
       
        Cucumber Test Results:
        [output_results_here]
       
       
       Additional Considerations:
       
        • Ensure the paths provided by the user are validated to prevent errors related to file access.
        • Consider implementing a timeout for the server startup and test execution to handle cases where operations may hang.
       
       This structured prompt ensures that all necessary details are covered for creating an agent capable of handling the described task efficiently and effectively.`;

      
        const response = await callOpenAI(prompt,message,undefined);

        async function runCode(filePath) {
            return new Promise((resolve, reject) => {
                exec(`node ${filePath}`, (error, stdout, stderr) => {
                    if (error) {
                        reject(`Error: ${stderr}`);
                    } else {
                        resolve(`Output: ${stdout}`);
                    }
                });
            });
        }
        
        async function runCucumberTests(filePath) {
            const featureFile = path.join(__dirname, 'features', 'example.feature');
            const cucumberCommand = `npx cucumber-js ${featureFile}`;
            
            return new Promise((resolve, reject) => {
                exec(cucumberCommand, (error, stdout, stderr) => {
                    if (error) {
                        reject(`Error: ${stderr}`);
                    } else {
                        resolve(`Cucumber Test Output: ${stdout}`);
                    }
                });
            });
        }
        //await this.processToolCalls(response,tools);  
    }

    
}

module.exports = TesterAgent;
