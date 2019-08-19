import React from "react";
import Button from '@material-ui/core/Button';
import ReactExport from "react-data-export";
import Moment from 'moment';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

class DownloadAccountInquiry extends React.Component {

    constructor(props) {
        super(props);
        this.state = { report: this.props.data, reportYear: this.props.year, userName: this.props.user, userNID: this.props.niD };
      }

      prepareData(data) {
        let prevBalance = 0;
        return data.map(d => {
          let balance = d.type === "debit" ? -1 * parseFloat(d.sum): parseFloat(d.sum);
          prevBalance = prevBalance + balance;
    
          console.log("prev",prevBalance);
          console.log("bal",balance);
          return {
            ...d,
            credit: d.type === "credit" ? d.sum * 100 / 100: 0,
            debit: d.type === "debit" ? d.sum * 100 / 100: 0,
            je_date: Moment(d.je_date).format("DD.MM.YYYY"),
            balance: prevBalance * 100 / 100
          }
        });
      }

    render() {
        let report = this.state.report;
        let data = [];
        let reportData = Object.keys(report).map((k,i) => {
            const data = this.prepareData(report[k]);
            const lastIndex = data.length - 1;
            const totalBalance = data.map((d,index) => {
                  if(index == lastIndex)
                    { 
                      return parseFloat(d.balance);
                    }
            });
            let creditBalance = 0 , debitBalance = 0;
            data.forEach(d => {
                creditBalance += d.credit;
                debitBalance  += d.debit;
            });  
            return ( [
                       [[
                            {
                                value : k , style: { alignment: { horizontal : "right"},font: { bold: true}, fill: {patternType: "solid", fgColor: {rgb: "6633CCCC"}}}
                            },
                            {
                                value: Number(Number(totalBalance[lastIndex]).toFixed(2)) , style: { numFmt : "#,##0.00", alignment: { horizontal : "right"}, font: { bold: true},fill: {patternType: "solid", fgColor: {rgb: "6633CCCC"}}}
                            }
                         ]],
                        data.map((row, j) => {
                              return (
                                [
                                    {
                                          value: row.je_id , style: { alignment: { horizontal : "right"}}
                                    },
                                    {
                                          value: row.movement_no, style: { alignment: { horizontal : "right"}}
                                    },
                                    {
                                          value: row.batch_id, style: { alignment: { horizontal : "right"}}
                                    },
                                    {
                                          value: row.reference_1, style: { alignment: { horizontal : "right"}}
                                    },
                                    {
                                          value: row.je_date, style: { alignment: { horizontal : "right"}}
                                    },
                                    {
                                          value: row.vendor_name, style: { alignment: { horizontal : "right"}}
                                    },
                                    {
                                          value: row.details, style: { alignment: { horizontal : "right"}}
                                    },
                                    {
                                          value: row.type === 'credit' ? Number(parseFloat(Number(row.credit)).toFixed(2)) : 0 , style: { alignment: { horizontal : "right"}, numFmt : "#,##0.00"}
                                    },
                                    {
                                          value: row.type === 'debit' ? Number(parseFloat(Number(row.debit)).toFixed(2)) : 0  , style: { alignment: { horizontal : "right"}, numFmt : "#,##0.00"}
                                    },
                                    {
                                          value: Number(parseFloat(Number(row.balance)).toFixed(2)), style: { alignment: { horizontal : "right"}, numFmt : "#,##0.00"}
                                    },
                                ])
                        }),
                        [[
                            {
                                value : 'סה"כ' , style: { alignment: { horizontal : "right"},font: { bold: true}}
                            },
                            {
                                
                            },
                            {
                               
                            },
                            {
                               
                            },
                            {
                                
                            },
                            {
                               
                            },
                            {
                                
                            },
                            {
                                value: Number(Number(creditBalance).toFixed(2)) , style: { numFmt : "#,##0.00", alignment: { horizontal : "right"}, font: { bold: true}}
                            },
                            {
                                value: Number(Number(debitBalance).toFixed(2)) , style: { numFmt : "#,##0.00", alignment: { horizontal : "right"}, font: { bold: true}}
                            },
                            {
                                value: Number(Number(totalBalance[lastIndex]).toFixed(2)) , style: { numFmt : "#,##0.00", alignment: { horizontal : "right"}, font: { bold: true}}
                            }
                        ]]
            ]);
        })
       
        reportData = reportData.flat().flat();
        reportData.unshift([
            {value: 'פקודת יומן',style: { alignment: { horizontal : "right"} , font: {bold: true}, fill: {patternType: "solid", fgColor: {rgb: "D9D1E0E0"}}}},
            {value: "תנועה",style: { alignment: { horizontal : "right"} ,font: {bold: true}, fill: {patternType: "solid", fgColor: {rgb: "D9D1E0E0"}}}},
            {value: "מנה",style: {alignment: { horizontal : "right"} ,font: {bold: true}, fill: {patternType: "solid", fgColor: {rgb: "D9D1E0E0"}}}},
            {value: 'אסמכתא',style: {alignment: { horizontal : "right"} ,font: {bold: true}, fill: {patternType: "solid", fgColor: {rgb: "D9D1E0E0"}}}},
            {value: 'תאריך',style: {alignment: { horizontal : "right"} ,font: {bold: true}, fill: {patternType: "solid", fgColor: {rgb: "D9D1E0E0"}}}},
            {value: "ספק",style: {alignment: { horizontal : "right"} ,font: {bold: true}, fill: {patternType: "solid", fgColor: {rgb: "D9D1E0E0"}}}},
            {value: "פרטים",style: {alignment: { horizontal : "right"} ,font: {bold: true}, fill: {patternType: "solid", fgColor: {rgb: "D9D1E0E0"}}}},
            {value: 'זכות',style: {alignment: { horizontal : "right"} ,font: {bold: true}, fill: {patternType: "solid", fgColor: {rgb: "D9D1E0E0"}}}},
            {value: 'חובה',style: {alignment: { horizontal : "right"} ,font: {bold: true}, fill: {patternType: "solid", fgColor: {rgb: "D9D1E0E0"}}}},
            {value: 'יתרה',style: {alignment: { horizontal : "right"} ,font: {bold: true}, fill: {patternType: "solid", fgColor: {rgb: "D9D1E0E0"}}}}
        ]);
        data = [
            {
                columns : [
                    {title: this.state.reportYear + ' כרטסת שנת ', width: {wch: 40}, style: {alignment: { horizontal : "right"}}},//pixels width 
                    {title: this.state.userName + " - " + this.state.userNID, width: {wch: 30}},//char width
                    {title : "", width: {wch: 15}},
                    {title : "", width: {wch: 15}},
                    {title : "", width: {wch: 15}},
                    {title : "", width: {wch: 15}},
                    {title : "", width: {wch: 15}},
                    {title : "", width: {wch: 15}},
                    {title : "", width: {wch: 15}},
                    {title : "", width: {wch: 15}}
                ],
                data : reportData
            }
        ]

        let filename= "Account Inquiries ("+this.state.reportYear+") ["+this.state.userName + " - " + this.state.userNID+"]";
        return (
            <ExcelFile element={<Button className="download-button">Excel</Button>} filename={filename} >
                <ExcelSheet dataSet={data} name="Account Inquiries" />
            </ExcelFile>
        );
    }
}

export default DownloadAccountInquiry;