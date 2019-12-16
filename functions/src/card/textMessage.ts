export class textMessage {
    text: string;
    constructor (text :string){
        this.text =text
    } 

    getJson(){
        return {
            "type": "text",
            "text": `${this.text}`
          }
    }
}