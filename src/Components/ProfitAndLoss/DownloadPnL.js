import React from "react";
import Button from '@material-ui/core/Button';
import ReactExport from "react-data-export";
import moment from 'moment';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;


class DownloadPnL extends React.Component {

    constructor(props) {
        super(props);
        this.state = { report: this.props.data, reportYear: this.props.year, userName: this.props.user, userNID: this.props.niD, reportType: this.props.type, selectedMonths: this.props.selectedMonths };
      }

      componentWillReceiveProps(nextProps) {
        const {report} = nextProps.data;
        const {reportYear} = nextProps.year;
        const {userName} = nextProps.user;
        const {userNID} = nextProps.niD;
        const {reportType} = nextProps.type;
        const {selectedMonths} = nextProps.selectedMonths;
        
        if ( report !== this.state.report ||
             reportYear !== this.state.reportYear || 
             userName !== this.state.userName || 
             userNID !== this.state.userNID || 
             reportType !== this.state.reportType || 
             selectedMonths !== this.state.selectedMonths) {
          
          this.setState({
            report: report,
            reportYear: reportYear,
            userName: userName,
            userNID: userNID,
            reportType: reportType,
            selectedMonths: selectedMonths
          });
        }
      }

    render() {
        let report = this.state.report;
        let selectedMonths = this.state.selectedMonths;
        let data = [];
        console.log("excel sy months",selectedMonths);
        if(this.state.reportType === "yearly") {
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
                                {value: category.name, style:{ alignment : { readingOrder: 2, horizontal : "top"}}},
                                {value: Math.round(category.sum), style:{numFmt : category.type == "debit" ? "(#,##0);#,##0;0;@" : "#,##0;(#,##0);0;@"}},
                            ]
                        )
                    }),
                    [
                        [
                            {value: ' סה"כ '+ groupKey, style: {font: {bold: true}}},
                            {value: Math.round(report.groupedData[groupKey].sum), style: {font: {bold: true}, numFmt : report.groupedData[groupKey].sumType == "debit" ? "(#,##0);#,##0;0;@" : "#,##0;(#,##0);0;@"}}
                        ]
                    ]
                    ])
            });
            reportData = reportData.flat().flat();
            reportData.push([
                {value: '(סה״כ רווח (הפסד', style: {font: {bold: true}, alignment: { horizontal: "right"}}},
                {value: Math.round(Math.abs(report.totalCreditSum - report.totalDebitSum)), style: {font: {bold: true}, numFmt : report.totalCreditSum >= report.totalDebitSum ? "#,##0;#,##0;0;@" : "(#,##0);(#,##0);0;@"}}
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
        }
        else if(this.state.reportType === "monthly") {
            if(this.state.report) {
                let reportData = Object.keys(this.state.report.groupedData).map(function(groupKey, i){    
                    return ([
                        [[
                            {value: groupKey, style: {font: {bold: true}, fill: {patternType: "solid", fgColor: {rgb: "6633CCCC"}}}},
                            selectedMonths.map((month) => {
                                return (
                                    {value: i == 0 ? moment(month).format('MMMM') : "", style: {font: {bold: true}, fill: {patternType: "solid", fgColor: {rgb: "6633CCCC"}}}}
                                );
                            })
                            
                        ]],
                    ,
                    report.groupedData[groupKey].data.map((category, j) => {
                        return (
                            [
                                {value: category.name, style:{ alignment : { readingOrder: 2, horizontal : "top"}}},
                                selectedMonths.map((month) => {
                                    return (
                                        {value: category[moment(month).format('MMM')] !== undefined ? Math.round(category[moment(month).format('MMM')]) : 0 , style:{numFmt : category.type == "debit" ? "(#,##0);#,##0;0;@" : "#,##0;(#,##0);0;@"}}
                                    );
                                })
                            ]
                        )
                    }),
                    [
                        [
                            {value: ' סה"כ '+ groupKey, style: {font: {bold: true}}},
                            selectedMonths.map((month) => {
                                return (
                                    {value: Math.round(report.groupedData[groupKey].sum[moment(month).format('MMM')]) , style: {font: {bold: true}, numFmt : report.groupedData[groupKey].sumType == "debit" ? "(#,##0);#,##0;0;@" : "#,##0;(#,##0);0;@"}}
                                );
                            })
                        ]
                    ]
                    ])
            });
                reportData = reportData.flat().flat();
        
                // For months header with each group
                reportData.forEach((row,index)=>{
                        if(typeof  reportData[index][1] !== 'undefined') {
                            reportData[index][1].forEach((obj) =>{
                                reportData[index].push(obj);
                            });
                            reportData[index].splice(1,1);
                        }
                });
                
                reportData.push([
                    {value: ' (סה״כ רווח (הפסד', style: {fill: {patternType: "solid", fgColor: {rgb: "C4C4BCBC"}},font: {bold: true}, alignment: { horizontal: "right"}}},
                    selectedMonths.map((month) => {
                        return (
                            {value: Math.round(Math.abs(report.totalCreditSum[moment(month).format('MMM')] - report.totalDebitSum[moment(month).format('MMM')])), style: {fill: {patternType: "solid", fgColor: {rgb: "C4C4BCBC"}},font: {bold: true}, numFmt : report.totalCreditSum[moment(month).format('MMM')] >= report.totalDebitSum[moment(month).format('MMM')] ? "#,##0;#,##0;0;@" : "(#,##0);(#,##0);0;@"}}
                        );
                    })
                ]);
                
                // Total For each Month
                reportData[reportData.length - 1][1].forEach((row,index)=>{
                    
                    reportData[reportData.length - 1].push(row);
                    
                });
                reportData[reportData.length - 1].splice(1,1);
                
                data = [
                    {
                        columns : [
                            {title: this.state.reportYear + ' דוח רווח והפסד שנת', width: {wch: 40}},//pixels width 
                            {title: this.state.userName + " - " + this.state.userNID, width: {wch: 30}},//char width 
                        ],
                        data : reportData
                    }
                ]
            }
        }
        
        

        let filename= "("+this.state.reportYear+") ["+this.state.userNID + " - " +this.state.userName +"] דוח רווח והפסד";
       
        return (
            <ExcelFile element={<Button className="download-button">Excel</Button>} filename={filename}>
                <ExcelSheet dataSet={data} name="Profit and Loss" />
            </ExcelFile>
        );
    }
}

export default DownloadPnL;