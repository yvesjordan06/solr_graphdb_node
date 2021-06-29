//Here we start all this necessary for the server
import GDB from "../database/graphdb.js"
import render from "koa-ejs";
import path from "path"


const __dirname = path.resolve();
export function initServer(app) {
    console.log("\nBootstrapping the application...\n");


    render(app, {
        root: path.join(__dirname, "views"),
        layout:false,
        //layout: "index",
        viewExt: "ejs",
    });


    //Starting the GraphDB connector and loging in 
    GDB.login()
}


