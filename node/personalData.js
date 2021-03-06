// Load personal settings not included in git repo

var fs = require('fs');

var personalDataFile = process.env.HOME + '/.arlobot/personalDataForBehavior.json';
// TODO: Is there any way to not hard code this file location,
// to such a specific spot in the home folder,
// while still allowing it to be from anywhere?
// Because this is called by lots of modules, some run by scripts in other
// locations within the Arlobot system.
var defaultDataFile = process.env.HOME + '/catkin_ws/src/Metatron/scripts/dotarlobot/personalDataForBehavior.json'
var personalData = JSON.parse(fs.readFileSync(personalDataFile, 'utf8'));
var defaultData = JSON.parse(fs.readFileSync(defaultDataFile, 'utf8'));

// http://stackoverflow.com/a/130504
function DumpObjectIndented(obj, indent) {
    var result = "";
    if (indent == null) indent = "";

    for (var property in obj) {
        var value = obj[property];
        if (typeof value == 'string')
            value = "\"" + value + "\"";
        else if (typeof value == 'object') {
            if (value instanceof Array) {
                // Just let JS convert the Array to a string!
                value = "[ " + value + " ]";
            } else {
                // Recursive dump
                // (replace "  " by "\t" or something else if you prefer)
                var od = DumpObjectIndented(value, indent + "    ");
                // If you like { on the same line as the key
                value = "{\n" + od + "\n" + indent + "}";
                // If you prefer { and } to be aligned
                //value = "\n" + indent + "{\n" + od + "\n" + indent + "}";
            }
        }
        result += indent + "\"" + property + "\" : " + value + ",\n";
    }
    return result.replace(/,\n$/, "");
}

var updateNeeded = false;
for (prop in defaultData) {
    if (personalData[prop] === undefined) {
        updateNeeded = true;
        personalData[prop] = defaultData[prop];
    }
}
if (updateNeeded) {
    var newFileOutputData = '{\n' + DumpObjectIndented(personalData, '    ') + '\n}'
    //console.log(newFileOutputData);
    fs.writeFile(personalDataFile, newFileOutputData);
    console.log(personalDataFile + ' has been updated with new settings');
    console.log('Please check to see if you need to adjust them for your robot!');
}

module.exports = personalData;
