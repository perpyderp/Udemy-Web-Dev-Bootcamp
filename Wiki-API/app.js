
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { urlencoded } = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view-engine", "ejs");

// Set `strictQuery: false` to globally opt into filtering by properties that aren't in the schema
// Included because it removes preparatory warnings for Mongoose 7.
// See: https://mongoosejs.com/docs/migrating_to_6.html#strictquery-is-removed-and-replaced-by-strict
mongoose.set('strictQuery', false);

// Define the database URL to connect to.
const wikiDB = "mongodb://127.0.0.1:27017/wikiDB";

// Wait for database to connect, logging an error if there is a problem 
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(wikiDB);
}

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

app.route("/articles") 

.get((req, res) => {
    Article.find({}).
    then(article => res.json({ article })).
    catch(error => res.json({ error: error.message }));
})

.post((req, res) => {
    const newArticle = new Article ({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save().
    then(response => res.send("Successfully added article to DB")).
    catch(error => res.json({ error: error.message}));
})

.delete((req, res) => {
    Article.deleteMany({}).
    then(res.send("Successfully deleted all articles from DB")).
    catch(error => res.json({ error: error.message}));
});

app.route("/articles/:articleTitle")

.get((req, res) => {
    Article.findOne({title: req.params.articleTitle}).
    then(foundArticle => {
        if(foundArticle) {
            res.json({ foundArticle });
        }
        else {
            res.send("Could not find article with title: " + req.params.articleTitle);
        }
    }).
    catch(error => res.json({ error: error.message }));
})

.put((req, res) => {
    Article.updateOne(
        {title : req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {overwite: true}
    ).
    then(result => {
        if(result.matchedCount == 0) {
            res.send("Could not find article titled: " + req.params.articleTitle);
        }
        else {
            res.send("Successfully updated article: " + req.params.articleTitle);
        }
    }).
    catch(error => res.json({ error: error.message }));
})

.patch((req, res) => {
    Article.updateOne(
        {title: req.params.articleTitle},
        { $set: req.body}
    ).
    then(result => {
        if(result.matchedCount == 0) {
            res.send("Could not find article titled: " + req.params.articleTitle);
        }
        else {
            res.send("Successfully updated article: " + req.params.articleTitle);
        }
    }).
    catch(error => res.json({ error: error.message }));
})

.delete((req, res) => {
    Article.deleteOne(
        {title: req.params.articleTitle}
    ).
    then(result => {
        if(result.deletedCount == 0) {
            res.send("Could not find article titled: " + req.params.articleTitle);
        }
        else {
            res.send("Successfully deleted article: " + req.params.articleTitle);
        }
    }).
    catch(error => res.json({ error: error.message }));

});

app.listen(3000, function() {
    console.log("Server started on port 3000");
});