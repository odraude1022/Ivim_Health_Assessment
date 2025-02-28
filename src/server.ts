import app from "./app"

const PORT:number=parseInt(process.env.SERVER_PORT || "3000");

app.listen(PORT,() => {
    console.log('The application is listening '
          + 'on port '+PORT);
})