interface ChatModel {
    Text? : String,
    Url? : String,
    From : String,
    To : String,
    TimeStamp : Number,
    IsRead : Boolean
    $key? : string
}
export default ChatModel;