const fs = require('fs');
const path = require('path');

// Function to pluralize a string
function pluralize(str) {
    const lastChar = str.slice(-1).toLowerCase();
    const lastTwoChars = str.slice(-2).toLowerCase();

    if (lastChar === 'y' && !['a', 'e', 'i', 'o', 'u'].includes(str.slice(-2, -1).toLowerCase())) {
        return str.slice(0, -1) + 'ies';
    } else if (['s', 'x', 'z', 'ch', 'sh'].includes(lastTwoChars) || ['s', 'x', 'z'].includes(lastChar)) {
        return str + 'es';
    } else if (lastChar !== 's') {
        return str + 's';
    }
    return str;
}

// Function to lowercase and pluralize the last word in a string
function lowercasePluralize(str) {
    const words = str.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase().split(' ');
    words[words.length - 1] = pluralize(words[words.length - 1]);
    return words.join(' ');
}

// Function to create a model from a stub
function createModel(className) {
    const modelStubPath = path.join(__dirname, 'stubs', 'model.stub');
    const modelPath = path.join(__dirname, 'libs', 'Model', `${className}.js`);

    fs.readFile(modelStubPath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading model stub: ${err.message}`);
            return;
        }

        const lowerCasePluralizedClassName = lowercasePluralize(className);
        const output = data
            .replace(/{{ classname }}/g, className)
            .replace(/{{ lowercasePluralizedClassname }}/g, lowerCasePluralizedClassName);

        fs.writeFile(modelPath, output, 'utf8', (err) => {
            if (err) {
                console.error(`Error writing model file: ${err.message}`);
            } else {
                console.log(`Model ${className} created successfully at libs/Model/${className}.js`);
            }
        });
    });
}

// Function to create a migration from a stub
function makeMigration(tableName) {
    const migrationDir = path.join(__dirname, 'database', 'migrations');
    const stubPath = path.join(__dirname, 'stubs', 'migration.stub');

    // Ensure the migration directory exists
    if (!fs.existsSync(migrationDir)) {
        fs.mkdirSync(migrationDir, { recursive: true });
    }

    const migrationFileName = `create_${tableName}.js`;
    const migrationFilePath = path.join(migrationDir, migrationFileName);

    fs.readFile(stubPath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading migration stub: ${err.message}`);
            return;
        }

        // Replace the placeholder in the stub with the actual table name
        const migrationContent = data.replace(/{{ tableName }}/g, tableName);

        fs.writeFile(migrationFilePath, migrationContent, 'utf8', (err) => {
            if (err) {
                console.error(`Error writing migration file: ${err.message}`);
            } else {
                console.log(`Migration file created at ${migrationFilePath}`);
            }
        });
    });
}

// Function to create a controller from a stub
function createController(controllerName, specificArea) {
    const controllerStubPath = path.join(__dirname, 'stubs', 'controller.stub');
    const controllerDir = path.join(__dirname, 'app', specificArea, `Controller`);
    const controllerPath = path.join(controllerDir, `${controllerName.toLowerCase()}.js`);

    // Ensure the specific area directory exists
    if (!fs.existsSync(controllerDir)) {
        fs.mkdirSync(controllerDir, { recursive: true });
    }

    fs.readFile(controllerStubPath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading controller stub: ${err.message}`);
            return;
        }

        const output = data
            .replace(/{{ ControllerName }}/g, controllerName)
            .replace(/{{ SpecificArea }}/g, specificArea);

        fs.writeFile(controllerPath, output, 'utf8', (err) => {
            if (err) {
                console.error(`Error writing controller file: ${err.message}`);
            } else {
                console.log(`Controller ${controllerName} created successfully at ${controllerPath}`);
            }
        });
    });
}

// Command line argument handling
const args = process.argv.slice(2);
if (args.length < 3) {
    console.error("Please provide a command (make model, make migration, or make controller) and a name.");
    process.exit(1);
}

const command = args[0]; // "make"
const subCommand = args[1]; // "model", "migration", or "controller"
const name = args[2]; // ClassName or tableName or ControllerName
const specificArea = args[3]; // Specific area for controller

if (command === 'make' && subCommand === 'model') {
    createModel(name);
} else if (command === 'make' && subCommand === 'migration') {
    makeMigration(name);
} else if (command === 'make' && subCommand === 'controller' && specificArea) {
    createController(name, specificArea);
} else {
    console.error("Invalid command. Use 'make model <ClassName>', 'make migration <tableName>', or 'make controller <ControllerName> <SpecificArea>'.");
    process.exit(1);
}
