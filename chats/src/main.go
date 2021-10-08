package main

import (
	"chats/src/entity"
	"chats/src/repository"
	"encoding/json"
	"log"
	"math/rand"
	"net/http"
	"os"
	"strconv"

	"github.com/gorilla/mux"
)

var(
	repo repository.FireStoreRepo = repository.NewFirestoreRepo()
)
func main()  {
	setEnvVariables()

	// Init Router
	r := mux.NewRouter()

	// Route Handlers / Endpoints
	r.HandleFunc("/api/chats/{cid}",getChatMessages).Methods(("GET"))
	r.HandleFunc("/api/chats/{cid}",createChatMessage).Methods(("POST"))
	// r.HandleFunc("/api/chats/{id}/{mid}",deleteChatMessage).Methods(("DELETE"))

	log.Fatal(http.ListenAndServe(":8000",r))
}

func setEnvVariables(){
	os.Setenv("GOOGLE_APPLICATION_CREDENTIALS","/Users/amirpahadi/Developer/Firebase/service.json")
	println("Environment variables setup complete")
}

// Add new message to the chat
func createChatMessage(response http.ResponseWriter, request *http.Request)  {
	response.Header().Set("Content-Type","application/json")
	params:=mux.Vars(request)
	cid:= params["cid"]

	var message entity.Message
	err := json.NewDecoder(request.Body).Decode(&message)
	if err != nil {
		response.WriteHeader(http.StatusInternalServerError)
		response.Write([]byte(`{"error":"Error fetching the chat messages`))
	}

	message.MID = strconv.Itoa(rand.Int())
	repo.AddMessage(&message,message.MID,cid)

	response.WriteHeader(http.StatusOK)
	json.NewEncoder(response).Encode(message)
}

// Gets chat messages
func getChatMessages(response http.ResponseWriter,request *http.Request)  {
	response.Header().Set("Content-Type","application/json")
	params:=mux.Vars(request)
	cid:= params["cid"]

	messages, err := repo.FetchChat(cid)
	if err != nil {
		response.WriteHeader(http.StatusInternalServerError)
		response.Write([]byte(`{"error":"Error fetching the chat messages`))
	}

	response.WriteHeader(http.StatusOK)
	json.NewEncoder(response).Encode(messages)
}

// // delete a message in the chat
// func deleteChatMessage(w http.ResponseWriter,r *http.Request)  {
// 	w.Header().Set("Content-Type","application/json")
// 	params:=mux.Vars(r)
// 	mid:= params["mid"]
// 	updatedChat := findAndDelete(chat,mid)
// 	json.NewEncoder(w).Encode(updatedChat)
// }

// func findAndDelete(s []entity.Message, mid string) []entity.Message {
//     index := 0
//     for _, message := range s {
//         if message.MID != mid {
//             s[index] = message
//             index++
//         }
//     }
//     return s[:index]
// }
