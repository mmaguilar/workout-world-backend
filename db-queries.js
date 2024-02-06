const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://Aguilar:Eleven11@cluster0.2q9f60t.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function connectDB(){
	await client.connect();

	const database = client.db("workout-world");
	const collection = database.collection("workouts");

	const workoutDocument = [
	{
		_id: "",
		name: "",
		type: "",
		muscle: "",
		equipment: "",
		difficulty: "",
		instructions: "",
		favorite: false,
		image: ""
	},
	{
		_id: "",
		name: "",
		type: "",
		muscle: "",
		equipment: "",
		difficulty: "",
		instructions: "",
		favorite: false,
		image: ""
	},
	{
		_id: "",
		name: "",
		type: "",
		muscle: "",
		equipment: "",
		difficulty: "",
		instructions: "",
		favorite: false,
		image: ""
	},
	{
		_id: "",
		name: "",
		type: "",
		muscle: "",
		equipment: "",
		difficulty: "",
		instructions: "",
		favorite: false,
		image: ""
	},
	
	];

	const result = await collection.insertMany(workoutDocument);

	console.log(result);
    client.close();
}
connectDB();


