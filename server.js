//jshint esversion:6

const express = require("express");
const ejs = require("ejs");
const mongoose = require('mongoose');
const mongodb = require('mongodb')
const fs = require('fs');
const dotenv = require('dotenv');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require("mongoose-findorcreate");
const session = require('express-session');
const FacebookStrategy = require('passport-facebook').Strategy;
dotenv.config();

const url = `mongodb+srv://BishalAgarwal:${process.env.password}@atlascluster.2x9rxca.mongodb.net`;
const app = express();

const path = require('path');
app.set('view engine', 'ejs');

app.use(express.static("public"));
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET'
}));

app.get('/', function(req, res) {
  res.render('index');
});


var userProfile;

app.use(passport.initialize());
app.use(passport.session());



passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "/auth/google/course",
    proxy : true
  },
  function(accessToken, refreshToken, profile, done) {
    userProfile = profile;
    return done(null, userProfile);
  }
));

app.get('/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  }));

app.get('/auth/google/course',
passport.authenticate('google', {
  failureRedirect: '/'
}),
function(req, res) {
  // Successful authentication, redirect success.
  res.redirect('/course');
});
passport.use(new FacebookStrategy({
    clientID: process.env.APP_ID,
    clientSecret: process.env.APP_SECRET,
    callbackURL: "/auth/facebook/course",
    proxy : true
  },
  function(accessToken, refreshToken, profile, done) {
    userProfile = profile;
    return done(null, userProfile);
  }
));

app.get('/auth/facebook',
  passport.authenticate('facebook'));

app.get('/auth/facebook/course',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/course');
  });
app.get("/course", function(req, res) {
  res.render('course');
  res.sendFile(__dirname + "course");
});

const videoDir = __dirname + '/videos';
const videoArray = fs.readdirSync(videoDir).filter(function(file) {
  return path.extname(file) === '.mp4';
});
app.get("/init-video", function(req, res) {
  mongodb.MongoClient.connect(url, function(error, client) {
    if (error) {
      res.json(error);
      return;
    }
    for (let i = 0; i < videoArray.length; i++) {
      const db = client.db('videos');
      const bucket = new mongodb.GridFSBucket(db);
      const vidUploadStream = bucket.openUploadStream(`${i}`);
      const vidReadStream = fs.createReadStream('videos/' + videoArray[i])
      vidReadStream.pipe(vidUploadStream);
    }
    res.status(200).send("done....");
  });
});

app.get("/whatIsML", function(req, res) {
  mongodb.MongoClient.connect(url, function(error, client) {
    if (error) {
      res.status(500).json(error);
      return;
    }

    // Check for range headers to find our start time
    var range = req.headers.range;
    if (!range) {
      range = 'bytes = 0-';
    }

    const db = client.db('videos');
    // GridFS Collection
    db.collection('fs.files').findOne({
      filename: "0"
    }, (err, video) => {
      if (!video) {
        res.status(404).send("No video uploaded!");
        return;
      }

      // Create response headers
      const videoSize = video.length;
      const start = Number(range.replace(/\D/g, ""));
      const end = videoSize - 1;

      const contentLength = end - start + 1;
      const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
      };

      // HTTP Status 206 for Partial Content
      res.writeHead(206, headers);

      // Get the bucket and download stream from GridFS
      const bucket = new mongodb.GridFSBucket(db);
      const downloadStream = bucket.openDownloadStreamByName("0", {
        start
      });
      // Finally pipe video to response
      downloadStream.pipe(res);
    });
  });
});

app.get("/rentCostOfFlat", function(req, res) {
  mongodb.MongoClient.connect(url, function(error, client) {
    if (error) {
      res.status(500).json(error);
      return;
    }

    // Check for range headers to find our start time
    var range = req.headers.range;
    if (!range) {
      range = 'bytes = 0-';
    }

    const db = client.db('videos');
    // GridFS Collection
    db.collection('fs.files').findOne({
      filename: "1"
    }, (err, video) => {
      if (!video) {
        res.status(404).send("No video uploaded!");
        return;
      }

      // Create response headers
      const videoSize = video.length;
      const start = Number(range.replace(/\D/g, ""));
      const end = videoSize - 1;

      const contentLength = end - start + 1;
      const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
      };

      // HTTP Status 206 for Partial Content
      res.writeHead(206, headers);

      // Get the bucket and download stream from GridFS
      const bucket = new mongodb.GridFSBucket(db);
      const downloadStream = bucket.openDownloadStreamByName("1", {
        start
      });
      // Finally pipe video to response
      downloadStream.pipe(res);
    });
  });
});

app.get("/linearRegression", function(req, res) {
  mongodb.MongoClient.connect(url, function(error, client) {
    if (error) {
      res.status(500).json(error);
      return;
    }

    // Check for range headers to find our start time
    var range = req.headers.range;
    if (!range) {
      range = 'bytes = 0-';
    }

    const db = client.db('videos');
    // GridFS Collection
    db.collection('fs.files').findOne({
      filename: "2"
    }, (err, video) => {
      if (!video) {
        res.status(404).send("No video uploaded!");
        return;
      }

      // Create response headers
      const videoSize = video.length;
      const start = Number(range.replace(/\D/g, ""));
      const end = videoSize - 1;

      const contentLength = end - start + 1;
      const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
      };

      // HTTP Status 206 for Partial Content
      res.writeHead(206, headers);

      // Get the bucket and download stream from GridFS
      const bucket = new mongodb.GridFSBucket(db);
      const downloadStream = bucket.openDownloadStreamByName("2", {
        start
      });
      // Finally pipe video to response
      downloadStream.pipe(res);
    });
  });
});

app.get("/polymerRegression", function(req, res) {
  mongodb.MongoClient.connect(url, function(error, client) {
    if (error) {
      res.status(500).json(error);
      return;
    }

    // Check for range headers to find our start time
    var range = req.headers.range;
    if (!range) {
      range = 'bytes = 0-';
    }

    const db = client.db('videos');
    // GridFS Collection
    db.collection('fs.files').findOne({
      filename: "3"
    }, (err, video) => {
      if (!video) {
        res.status(404).send("No video uploaded!");
        return;
      }

      // Create response headers
      const videoSize = video.length;
      const start = Number(range.replace(/\D/g, ""));
      const end = videoSize - 1;

      const contentLength = end - start + 1;
      const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
      };

      // HTTP Status 206 for Partial Content
      res.writeHead(206, headers);

      // Get the bucket and download stream from GridFS
      const bucket = new mongodb.GridFSBucket(db);
      const downloadStream = bucket.openDownloadStreamByName("3", {
        start
      });
      // Finally pipe video to response
      downloadStream.pipe(res);
    });
  });
});

app.get("/spamEmailFilter", function(req, res) {
  mongodb.MongoClient.connect(url, function(error, client) {
    if (error) {
      res.status(500).json(error);
      return;
    }

    // Check for range headers to find our start time
    var range = req.headers.range;
    if (!range) {
      range = 'bytes = 0-';
    }

    const db = client.db('videos');
    // GridFS Collection
    db.collection('fs.files').findOne({
      filename: "4"
    }, (err, video) => {
      if (!video) {
        res.status(404).send("No video uploaded!");
        return;
      }

      // Create response headers
      const videoSize = video.length;
      const start = Number(range.replace(/\D/g, ""));
      const end = videoSize - 1;

      const contentLength = end - start + 1;
      const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
      };

      // HTTP Status 206 for Partial Content
      res.writeHead(206, headers);

      // Get the bucket and download stream from GridFS
      const bucket = new mongodb.GridFSBucket(db);
      const downloadStream = bucket.openDownloadStreamByName("4", {
        start
      });
      // Finally pipe video to response
      downloadStream.pipe(res);
    });
  });
});

app.get("/recommendationOfApps", function(req, res) {
  mongodb.MongoClient.connect(url, function(error, client) {
    if (error) {
      res.status(500).json(error);
      return;
    }

    // Check for range headers to find our start time
    var range = req.headers.range;
    if (!range) {
      range = 'bytes = 0-';
    }

    const db = client.db('videos');
    // GridFS Collection
    db.collection('fs.files').findOne({
      filename: "5"
    }, (err, video) => {
      if (!video) {
        res.status(404).send("No video uploaded!");
        return;
      }

      // Create response headers
      const videoSize = video.length;
      const start = Number(range.replace(/\D/g, ""));
      const end = videoSize - 1;

      const contentLength = end - start + 1;
      const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
      };

      // HTTP Status 206 for Partial Content
      res.writeHead(206, headers);

      // Get the bucket and download stream from GridFS
      const bucket = new mongodb.GridFSBucket(db);
      const downloadStream = bucket.openDownloadStreamByName("5", {
        start
      });
      // Finally pipe video to response
      downloadStream.pipe(res);
    });
  });
});

app.get("/applicationOfMLInCollege1", function(req, res) {
  mongodb.MongoClient.connect(url, function(error, client) {
    if (error) {
      res.status(500).json(error);
      return;
    }

    // Check for range headers to find our start time
    var range = req.headers.range;
    if (!range) {
      range = 'bytes = 0-';
    }

    const db = client.db('videos');
    // GridFS Collection
    db.collection('fs.files').findOne({
      filename: "6"
    }, (err, video) => {
      if (!video) {
        res.status(404).send("No video uploaded!");
        return;
      }

      // Create response headers
      const videoSize = video.length;
      const start = Number(range.replace(/\D/g, ""));
      const end = videoSize - 1;

      const contentLength = end - start + 1;
      const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
      };

      // HTTP Status 206 for Partial Content
      res.writeHead(206, headers);

      // Get the bucket and download stream from GridFS
      const bucket = new mongodb.GridFSBucket(db);
      const downloadStream = bucket.openDownloadStreamByName("6", {
        start
      });
      // Finally pipe video to response
      downloadStream.pipe(res);
    });
  });
});

app.get("/applicationOfMLInCollege2", function(req, res) {
  mongodb.MongoClient.connect(url, function(error, client) {
    if (error) {
      res.status(500).json(error);
      return;
    }

    // Check for range headers to find our start time
    var range = req.headers.range;
    if (!range) {
      range = 'bytes = 0-';
    }

    const db = client.db('videos');
    // GridFS Collection
    db.collection('fs.files').findOne({
      filename: "7"
    }, (err, video) => {
      if (!video) {
        res.status(404).send("No video uploaded!");
        return;
      }

      // Create response headers
      const videoSize = video.length;
      const start = Number(range.replace(/\D/g, ""));
      const end = videoSize - 1;

      const contentLength = end - start + 1;
      const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
      };

      // HTTP Status 206 for Partial Content
      res.writeHead(206, headers);

      // Get the bucket and download stream from GridFS
      const bucket = new mongodb.GridFSBucket(db);
      const downloadStream = bucket.openDownloadStreamByName("7", {
        start
      });
      // Finally pipe video to response
      downloadStream.pipe(res);
    });
  });
});

app.get("/neuralNetworks", function(req, res) {
  mongodb.MongoClient.connect(url, function(error, client) {
    if (error) {
      res.status(500).json(error);
      return;
    }

    // Check for range headers to find our start time
    var range = req.headers.range;
    if (!range) {
      range = 'bytes = 0-';
    }

    const db = client.db('videos');
    // GridFS Collection
    db.collection('fs.files').findOne({
      filename: "8"
    }, (err, video) => {
      if (!video) {
        res.status(404).send("No video uploaded!");
        return;
      }

      // Create response headers
      const videoSize = video.length;
      const start = Number(range.replace(/\D/g, ""));
      const end = videoSize - 1;

      const contentLength = end - start + 1;
      const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
      };

      // HTTP Status 206 for Partial Content
      res.writeHead(206, headers);

      // Get the bucket and download stream from GridFS
      const bucket = new mongodb.GridFSBucket(db);
      const downloadStream = bucket.openDownloadStreamByName("8", {
        start
      });
      // Finally pipe video to response
      downloadStream.pipe(res);
    });
  });
});

app.get("/recognizingHandWrittenDigits1", function(req, res) {
  mongodb.MongoClient.connect(url, function(error, client) {
    if (error) {
      res.status(500).json(error);
      return;
    }

    // Check for range headers to find our start time
    var range = req.headers.range;
    if (!range) {
      range = 'bytes = 0-';
    }

    const db = client.db('videos');
    // GridFS Collection
    db.collection('fs.files').findOne({
      filename: "9"
    }, (err, video) => {
      if (!video) {
        res.status(404).send("No video uploaded!");
        return;
      }

      // Create response headers
      const videoSize = video.length;
      const start = Number(range.replace(/\D/g, ""));
      const end = videoSize - 1;

      const contentLength = end - start + 1;
      const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
      };

      // HTTP Status 206 for Partial Content
      res.writeHead(206, headers);

      // Get the bucket and download stream from GridFS
      const bucket = new mongodb.GridFSBucket(db);
      const downloadStream = bucket.openDownloadStreamByName("9", {
        start
      });
      // Finally pipe video to response
      downloadStream.pipe(res);
    });
  });
});

app.get("/recognizingHandWrittenDigits2", function(req, res) {
  mongodb.MongoClient.connect(url, function(error, client) {
    if (error) {
      res.status(500).json(error);
      return;
    }

    // Check for range headers to find our start time
    var range = req.headers.range;
    if (!range) {
      range = 'bytes = 0-';
    }

    const db = client.db('videos');
    // GridFS Collection
    db.collection('fs.files').findOne({
      filename: "10"
    }, (err, video) => {
      if (!video) {
        res.status(404).send("No video uploaded!");
        return;
      }

      // Create response headers
      const videoSize = video.length;
      const start = Number(range.replace(/\D/g, ""));
      const end = videoSize - 1;

      const contentLength = end - start + 1;
      const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
      };

      // HTTP Status 206 for Partial Content
      res.writeHead(206, headers);

      // Get the bucket and download stream from GridFS
      const bucket = new mongodb.GridFSBucket(db);
      const downloadStream = bucket.openDownloadStreamByName("10", {
        start
      });
      // Finally pipe video to response
      downloadStream.pipe(res);
    });
  });
});

app.get("/deepLearning", function(req, res) {
  mongodb.MongoClient.connect(url, function(error, client) {
    if (error) {
      res.status(500).json(error);
      return;
    }

    // Check for range headers to find our start time
    var range = req.headers.range;
    if (!range) {
      range = 'bytes = 0-';
    }

    const db = client.db('videos');
    // GridFS Collection
    db.collection('fs.files').findOne({
      filename: "11"
    }, (err, video) => {
      if (!video) {
        res.status(404).send("No video uploaded!");
        return;
      }

      // Create response headers
      const videoSize = video.length;
      const start = Number(range.replace(/\D/g, ""));
      const end = videoSize - 1;

      const contentLength = end - start + 1;
      const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
      };

      // HTTP Status 206 for Partial Content
      res.writeHead(206, headers);

      // Get the bucket and download stream from GridFS
      const bucket = new mongodb.GridFSBucket(db);
      const downloadStream = bucket.openDownloadStreamByName("11", {
        start
      });
      // Finally pipe video to response
      downloadStream.pipe(res);
    });
  });
});

app.get("/discuss", function(req, res) {
  res.render("discuss");
  res.sendFile(__dirname + "/discuss");
});

app.get("/gethelp", function(req, res) {
  res.render("gethelp");
  res.sendFile(__dirname + "/gethelp");
});

app.get("/user", function(req, res) {
  res.render("gethelp");
  res.sendFile(__dirname + "/user");
});

app.get("/logout", function(req, res) {
  req.logout(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

app.listen(3000, function(req, res) {
  console.log("Server started on port 3000");
});
