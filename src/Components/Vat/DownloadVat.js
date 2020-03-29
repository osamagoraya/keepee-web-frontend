import React from "react";
import Button from '@material-ui/core/Button';
import ReactExport from "react-data-export";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

class DownloadVat extends React.Component {

    constructor(props) {
        super(props);
        this.state = { report: this.props.data, reportYear: this.props.year, userName: this.props.user, userNID: this.props.niD };
      }
    render() {
        let report = this.state.report;
        let data = [];
        data = [
            {
                columns : [
                    {title: "", width: {wch: 40}, style: { alignment : { horizontal : "right"}}},//pixels width 
                    {title: "", width: {wch: 30}},//char width 
                    {title : "" , width: {wch: 15}},
                    {title : "", width: {wch: 20}},
                    {title : "", width: {wch: 30}}
                ],
                data : [
                    [
                        {value: this.state.reportYear + ' דוח מעמ תקופתי לחודשים', width: {wch: 40}, style: { font: { bold: true},alignment : { horizontal : "right"}}},//pixels width 
                        {value: this.state.userName + " - " + this.state.userNID, width: {wch: 30}, style: { font: { bold: true}}},//char width 
                    
                    ],
                    [
                        {
                           value :  'עסקאות', style: {font: {bold: true}, fill: {patternType: "solid", fgColor: {rgb: "6633CCCC"}}}
                        }
                    ],
                    [
                         {
                            value :  'שיעור מס' , style: { font: {bold: true},fill: {patternType: "solid", fgColor: {rgb: "D9D1E0E0"}}}
                         },
                         {
                            value :  'עסקאות ללא מע"מ' , style: { font: {bold: true},fill: {patternType: "solid", fgColor: {rgb: "D9D1E0E0"}}}
                         },
                         {
                             value:  'שיעור מס' , style: { font: {bold: true},fill: {patternType: "solid", fgColor: {rgb: "D9D1E0E0"}}}
                         }
                    ],
                    [
                        {
                           value :  'עסקאות חייבות 17%'
                        },
                        {
                           value :  Math.round(parseFloat(report.deal_seventeen))
                        },
                        {
                            value:  Math.round(parseFloat(report.deal_seventeen_tax))
                        }
                   ],
                   [
                        {
                           value :  'עסקאות חייבות 18%'
                        },
                        {
                           value :  0
                        },
                        {
                           value: 0
                        }
                    ],
                    [
                        {
                           value :  'עסקאות פטורות או בשיעור 0%'
                        },
                        {
                           value :  Math.round(parseFloat(report.deal_zero))
                        },
                        {
                           value:  0
                        }
                    ],
                    [
                        {
                            value: 'סה"כ מס עסקאות' , style : { font: {bold: true} }
                         },
                         {
                            
                         },
                         {
                             value:  Math.round(parseFloat(report.deal_seventeen_tax))
                         }
                    ],
                    [
                        {
                          value: 'תשומות' , style: {font: {bold: true}, fill: {patternType: "solid", fgColor: {rgb: "6633CCCC"}}}
                        }
                    ],
                    [
                        {
                            value :  'שיעור מס' , style: { font: {bold: true}, fill: {patternType: "solid", fgColor: {rgb: "D9D1E0E0"}}}
                         },
                         {
                            value :  'תשומות ציוד' , style: { font: {bold: true},fill: {patternType: "solid", fgColor: {rgb: "D9D1E0E0"}}}
                         },
                         {
                            value: 'תשומות אחרות' , style: { font: {bold: true},fill: {patternType: "solid", fgColor: {rgb: "D9D1E0E0"}}}
                         },
                         {
                            value: 'מס תשומות' , style: { font: {bold: true},fill: {patternType: "solid", fgColor: {rgb: "D9D1E0E0"}}}
                         }
                    ],
                    [
                        {
                            value :  'תשומות 17%'
                         },
                         {
                            value :  Math.round(parseFloat(report.equipment_deal))
                         },
                         {
                            value: Math.round(parseFloat(report.others_deal))
                         },
                         {
                            value:  Math.round(parseFloat(report.others_deal)) + Math.round(parseFloat(report.equipment_deal))
                         }
                    ],
                    [
                        {
                            value :  'סה"כ מס תשומות' , style : { font: {bold: true} }
                         },
                         {},
                         {},
                         {
                            value: Math.round(parseFloat(report.others_deal)) + Math.round(parseFloat(report.equipment_deal))
                         }
                    ],
                    [
                        {
                            value :  'סכום הדוח' , style : { font: {bold: true} }
                         },
                         {},
                         {},
                         {
                            value: Math.round((Math.round(parseFloat(report.deal_seventeen_tax)) - (Math.round(parseFloat(report.others_deal)) + Math.round(parseFloat(report.equipment_deal))).toFixed(2)))
                         }
                    ]
                ]
            }
        ]

        let filename= "("+this.state.reportYear+") ["+this.state.userNID + " - " + this.state.userName+"] דוח מעמ";
        return (
            <ExcelFile element={<Button className="download-button">Excel</Button>} filename={filename}>
                <ExcelSheet dataSet={data} name="Vat" />
            </ExcelFile>
        );
    }
}

export default DownloadVat;