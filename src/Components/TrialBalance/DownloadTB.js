import React from "react";
import Button from '@material-ui/core/Button';
import ReactExport from "react-data-export";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

class DownloadTB extends React.Component {

    constructor(props) {
        super(props);
        this.state = { report: this.props.data, reportYear: this.props.year, userName: this.props.user, userNID: this.props.niD };
      }
    render() {
        let report = this.state.report;
        let data = [];
        
        let reportData = Object.keys(this.state.report.groupedData).map(function(groupKey, i){    
               return ([
                    [[
                        {value: groupKey, style: {font: {bold: true}, fill: {patternType: "solid", fgColor: {rgb: "6633CCCC"}}}},
                        {value: "", style: {font: {bold: true}, fill: {patternType: "solid", fgColor: {rgb: "6633CCCC"}}}},
                        {value: "", style: {font: {bold: true}, fill: {patternType: "solid", fgColor: {rgb: "6633CCCC"}}}},
                        {value: "", style: {font: {bold: true}, fill: {patternType: "solid", fgColor: {rgb: "6633CCCC"}}}}
                    ]],
               ,
                report.groupedData[groupKey].data.map((category, j) => {
                    return (
                        [
                            {value: category.name, style:{ alignment : { readingOrder: 2, horizontal : "right"}}},
                            {value: category.type == "credit" ? Number(Number(category.sum).toFixed(2)) : 0 , style: {numFmt : "#,##0.00;(#,##0.00);0.00;@"}},
                            {value: category.type == "debit" ? Number(Number(category.sum).toFixed(2)) : 0, style: {numFmt : "(#,##0.00);#,##0.00;0.00;@"}},
                            {value: Number(Number(category.sum).toFixed(2)) , style: {numFmt : category.type == "debit" ? "(#,##0.00);#,##0.00;0.00;@" : "#,##0.00;(#,##0.00);0.00;@"}},
                        ]
                    )
                  }),
                  [
                      [
                        {value: ' סה"כ '+ groupKey, style: {font: {bold: true}}},
                        {value: Number(Number(report.groupedData[groupKey].creditSum).toFixed(2)), style: {font: {bold: true},numFmt : "#,##0.00;(#,##0.00);0.00;@"}},
                        {value: Number(Number(report.groupedData[groupKey].debitSum).toFixed(2)), style: {font: {bold: true},numFmt : "(#,##0.00);#,##0.00;0.00;@"}},
                        {value: Number(Math.abs(report.groupedData[groupKey].creditSum - report.groupedData[groupKey].debitSum).toFixed(2)), style: {font: {bold: true},numFmt : report.groupedData[groupKey].creditSum >= Number(report.groupedData[groupKey].debitSum).toFixed(2) ? "#,##0.00;#,##0.00;0.00;@" : "(#,##0.00);(#,##0.00);0.00;@"}}
                      ]
                ]
               ])
        });
        reportData = reportData.flat().flat();
        reportData.unshift([
            {value: 'חשבון',style: {font: {bold: true}, fill: {patternType: "solid", fgColor: {rgb: "D9D1E0E0"}}}},
            {value: "זכות",style: {font: {bold: true}, fill: {patternType: "solid", fgColor: {rgb: "D9D1E0E0"}}}},
            {value: "חובה",style: {font: {bold: true}, fill: {patternType: "solid", fgColor: {rgb: "D9D1E0E0"}}}},
            {value: 'יתרה',style: {font: {bold: true}, fill: {patternType: "solid", fgColor: {rgb: "D9D1E0E0"}}}}
        ]);
        data = [
            {
                columns : [
                    {title: this.state.reportYear + ' מאזן בוחן שנת', width: {wch: 40}},//pixels width 
                    {title: this.state.userName + " - " + this.state.userNID, width: {wch: 30}},//char width 
                ],
                data : reportData
            }
        ]

        let filename= "("+this.state.reportYear+") ["+ this.state.userNID + " - " + this.state.userName+"] מאזן בוחן";
        return (
            <ExcelFile element={<Button className="download-button">Excel</Button>} filename={filename} >
                <ExcelSheet dataSet={data} name="Trial Balance" />
            </ExcelFile>
        );
    }
}

export default DownloadTB;