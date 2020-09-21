import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import Button from '../../Common/Button';

class DismissableDialog extends React.Component {
  state = {
    open: false,
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
      
    return (
      <div>
        {
          this.props.openDialogButton 
          ? this.props.openDialogButton
          : <Button onClick={this.handleClickOpen}>
              Open form dialog
            </Button>
        }
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
          scroll="paper"
          PaperProps={this.props.PaperProps}
        >
          <DialogTitle id="form-dialog-title">{this.props.title}</DialogTitle>
          <DialogContent>
            {this.props.children}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} variant="grey">
              Cancel
            </Button>
            <Button onClick={this.props.onSubmitCoord} variant="grey">
              Select
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default DismissableDialog;