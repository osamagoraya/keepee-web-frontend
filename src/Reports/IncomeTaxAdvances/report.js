import a from './a.jpg';
import b from './b.jpg';
import c from './c.jpg';
import d from './d.jpg';
import e from './e.jpg';
import f from './f.jpg';

let writeTextToDataURL = function(text, color='black', top=1, bottom=13, size = "1px Roboto, sans-serif", height = 3, width = 100)
  {
    var x = document.createElement("CANVAS");
    var context = x.getContext("2d");
  
    x.height = height;
    x.width = width;
  
  
    context.fillStyle = color;
    context.font = size;
    context.textBaseline = "top";
    context.beginPath();
    context.fillText(text, top, bottom,700);
    context.scale(2, 2)
    context.closePath();
    context.fill();
  
  
    return x.toDataURL();
  }

export const incomeTaxAdvancesDD = (data,reportPeriod,businessName,userNID) => ({
  // background color of whole document
  background: function () {
      return {
        canvas: [
      {
        type: 'rect',
        x: 0, y: 0, w: 900.28, h: 500.89,
        color: '#F8F8F8'
      }
    ]
    };
  },
  info: {
    title: 'Income Tax Advances Report',
    author: 'Keepee',
    subject: 'Income tax advances report prepared by Keepee',
  },
  pageOrientation: 'landscape',
  content: [
    {
      image: writeTextToDataURL(businessName + " - " + userNID,'black', 1, 1, "bold 12px Heebo", 20,businessName.length > 11 ? 180 : 140), 
      margin: [businessName.length > 15 ? 0 : 5,0],
      alignment:"left"
    },
    {
      image: writeTextToDataURL(reportPeriod+ ' דוח מקדמות מס הכנסה לתקופה','#707070', 1, 1, "bold 12px Heebo", 20,280), 
      margin: [-15,5,0,2], 
      fontSize: 15, 
      color: '#707070', 
      alignment:"right"
    },
    
    {
      style: 'tableExample',
      table: {
          widths: ['*'],
        body: [
          [
            {
              text: {},
              fillColor: '#F8F8F8',
              border: [false, false, false, true],
              margin: [15,0]
            }
          ]
        ]
      },
      layout: {
        hLineColor: '#828389'
      }
    },
    {
      style: 'tableExample',
      margin: [0,10],
      table: {
      widths: ['*','*'],
        body: [
          [
            {
                border: [false,false,false,false],
              table: {
                      widths: [85,100,10],
                    body: [
                          [
                            {
                                fillColor: 'white',
                                border: [false,false,false,true],
                                text : {text: data.businessCycle, alignment : 'right', color: '#828389'}
                            },
                            {
                              image: writeTextToDataURL('מחזור כספי','#707070', 1, 1, "12px Heebo", 20,220),
                              border: [false,false,false,false],
                              margin: [175,1]
                            },
                            {
                              border: [false,false,false,false],
                              margin: [130,1],
                                      image: a,
                                      width: 15,
                                      height: 15,
                            }
                          ]
                          ]
                      },
                      layout: {
                        hLineColor: '#828389'
                      }
            },
            {
                border: [false,false,false,false],
                margin: [-5,0],
              table: {
                      widths: [85,125,10],
                    body: [
                          [
                            {
                                fillColor: 'white',
                                border: [false,false,false,true],
                                text : {text: data.advancesByBusinessCycle, alignment : 'right', color: '#828389'}
                            },
                            {
                              image: writeTextToDataURL('מקדמה על פי ה-% מהמחזור העסקי','#707070', 1, 1, "12px Heebo", 20,220),
                              border: [false,false,false,false],
                              margin: [50,1],
                              rowSpan: 2
                            },
                            {
                                border: [false,false,false,false],
                                margin: [100,1],
                                      image: d,
                                      width: 15,
                                      height: 15,
                                      
                            }
                          ],
                          [
                            {
                                border : [false,false,false,false],
                                text : ''
                            },
                            {
                              border: [false,false,false,false],
                              rowSpan: 2,
                                text : {text: 'advance by business cycle %', alignment : 'right' , color: '#707070'}
                            },
                            {
                              border : [false,false,false,false],
                                text : ''
                            }
                          ]
                          ]
                      },
                      layout: {
                        hLineColor: '#828389'
                      }
            },
          ]
          ]
      }
    },
    {
      style: 'tableExample',
      margin: [0,10],
      table: {
      widths: ['*','*'],
        body: [
          [
            {
                border: [false,false,false,false],
              table: {
                      widths: [85,100,10],
                    body: [
                          [
                            {
                                fillColor: 'white',
                                border: [false,false,false,true],
                                text : {text: data.withHoldingTax, alignment : 'right', color: '#828389'}
                            },
                            {
                              image: writeTextToDataURL('סה"כ מס שנוכה במקור על ידי לקוחות בתקופה','#707070', 1, 1, "12px Heebo", 20,225),
                              border: [false,false,false,false],
                              margin: [5,2]
                            },
                            {
                              border: [false,false,false,false],
                              margin: [130,1],
                                      image: b,
                                      width: 15,
                                      height: 15,
                            }
                          ]
                          ]
                      },
                      layout: {
                        hLineColor: '#828389'
                      }
            },
            {
                border: [false,false,false,false],
                margin: [-5,0],
              table: {
                      widths: [85,125,10],
                    body: [
                          [
                            {
                                fillColor: 'white',
                                border: [false,false,false,true],
                                text : {text: data.withholdingTaxByAdvances, alignment : 'right', color: '#828389'}
                            },
                            {
                              image: writeTextToDataURL('ניכויים במקור לקיזוז עד סכום המקדמה','#707070', 1, 1, "12px Heebo", 20,220),
                              border: [false,false,false,false],
                              margin: [30,1],
                              rowSpan: 2
                            },
                            {
                              border: [false,false,false,false],
                              margin : [100,1],
                                      image: e,
                                      width: 15,
                                      height: 15,
                            }
                          ],
                          [
                            {
                                border : [false,false,false,false],
                                text : ''
                            },
                            {
                              image: writeTextToDataURL('מחזור כספי','#707070', 1, 1, "15px Heebo", 20,220),
                              border: [false,false,false,false],
                              margin: [30,1],
                              rowSpan: 2
                            },
                            {
                              border : [false,false,false,false],
                                text : ''
                            }
                          ]
                          ]
                      },
                      layout: {
                        hLineColor: '#828389'
                      }
            },
          ]
          ]
      }
    },
    {
      style: 'tableExample',
      margin: [0,10],
      table: {
      widths: ['*','*'],
        body: [
          [
            {
                border: [false,false,false,false],
              table: {
                      widths: [85,100,10],
                    body: [
                          [
                            {
                                fillColor: 'white',
                                border: [false,false,false,true],
                                text : {text: data.advances, alignment : 'right', color: '#828389'}
                            },
                            {
                              image: writeTextToDataURL(' פמקדמות ששולמו בגין עודפות','#707070', 1, 1, "12px Heebo", 20,220),
                              border: [false,false,false,false],
                              margin: [75,2]
                            },
                            {
                              border: [false,false,false,false],
                              margin: [130,1],
                                      image: c,
                                      width: 15,
                                      height: 15,
                            }
                          ]
                          ]
                      },
                      layout: {
                        hLineColor: '#828389'
                      }
            },
            {
                border: [false,false,false,false],
              table: {
                      widths: [85,120,10],
                    body: [
                          [
                            {
                                fillColor: 'white',
                                border: [false,false,false,true],
                                text : {text: data.totalPayments, alignment : 'right',color: '#828389' }
                            },
                            {
                              image: writeTextToDataURL('פסה"כ לתשלום','#707070', 1, 1, "12px Heebo", 20,220),
                              border: [false,false,false,false],
                              margin: [140,1],
                            },
                            {
                              border: [false,false,false,false],
                              margin: [100,1],
                                      image: f,
                                      width: 15,
                                      height: 15,
                            }
                          ]
                          ]
                      },
                      layout: {
                        hLineColor: '#828389'
                      }
            },
          ]
          ]
      }
    },
  ],
  styles: {
    header: {
      fontSize: 18,
      bold: true,
      margin: [0, 0, 0, 5]
    },
    subheader: {
      fontSize: 16,
      bold: true,
      margin: [0, 10, 0, 5]
    },
    tableExample: {
      margin: [0, 5, 0, 0]
    },
    deals17: {
      margin: [0, 0, 0, 0]
    },
    deals18: {
      margin: [0, 5, 0, 0]
    },
    deals0: {
      margin: [0, 5, 0, 0]
    },
    deals17inputTotal: {
      margin: [10, 5, 0, 0]
    },
    input: {
      margin: [0, 35, 0, 0]
    },
    tableHeader: {
      bold: true,
      fontSize: 13,
      color: 'black'
    }
  },
  defaultStyle: {
  }

});