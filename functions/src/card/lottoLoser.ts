export class lottoLoser {
    lottoNumber: string | undefined;
    lottoRound: string | undefined;
    lotteryDate: string | undefined;

    constructor (lottoNumber :string,lottoRound:string,lotteryDate:string){
        this.lottoNumber = lottoNumber
        this.lottoRound = lottoRound
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
                          "url": "https://firebasestorage.googleapis.com/v0/b/k-happy-lotto.appspot.com/o/cry.png?alt=media&token=359441de-454c-4bd0-90ce-7412a0dd7ac0",
                          "flex": 2,
                          "size": "full"
                        },
                        {
                          "type": "box",
                          "layout": "vertical",
                          "flex": 8,
                          "contents": [
                            {
                              "type": "text",
                              "text": "เสียใจด้วย!!!",
                              "size": "xl",
                              "align": "center",
                              "weight": "bold"
                            },
                            {
                              "type": "text",
                              "text": "คุณไม่ถูกรางวัล",
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
                }
              }
            }
    }
}