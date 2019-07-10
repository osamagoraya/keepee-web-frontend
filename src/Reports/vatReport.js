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

export const vatDD = (data,businessName,reportPeriod,selectedUserNID) => ({
  // background color of whole document
  // background color of whole document
  background: function () {
    return {
        canvas: [
            {
                type: 'rect',
                x: 0, y: 0, w: 595.28, h: 841.89,
                color: '#F8F8F8'
            }
        ]
    };
},
content: [
    {
        image: writeTextToDataURL(businessName + " - " + selectedUserNID,'black', 1, 1, "bold 12px Heebo", 20,businessName.length > 11 ? 180 : 140),
        alignment:"left"
    },
    { 
        image: writeTextToDataURL(reportPeriod + ' דוח מעמ תקופתי לחודשים','black', 1, 1, "bold 12px Heebo", 20,210),
        margin:[0,-10], 
        alignment: 'right'
    },
    {
        style: 'tableExample',
        table: {
            widths: ['*'],
            heights: [20],
            body: [
                [
                    {
                        image: writeTextToDataURL('עסקאות','black', 1, 1, "bold 12px Heebo", 20,220),
                        fillColor: '#94D3D2',
                        border: [false, false, false, false],
                        margin: [-55,10],
                        alignment: 'right'
                    }
                ]
            ]
        }
    },
    {
        style: 'tableExample',
        table: {
         widths: ['*','*','*'],
            body: [
                [
                    {
                        border: [false, false, false, false],
                        image: writeTextToDataURL('מס עסקאות','black',1,10, "bold 12px Heebo", 20,220),
                        margin: [-52,10],
                        alignment: "right"
                    },
                    {
                        border: [false, false, false, false],
                        image: writeTextToDataURL('עסקאות ללא מע"מ','black',1,10, "bold 12px Heebo", 20,220),
                        margin: [-40,10],
                        alignment: "right"
                    },
                    {
                        border: [false, false, false, false],
                        image: writeTextToDataURL('שיעור מס','black',1,10, "bold 12px Heebo", 20,220),
                        margin: [-56,10],
                        alignment: "right"
                    }
                ]
            ]
        }
    },
    {
        style: 'deals17',
        table: {
         widths: ['*','*','*'],
            body: [
                [
                    {
                        border: [false, false, false, false],
                        text: {text: Math.round(parseFloat(data.deal_seventeen_tax)), alignment : 'right'},
                        margin: [5,0]
                    },
                    {
                        border: [false, false, false, false],
                        text: {text: Math.round(parseFloat(data.deal_seventeen)), alignment : 'right'},
                        background: 'white',
                        margin: [8,0]
                    },
                    {
                        border: [false, false, false, false],
                        image: writeTextToDataURL('עסקאות חייבות 17%','black',1,10, "bold 12px Heebo", 20,220),
                        margin: [-38,-8],
                        alignment: "right"
                    }
                ]
            ]
        }
    },
    {
        style: 'deals18',
        table: {
         widths: ['*','*','*'],
            body: [
                [
                    {
                        border: [false, false, false, false],
                        text: {text: 0, alignment : 'right'},
                        margin: [5,0]
                    },
                    {
                        border: [false, false, false, false],
                        text: {text: '0', alignment : 'right'},
                        background: 'white',
                        margin: [8,0]
                    },
                    {
                        border: [false, false, false, false],
                        image: writeTextToDataURL('עסקאות חייבות 18%','black',1,10, "bold 12px Heebo", 20,220),
                        margin: [-38,-8],
                        alignment: "right"
                    }
                ]
            ]
        }
    },
    {
        style: 'deals0',
        table: {
         widths: ['*','*','*'],
            body: [
                [
                    {
                        border: [false, false, false, false],
                        text: {text: 0, alignment : 'right'},
                        margin: [5,0]
                    },
                    {
                        border: [false, false, false, false],
                        text: {text: Math.round(parseFloat(data.deal_zero)), alignment : 'right'},
                        background: 'white',
                        margin: [8,0]
                    },
                    {
                        border: [false, false, false, false],
                        image: writeTextToDataURL('עסקאות פטורות או בשיעור 0%','black',1,10, "bold 12px Heebo", 20,155),
                        margin: [1,-8],
                        alignment: "right"
                    }
                ],
            ]
        }
    },
    {
        style: 'deals17inputTotal',
        table: {
            widths: [90,48],
            body: [
                [
                    {
                        border: [false, false, false, false],
                        image: writeTextToDataURL('סה"כ מס עסקאות','black',1,10, "bold 12px Heebo", 20,220),
                        margin: [0,-8],
                        alignment: "left"
                    },
                    {
                        border: [false, false, false, false],
                        text: {text: Math.round(parseFloat(data.deal_seventeen_tax)), alignment : 'right'},
                        margin: [0,0]
                    }
                ],
            ]
        }
    },
    {
        style: 'input',
        table: {
            widths: ['*'],
            heights: [20],
            margin: [0,15,0,0],
            body: [
                [
                    {
                        image: writeTextToDataURL('תשומות','black', 1, 1, "bold 12px Heebo", 20,220),
                        fillColor: '#94D3D2',
                        border: [false, false, false, false],
                        margin: [-55,10],
                        alignment: 'right'
                    }
                ]
            ]
        }
    },
    {
        style: 'tableExample',
        table: {
         widths: ['*','*','*','*'],
            body: [
                [
                    {
                        border: [false, false, false, false],
                        image: writeTextToDataURL('מס תשומות','black',1,10, "bold 12px Heebo", 20,150),
                        margin: [-18,10],
                        alignment: "right"
                    },
                    {
                        border: [false, false, false, false],
                        image: writeTextToDataURL('תשומות אחרות','black',1,10, "bold 12px Heebo", 20,150),
                        margin: [2,10],
                        alignment: "left"
                    },
                    {
                        border: [false, false, false, false],
                        image: writeTextToDataURL('תשומות ציוד','black',1,10, "bold 12px Heebo", 20,150),
                        margin: [-20,10],
                        alignment: "left"
                    },
                    {
                        border: [false, false, false, false],
                        image: writeTextToDataURL('שיעור מס','black',1,10, "bold 12px Heebo", 20,150),
                        margin: [-40,10],
                        alignment: "left"
                    }
                ]
            ]
        }
    },
    {
        style: 'deals17Input',
        table: {
         widths: [155,135,120,'*'],
            body: [
                [
                    {
                        border: [false, false, false, false],
                        text: Math.round(parseFloat(data.others_deal)) + Math.round(parseFloat(data.equipment_deal)),
                        margin: [57,0],
                        alignment: 'left'
                    },
                    {
                        border: [false, false, false, false],
                        text: Math.round(parseFloat(data.others_deal)), 
                        alignment : 'left',
                        background: 'white',
                        margin: [0,0]
                    },
                    {
                        border: [false, false, false, false],
                        text: Math.round(parseFloat(data.equipment_deal)), 
                        alignment : 'left',
                        background: 'white',
                        margin: [0,0]
                    },
                    {
                        border: [false, false, false, false],
                        image: writeTextToDataURL('תשומות 17%','black',1,10, "bold 12px Heebo", 20,220),
                        alignment:'right',
                        margin: [5,-10]
                    }
                ],
            ]
        }
    },
    {
        style: 'deals17inputTotal',
        table: {
            widths: [55,40],
            body: [
                [
                    {
                        border: [false, false, false, false],
                        image: writeTextToDataURL('סה"כ מס תשומות','black',1,10, "bold 12px Heebo", 20,220),
                        margin: [-15,-8],
                        alignment: "left"
                    },
                    {
                        border: [false, false, false, false],
                        text: {text: Math.round(parseFloat(data.others_deal)) + Math.round(parseFloat(data.equipment_deal)), alignment : 'right'},
                        margin: [0,0]
                    }
                ],
            ]
        }
    },
    {
        style: 'deals17inputTotal',
        table: {
            widths: [45,50],
            body: [
                [
                    {
                        border: [false, false, false, false],
                        image: writeTextToDataURL('סכום הדוח','black',1,10, "bold 12px Heebo", 20,220),
                        margin: [-15,-8],
                        alignment: "left"
                    },
                    {
                        border: [false, false, false, false],
                        text: {text:Math.round((Math.round(parseFloat(data.deal_seventeen_tax)) - (Math.round(parseFloat(data.others_deal)) + Math.round(parseFloat(data.equipment_deal))).toFixed(2))), alignment : 'right'},
                        widths: [0,0],
                    }
                ],
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