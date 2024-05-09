const express = require("express");
const app= express();
const ExpressError = require("./ExpressError");

// app.use((req,res,next) =>{
    // let {query} = req.query;
    // console.log(query);
    // console.log("Hi,I am middleware");
    // res.send("middleware finished");
    // return next();
    // after return , this will not get executed.
    // console.log("Hi,I am after next.");

// });

// app.use((req,res,next)=>{
//     console.log("Hi, This is 2nd Middleware");
//     next();
//     console.log("Hi,I am after 2nd next.");

// })

//this is how we used to authenticate.

const checkToken = (req,res,next)=>{
    let {token} = req.query;
    if(token === "giveaccess"){
        next();
    }
    // res.send("ACCESS DENIED!!");
    // throw new Error("ACCESS DENIED");
    throw new ExpressError(401,"ACCESS DENIED !");
};

// app.use("/api",(req,res,next)=>{
//     let {token} = req.query;
//     if(token ==="giveaccess"){
//         next();
//     }
//     res.send("ACCESS DENIED!");
// });

app.get("/api",checkToken,(req,res)=>{
    res.send("data");
});

app.use("/random",(req,res,next)=>{
    console.log("I am only for random");
    next();
});
//logger-morgon
// app.use((req,res,next)=>{
//     req.time = new Date(Date.now()).toString();
//     console.log(req.method,req.hostname,req.path,req.time);
//     next();
// })

app.get("/",(req,res)=>{
    res.send("Hi,I am root");
    
});

app.get("/random",(req,res)=>{
    console.log("Hello random");
    res.send("This is a random page");
});

app.get("/err",(req,res)=>{
    abcd=abcd;
});

//Activity 
app.get("/admin",(req,res)=>{
    throw new ExpressError(403,"Access to admin is Forbidden");
});

app.use((err,req,res,next)=>{
    let {status,message} = err;
    res.status(status).send(message);
});


// app.use((err,req,res,next)=>{
//     console.log("--------ERROR1-------");
//     // next(err);
//     res.send(err);
// });


// app.use((err,req,res,next)=>{
//     console.log("------ERROR2-----");
//     next(err);
// })
// 404 if none of the other routes match , then this route matches and shows this page.
// app.use((req,res)=>{
//     res.status(404).send("Page not found");
// });

app.listen(8080,()=>{
    console.log("server listening to port 8080");
});