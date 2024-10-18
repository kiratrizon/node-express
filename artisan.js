const fs = require('fs');
const path = require('path');

// Function to convert a string to lowercase and pluralize it
function lowercasePluralize(str) {
    return str.toLowerCase() + 's'; // Simple pluralization; you can enhance this logic as needed
}

// Function to create a model
function createModel(className) {
    // Define paths
    const modelStubPath = path.join(__dirname, 'stubs', 'model.stub');
    const modelPath = path.join(__dirname, 'libs', 'Model', `${className}.js`);

    // Read the model stub
    fs.readFile(modelStubPath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading stub file: ${err.message}`);
            return;
        }

        // Replace placeholders in the stub
        const lowerCasePluralizedClassName = lowercasePluralize(className);
        const output = data
            .replace(/{{ classname }}/g, className)
            .replace(/{{ lowercasePluralizedClassname }}/g, lowerCasePluralizedClassName);

        // Write the new model file
        fs.writeFile(modelPath, output, 'utf8', (err) => {
            if (err) {
                console.error(`Error writing model file: ${err.message}`);
            } else {
                console.log(`Model ${className} created successfully at libs/Model/${className}.js`);
            }
        });
    });
}

// Command line argument handling
const args = process.argv.slice(2);
if (args.length < 3) {
    console.error("Please provide a command (make model) and a class name.");
    process.exit(1);
}

// Parse the command
const command = args[0]; // "make"
const subCommand = args[1]; // "model"
const className = args[2]; // e.g., "User"

// Check if the command is correct
if (command === 'make' && subCommand === 'model') {
    createModel(className);
} else {
    console.error("Invalid command. Use 'make model <ClassName>' to create a model.");
    process.exit(1);
}
