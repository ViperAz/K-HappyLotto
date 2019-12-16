export class lottoWinner {
    lottoNumber: string | undefined;
    lottoRound: string | undefined;
    lottoPrize: string | undefined;
    lotteryDate: string | undefined;

    constructor (lottoNumber :string,lottoRound:string,lottoPrize:string,lotteryDate:string){
        this.lottoNumber = lottoNumber
        this.lottoRound = lottoRound
        this.lottoPrize = lottoPrize
        this.lotteryDate = lotteryDate
    }
    

     getLottoJson(){
        return {
            "type" : "flex",
            "altText": "ผลรางวัลของคุณออกแล้วมาดูกัน!!",
            "contents"  : {
                "type": "bubble",
                "header": {
                  "type": "box",
                  "layout": "vertical",
                  "backgroundColor": "#0EE1BD",
                  "contents": [
                    {
                      "type": "box",
                      "layout": "horizontal",
                      "contents": [
                        {
                          "type": "image",
                          "url": "https://firebasestorage.googleapis.com/v0/b/k-happy-lotto.appspot.com/o/star.png?alt=media&token=d1299ec4-0e30-4ef5-b1b4-5a2fe4dc766d",
                          "flex": 2,
                          "size": "full",
                          "action": {
                            "type": "postback",
                            "label": `${this.lottoPrize}`,
                            "data": `${this.lottoPrize}`
                          }
                        },
                        {
                          "type": "box",
                          "layout": "vertical",
                          "flex": 8,
                          "contents": [
                            {
                              "type": "text",
                              "text": "ยินดีด้วย !!!!",
                              "size": "xl",
                              "align": "center",
                              "weight": "bold"
                            },
                            {
                              "type": "text",
                              "text": `คุณถูก${this.lottoPrize}`,
                              "size": "lg",
                              "align": "center",
                              "weight": "bold"
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },
                "body": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": `หมายเลข : ${this.lottoNumber}`,
                      "align": "start"
                    },
                    {
                      "type": "text",
                      "text": `งวดที่ : ${this.lottoRound} วันที่ : ${this.lotteryDate}`
                    }
                  ]
                },
                "footer": {
                  "type": "box",
                  "layout": "horizontal",
                  "contents": [
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "!!ขึ้นเงินเลย!!",
                        "text": "ขึ้นเงิน"
                      },
                      "color": "#499640",
                      "style": "primary"
                    }
                  ]
                }
              }
            }
    }
}