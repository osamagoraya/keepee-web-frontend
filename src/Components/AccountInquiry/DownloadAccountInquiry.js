import React from "react";
import Button from '@material-ui/core/Button';
import ReactExport from "react-data-export";

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
            credit: d.type === "credit" ? Math.round(balance * 100) / 100: 0,
            debit: d.type === "debit" ? Math.round(balance * 100) / 100: 0,
            balance: Math.round(prevBalance * 100) / 100
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
            return ( [
                       [[
                            {
                                value : k , style: { alignment: { horizontal : "right"},font: { bold: true}, fill: {patternType: "solid", fgColor: {rgb: "6633CCCC"}}}
                            },
                            {
                                value: Math.round(totalBalance[lastIndex]), style: { alignment: { horizontal : "right"}, font: { bold: true},fill: {patternType: "solid", fgColor: {rgb: "6633CCCC"}}}
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
                                          value: row.type === 'credit' ? Math.round(row.credit) : 0
                                    },
                                    {
                                          value: row.type === 'debit' ? Math.round(row.debit) : 0
                                    },
                                    {
                                          value: Math.round(row.balance)
                                    },
                                ])
                        })
            ]);
        })
       
        reportData = reportData.flat().flat();
        reportData.unshift([
            {value: 'JE',style: { alignment: { horizontal : "right"} , font: {bold: true}, fill: {patternType: "solid", fgColor: {rgb: "D9D1E0E0"}}}},
            {value: "Movement",style: { alignment: { horizontal : "right"} ,font: {bold: true}, fill: {patternType: "solid", fgColor: {rgb: "D9D1E0E0"}}}},
            {value: "Batch",style: {alignment: { horizontal : "right"} ,font: {bold: true}, fill: {patternType: "solid", fgColor: {rgb: "D9D1E0E0"}}}},
            {value: 'Reference',style: {alignment: { horizontal : "right"} ,font: {bold: true}, fill: {patternType: "solid", fgColor: {rgb: "D9D1E0E0"}}}},
            {value: 'Date',style: {alignment: { horizontal : "right"} ,font: {bold: true}, fill: {patternType: "solid", fgColor: {rgb: "D9D1E0E0"}}}},
            {value: "Vendor",style: {alignment: { horizontal : "right"} ,font: {bold: true}, fill: {patternType: "solid", fgColor: {rgb: "D9D1E0E0"}}}},
            {value: "Details",style: {alignment: { horizontal : "right"} ,font: {bold: true}, fill: {patternType: "solid", fgColor: {rgb: "D9D1E0E0"}}}},
            {value: 'Credit',style: {alignment: { horizontal : "right"} ,font: {bold: true}, fill: {patternType: "solid", fgColor: {rgb: "D9D1E0E0"}}}},
            {value: 'Debit',style: {alignment: { horizontal : "right"} ,font: {bold: true}, fill: {patternType: "solid", fgColor: {rgb: "D9D1E0E0"}}}},
            {value: 'Balance',style: {alignment: { horizontal : "right"} ,font: {bold: true}, fill: {patternType: "solid", fgColor: {rgb: "D9D1E0E0"}}}}
        ]);
        data = [
            {
                columns : [
                    {title: this.state.reportYear, width: {wch: 40}, style: {alignment: { horizontal : "right"}}},//pixels width 
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