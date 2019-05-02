export const vatDD = (data) => ({
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
    {text: 'Vat Report', style: 'header'},
    
    {
        style: 'tableExample',
        table: {
            widths: ['*'],
            heights: [20],
            body: [
                [
                    {
                        text: {text:'Deals',alignment:'right',bold: true},
                        fillColor: '#94D3D2',
                        border: [false, false, false, false],
                        margin: [5,10]
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
                        text: {text: '\tDeals Tax', bold: true, alignment : 'right'},
                        margin: [5,10]
                    },
                    {
                        border: [false, false, false, false],
                        text: {text: '\tDeals (No Vat)', bold: true, alignment : 'right'},
                        margin: [5,10]
                    },
                    {
                        border: [false, false, false, false],
                        text: {text: 'Tax Rate', bold: true, alignment : 'right'},

                        margin: [5,10]
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
                        text: {text: 'Deal 17%', alignment : 'right'},
                        margin: [5,0]
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
                        text: {text: 'Deal 18%', alignment : 'right'},
                        margin: [5,0]
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
                        text: {text: 'Deal 0%', alignment : 'right'},
                        margin: [5,0]
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
                        text: {text: 'total tax', alignment : 'right', bold: true},
                        margin: [0,0]
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
                        text: {text:'Input',alignment:'right',bold: true},
                        fillColor: '#94D3D2',
                        border: [false, false, false, false],
                        margin: [5,10]
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
                        text: {text: '\tTax Input', bold: true, alignment : 'right'},
                        margin: [5,10]
                    },
                    {
                        border: [false, false, false, false],
                        text: {text: '\tOthers', bold: true, alignment : 'right'},
                        margin: [5,10]
                    },
                    {
                        border: [false, false, false, false],
                        text: {text: '\tEquipment', bold: true, alignment : 'right'},
                        margin: [5,10]
                    },
                    {
                        border: [false, false, false, false],
                        text: {text: 'Tax Rate', bold: true, alignment : 'right'},
                        margin: [5,10]
                    }
                ]
            ]
        }
    },
    {
        style: 'deals17Input',
        table: {
         widths: ['*','*','*','*'],
            body: [
                [
                    {
                        border: [false, false, false, false],
                        text: {text: Math.round(parseFloat(data.others_deal)) + Math.round(parseFloat(data.equipment_deal)), alignment : 'right'},
                        margin: [5,0]
                    },
                    {
                        border: [false, false, false, false],
                        text: {text: Math.round(parseFloat(data.others_deal)), alignment : 'right'},
                        background: 'white',
                        margin: [8,0]
                    },
                    {
                        border: [false, false, false, false],
                        text: {text: Math.round(parseFloat(data.equipment_deal)), alignment : 'right'},
                        background: 'white',
                        margin: [8,0]
                    },
                    {
                        border: [false, false, false, false],
                        text: {text: 'Deal 17%', alignment : 'right'},
                        margin: [5,0]
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
                        text: {text: 'total input', alignment : 'left', bold: true},
                        margin: [0,0]
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
                        text: {text: 'total', alignment : 'left', bold: true},
                        margin: [0,0]
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