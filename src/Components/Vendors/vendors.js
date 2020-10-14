import React from 'react';
import MaterialTable from 'material-table';
import Box from '@material-ui/core/Box';
import {sendAsyncRequestToOCR} from '../../Services/AsyncRequestService';
import swal from 'sweetalert';

const boxStyles = { margin: '20px', marginTop: '5%'}
const tableStyles = { 
  maxBodyHeight: 400, 
  pageSize: 10,
  actionsColumnIndex : 5,
  direction: 'rtl'
}

class Vendors extends React.Component {

    state = {
        data: []
    }

  componentDidMount() {
      this.fetchVendors();
  }

  fetchVendors() {
    if (this.state.data.length !== 0){
      console.log("not fetching vendors, they exist", this.state.vendors);
      return;
    }
  
    sendAsyncRequestToOCR(
      "/vendors",
      "GET", 
      {},
      (r) => {
        this.setState({data: r.data.vendorNames});
      },
      (r) => {
        console.log("Error!","Unable to fetch vendors");
      }
    );
  }

  saveVendor = (id,name) => {
    sendAsyncRequestToOCR(
        "/invoice",
        "PUT", 
        { uploadId: id, vendorName: name},
        (r) => {
          console.log("Res",r);
        },
        (r) => {
          console.log("Error!","Unable to fetch vendors");
        }
    );
  }

  resetVendor = (id,name) => {
    sendAsyncRequestToOCR(
        "/invoice",
        "PUT", 
        { uploadId: id, name: name},
        (r) => {
          
        },
        (r) => {
          console.log("Error!","Unable to fetch vendors");
        }
    );
  }

  deleteVendor = (id,name) => {
    sendAsyncRequestToOCR(
        "/invoice",
        "", 
        { uploadId: id, name: name},
        (r) => {
          
        },
        (r) => {
          console.log("Error!","Unable to fetch vendors");
        }
    );
  }

  render() {
    return (
        <Box>
            <MaterialTable 
                options={tableStyles}
                columns={[
                    { title: 'Vendors', field: 'name' }
                ]}
                data={this.state.data}
                title="Vendors"
                editable={{
                    //onRowAdd: (newData) => new Promise(),
                    onRowUpdate: (newData, oldData) =>
                    new Promise((resolve) => {
                            if (oldData) {
                                sendAsyncRequestToOCR(
                                  "/vendors",
                                  "PUT", 
                                  { oldVendorName: oldData.name, newVendorName: newData.name},
                                  (r) => {
                                    this.setState((prevState) => {
                                      const data = [...prevState.data];
                                      data[data.indexOf(oldData)] = newData;
                                      return { ...prevState, data };
                                    });
                                    resolve();
                                  },
                                  (r) => {
                                    swal("Cannot Update! Already Exists!")
                                    resolve();
                                  }
                              );
                                
                            }
                    }),
                    onRowDelete: (oldData) =>
                    new Promise((resolve) => {
                        setTimeout(() => {
                            resolve();
                            this.setState((prevState) => {
                                const data = [...prevState.data];
                                data.splice(data.indexOf(oldData), 1);
                                return { ...prevState, data };
                              });
                        }, 300);
                        this.deleteVendor(oldData.uploadId,oldData.vendor);
                    }),
                }}
            />
      </Box>
    )
  }
}
export default Vendors;