package entity

// Message Struct
type Message struct {
	MID string `json:"mid"`
	ReceiverId string `json:"receiverid"`
	SenderId string `json:"senderid"`
	Text string `json:"text"`
	Timestamp string `json:"timestamp"`
}