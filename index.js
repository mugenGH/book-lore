import express, { response } from"express";
import axios  from "axios";
import movieQuotes  from "movie-quotes";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();
const app=express();
const port = 3000;



app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
 const ApiEndpt="https://www.googleapis.com/books/v1/volumes?q=";

 const API_KEY =process.env.GOOGLE_BOOKS_API_KEY;
 
 

app.use(express.static("public"));
 app.get("/",(req,res)=>{
const quotes=movieQuotes.random();
    res.render("start.ejs",{quotes:quotes})
 });

app.post("/search", async (req,res)=>{
   try{
  const title= req.body.title;
  const response = await axios.get(`${ApiEndpt}${title}&maxResults=40`);
  const result=response.data;
 
res.render("result.ejs",{title:title,result:result})
   }catch(error){
res.render("result.ejs",{title: "no match found",result:[]})
res.status(503).send("503 too many request 😣😣😣😣")
   }

})
 app.get("/home", async(req,res)=>{
   try{
      const response1 = await axios.get( `https://www.googleapis.com/books/v1/volumes?q=subject:health+mind+body&maxResults=15&key=${API_KEY}`);
      const response2= await axios.get( `https://www.googleapis.com/books/v1/volumes?q=subject:fiction&orderBy=relevance&maxResults=15&orderBy=newest&key=${API_KEY}`);
      const result1=response1.data;
      const result2=response2.data;
res.render("home.ejs",{result1:result1,result2:result2})   ;    
   }
   catch(error){
      console.error('Error fetching trending books:', error);
      res.render("home.ejs",{result:[]})
      res.status(503).send("503 too many request 😣😣😣😣")
   }
 })
 app.get("/item",async(req,res)=>{
  
   try{   const selfLink=req.query.selfLink;
    const text=req.query.textSnippet;  
   const response= await axios.get( `${selfLink}`)
      const result=response.data;
   res.render("item.ejs",{result:result,text:text});
   }catch(error){
      res.status(503).send("503 too many request 😣😣😣😣")
   }

 })
 app.post("/category", async(req,res)=>{
   try{
const category=req.body.id;
const response = await axios.get(`${ApiEndpt}subject:${category}&maxResults=40`);
const result=response.data;
res.render("result.ejs",{title:category,result:result});


   }catch(error){
res.render("result.ejs",{title: "no match found",result:[]})
res.status(503).send("503 too many request 😣😣😣😣")
   }


 })
app.get("/test",(req,res)=>{
  res.send("ok200")
})

 app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
