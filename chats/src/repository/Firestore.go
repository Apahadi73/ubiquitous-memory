package repository

import (
	"chats/src/entity"
	"context"
	"fmt"
	"log"
	"os"

	"cloud.google.com/go/firestore"
	"google.golang.org/api/option"
)


const(
	PROJECTID string="socialo-74856"
	COLLECTIONNAME string= "donnchad-chats"
	DOCNAME string = "chat"
)
type FireStoreRepo interface {
	AddMessage(message *entity.Message, id string, cid string) (*entity.Message, error)
	FetchChat(cid string)([]entity.Message, error)
	DeleteMessage(id string, cid string)([] entity.Message, error)
}

type repo struct{}

func NewFirestoreRepo() FireStoreRepo {
	return &repo{}
}

func (*repo) AddMessage(message *entity.Message, id string, cid string) (*entity.Message, error){
	ctx := context.Background()
	json := os.Getenv("GOOGLE_APPLICATION_CREDENTIALS")
	client, err := firestore.NewClient(ctx,PROJECTID,option.WithCredentialsFile(json))
	if err != nil {
  		log.Fatalln("Failed to create a Firestore Client %v",err)
		  return nil, err
	}
	defer client.Close()

	_, _, err = client.Collection(COLLECTIONNAME).Doc(DOCNAME).Collection(cid).Add(ctx,map[string]interface{}{
		"MID":message.MID,
		"ReceiverId":message.ReceiverId,
		"SenderId":message.SenderId,
		"Text":message.Text,
		"Timestamp":message.Timestamp,
	})

	if err != nil {
  		log.Fatalln("Failed to add new message to the chat %v",err)
		  return nil, err
	}

	return message,nil
}

func (*repo) FetchChat(cid string)([]entity.Message, error){
	ctx := context.Background()

	json := os.Getenv("GOOGLE_APPLICATION_CREDENTIALS")
	client, err := firestore.NewClient(ctx,PROJECTID,option.WithCredentialsFile(json))

	if err != nil {
  		log.Fatalln("Failed to create a Firestore Client %v",err)
		return nil, err
	}
	defer client.Close()
	println(COLLECTIONNAME)
	println(DOCNAME)
	println(cid)
	var chat []entity.Message
	iterator := client.Collection(COLLECTIONNAME).Doc(DOCNAME).Collection(cid).Documents(ctx)
	for {
        doc, err := iterator.Next()

        if err != nil {
            log.Fatalln("Failed to fetch message %v",err)
			return nil, err
        }
		var post entity.Message
		doc.DataTo(&post)
		chat = append(chat, post)
	}

	return chat,nil
}

func (*repo) DeleteMessage(id string, cid string)([]entity.Message, error){
	ctx := context.Background()

	json := os.Getenv("GOOGLE_APPLICATION_CREDENTIALS")
	client, err := firestore.NewClient(ctx,PROJECTID,option.WithCredentialsFile(json))

	if err != nil {
  		log.Fatalln("Failed to create a Firestore Client %v",err)
		return nil, err
	}
	defer client.Close()


	dsnap, err := client.Collection(COLLECTIONNAME).Doc(DOCNAME).Collection(cid).Doc(id).Delete(ctx)
	if err != nil {
  		log.Fatalln("Failed to delete the message %v",err)
		return nil, err
	}
	fmt.Println(dsnap)

	var chat []entity.Message
	iterator := client.Collection(COLLECTIONNAME).Doc(DOCNAME).Collection(cid).Documents(ctx)
	for {
        doc, err := iterator.Next()
        if err != nil {
            log.Fatalln("Failed to fetch messages %v",err)
			return nil, err
        }
		var post entity.Message
		doc.DataTo(&post)
		chat = append(chat, post)
	}

	return chat,nil
}
