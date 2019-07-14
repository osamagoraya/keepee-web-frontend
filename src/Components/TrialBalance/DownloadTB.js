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
                    [[{value: groupKey, style: {font: {bold: true}, fill: {patternType: "solid", fgColor: {rgb: "6633CCCC"}}}}]],
               ,
                report.groupedData[groupKey].data.map((category, j) => {
                    return (
                        [
                            {value: category.name, style:{ alignment : { readingOrder: 2, horizontal : "bottom"}}},
                            {value: category.type == "credit" ? Math.round(category.sum) : 0},
                            {value: category.type == "debit" ? Math.round(category.sum) : 0},
                            {value: Math.round(category.sum)},
                        ]
                    )
                  }),
                  [
                      [
                        {value: ' סה"כ '+ groupKey, style: {font: {bold: true}}},
                        {value: Math.round(report.groupedData[groupKey].sum), style: {font: {bold: true}}}
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

        let filename= "Trial Balance ("+this.state.reportYear+") ["+this.state.userName + " - " + this.state.userNID+"]";
        return (
            <ExcelFile element={<Button className="download-button">Excel</Button>} filename={filename} >
                <ExcelSheet dataSet={data} name="Trial Balance" />
            </ExcelFile>
        );
    }
}

export default DownloadTB;