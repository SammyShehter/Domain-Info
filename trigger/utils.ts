import fs from 'fs';
export function reportError(errorMessage: string): void {
    console.log("ERROR!", errorMessage)
    fs.appendFile("error.triggerApp.log", `${errorMessage}\n`, () => {})
}
