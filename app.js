const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jsonParser = bodyParser.json();

const { MongoClient } = require('mongodb');
const url = "mongodb+srv://Aguilar:Eleven11@cluster0.2q9f60t.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(url);
database = client.db("workout-world");
workoutCollection = database.collection("workouts");

//require database connection 
const connectDB = require("./db/connectDB");
const User = require("./db/userModel");
const auth = require("./auth");

connectDB();
	
// body parser configuration
app.use(jsonParser);
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (request, response, next) => {
	response.json({ message: "Hey! This is your server response!" });
	next();
  });  

//auth endpoint 
async function authorizeUser(request, response){
	response.json({
		message: "You are authorized to access me."
	})
}
app.get("/auth-endpoint", auth, authorizeUser);

//login endpoint 
async function loginUser(request, response){
	User
	.findOne({ email: request.body.email })
	.then((user) => {
		bcrypt.compare(request.body.password, user.password)
		.then((passwordCheck) => {

			//check if password matches
			if(!passwordCheck){
				return resposnse.status(400).send({
					message: "Passwords do not match", 
					error
				})
			}

			//create JWT token
			const token = jwt.sign(
				{
					userId: user._id,
					userEmail: user.email
				},
				"RANDOM-TOKEN",
				{ expiresIn: "24h"}
			);

			//return success response 
			response.status(200).send({
				message: "Login Successful",
				email: user.email,
				token
			})
		})
		.catch((error) => {
			response.status(400).send({
				message: "Passwords do not match",
				error
			});
		});
	})
	.catch((e) => {
		response.status(404).send({
			message: "Email not found",
			e
		});
	});

}
app.post("/login", loginUser);

//register endpoint
async function registerUser(request, response){
	bcrypt
    .hash(request.body.password, 10)
    .then((hashedPassword) => {
      // create a new user instance and collect the data
      const user = new User({
        email: request.body.email,
        password: hashedPassword,
      });
	  user.save()

	  // return success if the new user is added to the database successfully
	  .then((result) => {
		response.status(201).send({
		  message: "User Created Successfully",
		  result,
		});
	  })
	  // catch erroe if the new user wasn't added successfully to the database
	  .catch((error) => {
		response.status(500).send({
		  message: "Error creating user",
		  error,
		});
	  });

    })
    // catch error if the password hash isn't successful
    .catch((e) => {
      response.status(500).send({
        message: "Password was not hashed successfully",
        e,
      });
    });
}
app.post("/register", registerUser);

//get all the workout information
//localhost:3000/workouts
async function getAllWorkouts(req, res){
	const query = {};
	let workoutCursor = await workoutCollection.find(query);
	let workouts = await workoutCursor.toArray();
	console.log(workouts);

	//construct response 
	const response = workouts;
	res.json(response);
}
app.get('/workout-webapp/workouts', getAllWorkouts);

//get workout information by name 
//localhost:3000/workout/:name
async function getWorkoutsByName(req, res){
	const workoutName = req.params.name;

	const query ={
		_id: workoutName
	}

	let workoutCursor = await workoutCollection.find(query);
	let workouts = await workoutCursor.toArray();

	const response = workouts;
	res.json(response)
	console.log(response);
}

app.get('/workout-webapp/workout/:name', getWorkoutsByName);

//get workout information by all dropdown info
//localhost:3000/search/all?type=strength&muscle=quadriceps&difficulty=intermediate
async function getWorkoutsByAll(req,res){
		const workoutType = req.query.type;
		const workoutMuscle = req.query.muscle;
		const workoutDifficulty = req.query.difficulty;

		//construct query
		const query = {
			type : workoutType,
			muscle : workoutMuscle,
			difficulty : workoutDifficulty
		}

		let workoutCursor = await workoutCollection.find(query);
		let workouts = await workoutCursor.toArray();

		const response = workouts;
		res.json(response)
		console.log(response);
}
app.get('/workout-webapp/search/all', getWorkoutsByAll);


//get workouts by type and muscle 
//localhost:3000/search/typeandmuscle?type=strength&muscle=quadriceps
async function getWorkoutsByTypeAndMuscle(req, res){
	const workoutType = req.query.type;
	const workoutMuscle = req.query.muscle;

	//construct query
	const query = {
		type : workoutType,
		muscle : workoutMuscle
	}

	let workoutCursor = await workoutCollection.find(query);
	let workouts = await workoutCursor.toArray();

	const response = workouts;
	res.json(response);
	console.log(response);
}
app.get('/workout-webapp/search/typeandmuscle', getWorkoutsByTypeAndMuscle);



//get workouts by type and difficulty 
//localhost:3000/search/typeanddifficulty?type=strength&difficulty=beginner
async function getWorkoutsByTypeAndDifficulty(req, res){
	const workoutType = req.query.type;
	const workoutDifficulty = req.query.difficulty;

	//construct query
	const query = {
		type : workoutType,
		difficulty : workoutDifficulty
	}

	let workoutCursor = await workoutCollection.find(query);
	let workouts = await workoutCursor.toArray();

	const response = workouts;
	res.json(response);
	console.log(response);
}
app.get('/workout-webapp/search/typeanddifficulty', getWorkoutsByTypeAndDifficulty);



//get workouts by muscle and difficulty 
//localhost:3000/search/muscleanddifficulty?muscle=biceps&difficulty=beginner
async function getWorkoutsByMuscleAndDifficulty(req, res){
	const workoutMuscle = req.query.muscle;
	const workoutDifficulty = req.query.difficulty;

	//construct query
	const query = {
		muscle : workoutMuscle,
		difficulty : workoutDifficulty
	}

	let workoutCursor = await workoutCollection.find(query);
	let workouts = await workoutCursor.toArray();

	const response = workouts;
	res.json(response);
	console.log(response);
}
app.get('/workout-webapp/search/muscleanddifficulty', getWorkoutsByMuscleAndDifficulty);



//get workouts by type
//localhost:3000/search/type/:type
async function getWorkoutsByType(req, res){
	const workoutType = req.params.type;

	//construct query
	const query = {
		type: workoutType
	}

	const workoutCursor = await workoutCollection.find(query);
	const workouts = await workoutCursor.toArray();

	const response = workouts;
	res.json(response);
	console.log(response);
}
app.get('/workout-webapp/search/type/:type', getWorkoutsByType);


//get workouts by muscle
//localhost:3000/search/muscle/:muscle
async function getWorkoutsByMuscle(req, res){
	const workoutMuscle = req.params.muscle;

	//construct query
	const query = {
		muscle: workoutMuscle
	}

	const workoutCursor = await workoutCollection.find(query);
	const workouts = await workoutCursor.toArray();

	const response = workouts;
	res.json(response);
	console.log(response);
}
app.get('/workout-webapp/search/muscle/:muscle', getWorkoutsByMuscle);



//get workouts by difficulty
//localhost:3000/search/difficulty/:difficulty
async function getWorkoutsByDifficulty(req, res){
	const workoutDifficulty = req.params.difficulty;

	//construct query
	const query = {
		difficulty: workoutDifficulty
	}

	const workoutCursor = await workoutCollection.find(query);
	const workouts = await workoutCursor.toArray();

	const response = workouts;
	res.json(response);
	console.log(response);
}
app.get('/workout-webapp/search/difficulty/:difficulty', getWorkoutsByDifficulty);


//post request that allows users to update workout favorites
//localhost:3000/updatefavorite/hangclean
async function updateFavorite(req, res){
	const workoutName = req.params.workoutId;
	console.log(workoutName);
	const newFavorite = req.body.favorite;
	console.log(newFavorite);

	const filter = {_id : workoutName};

	const updateDocument = {
		$set: {
			favorite: newFavorite
		}
	};

	console.log(filter);
	const result = await workoutCollection.updateOne(filter, updateDocument);

	//http request code 
	const response = [
	{matchedCount: result.matchedCount},
	{modifiedCount: result.modifiedCount}
	];

	console.log(response);
}
app.post('/workout-webapp/updatefavorite/:workoutId', jsonParser, updateFavorite);



//get request that allows user to get workout favorites 
//localhost:3000/favorites
async function getFavorites(req, res){
	//finds favorited workouts
	let workoutCursor = await workoutCollection.find({
		favorite: true
  	}); 

  	let workouts = await workoutCursor.toArray();
	const response = workouts;
	res.json(response);
}
app.get('/api/workout-webapp/favorites', getFavorites);

module.exports = app;
