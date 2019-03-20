import React from 'react';

import Grid from '@material-ui/core/Grid';
import { Formik } from 'formik';
import {withRouter} from 'react-router-dom';

import Select from '../../Common/Select';
import TransparentTextField from '../../Common/TransparentTextField';
import {sendAuthenticatedAsyncRequest} from '../../../Services/AsyncRequestService';

import Button from '../../Common/Button';

const style = {
  accountInquiryContainer: {
    color: '#828389',
    fontFamily: 'Heebo',
    fontSize: 13,
    fontWeight: 300,
    // fontStyle: 'italic'
  },
  label: {
    color: "rgba(0, 0, 0, 0.54)",
    padding: 0,
    fontSize: "0.7rem",
    lineHeight: 1,
    display: "inline-block",
    fontWeight: 300,
    fontStyle: "italic",
  }
}

const KLabel = (props) => (
  <div style={style.label}>
    {props.children}
  </div>
);

class MenuSubSectionFilters extends React.Component {

  state = {
    categories: []
  }

  componentDidMount() {
    this.fetchCategories();
  }

  setParams (values) {
    const {minCategory, maxCategory, minDate, maxDate } = values;
    this.props.history.push({
      pathname: '/workspace/account-inquiry',
      search: `?minCat=${minCategory ? minCategory.categoryNo : ''}&maxCat=${maxCategory ? maxCategory.categoryNo : ''}&minDate=${minDate}&maxDate=${maxDate}`
    });
  }

  fetchCategories() {
    if (this.state.categories.length !== 0){
      console.log("not fetching categories, they exist", this.state.categories);
      return;
    }

    sendAuthenticatedAsyncRequest(
      "/getCategories",
      "POST", 
      null,
      (r) => this.setState({
        categories: JSON.parse(r.data.body).sort((c1,c2) => parseInt(c1.categoryId) - parseInt(c2.categoryId))
      })
    );

  }

  render (){
    const {categories} = this.state;
    return (
      <Grid container style={style.accountInquiryContainer}>
        <Formik
        initialValues={{ 
          minCategory: '', maxCategory: '', minDate: '', maxDate: '' 
        }}    
        onSubmit={(values) => {
          this.setParams(values)
        }}
        enableReinitialize={true}
        >
        {({ values, touched, errors, handleSubmit, handleChange, handleBlur, setFieldValue, submitForm }) => {
          return (
            <form onSubmit={handleSubmit} style={{width: "100%"}}>
            <Grid item md={12}>
              Categories
            </Grid>
            <Grid item md={12} >
              <KLabel>From</KLabel>
              <Select
                transparent
                value={values.minCategory}
                onChange={(selectedOption) => {
                  console.log("selected min cat", selectedOption);
                  setFieldValue('minCategory', selectedOption);
                }}
                options={categories}
                labelKey="categoryLabel"
                valueKey="categoryId"
                placeholder="Min Category"
                onBlur={handleBlur}
                isLoading={categories.length === 0}
                // feedback={touched.categoryId && errors.categoryId ? errors.categoryId : null}
              />
              <KLabel>To</KLabel>
              <Select
                transparent
                value={values.maxCategory}
                onChange={(selectedOption) => {
                  console.log("selected max cat", selectedOption);
                  setFieldValue('maxCategory', selectedOption);
                }}
                options={categories}
                labelKey="categoryLabel"
                valueKey="categoryId"
                placeholder="Max Category"
                onBlur={handleBlur}
                isLoading={categories.length === 0}
                // feedback={touched.categoryId && errors.categoryId ? errors.categoryId : null}
              />
            </Grid>
            
            <Grid item md={12} style={{marginTop: 10}}>
              Dates
            </Grid>
            <Grid item md={12} style={{marginTop: 4}}>
              <KLabel>From</KLabel>
              <TransparentTextField
                type="date"
                fullWidth
                name="minDate"
                value={values.minDate}
                onChange={handleChange}
                onBlur={handleBlur}
                // feedback={touched.jeDate && errors.jeDate ? errors.jeDate : null}
                />
            </Grid>
            <Grid item md={12} style={{marginTop: 4}}>
              <KLabel>To</KLabel>
              <TransparentTextField
                type="date"
                fullWidth
                name="maxDate"
                value={values.maxDate}
                onChange={handleChange}
                onBlur={handleBlur}
                // feedback={touched.jeDate && errors.jeDate ? errors.jeDate : null}
                />
            </Grid>
            <Grid item md={12} container style={{marginTop: 8, justifyContent: "flex-end"}}>
                <Button type="submit" size="small" variant="transparent">Generate</Button>
            </Grid>
            </form>
          )
        }}
      </Formik>
      </Grid>
    );
  }
}

export default withRouter(MenuSubSectionFilters);