const express = require("express");
const app = express();
const body = require("body-parser");
const jsonParser = body.json();

//connect to the cluster Mongodb
const { MongoClient, ServerApiVersion } = require('mongodb');
const url = "mongodb+srv://Aguilar:Eleven11@cluster0.2q9f60t.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(url);

// body parser configuration
app.use(body.json());
app.use(body.urlencoded({ extended: true }));

async function connectDB(){
  await client.connect();
  database = client.db("workout-world");
  collection = database.collection("workouts");
  
}
  
connectDB();

app.get("/", (request, response, next) => {
  response.json({ message: "Hey! This is your server response!" });
  next();
});

//get all the workout information
//localhost:3000/workouts
async function getAllWorkouts(req, res){
	const query = {};
	let workoutCursor = await collection.find(query);
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

	let workoutCursor = await collection.find(query);
	let workouts = await workoutCursor.toArray();

	const response = workouts;
	res.json(response)
	console.log(response);
}

app.get(`/workout-webapp/workout/:name`, getWorkoutsByName);

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

		let workoutCursor = await collection.find(query);
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

	let workoutCursor = await collection.find(query);
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

	let workoutCursor = await collection.find(query);
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

	let workoutCursor = await collection.find(query);
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

	const workoutCursor = await collection.find(query);
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

	const workoutCursor = await collection.find(query);
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

	const workoutCursor = await collection.find(query);
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
	const result = await collection.updateOne(filter, updateDocument);

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
	let workoutCursor = await collection.find({
		favorite: true
  	}); 

  	let workouts = await workoutCursor.toArray();
	const response = workouts;
	res.json(response);
}
app.get('/workout-webapp/favorites', getFavorites);

module.exports = app;
