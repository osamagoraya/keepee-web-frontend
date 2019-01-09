import React, { Component } from "react";
import { Document, Page } from "react-pdf/dist/entry.webpack";
import Modal from 'react-awesome-modal';
import "react-pdf/dist/Page/AnnotationLayer.css";
import "./PDFViewer.css";

export default class App extends Component {

    constructor(props) {
        super(props)
        this.state = { numPages: null, pageNumber: 1, visible : false };
    }

    onDocumentLoadSuccess = ({ numPages }) => {
        this.setState({ numPages });
    };

    goToPrevPage = () => {
        if( this.state.pageNumber === 1)
            return;
        this.setState(state => ({pageNumber: state.pageNumber - 1}));
    }
    goToNextPage = () => {
        if( this.state.pageNumber === this.state.numPages )
            return;
        this.setState(state => ({pageNumber: state.pageNumber + 1}));
    }

    openModal = () => {
        this.setState({
            visible : true
        });
    }

    closeModal = () => {
        this.setState({
            visible : false
        });
    }

    render() {
        const { pageNumber, numPages } = this.state;

        return (
            <div>
                <Document
                        file={this.props.fileUrl}
                        onLoadSuccess={this.onDocumentLoadSuccess}
                        onClick={() => this.openModal()}
                        className="PDFDoc"
                >
                        <Page pageNumber={pageNumber} />
                </Document>
                <div className="columns" style={{ position: 'fixed', width: '28.9%'}}>
                    <div className="column is-one-third">
                        <a type="button" onClick={this.goToPrevPage}>
                            <i className="far fa-angle-left"></i>
                        </a>
                    </div>
                    <div className="column is-one-third">
                        <p>Page {pageNumber} of {numPages}</p>
                    </div>
                    <div className="column is-one-third">
                        <a type="button" style={{ marginLeft: '35%'}} onClick={this.goToNextPage}>
                            <i className="far fa-angle-right"></i>
                        </a>
                    </div>
                </div>
                <Modal
                    visible={this.state.visible}
                    width="400"
                    height="300"
                    effect="fadeInUp"
                    onClickAway={() => this.closeModal()}
                >
                    <div>
                        <Document
                            file={this.props.fileUrl}
                            onLoadSuccess={this.onDocumentLoadSuccess}
                            onClick={() => this.openModal()}
                            className="modalDiv"
                        >
                            <Page pageNumber={pageNumber} />
                        </Document>
                        <div className="columns" style={{ position: 'fixed', width: '100%', marginLeft: '7%'}}>
                            <div className="column is-one-third">
                                <a type="button" onClick={this.goToPrevPage}>
                                    <i className="far fa-angle-left fa-2x"></i>
                                </a>
                            </div>
                            <div className="column is-one-third">
                                <p style={{ color: 'white'}}>Page {pageNumber} of {numPages}</p>
                            </div>
                            <div className="column is-one-third">
                                <a type="button" style={{ marginLeft: '35%'}} onClick={this.goToNextPage}>
                                    <i className="far fa-angle-right fa-2x"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}
