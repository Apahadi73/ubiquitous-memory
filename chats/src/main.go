package main

import (
	"encoding/json"
	"log"
	"net/http"

	"./entity"
	"./repository"
	"github.com/gorilla/mux"
)

var(
	repo repository.FireStoreRepo = repository.NewFirestoreRepo()
)
func main()  {
	// Init Router
	r := mux.NewRouter()
	// Route Handlers / Endpoints
	r.HandleFunc("/api/chats/{id}",getChatMessages).Methods(("GET"))
	// r.HandleFunc("/api/chats/{id}",createChatMessage).Methods(("POST"))
	// r.HandleFunc("/api/chats/{id}/{mid}",deleteChatMessage).Methods(("DELETE"))
	log.Fatal(http.ListenAndServe(":8000",r))
}


// // Add new message to the chat
// func createChatMessage(w http.ResponseWriter, r *http.Request)  {
// 	w.Header().Set("Content-Type","application/json")
// 	var message entity.Message
// 	_= json.NewDecoder(r.Body).Decode(&message)
// 	message.MID = strconv.Itoa(rand.Intn(10000000))
// 	chat = append(chat,message )
// 	json.NewEncoder(w).Encode(chat)
// }

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

func findAndDelete(s []entity.Message, mid string) []entity.Message {
    index := 0
    for _, message := range s {
        if message.MID != mid {
            s[index] = message
            index++
        }
    }
    return s[:index]
}
