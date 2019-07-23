import React from "react";
import Button from '@material-ui/core/Button';
import ReactExport from "react-data-export";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

class DownloadPnL extends React.Component {

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
                        {value: "", style: {font: {bold: true}, fill: {patternType: "solid", fgColor: {rgb: "6633CCCC"}}}}
                    ]],
               ,
                report.groupedData[groupKey].data.map((category, j) => {
                    return (
                        [
                            {value: category.name, style:{ alignment : { readingOrder: 1, horizontal : "top"}}},
                            {value: Math.round(category.sum), style:{numFmt : category.type == "debit" ? "(#,##0);#,##0;0;@" : "#,##0;(#,##0);0;@"}},
                        ]
                    )
                  }),
                  [
                      [
                        {value: ' סה"כ '+ groupKey, style: {font: {bold: true}}},
                        {value: Math.round(report.groupedData[groupKey].sum), style: {font: {bold: true}, numFmt : "#,##0;(#,##0);0;@"}}
                      ]
                  ]
               ])
        });
        reportData = reportData.flat().flat();
        reportData.push([
            {value: '(סה״כ רווח (הפסד', style: {font: {bold: true}, alignment: { horizontal: "right"}}},
            {value: Math.round(report.totalSum), style: {font: {bold: true}, numFmt : "#,##0;(#,##0);0;@"}}
        ]);
        data = [
            {
                columns : [
                    {title: this.state.reportYear + ' דוח רווח והפסד שנת', width: {wch: 40}},//pixels width 
                    {title: this.state.userName + " - " + this.state.userNID, width: {wch: 30}},//char width 
                ],
                data : reportData
            }
        ]

        let filename= "Profit & Loss ("+this.state.reportYear+") ["+this.state.userName + " - " + this.state.userNID+"]";
        return (
            <ExcelFile element={<Button className="download-button">Excel</Button>} filename={filename}>
                <ExcelSheet dataSet={data} name="Profit and Loss" />
            </ExcelFile>
        );
    }
}

export default DownloadPnL;