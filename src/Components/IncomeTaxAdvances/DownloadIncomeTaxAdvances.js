import React from "react";
import Button from '@material-ui/core/Button';
import ReactExport from "react-data-export";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

class DownloadIncomeTaxAdvances extends React.Component {

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
                    {title : ""},
                    {title : "", width: {wch: 40}},
                    {title : "", width: {wch: 30}}
                ],
                data : [
                    [
                        {value: this.state.reportYear + ' דוח מקדמות מס הכנסה לתקופה', width: {wch: 40}, style: { font: { bold: true},alignment : { horizontal : "right"}}},//pixels width 
                        {value: this.state.userName + " - " + this.state.userNID, width: {wch: 30}, style: { font: { bold: true}}},//char width 
                    
                    ],
                    [
                        {
                           value :  'מקדמה על פי ה-% מהמחזור העסקי'
                        },
                        {
                           value : Math.round(report.advancesByBusinessCycle)
                        },
                        {

                        },
                        {
                            value: 'מחזור כספי'
                        },
                        {
                            value:  Math.round(report.businessCycle)
                        }
                    ],
                    [
                        {
                            value :  'ניכויים במקור לקיזוז עד סכום המקדמה'
                         },
                         {
                            value :  Math.round(report.withholdingTaxByAdvances)
                         },
                         {
 
                         },
                         {
                             value:'סה"כ מס שנוכה במקור על ידי לקוחות בתקופה'
                         },
                         {
                             value:  Math.round(report.withHoldingTax)
                         }
                    ],
                    [
                        {
                            value :  'סה"כ לתשלום'
                         },
                         {
                            value :  Math.round(report.totalPayments)
                         },
                         {
 
                         },
                         {
                             value: ' מקדמות ששולמו בגין עודפות'
                         },
                         {
                             value:  Math.round(report.advances)
                         }
                    ]
                ]
            }
        ]

        let filename= "("+this.state.reportYear+") ["+this.state.userNID + " - " + this.state.userName+"] דוח מקדמות מס הכנסה";
        return (
            <ExcelFile element={<Button className="download-button">Excel</Button>} filename={filename}>
                <ExcelSheet dataSet={data} name="Income tax advances" />
            </ExcelFile>
        );
    }
}

export default DownloadIncomeTaxAdvances;