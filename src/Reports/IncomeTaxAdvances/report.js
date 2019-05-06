import a from './a.jpg';
import b from './b.jpg';
import c from './c.jpg';
import d from './d.jpg';
import e from './e.jpg';
import f from './f.jpg';

export const incomeTaxAdvancesDD = (data,reportPeriod,businessName,userNID) => ({
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
  info: {
    title: 'Income Tax Advances Report',
    author: 'Keepee',
    subject: 'Income tax advances report prepared by Keepee',
  },
  content: [
    {text: businessName + " - " + userNID, margin: [10,0,0,2], fontSize: 15, color: '#707070', alignment: 'right'},
    {text: reportPeriod, margin: [10,0,0,2], fontSize: 15, color: '#707070'},
    
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
                              border: [false,false,false,false],
                                text : {text: 'Business Cycle', alignment : 'right' , color: '#707070'}
                            },
                            {
                              border: [false,false,false,false],
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
                                text : {text: data.advancesByBusinessCyclePercent, alignment : 'right', color: '#828389'}
                            },
                            {
                              border: [false,false,false,false],
                              margin: [0,0],
                              rowSpan: 2,
                                text : {text: 'advance by business cycle %', alignment : 'right' , color: '#707070'}
                            },
                            {
                                border: [false,false,false,false],
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
                                text : {text: data.withholdingTax, alignment : 'right', color: '#828389'}
                            },
                            {
                              border: [false,false,false,false],
                                text : {text: 'Witholding tax', alignment : 'right' , color: '#707070'}
                            },
                            {
                              border: [false,false,false,false],
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
                              border: [false,false,false,false],
                              rowSpan: 2,
                                text : {text: 'Withholding Tax by Advances', alignment : 'right' , color: '#707070'}
                            },
                            {
                              border: [false,false,false,false],
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
                              border: [false,false,false,false],
                              rowSpan: 2,
                                text : {text: 'withholding tax by advances', alignment : 'right' , color: '#707070'}
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
                              border: [false,false,false,false],
                                text : {text: 'Advances', alignment : 'right' , color: '#707070'}
                            },
                            {
                              border: [false,false,false,false],
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
                                text : {text: data.totalPayment, alignment : 'right',color: '#828389' }
                            },
                            {
                              border: [false,false,false,false],
                                text : {text: 'Total Payment', alignment : 'right' , color: '#707070'}
                            },
                            {
                              border: [false,false,false,false],
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