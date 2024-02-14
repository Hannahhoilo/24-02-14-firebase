import firebaseConfig from "./firebaseConfig";

import {initializeApp} from 'firebase/app';

import {getFirestore, collection, addDoc, deleteDoc, doc, onSnapshot, updateDoc} from 'firebase/firestore';
import {getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, onAuthStateChanged} from 'firebase/auth'

// initialize firebase
initializeApp(firebaseConfig);

// connect to the database on firebare
const database = getFirestore();

// connect to the trainers collection
const trainersCollection = collection(database, 'trainers');

// add trainers to the collection
const firstname = document.querySelector('.firstname');
const lastname = document.querySelector('.lastname');
const birthyear = document.querySelector('.birthyear');
const addTrainersForm = document.querySelector('.add-trainers-form');

addTrainersForm.addEventListener('submit', (e)=>{
	e.preventDefault();
	const newTrainer = {
		firstname: firstname.value,
		lastname: lastname.value,
		birthyear: birthyear.value
	}
	addDoc(trainersCollection, newTrainer)
	.then(()=> {
		console.log('Trainer has been added to the collection');
		addTrainersForm.reset();
	})
	.catch(err => console.log(err.message))
})

// delete documents from the collection
const deleteID = document.querySelector('.delete-ID');
const deleteButton = document.querySelector('.delete-trainer-button');

deleteButton.addEventListener('click', (e)=>{
	e.preventDefault();
	const docToDelete = doc(database, 'trainers', deleteID.value);
	deleteDoc(docToDelete)
	.then(()=> {
		console.log('The trainer has been deleted');
		deleteID.value = '';
	})
	.catch(err => console.log(err.message))
})

// fetching trainers from the collection
onSnapshot(trainersCollection, (snapshot)=>{
	const trainersArray = [];
	snapshot.docs.forEach(doc => {
		// console.log(snapshot);
		trainersArray.push({id: doc.id, ...doc.data()})
	})
	console.log(trainersArray);
})

// uppdating an existing document
const updateID = document.querySelector('.update-ID');
const updateButton = document.querySelector('.update-trainer-button');

updateButton.addEventListener('click', (e)=>{
	e.preventDefault();
	const docToUpdate = doc(database, 'trainers', updateID.value)
	updateDoc(docToUpdate, {
		firstname: 'update fistname'
	})
	.then(()=>{
		console.log('The document has been updated succesfully')
		updateID.value = '';
	})
	.catch(err => console.log(err.message))
})


// PART 2 AUTHENTICATION ---------------------------------------- <3 ------ <3 ----- <3

// initializing the authentication service
const authService = getAuth();

// signing up users
const email = document.querySelector('.email');
const password = document.querySelector('.password');
const signUpButton = document.querySelector('.sign-up-button');


const signUpUsers = ()=>{
	const userEmail = email.value;
	const userPassword = password.value;
	createUserWithEmailAndPassword(authService, userEmail, userPassword)
	.then((cred)=> {
		console.log('The account has been created successfully');
		console.log(cred);
	})
	.catch(err => console.log(err.message))
}

signUpButton.addEventListener('click', (e)=>{
	e.preventDefault();
	signUpUsers();
})

// sign out users
const signOutButton = document.querySelector('.sign-out-button');

const signOutUsers = () =>{
	signOut(authService)
	.then(()=> console.log('You have successfully signed out'))
	.catch(err => console.log(err.message))
}

signOutButton.addEventListener('click', (e)=>{
	e.preventDefault();
	signOutUsers();
})

// signing in users
const signInButton = document.querySelector('.sign-in-button');
const signInUsers = ()=>{
	const userEmail = email.value;
	const userPassword = password.value;
	signInWithEmailAndPassword(authService, userEmail, userPassword)
	.then(()=>{
		console.log('You have successfully logged back in');
	})
	.catch(err => console.log(err.message))
}

signInButton.addEventListener('click', (e)=>{
	e.preventDefault();
	signInUsers()
})

// check users authentication state 

const checkUsersStatus = ()=>{
	const secretContent = document.querySelector('.secret-content');
	onAuthStateChanged(authService, user =>{
		if(user){
			secretContent.style.display = 'block';
		} else {
			secretContent.style.display = 'none';
		}
	})
}

checkUsersStatus();